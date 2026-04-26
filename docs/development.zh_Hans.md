# 开发指南

## 前置条件

- Node.js 18+
- npm
- 已创建的 Firebase 项目，启用：
  - Authentication（Google 提供商）
  - Cloud Firestore（区域 `eur3`）
  - Hosting（部署用，可选）

## 环境搭建

```bash
git clone https://github.com/yinyanfr/workout-goer.git
cd workout-goer
npm install
```

`npm install` 会触发 `umi setup`，自动生成 `src/.umi/` 目录——这是框架运行时文件，**请勿手动编辑**。

## 开发服务

```bash
npm run dev     # 启动 http://localhost:8000
```

默认开启热更新。本项目直接使用 Firebase 客户端 SDK，无需代理。

## 构建

```bash
npm run build   # 输出到 dist/
```

生产构建由 Firebase Hosting 提供服务。所有路由重写到 `/index.html`（SPA 模式）。

## 项目架构

```
src/
├── components/       # 可复用 UI 组件
│   ├── PlanList.tsx          # 阶段层级（折叠卡片 + 表格）
│   ├── WeeklyPlan.tsx        # 单周详情视图
│   ├── PlanImporter.tsx      # JSON 导入弹窗（含代码编辑器）
│   ├── HeroCanvas.tsx        # 3D 线框画布动画
│   ├── UserMenu.tsx          # Google 登录按钮 / 头像下拉菜单
│   ├── LocaleSelect.tsx      # 语言切换器
│   └── ThemeSwitch.tsx       # 亮暗模式切换
├── hooks/            # React Context 钩子
│   ├── useAuth.tsx           # AuthProvider + useAuth() — Firebase 认证状态
│   └── useI18n.tsx           # I18nProvider + useI18n() — 自定义国际化方案
├── layouts/          # 全局布局
│   └── index.tsx             # AuthProvider → I18nProvider → ConfigProvider → Nav → Outlet → Footer
├── locales/          # 翻译字典
│   ├── index.ts              # LocaleDict 类型 + 语言名映射
│   ├── zh-CN.ts / en-US.ts / fr-FR.ts / ja-JP.ts
├── pages/            # 路由组件（由 .umirc.ts 匹配）
│   ├── index.tsx             # / — 3D 首页
│   ├── plans.tsx             # /plans — 计划总览 + 导入/删除
│   ├── weekly.tsx            # /plans/:week — 单周钻取
│   ├── user.tsx              # /user — 个人资料表单
│   └── help.tsx              # /help — JSON 格式参考
├── services/         # Firebase SDK 封装
│   └── index.ts              # app 初始化、auth、db、CRUD、JSON 校验
├── types/            # TypeScript 类型
│   └── plan.ts               # PlanData, PhaseData 等（snake_case）
├── utils/            # 工具函数
│   └── plan-utils.ts         # getWeekData(), parseWeekRange()
└── examples/         # 参考文件（运行时未使用）
    ├── plans.json            # 示例 24 周计划
    ├── plan.d.ts             # 类型定义（camelCase，设计参考）
    └── prompt.md             # AI 提示词模板
```

## 核心模式

### 路由

路由在 `.umirc.ts` 中显式定义，而非按文件名推断：

```ts
routes: [
  { path: "/", component: "index" },
  { path: "/plans", component: "plans" },
  { path: "/plans/:week", component: "weekly" },
  { path: "/user", component: "user" },
  { path: "/help", component: "help" },
]
```

### Provider 嵌套

全局布局按以下顺序包裹应用：

```
AuthProvider          # Firebase 认证状态
  └─ I18nProvider     # 语言环境
       └─ AppShell    # ConfigProvider（antd 主题 + 语言）→ Nav → Outlet
```

### Firebase 数据模型

```
user/{uid}       # UserProfile: displayName, gender, age, height, weight, bio
plans/{uid}      # PlanData: goal, principles, phases[], ...
```

每位用户仅有一份计划文档。导入新计划会覆盖旧计划。

### i18n

- 自研轻量方案，无三方依赖
- 4 种语言，每种约 70 个 key
- 通过动态 `import()` 按需加载
- key 使用点号分隔：`"plans.principles"`、`"table.week"`
- 支持参数插值：`t("weekly.weekTitle", { week: 5 })` → "第5周"
- 仅翻译 UI 外壳——计划数据内容保持源语言

### 暗色模式

- `<html data-theme="dark|light">` 属性切换 CSS 变量
- antd `ConfigProvider theme.algorithm` 控制组件级主题
- 持久化到 `localStorage`
- 入口：`src/components/ThemeSwitch.tsx`

## Firebase CLI

```bash
npx firebase-tools deploy --project workout-goer     # 完整部署
npx firebase-tools deploy --only hosting              # 仅部署托管
npx firebase-tools deploy --only firestore:rules      # 仅部署规则
```

项目别名在 `.firebaserc` 中配置。
