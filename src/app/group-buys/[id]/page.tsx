import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "团购演示",
  description: "三人成团的标价说明。这里不创建订单，也不开始扣款。",
  path: "/group-buys/demo",
});

export function generateStaticParams() {
  return [{ id: "demo" }];
}

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MarketingShell>
      <section className="mx-auto max-w-xl px-4 py-14">
        <p className="text-xs text-[#8A7A9C]">编号 {id}</p>
        <h1 className="mt-2 text-3xl font-black text-[#38254F]">三人成团的进阶会员</h1>
        <p className="mt-3 text-sm leading-7 text-[#6D5B82]">
          标价 ¥798，用来演示参考站上的限时团购卡片。这里不创建订单，也不开始倒计时扣款。
        </p>
        <Link href="/membership#join" className="mt-6 inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white">
          返回会员方案
        </Link>
      </section>
    </MarketingShell>
  );
}
