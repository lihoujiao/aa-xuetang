import type { Metadata } from "next";
import { LearnView } from "@/components/learn-view";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "学习",
  description: "工作台里的课程页，和公开课表是同一套章节。",
  path: "/c/learn",
});

export default function ConsoleLearnPage() {
  return <LearnView embedded />;
}
