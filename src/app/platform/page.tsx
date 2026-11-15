import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "工作台" };

export default function PlatformPage() {
  return (
    <ProsePage
      title="一套可以换上自己名字的练习工作台"
      lede="对话、创作、文件和学习放在同一条侧栏里。人看的上下文和助手用的材料尽量在一处。"
      actions={[{ href: "/c", label: "打开工作台" }, { href: "/developers", label: "看接入方式" }]}
      sections={[
        { heading: "四种后端，一个入口", body: ["可以直接接模型，也可以接你自己的接口、可视化流程或已有的助手网关。演示站只展示入口，不转发真实请求。"] },
        { heading: "从选题到成片", body: ["创作页用模板把步骤留在画布上，方便第二天接着改。"] },
        { heading: "计费和席位", body: ["积分、会员天数和席位分开记。组织如果要换品牌和存储，看企业页。"] },
      ]}
    />
  );
}
