"use client";

import Link from "next/link";
import { useState } from "react";
import { chapters, kindLabel, type Lesson, type Chapter } from "@/lib/content";
import { formatClock } from "@/lib/utils";
import { useUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LessonStage({
  chapter,
  lesson,
  inApp = false,
}: {
  chapter: Chapter;
  lesson: Lesson;
  inApp?: boolean;
}) {
  const user = useUser();
  const [shared, setShared] = useState(false);
  const canOpen = Boolean(user) && !lesson.locked;

  return (
    <div className={cn("grid min-h-screen lg:grid-cols-[300px_1fr]", inApp && "min-h-[calc(100vh)]")}>
      <aside className="border-r border-[#E7DFF1] bg-white/70 p-4">
        <Link href={inApp ? "/c/learn" : "/courses"} className="text-sm font-semibold text-[#5C2B92]">
          ← 课程地图
        </Link>
        <div className="mt-4 space-y-4">
          {chapters.map((item, index) => (
            <div key={item.slug}>
              <p className="text-xs font-semibold text-[#8A7A9C]">
                {index + 1} {item.title}
              </p>
              <ul className="mt-1 space-y-1">
                {item.lessons.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`${inApp ? "/c/learn" : "/courses"}/${entry.slug}`}
                      className={cn(
                        "block truncate rounded-xl px-2 py-1.5 text-sm text-[#4C3D62]",
                        entry.slug === lesson.slug && "bg-[#F3E8FF] font-semibold text-[#5C2B92]",
                      )}
                    >
                      {entry.index} {entry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
      <div className="px-4 py-6 md:px-8">
        <div className="rounded-[28px] bg-[#EFE7F8] p-6 md:p-10">
          <p className="text-xs font-semibold text-[#7A5AA8]">
            {chapter.title} · {kindLabel[lesson.kind]}
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black text-[#38254F] md:text-3xl">
            {lesson.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-7 text-[#6D5B82]">
            {lesson.summary}
          </p>
          {lesson.seconds > 0 && (
            <p className="mt-3 text-center text-xs text-[#8A7A9C]">{formatClock(lesson.seconds)}</p>
          )}
          <div className="mt-6 flex flex-col items-center gap-3">
            {canOpen ? (
              <div className="w-full max-w-xl rounded-2xl bg-white p-4 text-sm text-[#4C3D62]">
                <p className="font-semibold text-[#38254F]">演示播放位</p>
                <p className="mt-1 leading-6">
                  {user}，这一节在演示站里不播放外部视频。进度条只表示你已经打开过页面。
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0E8F8]">
                  <div className="h-full w-1/5 rounded-full bg-[#5C2B92]" />
                </div>
              </div>
            ) : (
              <Button asChild>
                <Link href={`/login?callbackUrl=${inApp ? "/c/learn" : "/courses"}/${lesson.slug}`}>
                  {lesson.locked ? "登录后查看解锁方式" : "登录后观看"} →
                </Link>
              </Button>
            )}
            <Link href={inApp ? "/c/learn#course-learning-path" : "/courses#course-learning-path"} className="text-sm text-[#6D5B82] hover:text-[#5C2B92]">
              浏览更多课程
            </Link>
          </div>
        </div>
        <article className="mx-auto mt-6 max-w-3xl rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#38254F]">{lesson.title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#4C3D62]">{lesson.summary}</p>
          <p className="mt-3 text-sm leading-7 text-[#4C3D62]">
            {lesson.credits === 0
              ? "这一节标为免费，登录后即可在演示站里打开说明。"
              : `解锁需要 ${lesson.credits.toLocaleString()} 积分${
                  lesson.accessDays ? `，有效 ${lesson.accessDays} 天` : ""
                }。演示站不会扣除积分。`}
          </p>
          <button
            type="button"
            onClick={() => setShared(true)}
            className="mt-4 text-sm font-semibold text-[#5C2B92]"
          >
            {shared ? "已在本页记下：想把这节课分享给同事" : "分享这节课"}
          </button>
        </article>
      </div>
    </div>
  );
}
