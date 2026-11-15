import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "开发者",
  description: "把模型、自有接口或已有流程接到同一个对话入口时要守住的边界。",
  path: "/developers",
});

export default function DevelopersPage() {
  return (
    <ProsePage
      kicker="接入说明"
      title="选一种后端，接到同一个对话入口。"
      lede="这一页是公开说明的缩写。密钥只应在登录后的配置里填写，不要出现在链接或提示词中。"
      sections={[
        { heading: "直接接模型", body: ["填写地址、模型名和密钥。适合没有自己服务器的时候。"] },
        { heading: "接自己的接口", body: ["按请求和响应约定返回文本。你可以在里面查自己的数据。"] },
        { heading: "接已有流程", body: ["如果流程已经能用地址触发，就把那条地址登记进来。"] },
        { heading: "权限", body: ["读取、写入和执行是分开的。演示站不会签发真实令牌。"] },
      ]}
    />
  );
}
