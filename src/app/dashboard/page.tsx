import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "数据",
  description: "用一周的练习分钟和完成课时，看自己走到了哪一节。",
  path: "/dashboard",
});

const bars = [40, 55, 32, 70, 48, 80, 36];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-xs font-semibold text-[#7A5AA8]">数据</p>
        <h1 className="mt-1 text-3xl font-black text-[#38254F]">这一周的练习</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6D5B82]">
          数字来自演示数据，用来看版式。登录后的正式环境才会接入真实进度。
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["完成课时", "4"],
            ["练习分钟", "186"],
            ["可用积分", "120"],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm text-[#8A7A9C]">{label}</p>
              <p className="mt-2 text-3xl font-black text-[#38254F]">{value}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#38254F]">近七日分钟</p>
          <div className="mt-4 flex h-36 items-end gap-3">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-[#CDB6EE]" style={{ height: `${h}%` }} />
                <span className="text-[11px] text-[#8A7A9C]">{["一", "二", "三", "四", "五", "六", "日"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
