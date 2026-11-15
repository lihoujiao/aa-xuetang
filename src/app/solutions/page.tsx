"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { solutions } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const kinds = ["全部类型", "产品", "服务", "解决方案"] as const;

export default function SolutionsPage() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("全部类型");
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState("");
  const list = useMemo(
    () =>
      solutions.filter((item) => {
        const kindOk = kind === "全部类型" || item.kind === kind;
        return kindOk && (!q || `${item.title}${item.summary}`.includes(q));
      }),
    [kind, q],
  );
  return (
    <MarketingShell>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-xs font-semibold text-[#7A5AA8]">挑过的供给，价格写在明处</p>
        <h1 className="mt-2 text-4xl font-black text-[#38254F]">好用的，先看价格再决定。</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6D5B82]">
          从工具到落地协助，市场参考价和会员价放在一起。演示站不跳转到外部商店。
        </p>
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <form
          className="flex gap-2 rounded-[28px] bg-white p-2 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            setQ(draft);
          }}
        >
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="搜索产品、用途或合作方" aria-label="搜索供给" className="border-0 focus:ring-0" />
          <Button type="submit">搜索 →</Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {kinds.map((item) => (
            <button key={item} type="button" onClick={() => setKind(item)} className={cn("rounded-full px-3 py-1.5 text-sm font-semibold", kind === item ? "bg-[#5C2B92] text-white" : "bg-white text-[#5E4C74]")}>
              {item}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#8A7A9C]">本页 {list.length} 项</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map((item) => (
            <Link key={item.slug} href={`/solutions/${item.slug}`} className="rounded-[28px] bg-white p-5 shadow-sm">
              <p className="text-xs text-[#8A7A9C]">{item.kind}</p>
              <h2 className="mt-1 text-lg font-bold text-[#2C2140]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6D5B82]">{item.summary}</p>
              <p className="mt-3 text-sm text-[#38254F]">市场参考 {item.market}</p>
              <p className="text-sm font-semibold text-[#5C2B92]">会员价 {item.member}</p>
            </Link>
          ))}
        </div>
        {list.length === 0 && <p className="mt-8 text-sm text-[#6D5B82]">没有匹配的供给。</p>}
      </section>
    </MarketingShell>
  );
}
