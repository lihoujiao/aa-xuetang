"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  Folder,
  LayoutDashboard,
  MessageSquare,
  PenTool,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/session";

const items = [
  { href: "/c", label: "对话", icon: MessageSquare, exact: true },
  { href: "/c/agents", label: "智能体", icon: Bot },
  { href: "/c/studio", label: "创作", icon: PenTool },
  { href: "/c/files", label: "我的文件", icon: Folder },
  { href: "/c/learn", label: "学习", icon: Sparkles },
  { href: "/dashboard", label: "数据", icon: LayoutDashboard },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useUser();
  const [notice, setNotice] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F3FB]">
      <aside className="sticky top-0 flex h-screen w-[72px] shrink-0 flex-col items-center border-r border-[#E7DFF1] bg-[#F4F1F8] py-3">
        <Link
          href="/"
          className="mb-3 grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#8B6CFF] to-[#5C2B92] text-[11px] font-black text-white"
          title="回到学堂首页"
        >
          AA
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-1">
          {items.map((item) => {
            const on = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className={cn(
                  "group relative grid size-10 place-items-center rounded-xl text-[#7A6C90] hover:bg-white hover:text-[#5C2B92]",
                  on && "bg-white text-[#5C2B92] shadow-sm",
                )}
              >
                {on && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#5C2B92]" />
                )}
                <Icon className="size-[18px]" />
                <span className="pointer-events-none absolute left-12 z-20 hidden whitespace-nowrap rounded-md border border-[#E7DFF1] bg-white px-2 py-1 text-xs text-[#38254F] shadow-sm group-hover:block">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label="通知"
          onClick={() => setNotice((v) => !v)}
          className="relative mb-2 grid size-10 place-items-center rounded-xl text-[#7A6C90] hover:bg-white"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#E15B64]" />
        </button>
        <Link
          href="/c/profile"
          aria-label="我的"
          title="我的"
          className="grid size-10 place-items-center rounded-full bg-[#E7D8F8] text-xs font-bold text-[#5C2B92]"
        >
          {(user || "客").slice(0, 1)}
        </Link>
        {notice && (
          <div className="absolute bottom-16 left-16 z-30 w-64 rounded-2xl border border-[#E7DFF1] bg-white p-3 text-sm shadow-xl">
            <p className="font-semibold text-[#38254F]">未读通知</p>
            <p className="mt-1 text-[#6D5B82]">江城下午茶的报名将在演示时间开放。这是本地示例，不会发送消息。</p>
          </div>
        )}
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
