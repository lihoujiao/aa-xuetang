import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { DatabaseSync } from "node:sqlite";
import { handleApi } from "../src/api.js";

function createDb() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../schema.sql", import.meta.url), "utf8"));
  return {
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
}

function env(extra = {}) {
  return {
    DB: createDb(),
    SESSION_SECRET: "test-session-secret",
    SMS_MOCK: "1",
    now: () => extra.clock?.now ?? Date.parse("2026-11-15T02:00:00Z"),
    ...extra,
  };
}

async function call(target, path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (init.json) headers.set("content-type", "application/json");
  if (init.ip) headers.set("cf-connecting-ip", init.ip);
  if (init.cookie) headers.set("cookie", init.cookie);
  const res = await handleApi(
    new Request(`https://xuetang.fde100.com.cn${path}`, {
      method: init.method || (init.json ? "POST" : "GET"),
      headers,
      body: init.json ? JSON.stringify(init.json) : undefined,
    }),
    target,
  );
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, body, headers: res.headers };
}

function cookieOf(headers) {
  return headers.get("set-cookie") || "";
}

test("未配置阿里云且未开启模拟时，发码返回尚未开通", async () => {
  const target = env({ SMS_MOCK: "0" });
  const res = await call(target, "/api/sms/send", { json: { phone: "13800138000" } });
  assert.equal(res.status, 503);
  assert.equal(res.body.message, "短信服务尚未开通");
});

test("模拟发码、校验建会话、读取身份并退出", async () => {
  const target = env();
  const sent = await call(target, "/api/sms/send", { json: { phone: "13800138000" }, ip: "1.1.1.1" });
  assert.equal(sent.status, 200);
  assert.match(sent.body.devCode, /^\d{6}$/);

  const verified = await call(target, "/api/sms/verify", {
    json: { phone: "13800138000", code: sent.body.devCode, nickname: "林夏" },
  });
  assert.equal(verified.status, 200);
  assert.equal(verified.body.user.nickname, "林夏");
  assert.equal(verified.body.user.phoneMasked, "138****8000");
  const setCookie = cookieOf(verified.headers);
  assert.match(setCookie, /aa_session=/);
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, /Secure/);

  const token = setCookie.split(";")[0];
  const me = await call(target, "/api/me", { cookie: token });
  assert.equal(me.body.user.nickname, "林夏");

  const out = await call(target, "/api/logout", { method: "POST", cookie: token });
  assert.equal(out.status, 200);
  const again = await call(target, "/api/me", { cookie: token });
  assert.equal(again.body.user, null);
});

test("同一号码 60 秒内不能再次发码", async () => {
  const clock = { now: Date.parse("2026-11-15T02:00:00Z") };
  const target = env({ clock });
  const first = await call(target, "/api/sms/send", { json: { phone: "13800138001" }, ip: "1.1.1.2" });
  assert.equal(first.status, 200);
  clock.now += 30_000;
  const second = await call(target, "/api/sms/send", { json: { phone: "13800138001" }, ip: "1.1.1.2" });
  assert.equal(second.status, 429);
  clock.now += 31_000;
  const third = await call(target, "/api/sms/send", { json: { phone: "13800138001" }, ip: "1.1.1.2" });
  assert.equal(third.status, 200);
});

test("同一号码每天最多 10 次", async () => {
  const clock = { now: Date.parse("2026-11-15T02:00:00Z") };
  const target = env({ clock });
  for (let i = 0; i < 10; i += 1) {
    const res = await call(target, "/api/sms/send", { json: { phone: "13900139000" }, ip: `10.0.0.${i}` });
    assert.equal(res.status, 200, `第 ${i + 1} 次`);
    clock.now += 61_000;
  }
  const blocked = await call(target, "/api/sms/send", { json: { phone: "13900139000" }, ip: "10.0.0.20" });
  assert.equal(blocked.status, 429);
  assert.match(blocked.body.message, /今日/);
});

test("连续输错 5 次后锁定", async () => {
  const target = env();
  const sent = await call(target, "/api/sms/send", { json: { phone: "13700137000" }, ip: "8.8.8.8" });
  for (let i = 0; i < 4; i += 1) {
    const wrong = await call(target, "/api/sms/verify", { json: { phone: "13700137000", code: "000000" } });
    assert.equal(wrong.status, 400);
  }
  const locked = await call(target, "/api/sms/verify", { json: { phone: "13700137000", code: "000000" } });
  assert.equal(locked.status, 429);
  const still = await call(target, "/api/sms/verify", { json: { phone: "13700137000", code: sent.body.devCode } });
  assert.equal(still.status, 429);
});

test("同一 IP 每小时最多 10 次", async () => {
  const target = env();
  for (let i = 0; i < 10; i += 1) {
    const phone = `1380013${String(i).padStart(4, "0")}`;
    const res = await call(target, "/api/sms/send", { json: { phone }, ip: "9.9.9.9" });
    assert.equal(res.status, 200);
  }
  const blocked = await call(target, "/api/sms/send", { json: { phone: "13800131111" }, ip: "9.9.9.9" });
  assert.equal(blocked.status, 429);
  assert.match(blocked.body.message, /网络/);
});

test("未配置微信时返回即将开通", async () => {
  const target = env();
  const res = await call(target, "/api/wechat/start?purpose=login");
  assert.equal(res.status, 503);
  assert.equal(res.body.message, "微信绑定即将开通");
});

test("配置了微信时，登录跳转带上防伪 state", async () => {
  const target = env({ WECHAT_APPID: "wx-test", WECHAT_SECRET: "not-logged" });
  const res = await call(target, "/api/wechat/start?purpose=login");
  assert.equal(res.status, 302);
  const location = res.headers.get("location") || "";
  assert.match(location, /^https:\/\/open\.weixin\.qq\.com\/connect\/qrconnect\?/);
  assert.match(location, /redirect_uri=https%3A%2F%2Fxuetang\.fde100\.com\.cn%2Fapi%2Fwechat%2Fcallback/);
  assert.doesNotMatch(location, /not-logged/);
});
