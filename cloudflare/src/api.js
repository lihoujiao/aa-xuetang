import { aliyunCheck, aliyunSend, smsConfigured, smsMock } from "./sms.js";

const COOKIE = "aa_session";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;
const LOCK_MS = 10 * 60 * 1000;
const STATE_MS = 10 * 60 * 1000;
const PHONE_RE = /^1[3-9]\d{9}$/;
function requestOrigin(request) {
  return new URL(request.url).origin;
}

function nowMs(env) {
  return typeof env.now === "function" ? env.now() : Date.now();
}

function beijingDayStart(now) {
  const offset = 8 * 60 * 60 * 1000;
  const shifted = new Date(now + offset);
  return Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - offset;
}

function json(data, status = 200, extraHeaders) {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  if (extraHeaders) {
    for (const [key, value] of extraHeaders) headers.append(key, value);
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function clientIp(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function readCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hashToken(secret, token) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(token)));
}

function randomHex(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return hex(buf.buffer);
}

export function maskPhone(phone) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

function publicUser(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    phoneMasked: maskPhone(row.phone),
    wechatBound: Boolean(row.wechat_openid),
  };
}

function cookie(token, request, maxAge) {
  const secure = new URL(request.url).protocol === "https:";
  const parts = [`${COOKIE}=${token}`, "HttpOnly", "SameSite=Lax", "Path=/", `Max-Age=${maxAge}`];
  if (secure) parts.push("Secure");
  return ["set-cookie", parts.join("; ")];
}

function turnstileOn(env) {
  return Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET);
}

function wechatOn(env) {
  return Boolean(env.WECHAT_APPID && env.WECHAT_SECRET);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function currentUser(request, env) {
  if (!env.SESSION_SECRET || !env.DB) return null;
  const token = readCookie(request, COOKIE);
  if (!token) return null;
  const tokenHash = await hashToken(env.SESSION_SECRET, token);
  const row = await env.DB.prepare(
    `SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ? AND sessions.expires_at > ?`,
  ).bind(tokenHash, nowMs(env)).first();
  return row || null;
}

async function createSession(env, request, userId) {
  if (!env.SESSION_SECRET) {
    return json({ ok: false, message: "会话密钥尚未配置" }, 503);
  }
  const token = randomHex(32);
  const tokenHash = await hashToken(env.SESSION_SECRET, token);
  const now = nowMs(env);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(
    tokenHash,
    userId,
    now + SESSION_MS,
    now,
  ).run();
  return token;
}

async function verifyTurnstile(env, token, ip) {
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET);
  body.set("response", token || "");
  body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

async function sendSms(request, env) {
  const body = await readJson(request);
  const phone = String(body?.phone || "").trim();
  if (!PHONE_RE.test(phone)) return json({ ok: false, message: "只接受中国大陆 11 位手机号" }, 400);
  if (!smsMock(env) && !smsConfigured(env)) return json({ ok: false, message: "短信服务尚未开通" }, 503);
  if (turnstileOn(env)) {
    const passed = await verifyTurnstile(env, body?.turnstileToken, clientIp(request));
    if (!passed) return json({ ok: false, message: "请先完成人机验证" }, 400);
  } else if ((env.TURNSTILE_SITE_KEY && !env.TURNSTILE_SECRET) || (!env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET)) {
    return json({ ok: false, message: "人机验证未正确配置" }, 503);
  }

  const now = nowMs(env);
  const ip = clientIp(request);
  const dayStart = beijingDayStart(now);
  const last = await env.DB.prepare("SELECT created_at FROM sms_sends WHERE phone = ? ORDER BY created_at DESC LIMIT 1").bind(phone).first();
  if (last && now - last.created_at < 60_000) {
    return json({ ok: false, message: "请 60 秒后再获取验证码" }, 429);
  }
  const phoneDay = await env.DB.prepare("SELECT COUNT(*) AS n FROM sms_sends WHERE phone = ? AND created_at >= ?").bind(phone, dayStart).first();
  if ((phoneDay?.n || 0) >= 10) return json({ ok: false, message: "该手机号今日获取次数已达上限" }, 429);
  const ipHour = await env.DB.prepare("SELECT COUNT(*) AS n FROM sms_sends WHERE ip = ? AND created_at >= ?").bind(ip, now - 3600_000).first();
  if ((ipHour?.n || 0) >= 10) return json({ ok: false, message: "当前网络获取次数已达上限，请稍后再试" }, 429);
  const siteDay = await env.DB.prepare("SELECT COUNT(*) AS n FROM sms_sends WHERE created_at >= ?").bind(dayStart).first();
  if ((siteDay?.n || 0) >= 300) return json({ ok: false, message: "今日短信发送额度已用完" }, 429);

  let devCode;
  if (smsMock(env)) {
    devCode = String(Math.floor(100000 + Math.random() * 900000));
    await env.DB.prepare("INSERT INTO mock_sms (phone, code, expires_at) VALUES (?, ?, ?) ON CONFLICT(phone) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at").bind(
      phone,
      devCode,
      now + 300_000,
    ).run();
  } else {
    const sent = await aliyunSend(env, phone);
    if (!sent.ok) return json({ ok: false, message: "短信发送失败，请稍后再试" }, 502);
  }
  await env.DB.prepare("INSERT INTO sms_sends (phone, ip, created_at) VALUES (?, ?, ?)").bind(phone, ip, now).run();
  const payload = { ok: true, message: "验证码已发送" };
  if (devCode) payload.devCode = devCode;
  return json(payload);
}

async function verifySms(request, env) {
  const body = await readJson(request);
  const phone = String(body?.phone || "").trim();
  const code = String(body?.code || "").trim();
  if (!PHONE_RE.test(phone)) return json({ ok: false, message: "只接受中国大陆 11 位手机号" }, 400);
  if (!/^\d{6}$/.test(code)) return json({ ok: false, message: "请输入 6 位验证码" }, 400);
  if (!smsMock(env) && !smsConfigured(env)) return json({ ok: false, message: "短信服务尚未开通" }, 503);

  const now = nowMs(env);
  const lock = await env.DB.prepare("SELECT fail_count, locked_until FROM sms_locks WHERE phone = ?").bind(phone).first();
  if (lock && lock.locked_until > now) {
    return json({ ok: false, message: "验证码错误次数过多，请 10 分钟后再试" }, 429);
  }

  let passed = false;
  if (smsMock(env)) {
    const row = await env.DB.prepare("SELECT code, expires_at FROM mock_sms WHERE phone = ?").bind(phone).first();
    passed = Boolean(row && row.code === code && row.expires_at > now);
  } else {
    const checked = await aliyunCheck(env, phone, code);
    passed = checked.ok;
  }

  if (!passed) {
    const fails = (lock && lock.locked_until <= now ? lock.fail_count : lock?.fail_count || 0) + 1;
    const lockedUntil = fails >= 5 ? now + LOCK_MS : 0;
    await env.DB.prepare(
      "INSERT INTO sms_locks (phone, fail_count, locked_until) VALUES (?, ?, ?) ON CONFLICT(phone) DO UPDATE SET fail_count = excluded.fail_count, locked_until = excluded.locked_until",
    ).bind(phone, fails >= 5 ? 0 : fails, lockedUntil).run();
    if (lockedUntil) return json({ ok: false, message: "验证码错误次数过多，请 10 分钟后再试" }, 429);
    return json({ ok: false, message: "验证码不正确" }, 400);
  }

  await env.DB.prepare("DELETE FROM sms_locks WHERE phone = ?").bind(phone).run();
  await env.DB.prepare("DELETE FROM mock_sms WHERE phone = ?").bind(phone).run();

  let user = await env.DB.prepare("SELECT * FROM users WHERE phone = ?").bind(phone).first();
  if (!user) {
    const nickname = String(body?.nickname || "").trim().slice(0, 20) || `学员${phone.slice(-4)}`;
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, phone, nickname, created_at) VALUES (?, ?, ?, ?)").bind(id, phone, nickname, now).run();
    user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  }
  const token = await createSession(env, request, user.id);
  if (token instanceof Response) return token;
  return json({ ok: true, user: publicUser(user) }, 200, [cookie(token, request, SESSION_MS / 1000)]);
}

async function me(request, env) {
  const user = await currentUser(request, env);
  return json({ ok: true, user: user ? publicUser(user) : null });
}

async function logout(request, env) {
  const token = readCookie(request, COOKIE);
  if (token && env.SESSION_SECRET && env.DB) {
    const tokenHash = await hashToken(env.SESSION_SECRET, token);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  return json({ ok: true }, 200, [cookie("", request, 0)]);
}

function config(env) {
  return json({
    ok: true,
    smsEnabled: smsConfigured(env) || smsMock(env),
    turnstileSiteKey: turnstileOn(env) ? env.TURNSTILE_SITE_KEY : null,
    wechatEnabled: wechatOn(env),
  });
}

function wechatRedirect(appid, state, origin) {
  const redirect = encodeURIComponent(`${origin}/api/wechat/callback`);
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${encodeURIComponent(appid)}&redirect_uri=${redirect}&response_type=code&scope=snsapi_login&state=${encodeURIComponent(state)}#wechat_redirect`;
}

async function wechatStart(request, env) {
  if (!wechatOn(env)) return json({ ok: false, message: "微信绑定即将开通" }, 503);
  const purpose = new URL(request.url).searchParams.get("purpose");
  if (purpose !== "bind" && purpose !== "login") return json({ ok: false, message: "未知的微信操作" }, 400);
  const user = await currentUser(request, env);
  if (purpose === "bind" && !user) return json({ ok: false, message: "请先用手机号登录，再绑定微信" }, 401);
  const state = randomHex(16);
  await env.DB.prepare("INSERT INTO wechat_states (state, purpose, user_id, expires_at) VALUES (?, ?, ?, ?)").bind(
    state,
    purpose,
    user?.id || null,
    nowMs(env) + STATE_MS,
  ).run();
  return Response.redirect(wechatRedirect(env.WECHAT_APPID, state, requestOrigin(request)), 302);
}

async function wechatCallback(request, env) {
  if (!wechatOn(env)) return json({ ok: false, message: "微信绑定即将开通" }, 503);
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const saved = await env.DB.prepare("SELECT * FROM wechat_states WHERE state = ?").bind(state).first();
  if (!saved || saved.expires_at < nowMs(env)) return json({ ok: false, message: "微信授权已过期，请重试" }, 400);
  await env.DB.prepare("DELETE FROM wechat_states WHERE state = ?").bind(state).run();

  const tokenUrl = new URL("https://api.weixin.qq.com/sns/oauth2/access_token");
  tokenUrl.searchParams.set("appid", env.WECHAT_APPID);
  tokenUrl.searchParams.set("secret", env.WECHAT_SECRET);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("grant_type", "authorization_code");
  const exchanged = await fetch(tokenUrl).then((res) => res.json()).catch(() => ({}));
  const openid = exchanged.openid;
  const unionid = exchanged.unionid || null;
  if (!openid) return json({ ok: false, message: "微信授权失败，请重试" }, 400);

  if (saved.purpose === "bind") {
    const owner = await env.DB.prepare("SELECT id FROM users WHERE wechat_openid = ?").bind(openid).first();
    if (owner && owner.id !== saved.user_id) return json({ ok: false, message: "这个微信已经绑定了其他账号" }, 409);
    await env.DB.prepare("UPDATE users SET wechat_openid = ?, wechat_unionid = ? WHERE id = ?").bind(openid, unionid, saved.user_id).run();
    return Response.redirect(`${requestOrigin(request)}/c/profile`, 302);
  }

  const user = await env.DB.prepare("SELECT * FROM users WHERE wechat_openid = ?").bind(openid).first();
  if (!user) return Response.redirect(`${requestOrigin(request)}/login?wechat=need_bind`, 302);
  const token = await createSession(env, request, user.id);
  if (token instanceof Response) return token;
  const headers = new Headers({ location: `${requestOrigin(request)}/c/profile` });
  headers.append(...cookie(token, request, SESSION_MS / 1000));
  return new Response(null, { status: 302, headers });
}

async function wechatUnbind(request, env) {
  const user = await currentUser(request, env);
  if (!user) return json({ ok: false, message: "请先登录" }, 401);
  await env.DB.prepare("UPDATE users SET wechat_openid = NULL, wechat_unionid = NULL WHERE id = ?").bind(user.id).run();
  const fresh = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
  return json({ ok: true, user: publicUser(fresh) });
}

export async function handleApi(request, env) {
  if (!env.DB) return json({ ok: false, message: "数据库未绑定" }, 503);
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();
  if (path === "/api/config" && method === "GET") return config(env);
  if (path === "/api/me" && method === "GET") return me(request, env);
  if (path === "/api/logout" && method === "POST") return logout(request, env);
  if (path === "/api/sms/send" && method === "POST") return sendSms(request, env);
  if (path === "/api/sms/verify" && method === "POST") return verifySms(request, env);
  if (path === "/api/wechat/start" && method === "GET") return wechatStart(request, env);
  if (path === "/api/wechat/callback" && method === "GET") return wechatCallback(request, env);
  if (path === "/api/wechat/unbind" && method === "POST") return wechatUnbind(request, env);
  return json({ ok: false, message: "接口不存在" }, 404);
}
