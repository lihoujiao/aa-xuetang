import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "订阅商店",
  description: "对照参考价选择月卡，再回到兑换页绑定到自己的账号。",
  path: "/shop",
});

const plans = [
  ["轻量月卡", "¥109", "约合市场参考 ¥148", "适合每天整理材料"],
  ["进阶月卡", "¥630", "约合市场参考 ¥720", "适合高频成片和长文档"],
  ["高额月卡", "¥1,180", "约合市场参考 ¥1,360", "适合密集使用的一个人"],
];

export default function ShopPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-14">
        <p className="text-xs font-semibold text-[#7A5AA8]">订阅商店 · 演示</p>
        <h1 className="mt-3 text-4xl font-black text-[#38254F]">为自己的账号准备下一程额度。</h1>
        <p className="mt-3 text-sm leading-7 text-[#6D5B82]">
          参考站导航里的订阅入口指向外部商店。这里用虚构套餐复现同一段路径：对照价格、联系领取兑换码、再回来自助兑换。不会产生订单。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#5C2B92]">
          <a href="#plans">套餐</a>
          <a href="#steps">购买流程</a>
          <Link href="/shop/redeem">自助兑换</Link>
        </div>
        <div id="plans" className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map(([name, price, ref, text]) => (
            <article key={name} className="rounded-3xl bg-white p-5">
              <h2 className="font-bold text-[#38254F]">{name}</h2>
              <p className="mt-2 text-3xl font-black">{price}</p>
              <p className="text-xs text-[#8A7A9C]">{ref}</p>
              <p className="mt-3 text-sm text-[#6D5B82]">{text}</p>
            </article>
          ))}
        </div>
        <section id="steps" className="mt-10 space-y-3 text-sm leading-7 text-[#4C3D62]">
          <h2 className="text-xl font-bold text-[#38254F]">从选择到开通</h2>
          <p>01 对照参考价，选一个周期一致的套餐。</p>
          <p>02 在演示里记下意向。正式环境由客服确认后再付款。</p>
          <p>03 拿到兑换码后，回到兑换页绑定到自己的账号，并当天做一次小任务验证。</p>
        </section>
      </section>
    </MarketingShell>
  );
}
