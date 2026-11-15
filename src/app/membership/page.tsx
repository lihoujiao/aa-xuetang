import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { solutions } from "@/lib/content";

export const metadata: Metadata = { title: "会员权益" };

const benefits = [
  ["会员课程", "按章节学，有效期内新课继续开放。"],
  ["推广回报", "被邀请人完成符合规则的支付后才计佣金。"],
  ["交流小组", "拿具体任务来问，不收空泛的感想。"],
  ["技能包", "现成检查单，按任务取用。"],
  ["可交付的入口", "把跑通的流程做成别人能打开的服务。"],
  ["精选会员价", "市场价和会员价写在一起。"],
];

export default function MembershipPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-4xl font-black text-[#38254F]">基础和进阶，按需要选。</h1>
        <p className="mt-3 text-sm leading-7 text-[#6D5B82]">
          基础会员是课程、答疑和技能包。进阶会员再加上佣金资格和供给优惠。两档分开计时。
        </p>
        <div className="mt-6 flex gap-3">
          <a href="#join" className="inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-bold text-white">查看开通方案</a>
          <Link href="/learn" className="inline-flex h-11 items-center rounded-full bg-white px-4 text-sm font-bold text-[#5C2B92]">先看学习内容</Link>
        </div>
      </section>
      <section id="join" className="mx-auto grid max-w-4xl gap-4 px-4 md:grid-cols-2">
        <article className="rounded-[28px] bg-[#16324F] p-6 text-white">
          <h2 className="text-xl font-bold">基础会员</h2>
          <p className="mt-2 text-4xl font-black">¥365 <span className="text-sm font-medium">/ 365 天</span></p>
          <Link href="/login?callbackUrl=/profile/membership" className="mt-4 inline-flex rounded-xl bg-[#3D6FE0] px-4 py-2 text-sm">登录后查看</Link>
        </article>
        <article className="rounded-[28px] bg-[#4A3424] p-6 text-white">
          <h2 className="text-xl font-bold">进阶会员</h2>
          <p className="mt-2 text-4xl font-black">¥998 <span className="text-sm font-medium">/ 365 天</span></p>
          <Link href="/login?callbackUrl=/profile/membership" className="mt-4 inline-flex rounded-xl bg-[#E6D2A6] px-4 py-2 text-sm text-[#3D2C1B]">登录后查看</Link>
        </article>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-12 md:grid-cols-3">
        {benefits.map(([title, text]) => (
          <article key={title} className="rounded-3xl bg-white p-5">
            <h3 className="font-bold text-[#38254F]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6D5B82]">{text}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-2xl font-black text-[#38254F]">会员价能用在这些供给上</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {solutions.map((item) => (
            <Link key={item.slug} href={`/solutions/${item.slug}`} className="rounded-3xl bg-white p-4">
              <p className="font-semibold text-[#2C2140]">{item.title}</p>
              <p className="text-sm text-[#6D5B82]">市场参考 {item.market} · 会员价 {item.member}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
