import { Typography, Card, Table, Divider, Space, Tag } from "antd";
import { useI18n } from "@/hooks/useI18n";

const { Title, Paragraph, Text } = Typography;

const TOP_FIELDS = [
  { field: "goal", type: "string", required: "是", desc: "整体训练目标，例如「半年减脂与体能提升」" },
  { field: "principles", type: "string[]", required: "是", desc: "训练原则列表，每条一个字符串" },
  { field: "phases", type: "Phase[]", required: "是", desc: "训练阶段数组，至少包含一个阶段" },
  { field: "weekly_recovery_rules", type: "string[]", required: "是", desc: "每周恢复规则列表，每条一个字符串" },
  { field: "red_flags", type: "string[]", required: "是", desc: "风险提示列表，每条一个字符串" },
];

const PHASE_FIELDS = [
  { field: "phase", type: "string", desc: "阶段名称，例如「第1-4周」" },
  { field: "objective", type: "string", desc: "阶段目标，例如「建立基线，减少极端疲劳」" },
  { field: "cardio", type: "Cardio?", desc: "有氧训练安排，可选" },
  { field: "strength", type: "Strength?", desc: "力量训练安排，可选" },
  { field: "recovery", type: "Recovery?", desc: "恢复与休息安排，可选" },
  { field: "expected_result", type: "ExpectedResult?", desc: "预期结果，可选" },
];

const CARDIO_FIELDS = [
  { field: "frequency_per_week", type: "string", desc: "每周训练频率，例如「5-6天」" },
  { field: "rest_days", type: "string?", desc: "休息日安排，例如「至少1天完全休息」" },
  { field: "plan", type: "CardioWeek[]?", desc: "按周推进的计划。每个元素有 weeks(周次范围)、duration_minutes(时长)、speed_kmh(速度)、incline_percent(坡度)、interval_example(间歇示例,可选)" },
  { field: "structure", type: "CardioSession[]?", desc: "结构化训练安排。每个元素有 type(类型名)、times_per_week(每周次数)、duration_minutes、speed_kmh、incline_percent、intervals(间歇说明)" },
  { field: "notes", type: "string[]?", desc: "额外说明" },
  { field: "optional", type: "object?", desc: "可选替代方式，如 { elliptical: '...' }" },
  { field: "warning", type: "string?", desc: "风险或限制说明" },
];

const STRENGTH_FIELDS = [
  { field: "status", type: "string?", desc: "当前安排状态，例如「暂不安排」" },
  { field: "frequency_per_week", type: "number | string", desc: "每周训练次数" },
  { field: "interval_days", type: "string?", desc: "训练间隔天数说明" },
  { field: "equipment", type: "string?", desc: "器械或训练设备" },
  { field: "exercises", type: "Exercise[]?", desc: "基础动作列表。每个元素有 name(动作名)、sets_reps(组数×次数)、starting_weight(起始重量,可选)" },
  { field: "added_exercises", type: "Exercise[]?", desc: "本阶段新增动作列表" },
  { field: "rules", type: "string[]?", desc: "训练执行规则" },
  { field: "progression", type: "string?", desc: "进阶方式说明" },
  { field: "structure", type: "string?", desc: "训练结构说明" },
  { field: "weight_rule", type: "string?", desc: "加重规则说明" },
];

const RECOVERY_FIELDS = [
  { field: "weekly_rest_days", type: "number?", desc: "每周完全休息天数" },
  { field: "active_recovery", type: "string?", desc: "主动恢复内容" },
  { field: "foam_rolling", type: "string?", desc: "泡沫轴放松说明" },
  { field: "sleep", type: "string?", desc: "睡眠要求" },
];

const EXPECTED_FIELDS = [
  { field: "weight_loss_kg", type: "string?", desc: "本阶段预计减重范围，例如「4-7」" },
  { field: "cumulative_weight_loss_kg", type: "string?", desc: "累计预计减重范围" },
  { field: "expected_weight_kg", type: "string?", desc: "预计体重范围" },
];

const tableColumns = [
  { title: "字段名", dataIndex: "field", key: "field", render: (v: string) => <Text code>{v}</Text> },
  { title: "类型", dataIndex: "type", key: "type", width: 140 },
  { title: "必填", dataIndex: "required", key: "required", width: 60, render: (v: string) => v ? <Tag color="blue">是</Tag> : <Tag>否</Tag> },
  { title: "说明", dataIndex: "desc", key: "desc" },
];

export default function HelpPage() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>
      <Title level={2}>健身计划 JSON 格式说明</Title>
      <Paragraph type="secondary" style={{ marginBottom: 32 }}>
        本页详细说明了可被 Workout Goer 导入的健身计划 JSON 格式。支持 snake_case（推荐）和 camelCase 两种命名风格。
      </Paragraph>

      <Card size="small" title="如何生成 JSON" style={{ marginBottom: 24 }}>
        <Paragraph>
          你可以使用任意 AI 工具（如 ChatGPT、Gemini、Claude）来生成健身计划 JSON。将以下提示词发送给 AI：
        </Paragraph>
        <Paragraph
          copyable
          style={{
            background: "rgba(255,255,255,0.04)",
            padding: 16,
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: 13,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
{`你是一个严格的健身计划结构化抽取器。根据用户的健身需求，输出一个合法 JSON 对象。

硬性规则：
1. 只输出 JSON，不要输出任何解释或 Markdown
2. 字段名必须完全一致，区分大小写
3. 不要编造用户未提及的信息
4. 所有可提取的信息都应拆成原子项
5. 不要把多个动作、周次、规则合并成一条
6. 如果字段缺失：字符串用 ""，数组用 []

目标结构：见下方说明。`}
        </Paragraph>
      </Card>

      <Title level={3} style={{ marginTop: 32 }}>顶层字段</Title>
      <Table
        size="small"
        columns={tableColumns}
        dataSource={TOP_FIELDS.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        style={{ marginBottom: 32 }}
      />

      <Title level={3}>Phase（阶段）</Title>
      <Paragraph type="secondary">每个阶段包含一个训练周期的完整安排。</Paragraph>
      <Table
        size="small"
        columns={tableColumns.filter(c => c.key !== "required")}
        dataSource={PHASE_FIELDS.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        style={{ marginBottom: 32 }}
      />

      <Title level={3}>Cardio（有氧训练）</Title>
      <Table
        size="small"
        columns={tableColumns.filter(c => c.key !== "required")}
        dataSource={CARDIO_FIELDS.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        style={{ marginBottom: 32 }}
      />

      <Title level={3}>Strength（力量训练）</Title>
      <Table
        size="small"
        columns={tableColumns.filter(c => c.key !== "required")}
        dataSource={STRENGTH_FIELDS.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        style={{ marginBottom: 32 }}
      />

      <Title level={3}>Recovery（恢复与休息）</Title>
      <Table
        size="small"
        columns={tableColumns.filter(c => c.key !== "required")}
        dataSource={RECOVERY_FIELDS.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        style={{ marginBottom: 32 }}
      />

      <Title level={3}>Expected Result（预期结果）</Title>
      <Table
        size="small"
        columns={tableColumns.filter(c => c.key !== "required")}
        dataSource={EXPECTED_FIELDS.map((f, i) => ({ ...f, key: i }))}
        pagination={false}
        style={{ marginBottom: 32 }}
      />

      <Divider />

      <Title level={3}>完整示例</Title>
      <Paragraph type="secondary">
        以下是一个最短有效的 JSON 示例：
      </Paragraph>
      <Paragraph
        copyable
        style={{
          background: "rgba(255,255,255,0.04)",
          padding: 16,
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
        }}
      >
{`{
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
}`}
      </Paragraph>

      <Paragraph type="secondary" style={{ marginTop: 24 }}>
        提示：cardio.plan 用于按周推进的训练，cardio.structure 用于按类型分配（主力日/间歇日/轻松日）。
        两者可以同时存在或只使用一种。strength 可以为空对象 {} 表示暂不安排力量训练。
      </Paragraph>
    </div>
  );
}
