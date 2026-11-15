import { notFound } from "next/navigation";
import { LessonStage } from "@/components/lesson-stage";
import { allLessons, findLesson } from "@/lib/content";

export function generateStaticParams() {
  return allLessons().map(({ lesson }) => ({ slug: lesson.slug }));
}

export default async function AppLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findLesson(slug);
  if (!found) notFound();
  return <LessonStage chapter={found.chapter} lesson={found.lesson} inApp />;
}
