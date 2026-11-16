// cloudflare/src/sms.js
var HOST = "dypnsapi.aliyuncs.com";
var VERSION = "2017-05-25";
var enc = new TextEncoder();
var hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
var sha256Hex = async (s) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
async function hmacHex(key, msg) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}
var pct = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
function smsConfigured(env) {
  return Boolean(env.ALIYUN_ACCESS_KEY_ID && env.ALIYUN_ACCESS_KEY_SECRET && env.SMS_SIGN_NAME && env.SMS_TEMPLATE_CODE);
}
function smsMock(env) {
  return env.SMS_MOCK === "1";
}
async function call(env, action, params) {
  const query = Object.keys(params).filter((k) => params[k] !== "" && params[k] !== void 0 && params[k] !== null).sort().map((k) => `${pct(k)}=${pct(String(params[k]))}`).join("&");
  const payloadHash = await sha256Hex("");
  const headers = {
    host: HOST,
    "x-acs-action": action,
    "x-acs-content-sha256": payloadHash,
    "x-acs-date": (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, "Z"),
    "x-acs-signature-nonce": crypto.randomUUID().replace(/-/g, ""),
    "x-acs-version": VERSION
  };
  const names = Object.keys(headers).sort();
  const canonicalHeaders = names.map((n) => `${n}:${headers[n].trim()}
`).join("");
  const signedHeaders = names.join(";");
  const canonicalRequest = ["POST", "/", query, canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const stringToSign = "ACS3-HMAC-SHA256\n" + await sha256Hex(canonicalRequest);
  const signature = await hmacHex(env.ALIYUN_ACCESS_KEY_SECRET, stringToSign);
  headers.Authorization = `ACS3-HMAC-SHA256 Credential=${env.ALIYUN_ACCESS_KEY_ID},SignedHeaders=${signedHeaders},Signature=${signature}`;
  const res = await fetch(`https://${HOST}/?${query}`, { method: "POST", headers });
  const body = await res.json().catch(() => ({}));
  return body;
}
async function aliyunSend(env, phone) {
  const result = await call(env, "SendSmsVerifyCode", {
    PhoneNumber: phone,
    CountryCode: "86",
    SignName: env.SMS_SIGN_NAME,
    TemplateCode: env.SMS_TEMPLATE_CODE,
    TemplateParam: env.SMS_TEMPLATE_PARAM || '{"code":"##code##","min":"5"}',
    CodeLength: 6,
    CodeType: 1,
    ValidTime: 300,
    Interval: 60,
    DuplicatePolicy: 1
  });
  return {
    ok: result?.Code === "OK" && result?.Success !== false,
    code: String(result?.Code || ""),
    message: String(result?.Message || "")
  };
}
async function aliyunCheck(env, phone, code) {
  const result = await call(env, "CheckSmsVerifyCode", {
    PhoneNumber: phone,
    CountryCode: "86",
    VerifyCode: code
  });
  return {
    ok: result?.Code === "OK" && result?.Model?.VerifyResult === "PASS",
    code: String(result?.Code || ""),
    message: String(result?.Message || "")
  };
}

// cloudflare/src/api.js
var COOKIE = "aa_session";
var SESSION_MS = 30 * 24 * 60 * 60 * 1e3;
var LOCK_MS = 10 * 60 * 1e3;
var STATE_MS = 10 * 60 * 1e3;
var PHONE_RE = /^1[3-9]\d{9}$/;
function requestOrigin(request) {
  return new URL(request.url).origin;
}
function nowMs(env) {
  return typeof env.now === "function" ? env.now() : Date.now();
}
function beijingDayStart(now) {
  const offset = 8 * 60 * 60 * 1e3;
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
var enc2 = new TextEncoder();
var hex2 = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
async function hashToken(secret, token) {
  const key = await crypto.subtle.importKey("raw", enc2.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex2(await crypto.subtle.sign("HMAC", key, enc2.encode(token)));
}
function randomHex(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return hex2(buf.buffer);
}
function maskPhone(phone) {
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
function publicUser(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    phoneMasked: maskPhone(row.phone),
    wechatBound: Boolean(row.wechat_openid)
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
     WHERE sessions.token_hash = ? AND sessions.expires_at > ?`
  ).bind(tokenHash, nowMs(env)).first();
  return row || null;
}
async function createSession(env, request, userId) {
  if (!env.SESSION_SECRET) {
    return json({ ok: false, message: "\u4F1A\u8BDD\u5BC6\u94A5\u5C1A\u672A\u914D\u7F6E" }, 503);
  }
  const token = randomHex(32);
  const tokenHash = await hashToken(env.SESSION_SECRET, token);
  const now = nowMs(env);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(
    tokenHash,
    userId,
    now + SESSION_MS,
    now
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
  if (!PHONE_RE.test(phone)) return json({ ok: false, message: "\u53EA\u63A5\u53D7\u4E2D\u56FD\u5927\u9646 11 \u4F4D\u624B\u673A\u53F7" }, 400);
  if (!smsMock(env) && !smsConfigured(env)) return json({ ok: false, message: "\u77ED\u4FE1\u670D\u52A1\u5C1A\u672A\u5F00\u901A" }, 503);
  if (turnstileOn(env)) {
    const passed = await verifyTurnstile(env, body?.turnstileToken, clientIp(request));
    if (!passed) return json({ ok: false, message: "\u8BF7\u5148\u5B8C\u6210\u4EBA\u673A\u9A8C\u8BC1" }, 400);
  } else if (env.TURNSTILE_SITE_KEY && !env.TURNSTILE_SECRET || !env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET) {
    return json({ ok: false, message: "\u4EBA\u673A\u9A8C\u8BC1\u672A\u6B63\u786E\u914D\u7F6E" }, 503);
  }
  const now = nowMs(env);
  const ip = clientIp(request);
  const dayStart = beijingDayStart(now);
  const last = await env.DB.prepare("SELECT created_at FROM sms_sends WHERE phone = ? ORDER BY created_at DESC LIMIT 1").bind(phone).first();
  if (last && now - last.created_at < 6e4) {
    return json({ ok: false, message: "\u8BF7 60 \u79D2\u540E\u518D\u83B7\u53D6\u9A8C\u8BC1\u7801" }, 429);
  }
  const phoneDay = await env.DB.prepare("SELECT COUNT(*) AS n FROM sms_sends WHERE phone = ? AND created_at >= ?").bind(phone, dayStart).first();
  if ((phoneDay?.n || 0) >= 10) return json({ ok: false, message: "\u8BE5\u624B\u673A\u53F7\u4ECA\u65E5\u83B7\u53D6\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650" }, 429);
  const ipHour = await env.DB.prepare("SELECT COUNT(*) AS n FROM sms_sends WHERE ip = ? AND created_at >= ?").bind(ip, now - 36e5).first();
  if ((ipHour?.n || 0) >= 10) return json({ ok: false, message: "\u5F53\u524D\u7F51\u7EDC\u83B7\u53D6\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" }, 429);
  const siteDay = await env.DB.prepare("SELECT COUNT(*) AS n FROM sms_sends WHERE created_at >= ?").bind(dayStart).first();
  if ((siteDay?.n || 0) >= 300) return json({ ok: false, message: "\u4ECA\u65E5\u77ED\u4FE1\u53D1\u9001\u989D\u5EA6\u5DF2\u7528\u5B8C" }, 429);
  let devCode;
  if (smsMock(env)) {
    devCode = String(Math.floor(1e5 + Math.random() * 9e5));
    await env.DB.prepare("INSERT INTO mock_sms (phone, code, expires_at) VALUES (?, ?, ?) ON CONFLICT(phone) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at").bind(
      phone,
      devCode,
      now + 3e5
    ).run();
  } else {
    const sent = await aliyunSend(env, phone);
    if (!sent.ok) return json({ ok: false, message: "\u77ED\u4FE1\u53D1\u9001\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" }, 502);
  }
  await env.DB.prepare("INSERT INTO sms_sends (phone, ip, created_at) VALUES (?, ?, ?)").bind(phone, ip, now).run();
  const payload = { ok: true, message: "\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001" };
  if (devCode) payload.devCode = devCode;
  return json(payload);
}
async function verifySms(request, env) {
  const body = await readJson(request);
  const phone = String(body?.phone || "").trim();
  const code = String(body?.code || "").trim();
  if (!PHONE_RE.test(phone)) return json({ ok: false, message: "\u53EA\u63A5\u53D7\u4E2D\u56FD\u5927\u9646 11 \u4F4D\u624B\u673A\u53F7" }, 400);
  if (!/^\d{6}$/.test(code)) return json({ ok: false, message: "\u8BF7\u8F93\u5165 6 \u4F4D\u9A8C\u8BC1\u7801" }, 400);
  if (!smsMock(env) && !smsConfigured(env)) return json({ ok: false, message: "\u77ED\u4FE1\u670D\u52A1\u5C1A\u672A\u5F00\u901A" }, 503);
  const now = nowMs(env);
  const lock = await env.DB.prepare("SELECT fail_count, locked_until FROM sms_locks WHERE phone = ?").bind(phone).first();
  if (lock && lock.locked_until > now) {
    return json({ ok: false, message: "\u9A8C\u8BC1\u7801\u9519\u8BEF\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7 10 \u5206\u949F\u540E\u518D\u8BD5" }, 429);
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
      "INSERT INTO sms_locks (phone, fail_count, locked_until) VALUES (?, ?, ?) ON CONFLICT(phone) DO UPDATE SET fail_count = excluded.fail_count, locked_until = excluded.locked_until"
    ).bind(phone, fails >= 5 ? 0 : fails, lockedUntil).run();
    if (lockedUntil) return json({ ok: false, message: "\u9A8C\u8BC1\u7801\u9519\u8BEF\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7 10 \u5206\u949F\u540E\u518D\u8BD5" }, 429);
    return json({ ok: false, message: "\u9A8C\u8BC1\u7801\u4E0D\u6B63\u786E" }, 400);
  }
  await env.DB.prepare("DELETE FROM sms_locks WHERE phone = ?").bind(phone).run();
  await env.DB.prepare("DELETE FROM mock_sms WHERE phone = ?").bind(phone).run();
  let user = await env.DB.prepare("SELECT * FROM users WHERE phone = ?").bind(phone).first();
  if (!user) {
    const nickname = String(body?.nickname || "").trim().slice(0, 20) || `\u5B66\u5458${phone.slice(-4)}`;
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, phone, nickname, created_at) VALUES (?, ?, ?, ?)").bind(id, phone, nickname, now).run();
    user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  }
  const token = await createSession(env, request, user.id);
  if (token instanceof Response) return token;
  return json({ ok: true, user: publicUser(user) }, 200, [cookie(token, request, SESSION_MS / 1e3)]);
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
    wechatEnabled: wechatOn(env)
  });
}
function wechatRedirect(appid, state, origin) {
  const redirect = encodeURIComponent(`${origin}/api/wechat/callback`);
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${encodeURIComponent(appid)}&redirect_uri=${redirect}&response_type=code&scope=snsapi_login&state=${encodeURIComponent(state)}#wechat_redirect`;
}
async function wechatStart(request, env) {
  if (!wechatOn(env)) return json({ ok: false, message: "\u5FAE\u4FE1\u7ED1\u5B9A\u5373\u5C06\u5F00\u901A" }, 503);
  const purpose = new URL(request.url).searchParams.get("purpose");
  if (purpose !== "bind" && purpose !== "login") return json({ ok: false, message: "\u672A\u77E5\u7684\u5FAE\u4FE1\u64CD\u4F5C" }, 400);
  const user = await currentUser(request, env);
  if (purpose === "bind" && !user) return json({ ok: false, message: "\u8BF7\u5148\u7528\u624B\u673A\u53F7\u767B\u5F55\uFF0C\u518D\u7ED1\u5B9A\u5FAE\u4FE1" }, 401);
  const state = randomHex(16);
  await env.DB.prepare("INSERT INTO wechat_states (state, purpose, user_id, expires_at) VALUES (?, ?, ?, ?)").bind(
    state,
    purpose,
    user?.id || null,
    nowMs(env) + STATE_MS
  ).run();
  return Response.redirect(wechatRedirect(env.WECHAT_APPID, state, requestOrigin(request)), 302);
}
async function wechatCallback(request, env) {
  if (!wechatOn(env)) return json({ ok: false, message: "\u5FAE\u4FE1\u7ED1\u5B9A\u5373\u5C06\u5F00\u901A" }, 503);
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const saved = await env.DB.prepare("SELECT * FROM wechat_states WHERE state = ?").bind(state).first();
  if (!saved || saved.expires_at < nowMs(env)) return json({ ok: false, message: "\u5FAE\u4FE1\u6388\u6743\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u8BD5" }, 400);
  await env.DB.prepare("DELETE FROM wechat_states WHERE state = ?").bind(state).run();
  const tokenUrl = new URL("https://api.weixin.qq.com/sns/oauth2/access_token");
  tokenUrl.searchParams.set("appid", env.WECHAT_APPID);
  tokenUrl.searchParams.set("secret", env.WECHAT_SECRET);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("grant_type", "authorization_code");
  const exchanged = await fetch(tokenUrl).then((res) => res.json()).catch(() => ({}));
  const openid = exchanged.openid;
  const unionid = exchanged.unionid || null;
  if (!openid) return json({ ok: false, message: "\u5FAE\u4FE1\u6388\u6743\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5" }, 400);
  if (saved.purpose === "bind") {
    const owner = await env.DB.prepare("SELECT id FROM users WHERE wechat_openid = ?").bind(openid).first();
    if (owner && owner.id !== saved.user_id) return json({ ok: false, message: "\u8FD9\u4E2A\u5FAE\u4FE1\u5DF2\u7ECF\u7ED1\u5B9A\u4E86\u5176\u4ED6\u8D26\u53F7" }, 409);
    await env.DB.prepare("UPDATE users SET wechat_openid = ?, wechat_unionid = ? WHERE id = ?").bind(openid, unionid, saved.user_id).run();
    return Response.redirect(`${requestOrigin(request)}/c/profile`, 302);
  }
  const user = await env.DB.prepare("SELECT * FROM users WHERE wechat_openid = ?").bind(openid).first();
  if (!user) return Response.redirect(`${requestOrigin(request)}/login?wechat=need_bind`, 302);
  const token = await createSession(env, request, user.id);
  if (token instanceof Response) return token;
  const headers = new Headers({ location: `${requestOrigin(request)}/c/profile` });
  headers.append(...cookie(token, request, SESSION_MS / 1e3));
  return new Response(null, { status: 302, headers });
}
async function wechatUnbind(request, env) {
  const user = await currentUser(request, env);
  if (!user) return json({ ok: false, message: "\u8BF7\u5148\u767B\u5F55" }, 401);
  await env.DB.prepare("UPDATE users SET wechat_openid = NULL, wechat_unionid = NULL WHERE id = ?").bind(user.id).run();
  const fresh = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
  return json({ ok: true, user: publicUser(fresh) });
}
async function handleApi(request, env) {
  if (!env.DB) return json({ ok: false, message: "\u6570\u636E\u5E93\u672A\u7ED1\u5B9A" }, 503);
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
  return json({ ok: false, message: "\u63A5\u53E3\u4E0D\u5B58\u5728" }, 404);
}

// cloudflare/src/static.js
var TYPES = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  map: "application/json; charset=utf-8",
  webmanifest: "application/manifest+json"
};
var BINARY = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "webp", "gif", "ico", "woff", "woff2"]);
function extname(key) {
  const base = key.split("/").pop() || "";
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot + 1).toLowerCase() : "";
}
function lookupKeys(pathname) {
  if (pathname === "/") return ["/", "/index.html"];
  const keys = [pathname];
  if (!pathname.endsWith("/")) {
    keys.push(`${pathname}.html`, `${pathname}/index.html`);
  } else {
    keys.push(`${pathname}index.html`);
  }
  return keys;
}
async function serveStatic(request, env) {
  const url = new URL(request.url);
  let pathname = url.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
  if (pathname.includes("..")) return new Response("Bad Request", { status: 400 });
  for (const key of lookupKeys(pathname)) {
    const hit = await readKey(env, key);
    if (hit) return new Response(hit.body, { status: 200, headers: hit.headers });
  }
  const missing = await readKey(env, "/404.html");
  if (missing) return new Response(missing.body, { status: 404, headers: missing.headers });
  return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
}
async function readKey(env, key) {
  if (!env.SITE) return null;
  const ext = extname(key);
  const binary = BINARY.has(ext);
  const body = await env.SITE.get(key, binary ? { type: "arrayBuffer" } : { type: "text" });
  if (body == null) return null;
  const headers = new Headers({
    "content-type": TYPES[ext] || "application/octet-stream"
  });
  if (key.startsWith("/_next/static/")) {
    headers.set("cache-control", "public, max-age=31536000, immutable");
  }
  return { body, headers };
}

// cloudflare/src/worker.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }
    return serveStatic(request, env);
  }
};
export {
  worker_default as default
};
