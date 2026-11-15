import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { Gate } from "@/components/gate";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "兑换码",
  description: "课程邀请码在课表上，订阅兑换在商店页完成格式检查。",
  path: "/profile/redeem",
});

export default function ProfileRedeemPage() {
  return (
    <MarketingShell>
      <Gate title="兑换码" callback="/profile/redeem">
        <h1 className="text-3xl font-black text-[#38254F]">使用兑换码</h1>
        <p className="mt-2 text-sm text-[#6D5B82]">课程邀请码在课表卡片上，订阅兑换在商店。</p>
        <Link href="/shop/redeem" className="mt-4 inline-block text-sm font-semibold text-[#5C2B92]">
          打开订阅兑换 →
        </Link>
      </Gate>
    </MarketingShell>
  );
}
