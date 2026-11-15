import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "对话",
  description: "从一句具体的任务开始。演示回复只留在这台浏览器里。",
  path: "/c",
});

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
