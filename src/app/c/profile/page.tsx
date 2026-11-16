"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logout, refreshMe, useMe } from "@/lib/session";

type PublicConfig = { wechatEnabled: boolean };

export default function ProfilePage() {
  const user = useMe();
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data: PublicConfig) => setConfig(data))
      .catch(() => setConfig({ wechatEnabled: false }));
  }, []);

  if (user === undefined) {
    return <p className="px-6 py-10 text-sm text-[#6D5B82]">正在确认登录状态…</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-6 py-12">
        <h1 className="text-3xl font-black text-[#38254F]">我的</h1>
        <p className="mt-3 text-sm leading-6 text-[#6D5B82]">登录后可以查看打码手机号、称呼，并绑定微信。</p>
        <Link href="/login" className="mt-5 inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white">
          去登录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="text-3xl font-black text-[#38254F]">我的</h1>
      <dl className="mt-6 space-y-3 rounded-[28px] bg-white p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#8A7A9C]">称呼</dt>
          <dd className="font-semibold text-[#2C2140]">{user.nickname}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#8A7A9C]">手机号</dt>
          <dd className="font-semibold text-[#2C2140]">{user.phoneMasked}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#8A7A9C]">微信</dt>
          <dd className="font-semibold text-[#2C2140]">{user.wechatBound ? "已绑定" : "未绑定"}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        {user.wechatBound ? (
          <button
            type="button"
            className="h-11 rounded-full bg-white px-4 text-sm font-semibold text-[#5C2B92]"
            onClick={() => {
              void (async () => {
                const res = await fetch("/api/wechat/unbind", { method: "POST", credentials: "include" });
                const data = await res.json();
                setMessage(res.ok ? "已解除微信绑定" : data.message || "解绑失败");
                await refreshMe();
              })();
            }}
          >
            解绑微信
          </button>
        ) : (
          <button
            type="button"
            disabled={!config?.wechatEnabled}
            className="h-11 rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#C4B6D6]"
            onClick={() => {
              window.location.href = "/api/wechat/start?purpose=bind";
            }}
          >
            {config?.wechatEnabled ? "绑定微信" : "微信绑定即将开通"}
          </button>
        )}
        <button type="button" className="h-11 rounded-full bg-white px-4 text-sm font-semibold text-[#5C2B92]" onClick={() => void logout()}>
          退出登录
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-[#5C2B92]">{message}</p>}
    </div>
  );
}
