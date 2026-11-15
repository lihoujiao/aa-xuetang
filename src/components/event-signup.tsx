"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function EventSignup({ status, title }: { status: string; title: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="mt-6 rounded-3xl bg-white p-4">
      <Button
        type="button"
        disabled={status === "已结束"}
        onClick={() => setDone(true)}
      >
        {status === "已结束" ? "这一期已结束" : status === "即将开放" ? "先记一笔意向" : "提交报名意向"}
      </Button>
      {done && (
        <p className="mt-3 text-sm text-[#5C2B92]">
          已在这台浏览器记下对「{title}」的意向。演示站不会收费，也不会占用真实席位。
        </p>
      )}
    </div>
  );
}
