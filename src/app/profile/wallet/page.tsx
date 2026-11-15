import type { Metadata } from "next";
import { MarketingShell } from "@/components/shell";
import { Gate } from "@/components/gate";

export const metadata: Metadata = { title: "我的钱包" };

export default function WalletPage() {
  return (
    <MarketingShell>
      <Gate title="我的钱包" callback="/profile/wallet">
        <h1 className="text-3xl font-black text-[#38254F]">平台积分</h1>
        <p className="mt-2 text-5xl font-black text-[#5C2B92]">120</p>
        <p className="mt-2 text-sm text-[#6D5B82]">演示余额。充值按钮不会打开支付。</p>
        <p className="mt-4 text-sm text-[#6D5B82]">参考站把钱包放在登录后。公开导航里没有单独名为「Token 代理」的页面，最接近的是积分钱包和订阅商店。</p>
      </Gate>
    </MarketingShell>
  );
}
