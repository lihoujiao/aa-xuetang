import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/shell";
import { chapters, findInstructor, instructors } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return instructors.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const person = findInstructor(slug);
  return pageMeta({
    title: person?.name ?? "讲师",
    description: person?.focus ?? "一位公开介绍授课方向的讲师。",
    path: `/instructors/${slug}`,
  });
}

export default async function InstructorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = findInstructor(slug);
  if (!person) notFound();
  const related = chapters.filter((chapter) => chapter.instructor?.slug === person.slug);
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs font-semibold text-[#7A5AA8]">{person.role}</p>
        <h1 className="mt-2 text-4xl font-black text-[#38254F]">{person.name}</h1>
        <p className="mt-4 text-sm leading-7 text-[#4C3D62]">{person.bio}</p>
        <p className="mt-3 text-sm leading-7 text-[#4C3D62]">{person.focus}</p>
        <h2 className="mt-8 text-lg font-bold text-[#38254F]">相关章节</h2>
        <ul className="mt-3 space-y-2">
          {related.map((chapter) => (
            <li key={chapter.slug}>
              <Link href={`/courses#${chapter.slug}`} className="text-sm font-semibold text-[#5C2B92]">
                {chapter.title}
              </Link>
            </li>
          ))}
          {related.length === 0 && <li className="text-sm text-[#6D5B82]">这一位目前没有单独挂在章节上。</li>}
        </ul>
      </article>
    </MarketingShell>
  );
}
