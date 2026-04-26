import { Card, Table, Typography, Descriptions, Tag, Button, Empty, Space, Alert } from "antd";
import { Link } from "umi";
import { useMemo } from "react";
import { useI18n } from "@/hooks/useI18n";
import type { PlanData } from "@/types/plan";
import { getWeekData, type WeekData } from "@/utils/plan-utils";

const { Title, Paragraph, Text } = Typography;

interface WeeklyPlanProps {
  plan: PlanData;
  weekNum: number;
}

export default function WeeklyPlan({ plan, weekNum }: WeeklyPlanProps) {
  const { t } = useI18n();
  const data: WeekData | null = getWeekData(plan, weekNum);

  const strengthColumns = useMemo(
    () => [
      { title: t("table.name"), dataIndex: "name", key: "name" },
      { title: t("table.setsReps"), dataIndex: "setsReps", key: "setsReps" },
      { title: t("table.startingWeight"), dataIndex: "startingWeight", key: "startingWeight" },
    ],
    [t],
  );

  const sessionColumns = useMemo(
    () => [
      { title: t("table.type"), dataIndex: "type", key: "type" },
      { title: t("table.timesPerWeek"), dataIndex: "times", key: "times" },
      { title: t("table.duration"), dataIndex: "duration", key: "duration" },
      { title: t("table.speed"), dataIndex: "speed", key: "speed" },
      { title: t("table.incline"), dataIndex: "incline", key: "incline" },
      { title: t("table.intervals"), dataIndex: "intervals", key: "intervals" },
    ],
    [t],
  );

  if (!data) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
        <Link to="/plans">
          <Button type="link" style={{ padding: 0, marginBottom: 16 }}>
            {t("weekly.back")}
          </Button>
        </Link>
        <Empty description={t("weekly.notFound", { week: weekNum })} />
      </div>
    );
  }

  const { phase, cardioEntry } = data;
  const cardio = phase.cardio;
  const strength = phase.strength;
  const recovery = phase.recovery;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <Link to="/plans">
        <Button type="link" style={{ padding: 0, marginBottom: 12 }}>
          {t("weekly.back")}
        </Button>
      </Link>

      <Title level={2} style={{ marginBottom: 4 }}>
        {t("weekly.weekTitle", { week: weekNum })}
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 20 }}>
        {phase.phase} — {phase.objective}
      </Paragraph>

      <Space orientation="vertical" style={{ width: "100%" }} size="middle">
        {cardio && (
          <Card size="small" title={t("plans.cardio")}>
            {cardio.frequency_per_week && (
              <Paragraph style={{ marginBottom: 8 }}>
                {t("cardio.frequency")}: <Text strong>{cardio.frequency_per_week}</Text>
                {cardio.rest_days && (
                  <Text type="secondary">
                    {" "}
                    | {t("cardio.rest")}: {cardio.rest_days}
                  </Text>
                )}
              </Paragraph>
            )}

            {cardioEntry && (
              <Descriptions size="small" bordered column={2} style={{ marginBottom: 12 }}>
                <Descriptions.Item label={t("table.duration")}>
                  {cardioEntry.duration_minutes} 分钟
                </Descriptions.Item>
                <Descriptions.Item label={t("table.speed")}>
                  {cardioEntry.speed_kmh} km/h
                </Descriptions.Item>
                <Descriptions.Item label={t("table.incline")}>
                  {cardioEntry.incline_percent}%
                </Descriptions.Item>
                {cardioEntry.interval_example && (
                  <Descriptions.Item label={t("table.intervals")} span={2}>
                    {cardioEntry.interval_example}
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}

            {!cardioEntry && cardio.structure && cardio.structure.length > 0 && (
              <>
                <Text strong style={{ marginBottom: 8, display: "block" }}>
                  {t("cardio.sessions")}:
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
                    incline: s.incline_percent ? String(s.incline_percent) : "-",
                    intervals: s.intervals || "-",
                  }))}
                  pagination={false}
                  style={{ marginBottom: 12 }}
                />
              </>
            )}

            {cardio.notes && cardio.notes.length > 0 && (
              <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                {t("cardio.notes")}: {cardio.notes.join("; ")}
              </Paragraph>
            )}

            {cardio.optional?.elliptical && (
              <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                {t("cardio.elliptical")}: {cardio.optional.elliptical}
              </Paragraph>
            )}

            {cardio.warning && (
              <Alert title={cardio.warning} type="warning" showIcon style={{ marginTop: 8 }} />
            )}
          </Card>
        )}

        {strength && (
          <Card size="small" title={t("plans.strength")}>
            {strength.status ? (
              <Paragraph>
                {t("strength.status")}: <Tag>{strength.status}</Tag>
                {strength.reason && <Text type="secondary"> — {strength.reason}</Text>}
              </Paragraph>
            ) : (
              <>
                <Paragraph style={{ marginBottom: 8 }}>
                  {strength.frequency_per_week && (
                    <>
                      {t("strength.frequency")}:{" "}
                      <Text strong>{strength.frequency_per_week}次/周</Text>
                    </>
                  )}
                  {strength.interval_days && (
                    <Text type="secondary">
                      {" "}
                      | {t("strength.interval")}: {strength.interval_days}
                    </Text>
                  )}
                  {strength.equipment && (
                    <Text type="secondary">
                      {" "}
                      | {t("strength.equipment")}: {strength.equipment}
                    </Text>
                  )}
                </Paragraph>

                {strength.exercises && strength.exercises.length > 0 && (
                  <>
                    <Text strong style={{ marginBottom: 8, display: "block" }}>
                      {t("strength.baseExercises")}:
                    </Text>
                    <Table
                      size="small"
                      columns={strengthColumns}
                      dataSource={strength.exercises.map((e, i) => ({
                        key: i,
                        name: e.name,
                        setsReps: e.sets_reps,
                        startingWeight: e.starting_weight || e.starting_point || "-",
                      }))}
                      pagination={false}
                      style={{ marginBottom: 12 }}
                    />
                  </>
                )}

                {strength.added_exercises && strength.added_exercises.length > 0 && (
                  <>
                    <Text strong style={{ marginBottom: 8, display: "block" }}>
                      {t("strength.addedExercises")}:
                    </Text>
                    <Table
                      size="small"
                      columns={strengthColumns}
                      dataSource={strength.added_exercises.map((e, i) => ({
                        key: i,
                        name: e.name,
                        setsReps: e.sets_reps,
                        startingWeight: e.starting_weight || e.starting_point || "-",
                      }))}
                      pagination={false}
                      style={{ marginBottom: 12 }}
                    />
                  </>
                )}

                {strength.rules && strength.rules.length > 0 && (
                  <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                    {t("strength.rules")}: {strength.rules.join("; ")}
                  </Paragraph>
                )}

                {strength.progression && (
                  <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                    {t("strength.progression")}: {strength.progression}
                  </Paragraph>
                )}

                {strength.structure && (
                  <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                    {t("strength.structure")}: {strength.structure}
                  </Paragraph>
                )}

                {strength.weight_rule && (
                  <Paragraph type="secondary" style={{ marginBottom: 4 }}>
                    {t("strength.weightRule")}: {strength.weight_rule}
                  </Paragraph>
                )}
              </>
            )}
          </Card>
        )}

        {recovery && (
          <Card size="small" title={t("plans.recovery")}>
            <Descriptions size="small" column={2}>
              {recovery.weekly_rest_days !== undefined && (
                <Descriptions.Item label={t("recovery.restDays")}>
                  {recovery.weekly_rest_days}天/周
                </Descriptions.Item>
              )}
              {recovery.active_recovery && (
                <Descriptions.Item label={t("recovery.activeRecovery")}>
                  {recovery.active_recovery}
                </Descriptions.Item>
              )}
              {recovery.foam_rolling && (
                <Descriptions.Item label={t("recovery.foamRolling")}>
                  {recovery.foam_rolling}
                </Descriptions.Item>
              )}
              {recovery.sleep && (
                <Descriptions.Item label={t("recovery.sleep")}>{recovery.sleep}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}

        {phase.expected_result && (
          <Card size="small" title={t("plans.expectedResult")}>
            <Descriptions size="small" column={3}>
              {phase.expected_result.weight_loss_kg && (
                <Descriptions.Item label={t("plans.expectedResult")}>
                  {phase.expected_result.weight_loss_kg} kg
                </Descriptions.Item>
              )}
              {phase.expected_result.cumulative_weight_loss_kg && (
                <Descriptions.Item label={t("plans.expectedResult")}>
                  {phase.expected_result.cumulative_weight_loss_kg} kg
                </Descriptions.Item>
              )}
              {phase.expected_result.expected_weight_kg && (
                <Descriptions.Item label={t("plans.expectedResult")}>
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
