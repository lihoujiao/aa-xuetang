import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "创作",
  description: "从口播、海报或课程简介模板开始，材料只留在本页。",
  path: "/c/studio",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
