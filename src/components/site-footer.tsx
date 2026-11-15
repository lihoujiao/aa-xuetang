import Link from "next/link";
import { brand } from "@/lib/content";
import { Logo } from "@/components/site-header";

const links = [
  ["课程", "/courses"],
  ["文章", "/articles"],
  ["活动", "/events"],
  ["需求", "/demands"],
  ["精选供给", "/solutions"],
  ["会员权益", "/membership"],
  ["技能包", "/skills"],
  ["开发者", "/developers"],
  ["关于我们", "/about"],
];

const legal = [
  ["服务条款", "/legal/terms"],
  ["隐私政策", "/legal/privacy"],
  ["积分说明", "/legal/credits"],
  ["开发者协议", "/legal/developer"],
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E7DDF2] bg-[#F7F4FB]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Logo />
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#6A587E]">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-[#5C2B92]">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 text-xs text-[#8A7A9C] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name} · {brand.beian} ·{" "}
            <a className="hover:text-[#5C2B92]" href={`mailto:${brand.email}`}>
              {brand.email}
            </a>
          </p>
          <nav className="flex flex-wrap gap-x-4">
            {legal.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-[#5C2B92]">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
