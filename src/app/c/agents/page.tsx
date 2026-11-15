"use client";

import { useMemo, useState } from "react";
import { agents } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const categories = ["全部", ...new Set(agents.map((item) => item.category))];
  const [category, setCategory] = useState("全部");
  const [q, setQ] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const list = useMemo(
    () => agents.filter((item) => (category === "全部" || item.category === category) && (!q || item.name.includes(q) || item.blurb.includes(q))),
    [category, q],
  );
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-[#38254F]">智能体广场</h1>
          <p className="mt-1 text-sm text-[#6D5B82]">挑一个开始对话。可以按分类筛选。</p>
        </div>
        <Button type="button" onClick={() => setCreated("新的练习助手已放在列表末尾（仅本页）。")}>新建智能体</Button>
      </div>
      <Input className="mt-4 max-w-md" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索名称或用途" aria-label="搜索智能体" />
      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={cn("rounded-full px-3 py-1 text-sm", category === item ? "bg-[#5C2B92] text-white" : "bg-white text-[#5E4C74]")}>
            {item}
          </button>
        ))}
      </div>
      {created && <p className="mt-3 text-sm text-[#5C2B92]">{created}</p>}
      {list.length === 0 ? (
        <p className="mt-8 text-sm text-[#6D5B82]">没有匹配的智能体。</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <article key={item.name} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs text-[#8A7A9C]">{item.category}</p>
              <h2 className="mt-1 font-bold text-[#2C2140]">{item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6D5B82]">{item.blurb}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
