"use client";

import Link from "next/link";
import { useUser, signOut } from "@/lib/session";

export function Gate({
  title,
  children,
  callback,
}: {
  title: string;
  children: React.ReactNode;
  callback: string;
}) {
  const user = useUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-3xl font-black text-[#38254F]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#6D5B82]">这一页在参考站需要登录。演示站同样先请你在本地留下称呼。</p>
        <Link href={`/login?callbackUrl=${encodeURIComponent(callback)}`} className="mt-5 inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white">
          去登录
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-[#6D5B82]">当前称呼：{user}</p>
      <button type="button" onClick={signOut} className="text-sm font-semibold text-[#5C2B92]">
        退出本地登录
      </button>
      <div className="mt-4">{children}</div>
    </div>
  );
}
