import { describe, it, expect } from "vitest";
import { validateAndNormalizePlan } from "@/services/index";

describe("validateAndNormalizePlan", () => {
  it("accepts a valid snake_case plan", () => {
    const plan = {
      goal: "test",
      principles: ["p1"],
      phases: [{ phase: "p1", objective: "o1" }],
      weekly_recovery_rules: ["r1"],
      red_flags: ["f1"],
    };
    const r = validateAndNormalizePlan(plan);
    expect(r.valid).toBe(true);
    expect(r.plan!.goal).toBe("test");
  });

  it("accepts camelCase and normalizes to snake_case", () => {
    const plan = {
      goal: "test",
      principles: ["p1"],
      phases: [
        {
          phase: "Phase 1",
          objective: "obj",
          cardio: {
            frequencyPerWeek: "5 days",
            restDays: "1 day",
            weeklyPlans: [
              {
                weeks: "1-2",
                durationMinutes: 30,
                speedKmh: 3.5,
                inclinePercent: 1,
              },
            ],
          },
          expectedResult: {
            weightLossKg: "4-7",
            cumulativeWeightLossKg: "8-12",
          },
        },
      ],
      weeklyRecoveryRules: ["r1"],
      redFlags: ["f1"],
    };
    const r = validateAndNormalizePlan(plan);
    expect(r.valid).toBe(true);
    expect(r.plan!.goal).toBe("test");

    const phase = r.plan!.phases[0];
    expect(phase.cardio!.frequency_per_week).toBe("5 days");
    expect(phase.cardio!.rest_days).toBe("1 day");
    expect(phase.expected_result!.weight_loss_kg).toBe("4-7");
    expect(phase.expected_result!.cumulative_weight_loss_kg).toBe("8-12");

    // weeklyPlans -> plan
    expect(phase.cardio!.plan).toBeDefined();
    expect(phase.cardio!.plan!.length).toBe(1);
  });

  it("unwraps { content: string } arrays to string[]", () => {
    const plan = {
      goal: "test",
      principles: [{ content: "p1" }, { content: "p2" }],
      phases: [{ phase: "p1", objective: "o1" }],
      weekly_recovery_rules: [{ content: "r1" }],
      red_flags: [{ content: "f1" }],
    };
    const r = validateAndNormalizePlan(plan);
    expect(r.valid).toBe(true);
    expect(r.plan!.principles).toEqual(["p1", "p2"]);
    expect(r.plan!.weekly_recovery_rules).toEqual(["r1"]);
    expect(r.plan!.red_flags).toEqual(["f1"]);
  });

  it("rejects missing goal", () => {
    const r = validateAndNormalizePlan({
      principles: [],
      phases: [],
      weekly_recovery_rules: [],
      red_flags: [],
    });
    expect(r.valid).toBe(false);
    expect(r.errors!.some((e) => e.includes("goal"))).toBe(true);
  });

  it("rejects missing phases", () => {
    const r = validateAndNormalizePlan({
      goal: "test",
      principles: [],
      weekly_recovery_rules: [],
      red_flags: [],
    });
    expect(r.valid).toBe(false);
    expect(r.errors!.some((e) => e.includes("phases"))).toBe(true);
  });

  it("rejects non-array principles", () => {
    const r = validateAndNormalizePlan({
      goal: "test",
      principles: "not an array",
      phases: [],
      weekly_recovery_rules: [],
      red_flags: [],
    });
    expect(r.valid).toBe(false);
    expect(r.errors!.some((e) => e.includes("principles"))).toBe(true);
  });

  it("rejects invalid JSON root types", () => {
    expect(validateAndNormalizePlan(null).valid).toBe(false);
    expect(validateAndNormalizePlan(42).valid).toBe(false);
    expect(validateAndNormalizePlan("hello").valid).toBe(false);
    expect(validateAndNormalizePlan([]).valid).toBe(false);
  });

  it("accepts empty phases array", () => {
    const r = validateAndNormalizePlan({
      goal: "test",
      principles: [],
      phases: [],
      weekly_recovery_rules: [],
      red_flags: [],
    });
    expect(r.valid).toBe(true);
  });

  it("validates phase fields are strings", () => {
    const r = validateAndNormalizePlan({
      goal: "test",
      principles: [],
      phases: [{ phase: 123, objective: 456 }],
      weekly_recovery_rules: [],
      red_flags: [],
    });
    expect(r.valid).toBe(false);
  });
});
