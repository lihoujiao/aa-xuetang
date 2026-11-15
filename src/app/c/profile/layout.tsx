import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "我的",
  description: "查看本地称呼，并进入钱包、会员、兑换和推广面板。",
  path: "/c/profile",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
