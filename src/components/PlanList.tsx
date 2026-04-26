import {
  Collapse,
  Table,
  Tag,
  Card,
  Typography,
  Space,
  Descriptions,
  Alert,
  Button,
} from "antd";
import { Link } from "umi";
import type { ReactNode } from "react";
import type { PlanData, PhaseData, CardioWeekItem } from "@/types/plan";

const { Title, Paragraph, Text } = Typography;

interface PlanListProps {
  plan: PlanData;
}

function formatWeekLabel(item: CardioWeekItem): {
  label: string;
  startWeek: number;
} {
  if (item.week !== undefined) {
    return { label: `第${item.week}周`, startWeek: item.week };
  }
  if (item.weeks) {
    const match = item.weeks.match(/第?(\d+)(?:-(\d+))?周?/);
    if (match) {
      const start = parseInt(match[1]);
      return { label: item.weeks, startWeek: start };
    }
    return { label: item.weeks, startWeek: 0 };
  }
  return { label: "", startWeek: 0 };
}

function getPhaseWeekRange(phase: PhaseData): [number, number] {
  const match = phase.phase.match(/第?(\d+)(?:-(\d+))?周?/);
  if (match) {
    return [
      parseInt(match[1]),
      match[2] ? parseInt(match[2]) : parseInt(match[1]),
    ];
  }
  return [0, 0];
}

const cardioWeekColumns = [
  { title: "周次", dataIndex: "weekLabel", key: "weekLabel" },
  { title: "时长(分)", dataIndex: "duration", key: "duration" },
  { title: "速度(km/h)", dataIndex: "speed", key: "speed" },
  { title: "坡度(%)", dataIndex: "incline", key: "incline" },
  { title: "备注", dataIndex: "note", key: "note" },
  { title: "", dataIndex: "action", key: "action", width: 100 },
];

const cardioSessionColumns = [
  { title: "训练类型", dataIndex: "type", key: "type" },
  { title: "每周次数", dataIndex: "times", key: "times" },
  { title: "时长(分)", dataIndex: "duration", key: "duration" },
  { title: "速度(km/h)", dataIndex: "speed", key: "speed" },
  { title: "坡度(%)", dataIndex: "incline", key: "incline" },
  { title: "间歇说明", dataIndex: "intervals", key: "intervals" },
];

const strengthColumns = [
  { title: "动作名称", dataIndex: "name", key: "name" },
  { title: "组数 × 次数", dataIndex: "setsReps", key: "setsReps" },
  { title: "起始重量", dataIndex: "startingWeight", key: "startingWeight" },
];

function PhaseHeader({ phase, index }: { phase: PhaseData; index: number }) {
  const [, weekEnd] = getPhaseWeekRange(phase);
  const expected = phase.expected_result;
  return (
    <Space wrap>
      <Text strong>
        阶段 {index + 1}: {phase.phase}
      </Text>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {phase.objective}
      </Text>
      {expected?.weight_loss_kg && (
        <Tag color="blue">减重 {expected.weight_loss_kg}kg</Tag>
      )}
      {expected?.cumulative_weight_loss_kg && (
        <Tag color="green">累计减重 {expected.cumulative_weight_loss_kg}kg</Tag>
      )}
    </Space>
  );
}

function PhaseDetail({ phase }: { phase: PhaseData }) {
  const cardio = phase.cardio;
  const strength = phase.strength;
  const recovery = phase.recovery;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Card size="small" title="目标">
        <Paragraph style={{ marginBottom: 4 }}>{phase.objective}</Paragraph>
        {phase.expected_result && (
          <Descriptions size="small" column={3}>
            {phase.expected_result.weight_loss_kg && (
              <Descriptions.Item label="本阶段减重">
                {phase.expected_result.weight_loss_kg} kg
              </Descriptions.Item>
            )}
            {phase.expected_result.cumulative_weight_loss_kg && (
              <Descriptions.Item label="累计减重">
                {phase.expected_result.cumulative_weight_loss_kg} kg
              </Descriptions.Item>
            )}
            {phase.expected_result.expected_weight_kg && (
              <Descriptions.Item label="目标体重">
                {phase.expected_result.expected_weight_kg} kg
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Card>

      {cardio && (
        <Card size="small" title="有氧训练">
          {cardio.frequency_per_week && (
            <Paragraph style={{ marginBottom: 8 }}>
              频率: <Text strong>{cardio.frequency_per_week}</Text>
              {cardio.rest_days && (
                <Text type="secondary"> | 休息: {cardio.rest_days}</Text>
              )}
            </Paragraph>
          )}

          {cardio.plan && cardio.plan.length > 0 && (
            <Table
              size="small"
              columns={cardioWeekColumns}
              dataSource={cardio.plan.map((item, i) => {
                const { label, startWeek } = formatWeekLabel(item);
                return {
                  key: i,
                  weekLabel: label,
                  duration: String(item.duration_minutes),
                  speed: String(item.speed_kmh),
                  incline: String(item.incline_percent),
                  note: item.interval_example || "-",
                  action:
                    startWeek > 0 ? (
                      <Link to={`/plans/${startWeek}`}>
                        <Button size="small" type="link">
                          查看
                        </Button>
                      </Link>
                    ) : null,
                };
              })}
              pagination={false}
              style={{ marginBottom: 12 }}
            />
          )}

          {cardio.structure && cardio.structure.length > 0 && (
            <Table
              size="small"
              columns={cardioSessionColumns}
              dataSource={cardio.structure.map((s, i) => ({
                key: i,
                type: <Tag>{s.type}</Tag>,
                times: String(s.times_per_week),
                duration: String(s.duration_minutes),
                speed: s.speed_kmh ? String(s.speed_kmh) : "-",
                incline: s.incline_percent ? String(s.incline_percent) : "-",
                intervals: s.intervals || "-",
              }))}
              pagination={false}
              style={{ marginBottom: 12 }}
            />
          )}

          {cardio.notes && cardio.notes.length > 0 && (
            <Paragraph type="secondary" style={{ marginBottom: 4 }}>
              备注: {cardio.notes.join("; ")}
            </Paragraph>
          )}

          {cardio.optional?.elliptical && (
            <Paragraph type="secondary" style={{ marginBottom: 4 }}>
              椭圆机替代: {cardio.optional.elliptical}
            </Paragraph>
          )}

          {cardio.warning && (
            <Alert
              message={cardio.warning}
              type="warning"
              showIcon
              style={{ marginTop: 8 }}
            />
          )}
        </Card>
      )}

      {strength && (
        <Card size="small" title="力量训练">
          {strength.status ? (
            <Paragraph>
              状态: <Tag>{strength.status}</Tag>
              {strength.reason && (
                <Text type="secondary"> — {strength.reason}</Text>
              )}
            </Paragraph>
          ) : (
            <>
              <Paragraph style={{ marginBottom: 8 }}>
                {strength.frequency_per_week && (
                  <>
                    频率: <Text strong>{strength.frequency_per_week}次/周</Text>
                  </>
                )}
                {strength.interval_days && (
                  <Text type="secondary">
                    {" "}
                    | 间隔: {strength.interval_days}
                  </Text>
                )}
                {strength.equipment && (
                  <Text type="secondary"> | 器械: {strength.equipment}</Text>
                )}
              </Paragraph>

              {strength.exercises && strength.exercises.length > 0 && (
                <>
                  <Text strong style={{ marginBottom: 8, display: "block" }}>
                    基础动作:
                  </Text>
                  <Table
                    size="small"
                    columns={strengthColumns}
                    dataSource={strength.exercises.map((e, i) => ({
                      key: i,
                      name: e.name,
                      setsReps: e.sets_reps,
                      startingWeight:
                        e.starting_weight || e.starting_point || "-",
                    }))}
                    pagination={false}
                    style={{ marginBottom: 12 }}
                  />
                </>
              )}

              {strength.added_exercises &&
                strength.added_exercises.length > 0 && (
                  <>
                    <Text strong style={{ marginBottom: 8, display: "block" }}>
                      新增动作:
                    </Text>
                    <Table
                      size="small"
                      columns={strengthColumns}
                      dataSource={strength.added_exercises.map((e, i) => ({
                        key: i,
                        name: e.name,
                        setsReps: e.sets_reps,
                        startingWeight:
                          e.starting_weight || e.starting_point || "-",
                      }))}
                      pagination={false}
                      style={{ marginBottom: 12 }}
                    />
                  </>
                )}

              {strength.rules && strength.rules.length > 0 && (
                <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                  规则: {strength.rules.join("; ")}
                </Paragraph>
              )}

              {strength.progression && (
                <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                  进阶: {strength.progression}
                </Paragraph>
              )}

              {strength.structure && (
                <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                  结构: {strength.structure}
                </Paragraph>
              )}

              {strength.weight_rule && (
                <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                  加重: {strength.weight_rule}
                </Paragraph>
              )}
            </>
          )}
        </Card>
      )}

      {recovery && (
        <Card size="small" title="恢复与休息">
          <Descriptions size="small" column={2}>
            {recovery.weekly_rest_days !== undefined && (
              <Descriptions.Item label="完全休息">
                {recovery.weekly_rest_days}天/周
              </Descriptions.Item>
            )}
            {recovery.active_recovery && (
              <Descriptions.Item label="主动恢复">
                {recovery.active_recovery}
              </Descriptions.Item>
            )}
            {recovery.foam_rolling && (
              <Descriptions.Item label="泡沫轴放松">
                {recovery.foam_rolling}
              </Descriptions.Item>
            )}
            {recovery.sleep && (
              <Descriptions.Item label="睡眠">
                {recovery.sleep}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}
    </Space>
  );
}

export default function PlanList({ plan }: PlanListProps) {
  const phaseItems = plan.phases.map((phase, index) => ({
    key: `phase-${index}`,
    label: <PhaseHeader phase={phase} index={index} />,
    children: <PhaseDetail phase={phase} />,
  }));

  const summaryItems: Array<{ key: string; label: ReactNode; children: ReactNode }> = [];

  if (plan.principles.length > 0) {
    summaryItems.push({
      key: "principles",
      label: <Text strong>训练原则</Text>,
      children: (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {plan.principles.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      ),
    });
  }
  if (plan.weekly_recovery_rules.length > 0) {
    summaryItems.push({
      key: "recovery-rules",
      label: <Text strong>每周恢复规则</Text>,
      children: (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {plan.weekly_recovery_rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      ),
    });
  }
  if (plan.red_flags.length > 0) {
    summaryItems.push({
      key: "red-flags",
      label: (
        <Text strong style={{ color: "#ff4d4f" }}>
          风险提示
        </Text>
      ),
      children: (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {plan.red_flags.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      ),
    });
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        {plan.goal}
      </Title>
      <Text type="secondary" style={{ marginBottom: 20, display: "block" }}>
        {plan.phases.length} 个阶段
      </Text>

      {summaryItems.length > 0 && (
        <Collapse
          size="small"
          style={{ marginBottom: 16 }}
          items={summaryItems}
        />
      )}

      <Collapse
        size="small"
        items={phaseItems}
        defaultActiveKey={phaseItems.map((p) => p.key)}
      />
    </div>
  );
}
