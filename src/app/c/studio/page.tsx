"use client";

import { useState } from "react";

const templates = [
  ["口播成片", "从逐字稿到可继续删改的时间线"],
  ["一页海报", "先定标题和要证明的事实，再排版"],
  ["课程简介", "按表格一行生成，并留下抽查列"],
];

export default function StudioPage() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <p className="text-xs font-semibold text-[#7A5AA8]">AIGC 创作</p>
      <h1 className="mt-1 text-3xl font-black text-[#38254F]">从一块模板开始</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#6D5B82]">画布只在本页记住你选中的模板，不会上传素材。</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {templates.map(([title, text]) => (
          <button key={title} type="button" onClick={() => setPicked(title)} className="rounded-3xl bg-white p-5 text-left shadow-sm hover:-translate-y-0.5">
            <h2 className="font-bold text-[#38254F]">{title}</h2>
            <p className="mt-2 text-sm text-[#6D5B82]">{text}</p>
          </button>
        ))}
      </div>
      <div className="mt-6 min-h-48 rounded-[28px] border border-dashed border-[#D9CCEA] bg-white/60 p-6">
        {picked ? (
          <p className="text-sm text-[#38254F]">已打开「{picked}」。下一步：把材料贴进来，先写检查点，再生成。</p>
        ) : (
          <p className="text-sm text-[#8A7A9C]">还没有打开模板。</p>
        )}
      </div>
    </div>
  );
}
