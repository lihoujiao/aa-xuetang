import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { chapters, kindLabel } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { formatClock } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "学习路径",
  description: "先看清要解决的事，再从已开放的课、文章和活动里选下一步。",
  path: "/learn",
});

const steps = [
  ["01", "先看清能做什么", "从一节认识课开始，选一个希望交给工具的具体问题。", "/courses"],
  ["02", "围着任务练工具", "读实操文章，把表格、材料和检查点连起来。", "/articles?topic=tutorial"],
  ["03", "带着问题去现场", "看已公布的场次，选一个和自己任务有关的下午或周末。", "/workshops"],
];

export default function LearnPathPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-4xl px-4 py-14">
        <p className="text-xs text-[#8A7A9C]">AA 学堂 / 学习路径</p>
        <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-[#7A5AA8]">LEARN · PRACTICE · APPLY</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#38254F] md:text-5xl">
          先选目标，再动手检验。
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6D5B82]">
          想清楚要解决的那件事，再认识工具、做一次练习，用一个真实任务看结果。可以从已开放的课、实操文章和活动里选下一步。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/courses" className="inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-bold text-white">
            查看已开放课程 →
          </Link>
          <Link href="/membership" className="inline-flex h-11 items-center rounded-full bg-[#F3E8FF] px-4 text-sm font-bold text-[#5C2B92]">
            了解会员权益
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-4 md:grid-cols-3">
        {steps.map(([n, title, text, href]) => (
          <article key={n} className="rounded-[28px] bg-white/80 p-5">
            <p className="text-sm font-bold text-[#C4B0DE]">{n}</p>
            <h2 className="mt-2 text-lg font-bold text-[#38254F]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#6D5B82]">{text}</p>
            <Link href={href} className="mt-4 inline-block text-sm font-semibold text-[#5C2B92]">
              继续 →
            </Link>
          </article>
        ))}
      </section>
      <section id="published-courses" className="mx-auto max-w-3xl px-4 py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black text-[#38254F]">目前开放的课</h2>
          <Link href="/courses#course-learning-path" className="text-sm text-[#5C2B92]">
            进入课程地图 →
          </Link>
        </div>
        <div className="mt-6 space-y-6">
          {chapters.map((chapter) => (
            <article key={chapter.slug}>
              <h3 className="font-bold text-[#38254F]">{chapter.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#6D5B82]">{chapter.summary}</p>
              <ul className="mt-3 space-y-2">
                {chapter.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link href={`/courses/${lesson.slug}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm hover:text-[#5C2B92]">
                      <span>{lesson.title}</span>
                      <span className="shrink-0 text-xs text-[#8A7A9C]">
                        {kindLabel[lesson.kind]}
                        {lesson.seconds > 0 ? ` · ${formatClock(lesson.seconds)}` : ""}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
