# 健身计划 JSON 格式说明

本文档描述 Workout Goer 接受的 JSON 训练计划格式。导入器**同时支持驼峰（camelCase）和下划线（snake_case）命名**——存储格式为 snake_case。

## 快速开始

将以下提示词发送给任意 AI 工具（ChatGPT、Gemini、Claude）：

```
你是一个严格的健身计划结构化抽取器。根据用户输入的健身需求，输出一个合法 JSON 对象。

硬性规则：
1. 只输出 JSON，不要输出解释、Markdown、代码块
2. 严格按照下方结构输出，字段名区分大小写
3. 不要编造用户未提及的信息
4. 所有可提取的信息都应拆成原子项
5. 不要把多个动作、周次、规则合并成一条
6. 字段缺失时：字符串用 ""，数组用 []，可选对象省略不写
7. 原文中的数值、范围、频率、阶段、动作、风险、恢复要求必须保留
8. 原文内容不完整时，输出空值，不要补充臆测内容
```

## 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `goal` | `string` | 是 | 整体训练目标，如「半年减脂与体能提升」 |
| `principles` | `string[]` | 是 | 训练原则列表 |
| `phases` | `Phase[]` | 是 | 训练阶段数组（至少一个） |
| `weekly_recovery_rules` | `string[]` | 是 | 每周恢复规则 |
| `red_flags` | `string[]` | 是 | 风险提示 |

## Phase（阶段）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phase` | `string` | 是 | 阶段名称，如「第1-4周」 |
| `objective` | `string` | 是 | 阶段目标 |
| `cardio` | `Cardio?` | 否 | 有氧训练安排 |
| `strength` | `Strength?` | 否 | 力量训练安排 |
| `recovery` | `Recovery?` | 否 | 恢复与休息安排 |
| `expected_result` | `ExpectedResult?` | 否 | 预期结果 |

## Cardio（有氧训练）

| 字段 | 类型 | 说明 |
|------|------|------|
| `frequency_per_week` | `string` | 每周频率，如「5-6天」 |
| `rest_days` | `string` | 休息日说明 |
| `plan` | `CardioWeek[]` | 按周推进的计划。每项含：`weeks`（如「第1-2周」）或 `week`（如 9）、`duration_minutes`（时长）、`speed_kmh`（速度）、`incline_percent`（坡度）、可选的 `interval_example`（间歇示例） |
| `structure` | `CardioSession[]` | 结构化训练类型。每项含：`type`（如「主力日」）、`times_per_week`（每周次数）、`duration_minutes`、可选的 `speed_kmh`、`incline_percent`、`intervals` |
| `notes` | `string[]` | 额外说明 |
| `optional` | `object` | 替代方案，如 `{ "elliptical": "..." }` |
| `warning` | `string` | 风险提示 |

> `plan` 用于按周推进，`structure` 用于固定训练类型（主力日/间歇日/轻松日）。可同时使用或只用一种。

## Strength（力量训练）

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | `string` | 状态，如「暂不安排」 |
| `frequency_per_week` | `number \| string` | 每周次数 |
| `interval_days` | `string` | 训练间隔 |
| `equipment` | `string` | 器械设备 |
| `exercises` | `Exercise[]` | 基础动作。每项含：`name`（动作名）、`sets_reps`（如「2×12」）、`starting_weight`（起始重量） |
| `added_exercises` | `Exercise[]` | 本阶段新增动作 |
| `rules` | `string[]` | 训练执行规则 |
| `progression` | `string` | 进阶方式 |
| `structure` | `string` | 训练结构说明 |
| `weight_rule` | `string` | 加重规则 |

## Recovery（恢复与休息）

| 字段 | 类型 | 说明 |
|------|------|------|
| `weekly_rest_days` | `number` | 每周完全休息天数 |
| `active_recovery` | `string` | 主动恢复内容 |
| `foam_rolling` | `string` | 泡沫轴放松说明 |
| `sleep` | `string` | 睡眠要求 |

## Expected Result（预期结果）

| 字段 | 类型 | 说明 |
|------|------|------|
| `weight_loss_kg` | `string` | 本阶段预计减重，如「4-7」 |
| `cumulative_weight_loss_kg` | `string` | 累计预计减重 |
| `expected_weight_kg` | `string` | 目标体重 |

## 最简示例

```json
{
  "goal": "半年减脂与体能提升",
  "principles": [
    "保护关节优先于减脂速度",
    "一次只调整一个变量"
  ],
  "phases": [
    {
      "phase": "第1-4周",
      "objective": "建立基线",
      "cardio": {
        "frequency_per_week": "5-6天",
        "plan": [
          {
            "weeks": "第1-2周",
            "duration_minutes": 25,
            "speed_kmh": 3.0,
            "incline_percent": 0
          }
        ]
      },
      "expected_result": {
        "weight_loss_kg": "4-7"
      }
    }
  ],
  "weekly_recovery_rules": [
    "每周1天完全休息"
  ],
  "red_flags": [
    "膝盖持续疼痛"
  ]
}
```

## 驼峰格式支持

如果 AI 输出的字段是驼峰命名（如 `durationMinutes`、`frequencyPerWeek`、`redFlags`），导入器会自动转换为 snake_case。特殊处理：`weeklyPlans` 重命名为 `plan`；数组对象如 `[{ "content": "..." }]` 自动展开为字符串数组。
