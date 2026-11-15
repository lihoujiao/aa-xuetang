import Link from "next/link";
import { MarketingShell } from "@/components/shell";

export function ProsePage({
  kicker,
  title,
  lede,
  sections,
  actions,
}: {
  kicker?: string;
  title: string;
  lede: string;
  sections: { heading: string; body: string[] }[];
  actions?: { href: string; label: string }[];
}) {
  return (
    <MarketingShell>
      <article className="mx-auto max-w-3xl px-4 py-14">
        {kicker && <p className="text-xs font-semibold tracking-wide text-[#7A5AA8]">{kicker}</p>}
        <h1 className="mt-3 text-4xl font-black leading-tight text-[#38254F]">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-[#6D5B82]">{lede}</p>
        {actions && (
          <div className="mt-5 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="inline-flex h-11 items-center rounded-full bg-[#5C2B92] px-4 text-sm font-semibold text-white">
                {action.label}
              </Link>
            ))}
          </div>
        )}
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-[#38254F]">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-sm leading-7 text-[#4C3D62]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </MarketingShell>
  );
}
