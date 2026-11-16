"use client";

import Link from "next/link";
import { useState } from "react";
import { news } from "@/lib/content";
import { useMe } from "@/lib/session";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const user = useMe();
  const hour = new Date().getHours();
  const hello = hour < 5 ? "夜深了" : hour < 11 ? "早上好" : hour < 18 ? "下午好" : "晚上好";
  const [text, setText] = useState("");
  const [ask, setAsk] = useState(true);
  const [messages, setMessages] = useState<{ role: "you" | "aa"; text: string }[]>([]);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-8">
      <p className="text-sm text-[#8A7A9C]">{new Date().toLocaleDateString("zh-CN", { weekday: "long", month: "long", day: "numeric" })}</p>
      <h1 className="mt-2 text-4xl font-black text-[#38254F]">
        {hello}，{user?.nickname || "访客"}
      </h1>
      <div className="mt-6 flex-1 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm leading-6 text-[#6D5B82]">从一句具体的任务开始。演示回复只复述你的话，不会调用外部模型。</p>
        )}
        {messages.map((message, index) => (
          <p key={index} className={message.role === "you" ? "ml-auto max-w-[80%] rounded-2xl bg-[#5C2B92] px-4 py-2 text-sm text-white" : "max-w-[80%] rounded-2xl bg-white px-4 py-2 text-sm text-[#2C2140]"}>
            {message.text}
          </p>
        ))}
      </div>
      <form
        className="mt-4 rounded-[28px] bg-white p-3 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          const value = text.trim();
          if (!value) return;
          setMessages((list) => [
            ...list,
            { role: "you", text: value },
            { role: "aa", text: ask ? `先确认一下：你希望我只处理「${value}」这一件，对吗？` : `已记下：${value}` },
          ]);
          setText("");
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="写下要处理的一件事"
          className="w-full resize-none bg-transparent text-sm outline-none"
        />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setAsk((v) => !v)} className="rounded-full bg-[#F3E8FF] px-3 py-1 text-xs font-semibold text-[#5C2B92]">
            {ask ? "需要时询问" : "直接执行"}
          </button>
          <span className="text-xs text-[#8A7A9C]">自动技能 · 演示</span>
          <Button type="submit" size="sm" className="ml-auto">发送</Button>
        </div>
      </form>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <button type="button" onClick={() => setMessages([])} className="font-semibold text-[#5C2B92]">新建对话</button>
        <Link href="/c/agents" className="font-semibold text-[#5C2B92]">发起群聊</Link>
        <Link href="/profile/wallet" className="text-[#6D5B82]">平台积分</Link>
        <Link href="/profile/wallet" className="text-[#6D5B82]">我的钱包</Link>
      </div>
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-[#38254F]">每日手记</h2>
        <ul className="mt-2 space-y-2">
          {news.map((item) => (
            <li key={item.title} className="rounded-2xl bg-white px-4 py-3 text-sm">
              <span className="text-xs text-[#8A7A9C]">{item.source}</span>
              <p className="font-medium text-[#2C2140]">{item.title}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
