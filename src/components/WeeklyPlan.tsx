import {
  Card,
  Table,
  Typography,
  Descriptions,
  Tag,
  Button,
  Empty,
  Space,
  Alert,
} from "antd";
import { Link } from "umi";
import type { PlanData } from "@/types/plan";
import { getWeekData, parseWeekRange, type WeekData } from "@/utils/plan-utils";

const { Title, Paragraph, Text } = Typography;

const strengthColumns = [
  { title: "动作名称", dataIndex: "name", key: "name" },
  { title: "组数 × 次数", dataIndex: "setsReps", key: "setsReps" },
  { title: "起始重量", dataIndex: "startingWeight", key: "startingWeight" },
];

const sessionColumns = [
  { title: "训练类型", dataIndex: "type", key: "type" },
  { title: "每周次数", dataIndex: "times", key: "times" },
  { title: "时长(分)", dataIndex: "duration", key: "duration" },
  { title: "速度(km/h)", dataIndex: "speed", key: "speed" },
  { title: "坡度(%)", dataIndex: "incline", key: "incline" },
  { title: "间歇说明", dataIndex: "intervals", key: "intervals" },
];

interface WeeklyPlanProps {
  plan: PlanData;
  weekNum: number;
}

export default function WeeklyPlan({ plan, weekNum }: WeeklyPlanProps) {
  const data: WeekData | null = getWeekData(plan, weekNum);

  if (!data) {
    return (
      <div style={{ maxWidth: 700 }}>
        <Link to="/plans">
          <Button type="link" style={{ padding: 0, marginBottom: 16 }}>
            ← 返回计划总览
          </Button>
        </Link>
        <Empty description={`未找到第 ${weekNum} 周的数据`} />
      </div>
    );
  }

  const { phase, cardioEntry } = data;
  const cardio = phase.cardio;
  const strength = phase.strength;
  const recovery = phase.recovery;
  const [phaseStart, phaseEnd] = parseWeekRange(phase.phase);

  return (
    <div style={{ maxWidth: 700 }}>
      <Link to="/plans">
        <Button type="link" style={{ padding: 0, marginBottom: 12 }}>
          ← 返回计划总览
        </Button>
      </Link>

      <Title level={2} style={{ marginBottom: 4 }}>
        第{weekNum}周
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 20 }}>
        {phase.phase} — {phase.objective}
      </Paragraph>

      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {/* Cardio Section */}
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

            {cardioEntry && (
              <Descriptions
                size="small"
                bordered
                column={2}
                style={{ marginBottom: 12 }}
              >
                <Descriptions.Item label="时长">
                  {cardioEntry.duration_minutes} 分钟
                </Descriptions.Item>
                <Descriptions.Item label="速度">
                  {cardioEntry.speed_kmh} km/h
                </Descriptions.Item>
                <Descriptions.Item label="坡度">
                  {cardioEntry.incline_percent}%
                </Descriptions.Item>
                {cardioEntry.interval_example && (
                  <Descriptions.Item label="间歇示例" span={2}>
                    {cardioEntry.interval_example}
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}

            {!cardioEntry && cardio.structure && cardio.structure.length > 0 && (
              <>
                <Text strong style={{ marginBottom: 8, display: "block" }}>
                  本周训练类型:
                </Text>
                <Table
                  size="small"
                  columns={sessionColumns}
                  dataSource={cardio.structure.map((s, i) => ({
                    key: i,
                    type: <Tag>{s.type}</Tag>,
                    times: String(s.times_per_week),
                    duration: String(s.duration_minutes),
                    speed: s.speed_kmh ? String(s.speed_kmh) : "-",
                    incline: s.incline_percent
                      ? String(s.incline_percent)
                      : "-",
                    intervals: s.intervals || "-",
                  }))}
                  pagination={false}
                  style={{ marginBottom: 12 }}
                />
              </>
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

        {/* Strength Section */}
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
                      频率:{" "}
                      <Text strong>{strength.frequency_per_week}次/周</Text>
                    </>
                  )}
                  {strength.interval_days && (
                    <Text type="secondary">
                      {" "}
                      | 间隔: {strength.interval_days}
                    </Text>
                  )}
                  {strength.equipment && (
                    <Text type="secondary">
                      {" "}
                      | 器械: {strength.equipment}
                    </Text>
                  )}
                </Paragraph>

                {strength.exercises && strength.exercises.length > 0 && (
                  <>
                    <Text
                      strong
                      style={{ marginBottom: 8, display: "block" }}
                    >
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
                      <Text
                        strong
                        style={{ marginBottom: 8, display: "block" }}
                      >
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

        {/* Recovery Section */}
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

        {/* Phase Expected Result */}
        {phase.expected_result && (
          <Card size="small" title="阶段目标">
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
          </Card>
        )}
      </Space>
    </div>
  );
}
