import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "我的文件",
  description: "文件夹、知识库和回收站的演示空间，不会真正上传文件。",
  path: "/c/files",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
