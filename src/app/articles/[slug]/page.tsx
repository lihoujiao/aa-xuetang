import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/shell";
import { articles, findArticle } from "@/lib/content";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: findArticle(slug)?.title ?? "文章" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/articles" className="text-sm font-semibold text-[#5C2B92]">
          ← 文章列表
        </Link>
        <p className="mt-4 text-xs font-semibold text-[#7A5AA8]">{article.topicLabel}</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-[#38254F]">{article.title}</h1>
        <p className="mt-3 text-sm text-[#8A7A9C]">
          {article.author} · {article.date} · {article.minutes} 分钟
        </p>
        <div className="mt-6 space-y-4 text-[15px] leading-8 text-[#3C314C]">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </MarketingShell>
  );
}
