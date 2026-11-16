import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8");
const match = source.match(/export const SITE_URL = "([^"]+)"/);
if (!match) throw new Error("src/lib/site.ts 里没有 SITE_URL");
const site = match[1];

const pages = [
  ["/", "学堂入口，汇总会员、课表和近期活动。"],
  ["/courses", "按章节排列的学习页，可在列表和平铺之间切换。"],
  ["/learn", "先看清目标，再选课程、文章或活动作为下一步。"],
  ["/articles", "已发布的图文教程、活动记录和说明，可按分类筛选。"],
  ["/events", "线下场次的时间、地点、价格和剩余席位。"],
  ["/about", "学堂在做什么，以及怎样联系。"],
];

const more = [
  ["/workshops", "带着一个具体任务来的线下练习说明。"],
  ["/membership", "基础会员和进阶会员各自包含什么。"],
  ["/solutions", "把市场参考价和会员价放在一起的供给目录。"],
  ["/pricing", "会员与平台方案的标价说明。"],
];

const line = ([path, text], label) => `- [${label}](${site}${path === "/" ? "/" : path})：${text}`;
const labels = ["首页", "课程", "学习路径", "文章", "活动", "关于"];
const moreLabels = ["实战培训", "会员权益", "精选供给", "价格方案"];

const text = `# AA 学堂

> 从手头的一件事开始，按自己的节奏把练习做成能看的结果。

规范地址：${site}

## 关键页面

${pages.map((page, index) => line(page, labels[index])).join("\n")}

## 也可继续看

${more.map((page, index) => line(page, moreLabels[index])).join("\n")}
`;

writeFileSync(new URL("../public/llms.txt", import.meta.url), text);
