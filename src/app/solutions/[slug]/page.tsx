import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/shell";
import { findSolution, solutions } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return solutions.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = findSolution(slug);
  return pageMeta({
    title: item?.title ?? "供给",
    description: item?.summary ?? "一项可以对照价格查看的供给。",
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findSolution(slug);
  if (!item) notFound();
  const blocks = [
    ["适合谁", item.forWho],
    ["解决什么", item.solves],
    ["包含什么", item.includes],
    ["怎样交付", item.delivery],
  ];
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/solutions" className="text-sm font-semibold text-[#5C2B92]">← 全部供给</Link>
        <p className="mt-4 text-xs text-[#8A7A9C]">{item.kind} · {item.unit}</p>
        <h1 className="mt-2 text-3xl font-black text-[#38254F]">{item.title}</h1>
        <p className="mt-3 text-sm leading-7 text-[#6D5B82]">{item.summary}</p>
        <p id="member-offers" className="mt-4 rounded-2xl bg-white p-4 text-sm">
          市场参考 {item.market} · 会员价 {item.member}
        </p>
        {blocks.map(([title, lines]) => (
          <section key={String(title)} className="mt-6">
            <h2 className="text-lg font-bold text-[#38254F]">{title}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[#4C3D62]">
              {(lines as string[]).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
        <Link href="/shop/redeem" className="mt-6 inline-block text-sm font-semibold text-[#5C2B92]">
          查看兑换说明 →
        </Link>
      </article>
    </MarketingShell>
  );
}
