import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { events } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "实战培训",
  description: "带着一个已经说得清的任务来，先看场次安排再决定要不要参加。",
  path: "/workshops",
});

export default function WorkshopsPage() {
  return (
    <ProsePage
      kicker="WORKSHOPS · 一起练"
      title="带着自己的问题来的实战培训"
      lede="技术分享、上手练习或项目交流。先看这一场的主题、准备和名额，再决定要不要来。"
      actions={[
        { href: "/events", label: "查看场次安排" },
        { href: "/courses", label: "先从线上课开始" },
      ]}
      sections={[
        {
          heading: "近期场次",
          body: events
            .filter((event) => event.status !== "已结束")
            .map((event) => `${event.start} ${event.title} · ${event.city} · ${event.price}`),
        },
        {
          heading: "报名前",
          body: [
            "不同场次对基础的要求不一样，以详情页为准。",
            "会员不自动包含线下席位。",
            "时间和地点写在每一场自己的页面上。",
          ],
        },
      ]}
    />
  );
}
