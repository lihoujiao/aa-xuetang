import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { LessonStage } from "@/components/lesson-stage";
import { SiteHeader } from "@/components/site-header";
import { allLessons, findLesson } from "@/lib/content";
import { absoluteUrl, pageMeta, siteName, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return allLessons().map(({ lesson }) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findLesson(slug);
  return pageMeta({
    title: found?.lesson.title ?? "课程",
    description: found?.lesson.summary ?? "一节可以跟着做的课。",
    path: `/courses/${slug}`,
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findLesson(slug);
  if (!found) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: found.lesson.title,
          description: found.lesson.summary,
          url: absoluteUrl(`/courses/${found.lesson.slug}`),
          inLanguage: "zh-CN",
          provider: {
            "@type": "Organization",
            name: siteName,
            url: `${siteUrl}/`,
          },
        }}
      />
      <SiteHeader />
      <LessonStage chapter={found.chapter} lesson={found.lesson} />
    </>
  );
}
