"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { KeyRound, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/session";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params.get("callbackUrl") || "/c";
  const [mode, setMode] = useState<"wechat" | "email" | "password" | "phone">("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!agree) {
      setError("请先勾选协议。此页只在本地浏览器记住称呼，不会注册账号。");
      return;
    }
    if (mode === "phone" && phone.trim().length < 6) {
      setError("请填写一个演示用的手机号，至少 6 位。不会发送短信。");
      return;
    }
    if (mode === "phone" && code.trim().length < 4) {
      setError("请填写任意 4 位演示验证码。");
      return;
    }
    const label = name.trim() || (mode === "phone" ? `学员 ${phone.slice(-4)}` : "学员");
    signIn(label);
    router.push(callback.startsWith("/") ? callback : "/c");
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/photographer.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[#1A1228]/35" />
      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <form onSubmit={submit} className="w-full rounded-[28px] bg-[#F7F4F1] p-6 shadow-2xl">
          <h1 className="text-center text-2xl font-bold text-[#1A1228]">登录或注册</h1>
          <p className="mt-2 text-center text-sm text-[#6D5B82]">先给自己起个称呼，方便在这台浏览器里继续练习。</p>
          <div className="mt-5 space-y-2">
            <Button type="button" variant="outline" className="h-12 w-full justify-center bg-white" onClick={() => setMode("wechat")}>
              <MessageCircle className="text-emerald-500" /> 使用微信账户继续（演示）
            </Button>
            <Button type="button" variant="outline" className="h-12 w-full justify-center bg-white" onClick={() => setMode("email")}>
              <Mail /> 使用电子邮件继续
            </Button>
            <Button type="button" variant="outline" className="h-12 w-full justify-center bg-white" onClick={() => setMode("password")}>
              <KeyRound /> 使用账号密码继续
            </Button>
          </div>
          <p className="my-4 text-center text-xs text-[#A394B4]">或</p>
          <div className="flex gap-2">
            <span className="inline-flex h-11 items-center rounded-full border border-[#E6DCF2] bg-white px-3 text-sm">+86</span>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="手机号码" aria-label="手机号码" onFocus={() => setMode("phone")} />
          </div>
          <div className="mt-2 flex gap-2">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="验证码" aria-label="验证码" />
            <Button type="button" variant="outline" className="shrink-0 bg-white" onClick={() => setSent(true)}>
              {sent ? "已填入演示码" : "获取验证码"}
            </Button>
          </div>
          <Input className="mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="怎么称呼你（可选）" aria-label="称呼" />
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
          {mode !== "phone" && (
            <p className="mt-3 text-xs leading-5 text-[#6D5B82]">
              微信、邮箱和密码在演示站里走同一条本地登录，不会连接第三方。
            </p>
          )}
          <Button type="submit" variant="dark" className="mt-4 h-12 w-full">
            继续
          </Button>
          <p className="mt-4 text-center text-[11px] text-white/0">.</p>
        </form>
      </div>
      <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/90">
        背景为原创插画，仅作登录页氛围。
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-[#6D5B82]">正在打开登录页…</div>}>
      <LoginForm />
    </Suspense>
  );
}
