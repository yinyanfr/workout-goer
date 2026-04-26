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
import { useMemo } from "react";
import { useI18n } from "@/hooks/useI18n";
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

function PhaseHeader({ phase, index }: { phase: PhaseData; index: number }) {
  const { t } = useI18n();
  const expected = phase.expected_result;

  return (
    <Space wrap>
      <Text strong>
        {t("plans.phaseLabel", { n: index + 1 })}: {phase.phase}
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
  const { t } = useI18n();
  const cardio = phase.cardio;
  const strength = phase.strength;
  const recovery = phase.recovery;

  const cardioWeekColumns = useMemo(
    () => [
      { title: t("table.week"), dataIndex: "weekLabel", key: "weekLabel" },
      { title: t("table.duration"), dataIndex: "duration", key: "duration" },
      { title: t("table.speed"), dataIndex: "speed", key: "speed" },
      { title: t("table.incline"), dataIndex: "incline", key: "incline" },
      { title: t("table.note"), dataIndex: "note", key: "note" },
      { title: t("table.action"), dataIndex: "action", key: "action", width: 100 },
    ],
    [t],
  );

  const cardioSessionColumns = useMemo(
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

  const strengthColumns = useMemo(
    () => [
      { title: t("table.name"), dataIndex: "name", key: "name" },
      { title: t("table.setsReps"), dataIndex: "setsReps", key: "setsReps" },
      { title: t("table.startingWeight"), dataIndex: "startingWeight", key: "startingWeight" },
    ],
    [t],
  );

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
      <Card size="small" title={t("plans.objective")}>
        <Paragraph style={{ marginBottom: 4 }}>{phase.objective}</Paragraph>
        {phase.expected_result && (
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
        )}
      </Card>

      {cardio && (
        <Card size="small" title={t("plans.cardio")}>
          {cardio.frequency_per_week && (
            <Paragraph style={{ marginBottom: 8 }}>
              {t("cardio.frequency")}:{" "}
              <Text strong>{cardio.frequency_per_week}</Text>
              {cardio.rest_days && (
                <Text type="secondary">
                  {" "}
                  | {t("cardio.rest")}: {cardio.rest_days}
                </Text>
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
                  action: startWeek > 0 ? (
                    <Link to={`/plans/${startWeek}`}>
                      <Button size="small" type="link">
                        {t("table.viewDetail")}
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
              {t("cardio.notes")}: {cardio.notes.join("; ")}
            </Paragraph>
          )}

          {cardio.optional?.elliptical && (
            <Paragraph type="secondary" style={{ marginBottom: 4 }}>
              {t("cardio.elliptical")}: {cardio.optional.elliptical}
            </Paragraph>
          )}

          {cardio.warning && (
            <Alert
              title={cardio.warning}
              type="warning"
              showIcon
              style={{ marginTop: 8 }}
            />
          )}
        </Card>
      )}

      {strength && (
        <Card size="small" title={t("plans.strength")}>
          {strength.status ? (
            <Paragraph>
              {t("strength.status")}: <Tag>{strength.status}</Tag>
              {strength.reason && (
                <Text type="secondary"> — {strength.reason}</Text>
              )}
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
              <Descriptions.Item label={t("recovery.sleep")}>
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
  const { t } = useI18n();

  const phaseItems = plan.phases.map((phase, index) => ({
    key: `phase-${index}`,
    label: <PhaseHeader phase={phase} index={index} />,
    children: <PhaseDetail phase={phase} />,
  }));

  const summaryItems: Array<{ key: string; label: React.ReactNode; children: React.ReactNode }> = [];

  if (plan.principles.length > 0) {
    summaryItems.push({
      key: "principles",
      label: <Text strong>{t("plans.principles")}</Text>,
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
      label: <Text strong>{t("plans.recoveryRules")}</Text>,
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
      label: <Text strong style={{ color: "#ff4d4f" }}>{t("plans.redFlags")}</Text>,
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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
      <Title level={2} style={{ marginBottom: 4 }}>
        {plan.goal}
      </Title>
      <Text type="secondary" style={{ marginBottom: 20, display: "block" }}>
        {t("plans.phasesCount", { n: plan.phases.length })}
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
