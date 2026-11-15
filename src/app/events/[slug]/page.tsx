import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/shell";
import { EventSignup } from "@/components/event-signup";
import { events, findEvent } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = findEvent(slug);
  return pageMeta({
    title: event?.title ?? "活动",
    description: event
      ? `${event.start}，${event.place}，${event.price}。`
      : "一场可以报名查看的线下活动。",
    path: `/events/${slug}`,
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = findEvent(slug);
  if (!event) notFound();
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/events" className="text-sm font-semibold text-[#5C2B92]">
          ← 活动列表
        </Link>
        <p className="mt-4 text-xs font-semibold text-[#7A5AA8]">{event.status}</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-[#38254F]">{event.title}</h1>
        <p className="mt-3 text-sm text-[#6D5B82]">
          {event.start} – {event.end} · {event.place} · {event.price}
        </p>
        <p className="mt-2 text-sm text-[#6D5B82]">
          剩余 {event.seatsLeft} / {event.seatsTotal} 席
        </p>
        <EventSignup status={event.status} title={event.title} />
        <section id="event-about" className="mt-8 space-y-3 text-sm leading-7 text-[#3C314C]">
          <h2 className="text-xl font-bold text-[#38254F]">活动介绍</h2>
          <p>带着一个已经说得清的任务来。现场只推进这一件，离开时要能打开结果或写下下一步。</p>
        </section>
        <section id="event-participation" className="mt-6 space-y-3 text-sm leading-7 text-[#3C314C]">
          <h2 className="text-xl font-bold text-[#38254F]">如何参加</h2>
          <p>先看适合人群：能独立使用电脑，并愿意在现场改自己的材料。不需要提前写代码。</p>
        </section>
        <section id="event-policy" className="mt-6 space-y-3 text-sm leading-7 text-[#3C314C]">
          <h2 className="text-xl font-bold text-[#38254F]">取消与退款</h2>
          <p>开场 48 小时前可以改期。更晚的取消按当时页面说明处理。演示站不会收款。</p>
        </section>
      </article>
    </MarketingShell>
  );
}
