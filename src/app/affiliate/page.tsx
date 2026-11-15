import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "推广计划",
  description: "只有被邀请的人完成符合规则的支付，才会记入佣金。",
  path: "/affiliate",
});

export default function AffiliatePage() {
  return (
    <ProsePage
      title="把你觉得有用的部分分享出去"
      lede="参考站的推广面板需要登录。这里先说明规则。佣金只出现在符合条件的现金支付之后。"
      actions={[{ href: "/login?callbackUrl=/profile/affiliate", label: "登录后查看面板" }]}
      sections={[
        { heading: "怎样计算", body: ["浏览和注册不计佣金。活动报名、会员或积分充值里符合规则的支付才会计入。"] },
        { heading: "你会看到什么", body: ["登录后的面板包含邀请链接、记录和结算状态。演示数据不会打款。"] },
      ]}
    />
  );
}
