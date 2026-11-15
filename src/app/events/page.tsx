import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { events } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "线下活动",
  description: "查看即将开始和已经结束的场次，包含时间、地点、价格和剩余席位。",
  path: "/events",
});

export default function EventsPage() {
  const upcoming = events.filter((event) => event.status !== "已结束");
  const past = events.filter((event) => event.status === "已结束");
  const counts = [
    ["全部公开", events.length],
    ["待开始", events.filter((e) => e.status === "即将开放").length],
    ["进行中", events.filter((e) => e.status === "报名中").length],
    ["已结束", past.length],
  ];
  return (
    <MarketingShell>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#7A5AA8]">EVENT CENTER · 活动</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#38254F] md:text-5xl">
            来这里，和同路的人一起学、聊、做完一件事
          </h1>
        </div>
        <Image src="/images/hero-workshop.jpg" alt="" width={800} height={450} className="rounded-[32px]" />
      </section>
      <section className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-[#E7DFF1] md:grid-cols-4">
        {counts.map(([label, n]) => (
          <div key={String(label)} className="bg-white px-4 py-5 text-center">
            <p className="text-xs text-[#8A7A9C]">{label}</p>
            <p className="mt-1 text-3xl font-black text-[#5C2B92]">{n}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-lg font-bold text-[#38254F]">正在进行与即将开始</h2>
        <div className="mt-4 space-y-4">
          {upcoming.map((event) => (
            <EventRow key={event.slug} slug={event.slug} />
          ))}
        </div>
        <h2 className="mt-10 text-lg font-bold text-[#38254F]">往期活动</h2>
        <div className="mt-4 space-y-4">
          {past.map((event) => (
            <EventRow key={event.slug} slug={event.slug} />
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

function EventRow({ slug }: { slug: string }) {
  const event = events.find((item) => item.slug === slug)!;
  return (
    <Link href={`/events/${event.slug}`} className="grid gap-4 rounded-[28px] bg-white p-4 shadow-sm md:grid-cols-[120px_1fr_160px]">
      <div>
        <p className="text-3xl font-black text-[#38254F]">{event.start.slice(0, 5)}</p>
        <p className="text-xs text-[#8A7A9C]">{event.start}</p>
      </div>
      <div>
        <p className="text-xs text-[#8A7A9C]">
          {event.start} – {event.end} · {event.status} · {event.price}
        </p>
        <p className="mt-1 text-lg font-bold text-[#2C2140]">{event.title}</p>
        <p className="mt-1 text-sm text-[#6D5B82]">{event.place}</p>
      </div>
      <div className="relative h-24 overflow-hidden rounded-2xl">
        <Image src={event.cover} alt="" fill className="object-cover" />
      </div>
    </Link>
  );
}
