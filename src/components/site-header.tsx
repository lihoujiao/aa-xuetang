"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe } from "@/lib/session";

const NAV = [
  { href: "/", label: "首页", en: "Home" },
  { href: "/courses", label: "线上学习", en: "Courses" },
  { href: "/events", label: "线下活动", en: "Events" },
  { href: "/solutions", label: "精选供给", en: "Picks" },
  { href: "/affiliate", label: "推广计划", en: "Referrals" },
  { href: "/shop", label: "订阅商店", en: "Shop" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#8B6CFF] to-[#5C2B92] text-[11px] font-black tracking-tight text-white shadow-sm">
        AA
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-[#1A1228]">
          AA 学堂
        </span>
      )}
    </Link>
  );
}

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [en, setEn] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8DFF3]/80 bg-[#F7F4FB]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[65px] max-w-6xl items-center gap-3 px-4 md:px-6">
        <Logo />
        <nav className="ml-3 hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[14px] px-3 py-2 text-[13.5px] font-medium text-[#5E4C74] transition hover:bg-[#EFE6F8] hover:text-[#3C245F]",
                active(pathname, item.href) &&
                  "bg-[#EFE4F8] font-semibold text-[#3C245F]",
              )}
            >
              {en ? item.en : item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <AccountLink />
          <button
            type="button"
            onClick={() => setEn((v) => !v)}
            className="hidden h-9 items-center rounded-full px-2 text-[13px] font-semibold text-[#5E4C74] hover:bg-[#EFE6F8] sm:inline-flex"
            aria-pressed={en}
          >
            {en ? "中" : "EN"}
          </button>
          <Link
            href="/membership"
            className="hidden h-9 items-center rounded-full bg-gradient-to-b from-[#F8E9CC] to-[#E6D2A6] px-4 text-[13.5px] font-semibold text-[#3D2C1B] shadow-[0_2px_6px_rgba(143,106,42,0.16)] sm:inline-flex"
          >
            {en ? "Join" : "加入会员"}
          </Link>
          <Link
            href="/c"
            className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-[#5C2B92] px-3.5 text-[13px] font-semibold text-white shadow-[0_8px_16px_rgba(92,43,146,0.18)] hover:bg-[#4E247E]"
          >
            {en ? "Workspace" : "进入工作台"}
            <span className="ml-1" aria-hidden>
              →
            </span>
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-[#38254F] hover:bg-[#EFE6F8] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "关闭菜单" : "打开菜单"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {en && (
        <p className="border-t border-[#E8DFF3] bg-[#F3ECFA] px-4 py-1.5 text-center text-xs text-[#5C4870]">
          English labels are a preview. Lesson copy stays in Chinese.
        </p>
      )}
      {open && (
        <div className="border-t border-[#E8DFF3] bg-[#FBF9FE] px-4 py-3 lg:hidden">
          <div className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-2xl px-3 py-3 text-sm font-medium text-[#3C245F]",
                  active(pathname, item.href) && "bg-[#EFE4F8]",
                )}
              >
                {item.label}
              </Link>
            ))}
            <AccountLink className="rounded-2xl px-3 py-3 text-sm font-medium text-[#3C245F]" onNavigate={() => setOpen(false)} />
            <Link
              href="/membership"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-3 text-sm font-medium text-[#3D2C1B]"
            >
              加入会员
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function AccountLink({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const user = useMe();
  if (user) {
    return (
      <Link href="/c/profile" onClick={onNavigate} className={className ?? "hidden h-9 items-center rounded-full px-3 text-[13px] font-semibold text-[#5C2B92] hover:bg-[#EFE6F8] sm:inline-flex"}>
        {user.nickname}
      </Link>
    );
  }
  return (
    <Link href="/login" onClick={onNavigate} className={className ?? "hidden h-9 items-center rounded-full px-3 text-[13px] font-semibold text-[#5E4C74] hover:bg-[#EFE6F8] sm:inline-flex"}>
      登录
    </Link>
  );
}
