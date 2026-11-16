"use client";

import Link from "next/link";
import { logout, useMe } from "@/lib/session";

export function Gate({
  title,
  children,
  callback,
}: {
  title: string;
  children: React.ReactNode;
  callback: string;
}) {
  const user = useMe();
  if (user === undefined) {
    return <p className="px-4 py-16 text-sm text-[#6D5B82]">正在确认登录状态…</p>;
  }
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-3xl font-black text-[#38254F]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#6D5B82]">登录后才能查看这一页。</p>
        <Link href={`/login?callbackUrl=${encodeURIComponent(callback)}`} className="mt-5 inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white">
          去登录
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-[#6D5B82]">当前称呼：{user.nickname}</p>
      <button type="button" onClick={() => void logout()} className="text-sm font-semibold text-[#5C2B92]">
        退出登录
      </button>
      <div className="mt-4">{children}</div>
    </div>
  );
}
