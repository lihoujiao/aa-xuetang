import type { Metadata } from "next";
import { LearnView } from "@/components/learn-view";
import { MarketingShell } from "@/components/shell";

export const metadata: Metadata = { title: "线上学习" };

export default function CoursesPage() {
  return (
    <MarketingShell>
      <LearnView />
    </MarketingShell>
  );
}
