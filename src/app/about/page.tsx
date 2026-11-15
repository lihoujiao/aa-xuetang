import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { brand } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "关于我们",
  description: "AA 学堂把课表、文章和线下场次收在一起，方便从一件具体任务练起。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage
      title="在练习里认识彼此。"
      lede="AA 学堂是一个用来把方法走通的地方。课表、文章和线下场次都围绕同一件事：你手头已经存在的任务。"
      actions={[
        { href: "/learn", label: "查看学习内容" },
        { href: "/platform", label: "了解工作台" },
      ]}
      sections={[
        {
          heading: "从具体任务开始",
          body: [
            "我们不把规划中的课说成已经能学。页面上能点开的，才是当前内容。",
            "讲师介绍只写公开的方向，不代替你做职业决定。",
          ],
        },
        {
          heading: "联系",
          body: [
            `演示邮箱 ${brand.email}。这里不会发送真实邮件。`,
            "组织落地请看企业页，协议在页脚。",
          ],
        },
      ]}
    />
  );
}
