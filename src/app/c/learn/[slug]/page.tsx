import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonStage } from "@/components/lesson-stage";
import { allLessons, findLesson } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

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
    description: found?.lesson.summary ?? "工作台里的一节课。",
    path: `/c/learn/${slug}`,
  });
}

export default async function AppLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findLesson(slug);
  if (!found) notFound();
  return <LessonStage chapter={found.chapter} lesson={found.lesson} inApp />;
}
