"use client";

import { useState } from "react";
import Link from "next/link";
import { MarketingShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [note, setNote] = useState("");
  return (
    <MarketingShell>
      <section className="mx-auto max-w-lg px-4 py-14">
        <Link href="/shop" className="text-sm font-semibold text-[#5C2B92]">← 订阅商店</Link>
        <h1 className="mt-3 text-3xl font-black text-[#38254F]">自助兑换</h1>
        <p className="mt-2 text-sm leading-6 text-[#6D5B82]">兑换码留在这台浏览器里检查格式，不会发往服务器。</p>
        <form
          className="mt-6 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setNote(code.trim().length >= 8 ? "格式看起来完整。演示环境到此为止。" : "请输入至少 8 位。");
          }}
        >
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="兑换码" aria-label="兑换码" />
          <Button type="submit">检查</Button>
          {note && <p className="text-sm text-[#5C2B92]">{note}</p>}
        </form>
      </section>
    </MarketingShell>
  );
}
