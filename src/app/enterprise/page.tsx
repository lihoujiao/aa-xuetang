import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "企业落地",
  description: "先找值得做的场景，再接到真实流程里，并用结果而不是演示效果验收。",
  path: "/enterprise",
});

export default function EnterprisePage() {
  return (
    <ProsePage
      title="不是再买一套工具，而是让它进到日常流程里"
      lede="先找值得做的场景，再接上真实的数据和权限，最后用结果验收。演示站不预约外部会议。"
      actions={[{ href: "/about", label: "查看联系方式" }]}
      sections={[
        { heading: "还在找场景", body: ["想法很多时，先用一周能做完的标准筛一次。"] },
        { heading: "有样机但上不了线", body: ["权限、异常和回滚通常比演示效果更决定能不能用。"] },
        { heading: "已经接上系统", body: ["把助手放进现有的表格、审批或接待，而不是另开一个岛。"] },
        { heading: "上线后不稳定", body: ["看采用、准确和费用，并指定谁对结果负责。"] },
      ]}
    />
  );
}
