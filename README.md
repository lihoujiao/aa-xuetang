# AA 学堂

一个中文学习站示例。版式参考公开的共学课程页（浅紫顶栏、英雄区、三条路径、可切换的章节课表），内容、标志和插画都是原创的，不使用原站名称或图片。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

课表在 [http://localhost:3000/courses](http://localhost:3000/courses)，工作台里的同一页在 [http://localhost:3000/c/learn](http://localhost:3000/c/learn)。

## 脚本

- `npm run dev` 开发服务器
- `npm run build` 生产构建
- `npm run start` 运行构建结果
- `npm run lint` ESLint

登录使用手机短信验证码。接口在 Cloudflare Worker 里，说明见 `cloudflare/README.md`。本地模拟发码：

```bash
npm run worker:build
SMS_MOCK=1 node cloudflare/dev-server.mjs
```

结构说明见 `docs/site-structure.md`、`docs/sitemap.md`、`docs/content-inventory.md`。
