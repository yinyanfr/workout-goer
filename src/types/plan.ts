// Types matching the structure of examples/plans.json (snake_case keys)

export interface CardioWeekItem {
  weeks?: string;
  week?: number;
  duration_minutes: number | string;
  speed_kmh: number | string;
  incline_percent: number | string;
  notes?: string[];
  interval_example?: string;
}

export interface CardioSessionItem {
  type: string;
  times_per_week: number | string;
  duration_minutes: number | string;
  speed_kmh?: number | string;
  incline_percent?: number | string;
  intervals?: string;
}

export interface CardioOptional {
  elliptical?: string;
}

export interface CardioData {
  frequency_per_week?: string;
  rest_days?: string;
  plan?: CardioWeekItem[];
  structure?: CardioSessionItem[];
  notes?: string[];
  optional?: CardioOptional;
  warning?: string;
}

export interface StrengthExerciseItem {
  name: string;
  sets_reps: string;
  starting_weight?: string;
  starting_point?: string;
}

export interface StrengthData {
  status?: string;
  reason?: string;
  frequency_per_week?: number | string;
  interval_days?: string;
  equipment?: string;
  exercises?: StrengthExerciseItem[];
  rules?: string[];
  progression?: string;
  added_exercises?: StrengthExerciseItem[];
  structure?: string;
  weight_rule?: string;
}

export interface RecoveryData {
  weekly_rest_days?: number;
  active_recovery?: string;
  foam_rolling?: string;
  sleep?: string;
}

export interface ExpectedResultData {
  weight_loss_kg?: string;
  cumulative_weight_loss_kg?: string;
  expected_weight_kg?: string;
}

export interface PhaseData {
  phase: string;
  objective: string;
  cardio?: CardioData;
  strength?: StrengthData;
  recovery?: RecoveryData;
  expected_result?: ExpectedResultData;
}

export interface PlanData {
  goal: string;
  principles: string[];
  phases: PhaseData[];
  weekly_recovery_rules: string[];
  red_flags: string[];
}
