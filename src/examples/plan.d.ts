/**
 * 数值区间的字符串形式。
 * 例如：`"3-5"`。
 */
export type RangeString = `${number}-${number}`;

/**
 * 跑步机速度。
 * 可以是具体数值，也可以是区间字符串。
 */
export type Speed = number | RangeString;

/**
 * 训练时长，单位为分钟。
 * 可以是具体数值，也可以是区间字符串。
 */
export type DurationMinutes = number | RangeString;

/**
 * 坡度百分比。
 * 可以是具体数值，也可以是区间字符串。
 */
export type InclinePercent = number | RangeString;

/**
 * 单条通用文本项。
 * 用于原则、风险提示、恢复规则等场景。
 */
export interface TextItem {
  /** 文本内容 */
  content: string;
}

/**
 * 单个有氧训练周计划。
 */
export interface CardioWeekPlan {
  /** 周次范围，例如：`"第1-2周"` */
  weeks: string;

  /** 每次训练时长，单位分钟 */
  durationMinutes: DurationMinutes;

  /** 跑步机速度，单位 km/h */
  speedKmh: Speed;

  /** 坡度，单位百分比 */
  inclinePercent: InclinePercent;

  /** 可选备注 */
  notes?: string[];

  /** 可选的间歇训练说明 */
  intervalExample?: string;
}

/**
 * 有氧训练结构项。
 * 适合描述主力日、间歇日、轻松日这类固定结构。
 */
export interface CardioSessionPlan {
  /** 训练类型，例如：主力日、间歇日、轻松日 */
  type: string;

  /** 每周次数 */
  timesPerWeek: number;

  /** 每次训练时长，单位分钟 */
  durationMinutes: DurationMinutes;

  /** 速度，单位 km/h */
  speedKmh?: Speed;

  /** 坡度，单位百分比 */
  inclinePercent?: InclinePercent;

  /** 间歇描述 */
  intervals?: string;
}

/**
 * 有氧训练的可选替代方式。
 */
export interface CardioOptions {
  /** 椭圆机替代说明 */
  elliptical?: string;
}

/**
 * 有氧训练计划。
 */
export interface CardioPlan {
  /** 每周训练频率说明 */
  frequencyPerWeek: string;

  /** 每周休息安排说明 */
  restDays?: string;

  /** 按周推进的训练计划 */
  weeklyPlans?: CardioWeekPlan[];

  /** 结构化训练安排 */
  sessions?: CardioSessionPlan[];

  /** 额外说明 */
  notes?: string[];

  /** 可选替代方案 */
  options?: CardioOptions;

  /** 风险或限制说明 */
  warning?: string;
}

/**
 * 单个力量训练动作。
 */
export interface StrengthExercise {
  /** 动作名称 */
  name: string;

  /** 组数与次数，例如：`"2×12"` */
  setsReps: string;

  /** 起始重量建议 */
  startingWeight?: string;
}

/**
 * 力量训练计划。
 */
export interface StrengthPlan {
  /** 当前安排状态，例如：`"暂不安排"` */
  status?: string;

  /** 每周训练次数 */
  frequencyPerWeek?: number;

  /** 训练间隔天数说明 */
  intervalDays?: string;

  /** 器械或训练设备说明 */
  equipment?: string;

  /** 力量训练动作列表 */
  exercises?: StrengthExercise[];

  /** 训练执行规则 */
  rules?: string[];

  /** 进阶方式说明 */
  progression?: string;

  /** 新增动作列表 */
  addedExercises?: StrengthExercise[];

  /** 训练结构说明 */
  structure?: string;

  /** 加重规则说明 */
  weightRule?: string;
}

/**
 * 恢复与休息计划。
 */
export interface RecoveryPlan {
  /** 每周完全休息天数 */
  weeklyRestDays?: number;

  /** 主动恢复内容 */
  activeRecovery?: string;

  /** 泡沫轴放松说明 */
  foamRolling?: string;

  /** 睡眠要求 */
  sleep?: string;
}

/**
 * 阶段目标结果。
 */
export interface ExpectedResult {
  /** 本阶段预计减重范围 */
  weightLossKg?: string;

  /** 累计预计减重范围 */
  cumulativeWeightLossKg?: string;

  /** 预计体重范围 */
  expectedWeightKg?: string;
}

/**
 * 单个训练阶段。
 */
export interface PhasePlan {
  /** 阶段名称 */
  phase: string;

  /** 阶段目标 */
  objective: string;

  /** 有氧训练安排 */
  cardio?: CardioPlan;

  /** 力量训练安排 */
  strength?: StrengthPlan;

  /** 恢复安排 */
  recovery?: RecoveryPlan;

  /** 预期结果 */
  expectedResult?: ExpectedResult;
}

/**
 * 风险提示项。
 */
export interface RedFlagItem {
  /** 风险内容 */
  content: string;
}

/**
 * 每周恢复规则项。
 */
export interface WeeklyRecoveryRuleItem {
  /** 规则内容 */
  content: string;
}

/**
 * 整体运动计划。
 */
export interface WorkoutPlan {
  /** 总体目标 */
  goal: string;

  /** 训练原则列表 */
  principles: TextItem[];

  /** 分阶段计划 */
  phases: PhasePlan[];

  /** 每周恢复规则 */
  weeklyRecoveryRules: WeeklyRecoveryRuleItem[];

  /** 风险提示列表 */
  redFlags: RedFlagItem[];
}
