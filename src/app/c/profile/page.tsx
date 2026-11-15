"use client";

import Link from "next/link";
import { signOut, useUser } from "@/lib/session";

const links = [
  ["/profile/wallet", "我的钱包"],
  ["/profile/membership", "我的会员"],
  ["/profile/redeem", "兑换码"],
  ["/profile/affiliate", "推广面板"],
  ["/courses", "回到课表"],
];

export default function ProfilePage() {
  const user = useUser();
  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <div className="grid size-16 place-items-center rounded-full bg-[#5C2B92] text-xl font-black text-white">
        {(user || "客").slice(0, 1)}
      </div>
      <h1 className="mt-4 text-3xl font-black text-[#38254F]">{user || "还没有登录"}</h1>
      <p className="mt-2 text-sm text-[#6D5B82]">{user ? "本地称呼，只存在这台浏览器。" : "登录后可以在钱包和会员页看到演示数据。"}</p>
      {user ? (
        <button type="button" onClick={signOut} className="mt-3 text-sm font-semibold text-[#5C2B92]">退出</button>
      ) : (
        <Link href="/login?callbackUrl=/c/profile" className="mt-4 inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white">去登录</Link>
      )}
      <ul className="mt-6 space-y-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="block rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#2C2140]">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
