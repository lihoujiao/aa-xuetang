import type { Metadata } from "next";
import { MarketingShell } from "@/components/shell";
import { Gate } from "@/components/gate";

export const metadata: Metadata = { title: "推广面板" };

export default function ProfileAffiliatePage() {
  return (
    <MarketingShell>
      <Gate title="推广面板" callback="/profile/affiliate">
        <h1 className="text-3xl font-black text-[#38254F]">邀请记录</h1>
        <p className="mt-2 text-sm leading-7 text-[#6D5B82]">演示链接：/r/demo-local。还没有符合规则的支付，佣金为 0。</p>
      </Gate>
    </MarketingShell>
  );
}
