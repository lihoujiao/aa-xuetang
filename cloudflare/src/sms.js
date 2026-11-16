// 阿里云号码认证服务（Dypnsapi 2017-05-25）
// 签名：ACS3-HMAC-SHA256。凭证只从 env 读取，不打印、不写日志。

const HOST = "dypnsapi.aliyuncs.com";
const VERSION = "2017-05-25";
const enc = new TextEncoder();

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256Hex = async (s) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

async function hmacHex(key, msg) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}

const pct = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

export function smsConfigured(env) {
  return Boolean(env.ALIYUN_ACCESS_KEY_ID && env.ALIYUN_ACCESS_KEY_SECRET && env.SMS_SIGN_NAME && env.SMS_TEMPLATE_CODE);
}

export function smsMock(env) {
  return env.SMS_MOCK === "1";
}

async function call(env, action, params) {
  const query = Object.keys(params)
    .filter((k) => params[k] !== "" && params[k] !== undefined && params[k] !== null)
    .sort()
    .map((k) => `${pct(k)}=${pct(String(params[k]))}`)
    .join("&");
  const payloadHash = await sha256Hex("");
  const headers = {
    host: HOST,
    "x-acs-action": action,
    "x-acs-content-sha256": payloadHash,
    "x-acs-date": new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    "x-acs-signature-nonce": crypto.randomUUID().replace(/-/g, ""),
    "x-acs-version": VERSION,
  };
  const names = Object.keys(headers).sort();
  const canonicalHeaders = names.map((n) => `${n}:${headers[n].trim()}\n`).join("");
  const signedHeaders = names.join(";");
  const canonicalRequest = ["POST", "/", query, canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const stringToSign = "ACS3-HMAC-SHA256\n" + (await sha256Hex(canonicalRequest));
  const signature = await hmacHex(env.ALIYUN_ACCESS_KEY_SECRET, stringToSign);
  headers.Authorization = `ACS3-HMAC-SHA256 Credential=${env.ALIYUN_ACCESS_KEY_ID},SignedHeaders=${signedHeaders},Signature=${signature}`;
  const res = await fetch(`https://${HOST}/?${query}`, { method: "POST", headers });
  const body = await res.json().catch(() => ({}));
  return body;
}

export async function aliyunSend(env, phone) {
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
    DuplicatePolicy: 1,
  });
  return {
    ok: result?.Code === "OK" && result?.Success !== false,
    code: String(result?.Code || ""),
    message: String(result?.Message || ""),
  };
}

export async function aliyunCheck(env, phone, code) {
  const result = await call(env, "CheckSmsVerifyCode", {
    PhoneNumber: phone,
    CountryCode: "86",
    VerifyCode: code,
  });
  return {
    ok: result?.Code === "OK" && result?.Model?.VerifyResult === "PASS",
    code: String(result?.Code || ""),
    message: String(result?.Message || ""),
  };
}
