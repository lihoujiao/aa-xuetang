export const brand = {
  name: "AA 学堂",
  email: "hello@aa-xuetang.example",
  beian: "演示备案号 00000000号-1",
};

export type LessonKind = "video" | "interactive" | "article";

export type Lesson = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  seconds: number;
  kind: LessonKind;
  credits: number;
  checkins: number;
  people: string[];
  locked?: boolean;
  invite?: boolean;
  accessDays?: number;
};

export type Instructor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  focus: string;
};

export type ChapterEvent = {
  slug: string;
  start: string;
  end: string;
  status: "即将开放" | "报名中" | "已结束";
  price: string;
  title: string;
  city: string;
  place: string;
  seatsLeft: number;
  seatsTotal: number;
  cover: string;
};

export type Chapter = {
  slug: string;
  title: string;
  badge: string;
  summary: string;
  lessons: Lesson[];
  event?: ChapterEvent;
  instructor?: Instructor;
};

export const instructors: Instructor[] = [
  {
    slug: "linxia",
    name: "林夏",
    role: "AA 学堂认证讲师",
    bio: "做过内容工作室和小型品牌的日常运营，习惯把一节课收成可以交出去的样品。",
    focus: "带零基础学员从一次真实任务开始，做出口播、页面或可复用的小流程。",
  },
  {
    slug: "zhouheng",
    name: "周衡",
    role: "客户接待方向讲师",
    bio: "长期帮门店把散落在聊天里的咨询整理成可跟进的记录。",
    focus: "演示如何让助手先接待、再补记、必要时提醒人工接手。",
  },
  {
    slug: "chenyuan",
    name: "陈予安",
    role: "流程设计讲师",
    bio: "喜欢用看得见的步骤图，把重复劳动拆成可以检查的节点。",
    focus: "帮助学员建立数据、分支和定时运行的基本感觉。",
  },
];

const people = ["林", "周", "陈", "许", "何", "宋"];

export const chapters: Chapter[] = [
  {
    slug: "weekend-lab",
    title: "周末实作营",
    badge: "活动",
    summary:
      "这不是听完就散的分享。我们会从一个说得清的任务出发，整理材料、让助手执行、再核对结果，带走一份能打开、能复用的第一版。",
    lessons: [
      {
        slug: "desk-scenarios",
        index: "01",
        title: "桌面助手实作手册｜12 个办公场景",
        summary:
          "用看清楚、问明白、先规划、再执行、后核对、可交接这六步，走完 12 个常见办公场景。",
        seconds: 0,
        kind: "interactive",
        credits: 3280,
        checkins: 0,
        people: [],
        locked: true,
        invite: true,
        accessDays: 365,
      },
    ],
    event: {
      slug: "riverside-weekend",
      start: "12/12 09:00",
      end: "12/13 17:00",
      status: "报名中",
      price: "¥1680.00",
      title: "【江城·两天一夜】把一个业务问题做成助手样机",
      city: "江城",
      place: "江城市滨江路会客中心",
      seatsLeft: 36,
      seatsTotal: 48,
      cover: "/images/hero-workshop.jpg",
    },
  },
  {
    slug: "starter",
    title: "入门认识课",
    badge: "起步",
    summary:
      "先看清助手已经能替你做完什么，再理解模型、流程和技能怎么配合。随后用一个小任务做出作品，并对照自己的工作安排下一步。",
    instructor: instructors[0],
    lessons: [
      {
        slug: "what-it-can-do",
        index: "01",
        title: "第一课：它已经能替你做完哪些事",
        summary:
          "不讲空泛趋势。用三个身边的例子看清：哪些步骤可以交给助手，哪些判断仍然要自己留着。",
        seconds: 21 * 60 + 40,
        kind: "video",
        credits: 0,
        checkins: 18,
        people: people.slice(0, 4),
      },
      {
        slug: "how-pieces-fit",
        index: "02",
        title: "第二课：模型、流程和助手怎样分工",
        summary: "把容易混在一起的三个词拆开，知道什么时候该聊天，什么时候该把步骤画出来。",
        seconds: 30 * 60 + 12,
        kind: "video",
        credits: 0,
        checkins: 12,
        people: people.slice(1, 5),
      },
      {
        slug: "first-piece",
        index: "03",
        title: "第三课：用手头的任务做出第一件作品",
        summary: "选一件今天就能完成的小事，走完从材料到可展示结果的最短路径。",
        seconds: 28 * 60 + 5,
        kind: "video",
        credits: 0,
        checkins: 7,
        people: people.slice(0, 3),
      },
      {
        slug: "next-path",
        index: "04",
        title: "第四课：对照真实工作，决定接下来学什么",
        summary: "不按热度排课。用你自己的岗位任务，选出下一节值得花时间的练习。",
        seconds: 16 * 60 + 20,
        kind: "video",
        credits: 0,
        checkins: 4,
        people: people.slice(2, 4),
      },
    ],
  },
  {
    slug: "reception",
    title: "接待示范",
    badge: "情景",
    summary: "围绕个人聊天和企业聊天里的咨询，演示自动回复、隔时段跟进，以及何时把人请回来。",
    instructor: instructors[1],
    lessons: [
      {
        slug: "follow-up-demo",
        index: "01",
        title: "把咨询收成可跟进的客户记录",
        summary: "看一次完整演示：接待、补记、提醒人工，而不是只生成一段客气的回复。",
        seconds: 13 * 60 + 40,
        kind: "video",
        credits: 0,
        checkins: 9,
        people: people.slice(0, 4),
      },
    ],
  },
  {
    slug: "builder",
    title: "助手搭建课",
    badge: "动手",
    summary: "从安装到做出能重复使用的小流程，带你把助手放进自己的桌面工作。",
    lessons: [
      {
        slug: "install-tools",
        index: "01",
        title: "准备：认识常见桌面助手并完成安装",
        summary: "比较几种入口的差别，选一个先装好，避免同时开三套工具。",
        seconds: 10 * 60 + 20,
        kind: "video",
        credits: 0,
        checkins: 15,
        people: people.slice(0, 5),
      },
      {
        slug: "sign-in",
        index: "02",
        title: "手把手：注册、登录并确认额度",
        summary: "走完账号准备，知道哪里看剩余额度和失败提示。",
        seconds: 8 * 60 + 40,
        kind: "video",
        credits: 0,
        checkins: 11,
        people: people.slice(1, 4),
      },
      {
        slug: "redeem-note",
        index: "03",
        title: "图文：没有国际卡时，怎样完成订阅兑换",
        summary: "用一页说明看懂卡密、兑换页和到账检查，不把付款和开通混成一步。",
        seconds: 2 * 60 + 10,
        kind: "article",
        credits: 0,
        checkins: 6,
        people: people.slice(0, 2),
      },
      {
        slug: "cut-a-talk",
        index: "04",
        title: "把一段口播剪成还能改的成片",
        summary: "从逐字稿到可继续修改的时间线，保留你之后能自己改的节点。",
        seconds: 16 * 60,
        kind: "article",
        credits: 1680,
        checkins: 3,
        people: people.slice(2, 4),
        locked: true,
      },
      {
        slug: "idea-to-film",
        index: "05",
        title: "从一个念头走到能看的短片",
        summary: "先写分镜和检查点，再生成画面，避免同一镜头反复重抽。",
        seconds: 18 * 60,
        kind: "video",
        credits: 0,
        checkins: 8,
        people: people.slice(0, 3),
      },
      {
        slug: "borrow-quota",
        index: "06",
        title: "在已有工具里借用另一份额度",
        summary: "了解额度不能混用时的边界，以及怎样在不重复付费的前提下完成一次试验。",
        seconds: 12 * 60,
        kind: "article",
        credits: 980,
        checkins: 2,
        people: people.slice(1, 3),
        locked: true,
      },
    ],
  },
  {
    slug: "concepts",
    title: "概念补课",
    badge: "基础",
    summary: "用日常任务把抽象词说清楚，方便你在后面的实作里知道自己正在调哪一层。",
    lessons: [
      {
        slug: "what-is-ai",
        index: "01",
        title: "什么是人工智能：从日常任务看起",
        summary: "用整理邮件、写纪要、对表格三个动作，认识“会做”和“会判断”的差别。",
        seconds: 6 * 60,
        kind: "video",
        credits: 990,
        checkins: 5,
        people: people.slice(0, 2),
        locked: true,
      },
      {
        slug: "history-brief",
        index: "02",
        title: "一条很短的发展线索",
        summary: "不背年表。只记住几次能力跳跃，帮助你判断现在的工具处在哪一段。",
        seconds: 7 * 60,
        kind: "video",
        credits: 990,
        checkins: 4,
        people: people.slice(2, 4),
        locked: true,
      },
      {
        slug: "six-abilities",
        index: "03",
        title: "六种常见能力怎样配合",
        summary: "理解生成、检索、分类、抽取、规划和调用工具为什么经常要一起出现。",
        seconds: 9 * 60,
        kind: "video",
        credits: 990,
        checkins: 3,
        people: people.slice(0, 3),
        locked: true,
      },
      {
        slug: "what-is-token",
        index: "04",
        title: "加更：词元是什么，为什么会影响费用",
        summary: "用一段中文说明计费单位，避免把“字数”直接当成账单。",
        seconds: 8 * 60,
        kind: "video",
        credits: 680,
        checkins: 6,
        people: people.slice(1, 4),
        locked: true,
      },
    ],
  },
  {
    slug: "flow-mind",
    title: "流程思维课",
    badge: "过渡",
    summary:
      "如果文字对话还不稳定，可以先用看得见的步骤图建立感觉：数据从哪来、在哪分叉、什么时候自己跑。",
    instructor: instructors[2],
    lessons: [
      {
        slug: "why-workflow",
        index: "01",
        title: "会聊天之后，为什么还要学流程",
        summary: "聊天适合探索，流程适合重复。看清你现在的任务属于哪一种。",
        seconds: 11 * 60,
        kind: "video",
        credits: 0,
        checkins: 10,
        people: people.slice(0, 4),
      },
      {
        slug: "pick-a-board",
        index: "02",
        title: "几种可视化工具怎么选",
        summary: "不比较品牌口号，只比较你要接的表格、聊天和定时任务。",
        seconds: 14 * 60,
        kind: "video",
        credits: 0,
        checkins: 7,
        people: people.slice(1, 4),
      },
      {
        slug: "first-scenario",
        index: "03",
        title: "做出第一条会跑的场景",
        summary: "从一个表格新行触发，生成一段摘要，写回另一列。",
        seconds: 15 * 60,
        kind: "video",
        credits: 0,
        checkins: 6,
        people: people.slice(0, 3),
      },
      {
        slug: "router-filter",
        index: "04",
        title: "让数据在分叉处自己走",
        summary: "用过滤和分支处理“要人工看”和“可以直接归档”的两类结果。",
        seconds: 18 * 60,
        kind: "video",
        credits: 2480,
        checkins: 1,
        people: people.slice(3, 5),
        locked: true,
      },
    ],
  },
];

export const events: ChapterEvent[] = [
  chapters[0].event!,
  {
    slug: "teahouse-salon",
    start: "11/22 14:00",
    end: "11/22 17:00",
    status: "即将开放",
    price: "¥39.90",
    title: "【江城·下午茶】把桌面助手用成一把顺手的工具",
    city: "江城",
    place: "江城市花园道荣信商务中心会客厅",
    seatsLeft: 20,
    seatsTotal: 20,
    cover: "/images/desk-learner.jpg",
  },
  {
    slug: "past-salon",
    start: "11/15 14:00",
    end: "11/15 17:00",
    status: "已结束",
    price: "¥39.90",
    title: "【江城·下午茶】上一期工具上手会",
    city: "江城",
    place: "江城市花园道荣信商务中心会客厅",
    seatsLeft: 0,
    seatsTotal: 24,
    cover: "/images/photographer.jpg",
  },
  {
    slug: "past-day",
    start: "10/31 09:00",
    end: "10/31 18:00",
    status: "已结束",
    price: "¥99.00",
    title: "一日实作：把口播收成可修改的成片",
    city: "江城",
    place: "滨江路会客中心",
    seatsLeft: 0,
    seatsTotal: 30,
    cover: "/images/reader-chair.jpg",
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  topic: "tutorial" | "event" | "about";
  topicLabel: string;
  tags: string[];
  author: string;
  date: string;
  minutes: number;
  views: number;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "idea-to-cut",
    title: "从一个念头到能改的短片：先检查，再生成",
    excerpt: "如果同一个镜头总要重来好几次，问题往往出在生成之前。这篇按真实顺序写下分镜、首尾帧和提交前要看的三件事。",
    topic: "tutorial",
    topicLabel: "图文教程",
    tags: ["短片", "分镜", "检查清单"],
    author: "林夏",
    date: "2026/11/07",
    minutes: 18,
    views: 86,
    body: [
      "很多人把短片做成了抽卡。画面不满意就再抽一次，费用和耐心一起被消耗掉。更稳的做法是把“想清楚”和“生成”分成两段。",
      "先用文字写下这一镜要证明什么：人物在做什么、物件有没有变化、镜头是推近还是停住。然后只为这一镜准备首帧和尾帧。",
      "提交前看三件事：杯子、衣服、背景里的字，在两张图里是否同一尺寸、同一朝向。不一致的细节，生成后往往会自己长大。",
      "生成之后不要立刻往下剪。先把这一镜单独看完，确认动作没有跳，再放进成片。这样返工只会停在一镜，而不是整条片子。",
    ],
  },
  {
    slug: "talking-head-cut",
    title: "口播剪辑：留下一条你还能改的时间线",
    excerpt: "不追求一次出片。把口播收成可以继续删句、换字幕和补画面的工程，下一次就不用从头来。",
    topic: "tutorial",
    topicLabel: "图文教程",
    tags: ["口播", "剪辑"],
    author: "林夏",
    date: "2026/11/05",
    minutes: 12,
    views: 41,
    body: [
      "口播最怕的是成片只能导出、不能改。助手可以帮你找重复句和气口，但时间线应该留在你能打开的工程里。",
      "建议的顺序是：先出逐字稿，再标出要删的口头禅，然后按段落切，最后才上字幕和封面。",
      "如果你每周都要发一条，把这套顺序写成自己的检查单，比收藏十个提示词更有用。",
    ],
  },
  {
    slug: "sheet-to-brief",
    title: "表格里的六十行简介，怎样四分钟写完并抽查",
    excerpt: "把课程简介从手工填写改成表格触发。关键不是更快，而是每一行都能回头核对。",
    topic: "tutorial",
    topicLabel: "图文教程",
    tags: ["表格", "流程"],
    author: "陈予安",
    date: "2026/04/23",
    minutes: 6,
    views: 120,
    body: [
      "把标题、受众和时长放进表格，让流程按行生成简介，再写回旁边一列。人要做的是抽查，不是从空白页开始打字。",
      "抽查时看两件事：有没有编造课时，有没有把受众写成所有人。错了就改提示，而不是只改那一行。",
    ],
  },
  {
    slug: "salon-note",
    title: "下午茶见闻：大家真正卡住的是开工，不是概念",
    excerpt: "一期线下交流之后的记录。收藏夹里的教程很多，真正打开工具的人并不多。",
    topic: "event",
    topicLabel: "活动介绍",
    tags: ["线下", "记录"],
    author: "周衡",
    date: "2026/11/16",
    minutes: 5,
    views: 33,
    body: [
      "这一期没有新增工具。大家带着自己的未完成任务来，用一个下午只推进一件事。",
      "结束时能带走的，是一条已经跑通的小流程，或者一份写明下一步的清单。",
    ],
  },
  {
    slug: "why-we-learn-together",
    title: "为什么要把练习放回自己的工作里",
    excerpt: "课程负责把方法走通一遍，工作负责检验它能不能留下。两边缺一，都会很快忘掉。",
    topic: "about",
    topicLabel: "关于我们",
    tags: ["方法"],
    author: "AA 学堂",
    date: "2026/06/21",
    minutes: 7,
    views: 58,
    body: [
      "我们把课表排成章节，是为了让你知道自己走到哪。但进度本身不是目的。",
      "每节课都尽量对应一件能交出去的小事：一段可改的成片、一行核对过的简介、一次接待记录。",
    ],
  },
  {
    slug: "publish-draft",
    title: "把整理好的稿子送进草稿箱",
    excerpt: "排版可以自动化，发布前的那一眼不能省。这篇只讲从文本到草稿，不讲自动群发。",
    topic: "tutorial",
    topicLabel: "图文教程",
    tags: ["稿件", "排版"],
    author: "陈予安",
    date: "2026/04/26",
    minutes: 9,
    views: 77,
    body: [
      "流程停在草稿箱是有意的。自动写完不等于自动公开。",
      "你仍然需要看标题、封面和第一段有没有把事实说错。确认之后再手动发布。",
    ],
  },
];

export type Solution = {
  slug: string;
  kind: "产品" | "服务" | "解决方案";
  title: string;
  summary: string;
  market: string;
  member: string;
  unit: string;
  forWho: string[];
  solves: string[];
  includes: string[];
  delivery: string[];
};

export const solutions: Solution[] = [
  {
    slug: "desk-helper-month",
    kind: "产品",
    title: "桌面助手月卡",
    summary: "给个人账号准备一个月的日常写作、整理和轻度编程额度。",
    market: "¥148 / 月",
    member: "¥109 / 月",
    unit: "个人账号 · 30 天",
    forWho: ["需要每天整理材料的同事", "想试编程助手但不想一次买一年的人"],
    solves: ["把重复写作和摘要放到固定额度里", "避免临时找来路不明的共享账号"],
    includes: ["一个月个人额度", "兑换说明", "到账后的自查清单"],
    delivery: ["向客服确认套餐", "付款后领取兑换码", "在兑换页绑定到自己的账号"],
  },
  {
    slug: "studio-helper-month",
    kind: "产品",
    title: "工作室助手月卡",
    summary: "额度更高，适合一周要出多条成片或长文档的小团队里的一个人。",
    market: "¥720 / 月",
    member: "¥630 / 月",
    unit: "个人账号 · 30 天",
    forWho: ["内容小组里负责成片的人", "需要更长上下文的写作者"],
    solves: ["减少月底额度突然用尽", "把高频任务和日常聊天分开看"],
    includes: ["更高的月度额度", "兑换与延期说明"],
    delivery: ["先对照市场价和会员价", "确认账号地区是否支持", "兑换后当天做一次小任务验证"],
  },
  {
    slug: "reception-setup",
    kind: "解决方案",
    title: "聊天接待整理方案",
    summary: "从自然接待，到客户画像和隔日跟进，适合咨询量大的小店。",
    market: "¥1,280 / 月",
    member: "¥860 / 月",
    unit: "单店 · 月付",
    forWho: ["微信咨询多、表格记不住的门店", "需要人工随时接手的客服主管"],
    solves: ["咨询不再只留在聊天记录里", "超时未回复时有人被提醒"],
    includes: ["接待话术边界", "记录字段", "人工接手规则"],
    delivery: ["先看一节示范课", "再用自己的十段历史咨询试跑", "确认无误后再接到日常"],
  },
  {
    slug: "workshop-seat",
    kind: "服务",
    title: "两天线下陪跑席位",
    summary: "带着一个真实任务来，两天内做成可以演示的第一版。",
    market: "¥1,980 / 人",
    member: "¥1,680 / 人",
    unit: "线下 · 两天",
    forWho: ["想亲手做完而不是再收藏一课的人"],
    solves: ["开工难", "做完不知道怎样验收"],
    includes: ["席位", "任务单", "结束后的修改清单"],
    delivery: ["报名时写清任务", "现场只推进这一件", "离开时带走可打开的样品"],
  },
];

export const demands = [
  {
    title: "门店想把夜间咨询整理成第二天的跟进名单",
    city: "江城",
    budget: "¥3,000–8,000",
    status: "审核中",
  },
  {
    title: "教培机构希望把试听课纪要写回表格",
    city: "临江",
    budget: "¥2,000–5,000",
    status: "审核中",
  },
  {
    title: "小团队要把周报从四份文档收成一页",
    city: "远程",
    budget: "面议",
    status: "收集中",
  },
];

export const agents = [
  { name: "纪要整理", category: "办公", blurb: "把一场会议收成决定、负责人和未决问题。" },
  { name: "课表助教", category: "学习", blurb: "根据你卡住的任务，推荐下一节而不是整门课。" },
  { name: "接待记录", category: "运营", blurb: "从聊天里抽出客户、意向和下一次联系时间。" },
  { name: "分镜核对", category: "内容", blurb: "生成前检查首尾帧里会不会变形的细节。" },
  { name: "表格摘要", category: "办公", blurb: "按行读表，写出可以抽查的短简介。" },
  { name: "流程讲解", category: "学习", blurb: "用大白话解释一个已经跑起来的场景。" },
];

export const news = [
  { source: "学堂手记", title: "这一周大家最常卡住的，是开工而不是概念" },
  { source: "练习簿", title: "抽查生成结果时，先看事实再看文笔" },
  { source: "活动板", title: "江城下午茶还剩开放前的最后确认" },
];

export const leaderboard = [
  { name: "何清", score: 42 },
  { name: "宋晚", score: 31 },
  { name: "许舟", score: 18 },
  { name: "学员 118", score: 9 },
  { name: "周小满", score: 6 },
];

export const faqs = [
  {
    q: "免费版会过期吗？",
    a: "演示站里的免费课可以反复打开。正式环境里若有期限，会写在每一课的说明上，而不是藏在结算页。",
  },
  {
    q: "会员和单课积分有什么差别？",
    a: "会员按时间打开一批课。单课积分只解锁标明价格的那一节，并可能带有有效天数。",
  },
  {
    q: "线下活动是否包含在会员里？",
    a: "不默认包含。每一场都单独写价格、席位和取消规则。",
  },
  {
    q: "推广怎样计算？",
    a: "只有被邀请的人完成一笔符合规则的现金支付，才会产生佣金。浏览和注册本身不算。",
  },
];

export function allLessons() {
  return chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({ chapter, lesson })),
  );
}

export function findLesson(slug: string) {
  return allLessons().find((item) => item.lesson.slug === slug) ?? null;
}

export function findEvent(slug: string) {
  return events.find((event) => event.slug === slug) ?? null;
}

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug) ?? null;
}

export function findSolution(slug: string) {
  return solutions.find((item) => item.slug === slug) ?? null;
}

export function findInstructor(slug: string) {
  return instructors.find((item) => item.slug === slug) ?? null;
}

export const kindLabel: Record<LessonKind, string> = {
  video: "视频",
  interactive: "互动实战",
  article: "图文",
};
