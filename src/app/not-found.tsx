import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold text-[#7A5AA8]">404</p>
        <h1 className="mt-2 text-3xl font-black text-[#38254F]">页面走丢了</h1>
        <p className="mt-2 text-sm text-[#6D5B82]">链接可能已失效，或地址写错了。</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-[#5C2B92] px-4 py-2 text-sm font-semibold text-white">回到首页</Link>
          <Link href="/c" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5C2B92]">进入工作台</Link>
        </div>
      </div>
    </div>
  );
}
