# Workout Goer 🏃

**AI 帮你想，你只管练。**

Workout Goer 是一个可视化 AI 健身计划的 Web 应用。你把 AI 工具（ChatGPT、Gemini 等）生成的 JSON 计划粘贴进来，就能看到结构清晰的、可按周钻取的有氧+力量+恢复训练安排。

### [在线使用](https://workout-goer.web.app)

---

## 功能

- 🔐 **Google 登录**（Firebase Auth）— 每人一个独立账号
- 📋 **计划可视化** — 4 个训练阶段，折叠卡片展示有氧/力量/恢复表格
- 📅 **周视图** — 点击任一周次，查看该周具体训练参数
- ✍️ **JSON 导入** — 粘贴 AI 生成的 JSON，自带代码编辑器（语法高亮 + 行号）
- 📖 **/help 帮助页** — 完整 JSON 格式说明，含字段表和示例
- 🌙 **暗色模式** — 一键切换，持久化到 localStorage
- 🌍 **四国语言** — 简体中文 / English / Français / 日本語
- 🎨 **3D 首页** — 旋转线框环面 + DNA 螺旋 + 粒子场，纯 Canvas 2D，零依赖
- 👤 **个人资料** — 身高、体重、年龄、自我介绍，存储到 Firestore
- 📱 **响应式** — 手机和电脑都能用

## 技术栈

| 层 | 技术 |
|-------|-----------|
| 框架 | [UmiJS v4](https://umijs.org/) (React) |
| UI | [antd v6](https://ant.design/) |
| 认证 & 数据库 | [Firebase](https://firebase.google.com/) (Auth + Firestore) |
| 托管 | [Firebase Hosting](https://firebase.google.com/products/hosting) |
| 样式 | Less + CSS Variables |
| 3D | Canvas 2D + 数学计算（无三方库） |
| i18n | 自研轻量方案（零依赖） |

## 快速上手

### 前置条件

- Node.js 18+
- npm
- 已创建 Firebase 项目（启用 Firestore 和 Google 登录）

### 安装 & 运行

```bash
git clone https://github.com/yinyanfr/workout-goer.git
cd workout-goer
npm install          # 同时运行 umi setup（生成 src/.umi/）
npm run dev          # 启动开发服务器 http://localhost:8000
```

### 构建 & 部署

```bash
npm run build        # 输出到 dist/
firebase deploy      # 部署到 Firebase Hosting
```

### Firebase 配置

1. 在 [console.firebase.google.com](https://console.firebase.google.com/) 创建项目
2. 开启 **Authentication** → Google 提供商
3. 开启 **Cloud Firestore**，区域选 `eur3`
4. 将 `src/services/index.ts` 中的 Firebase 配置替换为你自己的
5. 部署 Firestore 规则：`firebase deploy --only firestore:rules`

## 使用流程

1. 右上角点 **Google 登录**
2. 用 AI 工具生成健身计划 JSON — 格式说明见[帮助页](https://workout-goer.web.app/help)
3. 进入 **/plans** → 点击「导入计划」→ 粘贴 JSON（支持驼峰和下划线两种格式）
4. 浏览你的计划 — 4 个阶段，点击周次查看详情
5. 在 **/user** 编辑个人资料

## 项目结构

```
src/
├── components/      # PlanList, WeeklyPlan, PlanImporter, HeroCanvas, UserMenu 等
├── hooks/           # useAuth, useI18n
├── layouts/         # 全局布局：Auth → i18n → ConfigProvider → Nav → Outlet → Footer
├── locales/         # 四国语言翻译文件（每种 55+ 个 key）
├── pages/           # index, plans, weekly, user, help
├── services/        # Firebase 初始化、Auth、Firestore CRUD、JSON 校验
├── types/           # plan.ts（snake_case，对应 plans.json）
├── utils/           # plan-utils（周次查找）
├── examples/        # plans.json, plan.d.ts, prompt.md（设计参考）
├── global.d.ts      # 全局类型声明
└── .umi/            # Umi 自动生成（请勿手动修改）
```

## 许可证

MIT — 详见 [LICENSE](./LICENSE)
