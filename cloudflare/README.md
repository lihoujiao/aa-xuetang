# AA 学堂 Worker

线上由单个 ES module 提供静态页和 `/api/*`。上传文件是 `cloudflare/worker.js`（由 `npm run worker:build` 从 `cloudflare/src/` 打包，不要上传未打包的 `src/`）。KV 绑定 `SITE` 只放 `out/` 里的静态文件；账号和会话在 D1 绑定 `DB`。

微信回调地址按当次请求的 Host 生成，因此 `xuetang.fde100.com.cn` 和之后的 `xuetang.ai-fde.com.cn` 都能用。页面上的规范地址来自 `src/lib/site.ts` 的 `SITE_URL`。

## 构建

在仓库根目录：

```bash
npm install
npm run worker:build
```

这会用 esbuild 把 `cloudflare/src/*.js` 打成 `cloudflare/worker.js`。产物不依赖 npm 包，可直接用 Cloudflare API 上传。

本地接口测试：

```bash
npm run test:worker
```

## 静态文件

`/x` 依次查找 KV 键 `/x`、`/x.html`、`/x/index.html`。都没有时返回 `/404.html`，状态码 404。`/_next/static/` 使用一年缓存。`/` 会读 `/index.html`。

## 绑定

| 名称 | 类型 | 用途 |
| --- | --- | --- |
| `SITE` | KV | 静态导出文件，键名以 `/` 开头 |
| `DB` | D1 | 用户、会话、短信频控、微信 state。建表执行 `cloudflare/schema.sql` |

## 环境变量

密钥只从 env 读取，代码和日志里都不会写死或打印。

| 变量 | 用途 |
| --- | --- |
| `ALIYUN_ACCESS_KEY_ID` | 阿里云号码认证服务的 AccessKey ID |
| `ALIYUN_ACCESS_KEY_SECRET` | 对应的 AccessKey Secret，只用于请求签名 |
| `SMS_SIGN_NAME` | 短信签名，线上为「恒创联众」 |
| `SMS_TEMPLATE_CODE` | 短信模板编号，线上为 `100001` |
| `SMS_TEMPLATE_PARAM` | 可选。模板参数 JSON，默认 `{"code":"##code##","min":"5"}` |
| `SESSION_SECRET` | 会话 cookie 的 HMAC 密钥。缺失时无法登录 |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile 站点密钥，经 `/api/config` 给前端 |
| `TURNSTILE_SECRET` | Turnstile 服务端校验密钥。与站点密钥成对配置后，发码前必须通过人机验证 |
| `WECHAT_APPID` | 微信开放平台网站应用的 AppID |
| `WECHAT_SECRET` | 该应用的 AppSecret，只在用 code 换 openid 时使用 |
| `SMS_MOCK` | 仅本地。设为 `1` 时不调用阿里云，并在发码响应里返回 `devCode`。线上不要设置 |

四个阿里云变量缺任一，`POST /api/sms/send` 返回「短信服务尚未开通」。`WECHAT_APPID` 或 `WECHAT_SECRET` 缺失时，微信接口返回「微信绑定即将开通」。
