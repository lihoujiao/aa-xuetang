import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "精选供给",
  description: "把市场参考价和会员价放在一起，先看用途再决定要不要办。",
  path: "/solutions",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
