import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { demands } from "@/lib/content";

export const metadata: Metadata = { title: "需求" };

export default function DemandsPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-4xl font-black text-[#38254F]">把真实问题交给做得完的人</h1>
        <p className="mt-3 text-sm leading-7 text-[#6D5B82]">
          下面是演示中的需求。发布会先进入登录，不会把内容送到外部。
        </p>
        <Link href="/login?callbackUrl=/demands" className="mt-5 inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white">
          登录后发布需求
        </Link>
        <div className="mt-8 space-y-3">
          {demands.map((item) => (
            <article key={item.title} className="rounded-3xl bg-white p-5">
              <p className="text-xs font-semibold text-[#7A5AA8]">{item.status} · {item.city}</p>
              <h2 className="mt-1 font-bold text-[#2C2140]">{item.title}</h2>
              <p className="mt-1 text-sm text-[#6D5B82]">预算 {item.budget}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-[#8A7A9C]">第一批仍在审核，列表不会自动刷新成真实委托。</p>
      </section>
    </MarketingShell>
  );
}
