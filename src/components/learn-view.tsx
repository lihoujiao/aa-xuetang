"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Code2,
  Gift,
  LayoutGrid,
  List,
  Lock,
  PenLine,
  Play,
  Sparkles,
  Table2,
  Users,
} from "lucide-react";
import { chapters, kindLabel, leaderboard, type Lesson } from "@/lib/content";
import { formatClock } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const tracks = [
  { icon: PenLine, title: "内容与表达", text: "把零散想法收成可发布的作品" },
  { icon: Table2, title: "事务与协作", text: "让重复的整理自己跑完" },
  { icon: Code2, title: "原型与尝试", text: "做出一个能点开的小样" },
];

function People({ names }: { names: string[] }) {
  if (!names.length) return null;
  const palette = ["#7C5CBF", "#E28B73", "#5AA7C8", "#D4A24C", "#7DAB6A", "#C46B93"];
  return (
    <span className="flex -space-x-1.5">
      {names.slice(0, 4).map((name, i) => (
        <span
          key={name + i}
          className="grid size-5 place-items-center rounded-full border border-white text-[10px] font-bold text-white"
          style={{ background: palette[i % palette.length] }}
        >
          {name.slice(0, 1)}
        </span>
      ))}
    </span>
  );
}

function LessonRow({ lesson, href }: { lesson: Lesson; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-3 py-2.5 shadow-[0_8px_24px_rgba(92,43,146,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(92,43,146,0.1)]"
    >
      <span className="relative grid h-12 w-[72px] shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#2A2142] to-[#6D4CA8] text-[10px] font-semibold text-white">
        {lesson.seconds > 0 ? formatClock(lesson.seconds) : kindLabel[lesson.kind]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[11px] text-[#8A7A9C]">
          <span className="font-semibold text-[#5C2B92]">{lesson.index}</span>
          <span>{kindLabel[lesson.kind]}</span>
        </span>
        <span className="mt-0.5 block truncate text-[15px] font-semibold text-[#2C2140] group-hover:text-[#5C2B92]">
          {lesson.title}
        </span>
        <span className="mt-1 flex items-center gap-2 text-xs text-[#8A7A9C]">
          <People names={lesson.people} />
          {lesson.checkins > 0 && <span>{lesson.checkins} 人打卡</span>}
        </span>
      </span>
      <span className="hidden shrink-0 items-center gap-2 sm:flex">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            lesson.credits === 0
              ? "bg-[#F3E8FF] text-[#5C2B92]"
              : "bg-[#F6F1E6] text-[#7A5A28]",
          )}
        >
          {lesson.credits === 0 ? "免费" : `${lesson.credits.toLocaleString()} 积分`}
        </span>
        <span className="grid size-9 place-items-center rounded-full bg-[#F3E8FF] text-[#5C2B92] group-hover:bg-[#5C2B92] group-hover:text-white">
          {lesson.locked ? <Lock className="size-4" /> : <Play className="size-4" />}
        </span>
      </span>
    </Link>
  );
}

function Featured({
  lesson,
  href,
  onInvite,
}: {
  lesson: Lesson;
  href: string;
  onInvite: () => void;
}) {
  return (
    <div className="grid items-center gap-4 rounded-[28px] border border-[#DDD0F3] bg-white p-4 shadow-[0_16px_40px_rgba(92,43,146,0.06)] md:grid-cols-[1fr_180px] md:p-5">
      <span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[11px] font-semibold text-[#5C2B92]">
          <Sparkles className="size-3" />
          {kindLabel[lesson.kind]}
        </span>
        <Link href={href} className="mt-2 block text-lg font-bold text-[#2C2140] hover:text-[#5C2B92]">
          {lesson.title}
        </Link>
        <span className="mt-1 block text-sm leading-6 text-[#6D5B82]">{lesson.summary}</span>
        <span className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#7A5A28]">
            {lesson.credits.toLocaleString()} 积分
          </span>
          <span className="rounded-full bg-[#F6F1E6] px-2 py-0.5 text-xs text-[#7A5A28]">未解锁</span>
          <button
            type="button"
            onClick={onInvite}
            className="inline-flex items-center gap-1 rounded-full bg-[#5C2B92] px-2.5 py-1 text-xs font-semibold text-white"
          >
            <Gift className="size-3" /> 邀请码兑换
          </button>
        </span>
      </span>
      <Link href={href} className="relative hidden h-32 overflow-hidden rounded-2xl md:block">
        <Image src="/images/desk-learner.jpg" alt="" fill className="object-cover" />
      </Link>
    </div>
  );
}

export function LearnView({ embedded = false }: { embedded?: boolean }) {
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [inviteFor, setInviteFor] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className={cn("relative", embedded && "min-h-full")}>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-4 pt-8 md:grid-cols-[minmax(0,540px)_1fr] md:px-6 md:pb-2 md:pt-14">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#E4D7F5] bg-white/80 px-3 py-1 text-xs font-semibold text-[#5C2B92]">
            <BookOpen className="size-3.5" />
            AA 学堂 · 一起练
          </p>
          <h1 className="mt-5 text-[34px] font-black leading-[1.15] tracking-tight text-[#38254F] sm:text-[44px] lg:text-[52px]">
            <span className="block whitespace-nowrap">先把眼前的事练会，</span>
            <span className="block whitespace-nowrap">再把念头收成作品。</span>
          </h1>
          <p className="mt-5 max-w-[420px] text-[15px] leading-7 text-[#6D5B82]">
            刚接触这些工具，或已经在工作里用过，都可以从手头的一件具体任务开始。跟着课走一遍，再把做法带回自己的学习和工作。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login?callbackUrl=/courses">
                登录开始学习 <span aria-hidden>→</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#course-learning-path">
                查看课程路线 <ArrowDown className="size-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-full bg-[#E7D8F8]/70 blur-2xl" />
          <Image
            src="/images/hero-workshop.jpg"
            alt="几位学员围坐讨论，墙上是一张简单的流程示意"
            width={960}
            height={540}
            priority
            className="w-full rounded-[32px] object-cover shadow-[0_30px_60px_rgba(92,43,146,0.12)]"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl grid-cols-3 gap-2 px-4 pb-8 pt-6 md:gap-8 md:px-6">
        {tracks.map((track) => (
          <div key={track.title} className="text-center">
            <track.icon className="mx-auto size-5 text-[#7A5AA8]" />
            <p className="mt-2 text-sm font-bold text-[#38254F] md:text-base">{track.title}</p>
            <p className="mt-1 text-[11px] leading-5 text-[#8A7A9C] md:text-xs">{track.text}</p>
          </div>
        ))}
      </section>

      <section id="course-learning-path" className="relative scroll-mt-20 py-8 md:py-14">
        <Image
          src="/images/photographer.jpg"
          alt=""
          width={420}
          height={280}
          className="pointer-events-none absolute left-0 top-6 hidden w-52 rounded-3xl opacity-95 xl:block"
        />
        <Image
          src="/images/desk-learner.jpg"
          alt=""
          width={360}
          height={240}
          className="pointer-events-none absolute bottom-24 right-0 hidden w-48 rounded-3xl xl:block"
        />
        <div className="relative mx-auto max-w-3xl px-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A5AA8]">
                <BookOpen className="size-3.5" /> 从一节课出发
              </p>
              <h2 className="mt-2 text-[28px] font-black tracking-tight text-[#38254F] md:text-[36px]">
                按自己的节奏，从认识走到动手
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#6D5B82]">
                沿着章节往下看。在课里理解做法，在练习和活动里把做法用起来。
              </p>
            </div>
            <div className="inline-flex shrink-0 rounded-full border border-white/70 bg-white/70 p-1 shadow-sm">
              <button
                type="button"
                aria-pressed={layout === "list"}
                onClick={() => setLayout("list")}
                className={cn(
                  "inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold",
                  layout === "list" ? "bg-[#ECE3F8] text-[#5C2B92]" : "text-[#7A6B90]",
                )}
              >
                <List className="size-4" /> 列表
              </button>
              <button
                type="button"
                aria-pressed={layout === "grid"}
                onClick={() => setLayout("grid")}
                className={cn(
                  "inline-flex h-10 items-center gap-1 rounded-full px-3 text-sm font-semibold",
                  layout === "grid" ? "bg-[#ECE3F8] text-[#5C2B92]" : "text-[#7A6B90]",
                )}
              >
                <LayoutGrid className="size-4" /> 平铺
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-10">
            {chapters.map((chapter, chapterIndex) => (
              <article key={chapter.slug} id={chapter.slug}>
                <header className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-[#5C2B92] text-sm font-black text-white">
                    {chapterIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[#2C2140]">{chapter.title}</h3>
                      <span className="rounded-full bg-[#F3E8FF] px-2 py-0.5 text-[11px] font-semibold text-[#5C2B92]">
                        {chapter.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[#6D5B82]">{chapter.summary}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#8A7A9C]">
                    0/{chapter.lessons.length}
                  </span>
                </header>

                <div
                  className={cn(
                    "mt-4",
                    layout === "grid" ? "grid gap-3 sm:grid-cols-2" : "space-y-2.5",
                  )}
                >
                  {chapter.lessons.map((lesson) =>
                    lesson.kind === "interactive" && layout === "list" ? (
                      <Featured
                        key={lesson.slug}
                        lesson={lesson}
                        href={`/courses/${lesson.slug}`}
                        onInvite={() => {
                          setInviteFor(lesson.title);
                          setMessage("");
                          setCode("");
                        }}
                      />
                    ) : (
                      <LessonRow
                        key={lesson.slug}
                        lesson={lesson}
                        href={`/courses/${lesson.slug}`}
                      />
                    ),
                  )}
                </div>

                {chapter.event && (
                  <div className="mt-4">
                    <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-[#7A5AA8]">
                      <Users className="size-3.5" /> 章节活动
                    </p>
                    <Link
                      href={`/events/${chapter.event.slug}`}
                      className="grid gap-3 rounded-[24px] bg-white p-4 shadow-[0_12px_32px_rgba(92,43,146,0.06)] transition hover:-translate-y-0.5 md:grid-cols-[1fr_180px]"
                    >
                      <span>
                        <span className="text-xs text-[#8A7A9C]">
                          {chapter.event.start} – {chapter.event.end}
                          <span className="ml-2 rounded-full bg-[#EAF7EE] px-2 py-0.5 font-semibold text-[#217A45]">
                            {chapter.event.status}
                          </span>
                          <span className="ml-2 font-semibold text-[#38254F]">{chapter.event.price}</span>
                        </span>
                        <span className="mt-2 block text-lg font-bold leading-snug text-[#2C2140]">
                          {chapter.event.title}
                        </span>
                        <span className="mt-1 block text-sm text-[#6D5B82]">{chapter.event.place}</span>
                        <span className="mt-3 block text-xs text-[#8A7A9C]">
                          剩余 {chapter.event.seatsLeft}/{chapter.event.seatsTotal} 席
                        </span>
                        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#F0E8F8]">
                          <span
                            className="block h-full rounded-full bg-[#5C2B92]"
                            style={{
                              width: `${Math.round(
                                ((chapter.event.seatsTotal - chapter.event.seatsLeft) /
                                  chapter.event.seatsTotal) *
                                  100,
                              )}%`,
                            }}
                          />
                        </span>
                      </span>
                      <span className="relative hidden h-28 overflow-hidden rounded-2xl md:block">
                        <Image src={chapter.event.cover} alt="" fill className="object-cover" />
                      </span>
                    </Link>
                    <p className="mt-2 text-xs text-[#A394B4]">本章还会继续补充 · 新的练习会标在这里</p>
                  </div>
                )}

                {chapter.instructor && (
                  <Link
                    href={`/instructors/${chapter.instructor.slug}`}
                    className="mt-4 flex items-center gap-3 rounded-2xl px-1 py-2 hover:bg-white/60"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-[#5C2B92] text-sm font-bold text-white">
                      {chapter.instructor.name.slice(0, 1)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-[#2C2140]">
                        {chapter.instructor.name}
                      </span>
                      <span className="block text-xs text-[#8A7A9C]">{chapter.instructor.role}</span>
                    </span>
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[28px] bg-white p-4 shadow-sm">
            <p className="px-2 pb-2 text-sm font-semibold text-[#38254F]">练习打卡</p>
            <ol className="divide-y divide-[#F1EAF8]">
              {leaderboard.map((row, index) => (
                <li key={row.name} className="flex items-center gap-3 px-2 py-3 text-sm">
                  <span className="w-8 text-[#8A7A9C]">#{index + 1}</span>
                  <span className="grid size-8 place-items-center rounded-full bg-[#5C2B92] text-xs font-bold text-white">
                    {row.name.slice(0, 1)}
                  </span>
                  <span className="flex-1 font-medium text-[#2C2140]">{row.name}</span>
                  <span className="text-[#8A7A9C]">{row.score}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-[1fr_280px] md:px-6 md:py-16">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A5AA8]">
            <BookOpen className="size-3.5" /> 把练习带回日常
          </p>
          <h2 className="mt-2 text-[32px] font-black tracking-tight text-[#38254F] md:text-[40px]">
            今天，先上完一节。
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-[#6D5B82]">
            挑一个和手头工作有关的主题，花一点时间学和练，把一个新做法用起来。
          </p>
          <Button asChild className="mt-5" size="lg">
            <a href="#course-learning-path">
              回到课表 <ArrowUp className="size-4" />
            </a>
          </Button>
          <nav className="mt-4 flex flex-wrap gap-4 text-sm text-[#6D5B82]">
            <Link className="hover:text-[#5C2B92]" href="/learn">
              学习路径
            </Link>
            <Link className="hover:text-[#5C2B92]" href="/membership">
              会员权益
            </Link>
            <Link className="hover:text-[#5C2B92]" href="/workshops">
              实战培训
            </Link>
            <Link className="hover:text-[#5C2B92]" href="/articles?topic=tutorial">
              实操文章
            </Link>
          </nav>
        </div>
        <Image
          src="/images/reader-chair.jpg"
          alt="一个人坐在沙发上看平板"
          width={640}
          height={640}
          className="mx-auto w-full max-w-xs rounded-[32px]"
        />
      </section>

      <Dialog open={Boolean(inviteFor)} onOpenChange={(open) => !open && setInviteFor(null)}>
        <DialogContent>
          <DialogTitle>邀请码兑换</DialogTitle>
          <DialogDescription>
            这是演示站。兑换码不会扣积分，也不会开通真实课程。输入任意 6 位字符可以看反馈。
          </DialogDescription>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setMessage(
                code.trim().length >= 6
                  ? "演示校验通过。正式环境会在这里核销并解锁对应课时。"
                  : "请输入至少 6 位。此表单不会提交到服务器。",
              );
            }}
          >
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="输入邀请码"
              aria-label="邀请码"
            />
            <Button type="submit" className="w-full">
              校验
            </Button>
            {message && <p className="text-sm text-[#5C2B92]">{message}</p>}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
