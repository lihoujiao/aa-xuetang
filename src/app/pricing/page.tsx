import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { faqs } from "@/lib/content";

export const metadata: Metadata = { title: "价格方案" };

const plans = [
  {
    name: "免费版",
    price: "¥0",
    unit: "一直可以打开",
    points: ["5 个练习用助手位", "已标明免费的课", "积分流水可查看"],
    href: "/login",
    cta: "免费开始",
  },
  {
    name: "个人会员",
    price: "¥365",
    unit: "/ 365 天",
    points: ["会员课表", "交流小组", "技能包更新"],
    href: "/membership#join",
    cta: "查看开通",
    featured: true,
  },
  {
    name: "小组版",
    price: "¥4,680",
    unit: "/ 套 · 次年维护另计",
    points: ["20 个席位", "两场线下陪跑名额", "共享练习记录"],
    href: "/enterprise",
    cta: "联系顾问",
  },
  {
    name: "组织版",
    price: "面议",
    unit: "按部署方式报价",
    points: ["可放在自己的环境", "登录与存储可替换", "品牌与域名可换"],
    href: "/enterprise",
    cta: "了解落地",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-4xl font-black text-[#38254F]">会员与平台方案</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6D5B82]">
          基础会员覆盖课程、答疑和技能包。更高一档加上商业化相关的席位和品牌设置。价格写在卡片上，演示站不收款。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] bg-gradient-to-br from-[#1E3A5F] to-[#16324F] p-6 text-white">
            <p className="text-sm text-white/70">基础会员</p>
            <p className="mt-2 text-5xl font-black">¥365 <span className="text-base font-medium">/ 365 天</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>解锁标明会员可学的课</li>
              <li>小组里提问</li>
              <li>技能包持续更新</li>
            </ul>
            <Link href="/login?callbackUrl=/membership" className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#3D6FE0] px-4 text-sm font-semibold">
              登录并查看基础会员
            </Link>
          </article>
          <article className="rounded-[28px] bg-gradient-to-br from-[#3A2A22] to-[#6A5030] p-6 text-white">
            <p className="text-sm text-white/70">进阶会员</p>
            <p className="mt-2 text-5xl font-black">¥998 <span className="text-base font-medium">/ 365 天</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>包含基础会员</li>
              <li>推广佣金资格</li>
              <li>精选供给的会员价</li>
            </ul>
            <Link href="/group-buys/demo" className="mt-6 inline-flex rounded-xl bg-[#8E2F3A] px-4 py-3 text-sm font-semibold">
              演示团购 ¥798 · 三人成团（不收款）
            </Link>
          </article>
        </div>
        <h2 className="mt-14 text-2xl font-black text-[#38254F]">随规模变化的四档</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-3xl bg-white p-5 shadow-sm">
              <h3 className="font-bold text-[#38254F]">{plan.name}</h3>
              <p className="mt-3 text-3xl font-black text-[#1A1228]">{plan.price}</p>
              <p className="text-xs text-[#8A7A9C]">{plan.unit}</p>
              <ul className="mt-4 space-y-2 text-sm text-[#4C3D62]">
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link href={plan.href} className="mt-5 inline-block text-sm font-semibold text-[#5C2B92]">
                {plan.cta} →
              </Link>
            </article>
          ))}
        </div>
        <h2 className="mt-14 text-2xl font-black text-[#38254F]">常见问题</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-2xl bg-white p-4">
              <summary className="cursor-pointer font-semibold text-[#38254F]">{item.q}</summary>
              <p className="mt-2 text-sm leading-6 text-[#6D5B82]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
