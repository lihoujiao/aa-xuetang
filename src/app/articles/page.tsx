import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MarketingShell } from "@/components/shell";
import { ArticleBrowser } from "@/components/article-browser";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "文章",
  description: "已发布的图文教程、活动记录和学堂说明，每篇都能点进正文。",
  path: "/articles",
});

export default function ArticlesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl items-end gap-6 px-4 pb-4 pt-12 md:grid-cols-[1fr_240px]">
        <div>
          <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#7A5AA8]">
            COMMUNITY JOURNAL
          </p>
          <h1 className="mt-4 text-4xl font-black text-[#38254F]">最新文章</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6D5B82]">
            读一点新的做法，做一点小尝试。这里更新的是练习笔记和活动记录，方便你对照自己的任务。
          </p>
        </div>
        <div className="justify-self-end">
          <Link href="/courses" className="text-sm font-semibold text-[#5C2B92]">
            去课表看看 →
          </Link>
        </div>
      </section>
      <Suspense fallback={<p className="mx-auto max-w-6xl px-4 pb-16 text-sm text-[#6D5B82]">正在整理文章…</p>}>
        <ArticleBrowser />
      </Suspense>
    </MarketingShell>
  );
}
