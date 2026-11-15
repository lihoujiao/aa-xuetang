import type { Metadata } from "next";
import { LearnView } from "@/components/learn-view";

export const metadata: Metadata = { title: "学习" };

export default function ConsoleLearnPage() {
  return <LearnView embedded />;
}
