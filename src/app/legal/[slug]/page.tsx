import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProsePage } from "@/components/prose-page";
import { pageMeta } from "@/lib/seo";

const docs: Record<string, { title: string; lede: string; sections: { heading: string; body: string[] }[] }> = {
  terms: {
    title: "用户协议",
    lede: "这是演示文本，不是正式法律文件。使用本站即表示你知道这里的课程、价格和登录都是本地示例。",
    sections: [
      { heading: "内容", body: ["页面文案为原创示例，不代表任何已上线服务的承诺。"] },
      { heading: "账号", body: ["登录只把称呼存在这台浏览器，清除站点数据即消失。"] },
    ],
  },
  privacy: {
    title: "隐私政策",
    lede: "演示站不建立用户档案，也不向第三方提交手机号。",
    sections: [
      { heading: "存在本地的内容", body: ["称呼、报名意向和兑换码检查都留在浏览器里。"] },
      { heading: "我们不收集", body: ["没有验证码短信，没有支付，没有行为分析脚本。"] },
    ],
  },
  credits: {
    title: "积分说明",
    lede: "积分用于在说明里标出某一节的解锁成本。演示站展示数字，但不增减余额。",
    sections: [
      { heading: "和会员的差别", body: ["会员按时间打开一批课。积分只对应标了价格的单节。"] },
    ],
  },
  developer: {
    title: "开发者协议",
    lede: "接入自己的接口时，你需要为返回内容和密钥保管负责。",
    sections: [
      { heading: "密钥", body: ["不要把令牌放进公开链接、截图或提示词。"] },
      { heading: "演示边界", body: ["本站不会代你调用外部模型。"] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs[slug];
  return pageMeta({
    title: doc?.title ?? "协议",
    description: doc?.lede ?? "本站的说明文本。",
    path: `/legal/${slug}`,
  });
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = docs[slug];
  if (!doc) notFound();
  return <ProsePage title={doc.title} lede={doc.lede} sections={doc.sections} />;
}
