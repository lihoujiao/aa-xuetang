import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "技能包" };

export default function SkillsPage() {
  return (
    <ProsePage
      kicker="CLI · SKILL · MCP"
      title="让助手按现成步骤做事。"
      lede="技能包是一组检查单和调用说明。你把它交给桌面上的助手，用来运营自己的练习空间，而不是再收藏一段提示词。"
      actions={[{ href: "/developers", label: "查看接入说明" }, { href: "/login", label: "登录后试用" }]}
      sections={[
        { heading: "命令行", body: ["用来在自己的电脑上初始化和检查配置。演示站不提供可执行安装包。"] },
        { heading: "技能包", body: ["按任务拆开：纪要、抽查、接待记录。每个包都写明输入和不能做的事。"] },
        { heading: "连接器", body: ["如果要把学堂里的只读目录接到外部助手，请看开发者页的边界说明。"] },
        { heading: "可以配合的环境", body: ["常见的桌面编程助手都可以阅读同一份说明。我们不绑定其中某一个。"] },
      ]}
    />
  );
}
