import Image from "next/image";
import Link from "next/link";
import { Calendar, Crown, GraduationCap } from "lucide-react";
import { MarketingShell } from "@/components/shell";
import { articles, events, solutions } from "@/lib/content";

const benefits = [
  ["会员课程", "有效期内按课表学习，新课上线后继续开放。"],
  ["推广回报", "邀请的人完成符合规则的支付后，才会计入佣金。"],
  ["交流小组", "练习卡住时，可以在小组里问具体做法。"],
  ["现成技能", "按任务取用检查单，减少每次从头写提示。"],
  ["可收费的交付", "把已经跑通的小流程做成别人能用的入口。"],
  ["供给优惠", "精选里的标价和会员价并排，方便自己比较。"],
];

export default function HomePage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-5xl px-4 pb-6 pt-12 text-center md:pt-16">
        <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#7A5AA8]">
          工作里用得上，生活里也留一点余量
        </p>
        <p className="mt-4 text-xl font-bold text-[#5C2B92]">AA 学堂</p>
        <h1 className="mx-auto mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#38254F] md:text-6xl">
          让手头的事轻一点，也更清楚一点
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6D5B82] md:text-base">
          一群人一起学、一起做。把新的做法带回自己的工作和生活，而不是只停在收藏夹里。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/membership" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-b from-[#F8E9CC] to-[#E6D2A6] px-5 text-sm font-semibold text-[#3D2C1B]">
            <Crown className="size-4" /> 先看会员方案
          </Link>
          <Link href="/courses" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#3D6FE0] px-5 text-sm font-semibold text-white">
            <GraduationCap className="size-4" /> 去看线上课表
          </Link>
          <Link href="/events" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#7C4DDB] px-5 text-sm font-semibold text-white">
            <Calendar className="size-4" /> 看线下场次
          </Link>
        </div>
      </section>
      <section className="relative mx-auto max-w-4xl px-4">
        <Image
          src="/images/hero-workshop.jpg"
          alt="学员围坐讨论"
          width={1200}
          height={675}
          priority
          className="rounded-[36px] shadow-[0_30px_70px_rgba(92,43,146,0.14)]"
        />
        <p className="absolute left-8 top-8 hidden rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#5C2B92] md:block">
          和同路的人，一起把一件事做完
        </p>
      </section>
      <section className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-px overflow-hidden rounded-[28px] bg-white shadow-sm">
        {[
          ["860", "一起练习的人"],
          ["12,400", "累计练习小时"],
          ["6", "正在开放的章节"],
        ].map(([n, label]) => (
          <div key={label} className="bg-white px-4 py-6 text-center">
            <p className="text-2xl font-black text-[#38254F] md:text-3xl">{n}</p>
            <p className="mt-1 text-xs text-[#8A7A9C] md:text-sm">{label}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-black text-[#38254F]">最近发生的事</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {events.slice(0, 2).map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="rounded-3xl bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-semibold text-[#7A5AA8]">活动 · {event.status}</p>
              <p className="mt-2 font-bold text-[#2C2140]">{event.title}</p>
              <p className="mt-2 text-sm text-[#6D5B82]">{event.start} · {event.city}</p>
            </Link>
          ))}
          <Link href={`/articles/${articles[0].slug}`} className="rounded-3xl bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-xs font-semibold text-[#7A5AA8]">文章 · {articles[0].topicLabel}</p>
            <p className="mt-2 font-bold text-[#2C2140]">{articles[0].title}</p>
            <p className="mt-2 text-sm leading-6 text-[#6D5B82]">{articles[0].excerpt}</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-black text-[#38254F]">六项可以慢慢用起来的权益</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {benefits.map(([title, text]) => (
            <article key={title} className="rounded-3xl bg-white/80 p-5">
              <h3 className="font-bold text-[#38254F]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6D5B82]">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {solutions.slice(0, 2).map((item) => (
            <Link key={item.slug} href={`/solutions/${item.slug}`} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs text-[#8A7A9C]">{item.kind}</p>
              <p className="mt-1 font-bold text-[#2C2140]">{item.title}</p>
              <p className="mt-2 text-sm text-[#6D5B82]">市场参考 {item.market} · 会员价 {item.member}</p>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
