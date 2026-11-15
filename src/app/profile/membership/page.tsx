import type { Metadata } from "next";
import { MarketingShell } from "@/components/shell";
import { Gate } from "@/components/gate";

export const metadata: Metadata = { title: "我的会员" };

export default function MembershipAccountPage() {
  return (
    <MarketingShell>
      <Gate title="我的会员" callback="/profile/membership">
        <h1 className="text-3xl font-black text-[#38254F]">还没有开通</h1>
        <p className="mt-2 text-sm leading-7 text-[#6D5B82]">演示账号默认不是会员。价格见会员页，这里不会生成订单。</p>
      </Gate>
    </MarketingShell>
  );
}
