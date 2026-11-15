import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "智能体",
  description: "按分类挑选一个助手，从纪要、接待或分镜核对开始。",
  path: "/c/agents",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
