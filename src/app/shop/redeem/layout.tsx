import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "自助兑换",
  description: "检查兑换码的格式。演示环境不会把码发到服务器。",
  path: "/shop/redeem",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
