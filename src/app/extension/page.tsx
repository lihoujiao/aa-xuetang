import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "浏览器侧栏" };

export default function ExtensionPage() {
  return (
    <ProsePage
      title="把学堂留在浏览器侧栏里"
      lede="演示站不提供可安装的扩展包。下面是安装这类侧栏时通常要走的五步，方便你对照自己的浏览器。"
      actions={[{ href: "/c", label: "改用网页版" }]}
      sections={[
        { heading: "1. 取得文件夹", body: ["正式环境会提供压缩包。这里没有文件可下。"] },
        { heading: "2. 打开扩展页", body: ["在浏览器地址栏进入扩展管理。"] },
        { heading: "3. 打开开发者模式", body: ["只有在你信任来源时才加载未上架的文件夹。"] },
        { heading: "4. 选择文件夹", body: ["指向解压后的目录，而不是压缩包本身。"] },
        { heading: "5. 点图标", body: ["侧栏出现后，用和网页版相同的本地登录状态。"] },
      ]}
    />
  );
}
