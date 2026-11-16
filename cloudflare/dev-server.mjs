// 本地把静态导出和 Worker API 放在同一个端口。SMS_MOCK=1 时验证码出现在发码响应里。
import { createServer } from "node:http";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import worker from "./src/worker.js";

const root = new URL("../out/", import.meta.url).pathname;
const port = Number(process.env.PORT || 43127);
const files = new Map();

function walk(dir, prefix) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const rel = `${prefix}/${name}`;
    if (statSync(abs).isDirectory()) walk(abs, rel);
    else files.set(rel, readFileSync(abs));
  }
}
if (!existsSync(root)) {
  console.error("缺少 out/，请先 npm run build");
  process.exit(1);
}
walk(root, "");

const db = new DatabaseSync(":memory:");
db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
const DB = {
  prepare(sql) {
    const stmt = db.prepare(sql);
    const wrap = (...params) => ({
      async first() {
        return stmt.get(...params) ?? null;
      },
      async all() {
        return { results: stmt.all(...params) };
      },
      async run() {
        const info = stmt.run(...params);
        return { success: true, meta: { changes: info.changes } };
      },
    });
    return { bind: wrap };
  },
};

const SITE = {
  async get(key, opts) {
    const buf = files.get(key);
    if (!buf) return null;
    if (opts?.type === "arrayBuffer") return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return buf.toString("utf8");
  },
};

const env = {
  DB,
  SITE,
  SESSION_SECRET: process.env.SESSION_SECRET || "local-dev-session-secret",
  SMS_MOCK: process.env.SMS_MOCK || "1",
  ALIYUN_ACCESS_KEY_ID: process.env.ALIYUN_ACCESS_KEY_ID,
  ALIYUN_ACCESS_KEY_SECRET: process.env.ALIYUN_ACCESS_KEY_SECRET,
  SMS_SIGN_NAME: process.env.SMS_SIGN_NAME,
  SMS_TEMPLATE_CODE: process.env.SMS_TEMPLATE_CODE,
  SMS_TEMPLATE_PARAM: process.env.SMS_TEMPLATE_PARAM,
  TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET: process.env.TURNSTILE_SECRET,
  WECHAT_APPID: process.env.WECHAT_APPID,
  WECHAT_SECRET: process.env.WECHAT_SECRET,
};

const server = createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  const request = new Request(`http://127.0.0.1:${port}${req.url}`, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
  });
  const response = await worker.fetch(request, env);
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    res.setHeader(key, value);
  });
  const cookies = response.headers.getSetCookie?.() || [];
  if (cookies.length) res.setHeader("set-cookie", cookies);
  res.end(Buffer.from(await response.arrayBuffer()));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}`);
});
