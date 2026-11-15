import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LearnView } from "@/components/learn-view";
import { MarketingShell } from "@/components/shell";
import { allLessons } from "@/lib/content";
import { absoluteUrl, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "线上学习",
  description: "按章节排列的课程目录，从认识工具走到做出能打开的第一版。",
  path: "/courses",
});

export default function CoursesPage() {
  const lessons = allLessons();
  return (
    <MarketingShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AA 学堂课程",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: lessons.length,
          itemListElement: lessons.map(({ lesson }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: lesson.title,
            url: absoluteUrl(`/courses/${lesson.slug}`),
          })),
        }}
      />
      <LearnView />
    </MarketingShell>
  );
}
