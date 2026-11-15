"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = ["我的文件夹", "我的知识库", "回收站"];

export default function FilesPage() {
  const [tab, setTab] = useState(tabs[0]);
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-3xl font-black text-[#38254F]">云盘</h1>
      <p className="mt-1 text-sm text-[#6D5B82]">个人文件空间 · 演示容量 1 GB · 不会真正上传。</p>
      <div className="mt-4 flex gap-2">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={cn("rounded-full px-3 py-1.5 text-sm", tab === item ? "bg-[#5C2B92] text-white" : "bg-white")}>
            {item}
          </button>
        ))}
      </div>
      <label className="mt-6 block rounded-[28px] border border-dashed border-[#D9CCEA] bg-white p-8 text-center text-sm text-[#6D5B82]">
        选择文件以加入「{tab}」列表
        <input
          type="file"
          className="mt-3 block w-full text-xs"
          onChange={(event) => {
            const name = event.target.files?.[0]?.name;
            if (name) setFiles((list) => [name, ...list]);
          }}
        />
      </label>
      <ul className="mt-4 space-y-2">
        {files.length === 0 && <li className="text-sm text-[#8A7A9C]">还没有文件。</li>}
        {files.map((name) => (
          <li key={name} className="rounded-2xl bg-white px-4 py-3 text-sm">{name}</li>
        ))}
      </ul>
    </div>
  );
}
