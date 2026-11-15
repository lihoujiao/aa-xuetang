import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "登录",
  description: "留下一个称呼，以便在这台浏览器里继续看课和练习。",
  path: "/login",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
