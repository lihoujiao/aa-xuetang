"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { articles } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const topics = [
  { id: "all", label: "全部文章" },
  { id: "tutorial", label: "图文教程" },
  { id: "event", label: "活动介绍" },
  { id: "about", label: "关于我们" },
];

export function ArticleBrowser({
  initialTopic,
  initialQuery,
}: {
  initialTopic?: string;
  initialQuery?: string;
}) {
  const initial = topics.some((item) => item.id === initialTopic) ? initialTopic! : "all";
  const [topic, setTopic] = useState(initial);
  const [query, setQuery] = useState(initialQuery ?? "");
  const [draft, setDraft] = useState(initialQuery ?? "");

  const list = useMemo(() => {
    return articles.filter((article) => {
      const topicOk = topic === "all" || article.topic === topic;
      const q = query.trim();
      const text = `${article.title} ${article.excerpt} ${article.tags.join(" ")}`;
      return topicOk && (!q || text.includes(q));
    });
  }, [topic, query]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <form
        className="flex gap-2 rounded-[28px] bg-white p-2 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(draft);
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="按标题、摘要或关键词搜索"
          aria-label="搜索文章"
          className="border-0 shadow-none focus:ring-0"
        />
        <Button type="submit">搜索 →</Button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {topics.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTopic(item.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-semibold",
              topic === item.id ? "bg-[#5C2B92] text-white" : "bg-white text-[#5E4C74]",
            )}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#8A7A9C]">共 {list.length} 篇</span>
      </div>
      {list.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-white p-8 text-sm text-[#6D5B82]">没有匹配的文章。换个词，或切回全部。</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {list.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="rounded-[28px] bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
              <p className="text-xs font-semibold text-[#7A5AA8]">{article.topicLabel}</p>
              <h2 className="mt-2 text-lg font-bold leading-snug text-[#2C2140]">{article.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6D5B82]">{article.excerpt}</p>
              <p className="mt-3 text-xs text-[#8A7A9C]">
                {article.date} · {article.minutes} 分钟 · {article.views}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
