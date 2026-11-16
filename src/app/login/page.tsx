"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setMe, type SessionUser } from "@/lib/session";

type PublicConfig = {
  smsEnabled: boolean;
  turnstileSiteKey: string | null;
  wechatEnabled: boolean;
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [devCode, setDevCode] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [sending, setSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    if (params.get("wechat") === "need_bind") {
      setError("这个微信还没有绑定账号。请先用手机号登录，再在「我的」页面绑定。");
    }
    fetch("/api/config")
      .then((res) => res.json())
      .then((data: PublicConfig) => {
        setConfig(data);
        if (!data.smsEnabled) setError("短信服务尚未开通");
      })
      .catch(() => setError("暂时连不上登录服务"));
  }, [params]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  async function sendCode() {
    setError("");
    setInfo("");
    if (!agree) {
      setError("请先勾选同意协议");
      return;
    }
    if (config && !config.smsEnabled) {
      setError("短信服务尚未开通");
      return;
    }
    if (config?.turnstileSiteKey && !turnstileToken) {
      setError("请先完成人机验证");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "验证码发送失败");
        return;
      }
      setSeconds(60);
      setInfo("验证码已发送，5 分钟内有效。");
      if (data.devCode) setDevCode(data.devCode);
    } catch {
      setError("暂时连不上登录服务");
    } finally {
      setSending(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!agree) {
      setError("请先勾选同意协议");
      return;
    }
    const res = await fetch("/api/sms/verify", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone, code, nickname }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "登录失败");
      return;
    }
    setMe(data.user as SessionUser);
    router.push("/c/profile");
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/photographer.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[#1A1228]/35" />
      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <form onSubmit={submit} className="w-full rounded-[28px] bg-[#F7F4F1] p-6 shadow-2xl">
          <h1 className="text-center text-2xl font-bold text-[#1A1228]">登录或注册</h1>
          <p className="mt-2 text-center text-sm text-[#6D5B82]">用手机号接收验证码。新号码会自动注册。</p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-12 w-full justify-center bg-white"
            disabled={!config?.wechatEnabled}
            onClick={() => {
              window.location.href = "/api/wechat/start?purpose=login";
            }}
          >
            <MessageCircle className="text-emerald-500" />
            {config?.wechatEnabled ? "使用微信账号登录" : "微信绑定即将开通"}
          </Button>
          <p className="my-4 text-center text-xs text-[#A394B4]">或使用手机号</p>
          <div className="flex gap-2">
            <span className="inline-flex h-11 items-center rounded-full border border-[#E6DCF2] bg-white px-3 text-sm">+86</span>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="手机号码" aria-label="手机号码" inputMode="numeric" />
          </div>
          <div className="mt-2 flex gap-2">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6 位验证码" aria-label="验证码" inputMode="numeric" />
            <Button type="button" variant="outline" className="shrink-0 bg-white" disabled={sending || seconds > 0} onClick={() => void sendCode()}>
              {seconds > 0 ? `${seconds} 秒` : "获取验证码"}
            </Button>
          </div>
          <Input className="mt-2" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="怎么称呼你（选填，仅首次注册）" aria-label="称呼" />
          {config?.turnstileSiteKey && (
            <Turnstile siteKey={config.turnstileSiteKey} onToken={setTurnstileToken} />
          )}
          <label className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#6D5B82]">
            <input type="checkbox" className="mt-0.5" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              我已阅读并同意
              <Link href="/legal/terms" className="text-[#5C2B92]">《用户协议》</Link>
              和
              <Link href="/legal/privacy" className="text-[#5C2B92]">《隐私政策》</Link>
            </span>
          </label>
          {error && <p className="mt-3 text-sm text-[#9B2C3A]">{error}</p>}
          {info && <p className="mt-3 text-sm text-[#217A45]">{info}</p>}
          {devCode && <p className="mt-2 text-sm text-[#5C2B92]">本地测试验证码：{devCode}</p>}
          <Button type="submit" variant="dark" className="mt-4 h-12 w-full">
            继续
          </Button>
        </form>
      </div>
      <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/90">背景为原创插画，仅作登录页氛围。</p>
    </div>
  );
}

function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  useEffect(() => {
    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      document.head.appendChild(script);
    }
    let widgetId = "";
    const host = document.getElementById("turnstile-host");
    const timer = window.setInterval(() => {
      const turnstile = (window as unknown as { turnstile?: { render: (el: HTMLElement, opts: object) => string; remove: (id: string) => void } }).turnstile;
      if (!turnstile || !host || widgetId) return;
      window.clearInterval(timer);
      widgetId = turnstile.render(host, { sitekey: siteKey, callback: onToken });
    }, 200);
    return () => window.clearInterval(timer);
  }, [onToken, siteKey]);
  return <div id="turnstile-host" className="mt-4" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-[#6D5B82]">正在打开登录页…</div>}>
      <LoginForm />
    </Suspense>
  );
}
