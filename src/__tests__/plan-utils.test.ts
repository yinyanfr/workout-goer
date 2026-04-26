import { describe, it, expect } from "vitest";
import { getWeekData, parseWeekRange } from "@/utils/plan-utils";
import type { PlanData } from "@/types/plan";
import examplePlan from "@/examples/plans.json";

const plan = examplePlan as PlanData;

describe("getWeekData", () => {
  it("finds week 1 in phase 1", () => {
    const r = getWeekData(plan, 1);
    expect(r).not.toBeNull();
    expect(r!.phase.phase).toBe("第1-4周");
    expect(r!.phase.objective).toBe("建立基线，减少极端疲劳");
  });

  it("finds week 4 in phase 1", () => {
    const r = getWeekData(plan, 4);
    expect(r).not.toBeNull();
    expect(r!.phase.phase).toBe("第1-4周");
  });

  it("finds week 5 in phase 2", () => {
    const r = getWeekData(plan, 5);
    expect(r).not.toBeNull();
    expect(r!.phase.phase).toBe("第5-8周");
  });

  it("finds week 8 in phase 2", () => {
    const r = getWeekData(plan, 8);
    expect(r).not.toBeNull();
    expect(r!.phase.phase).toBe("第5-8周");
  });

  it("finds week 14 in phase 3", () => {
    const r = getWeekData(plan, 14);
    expect(r).not.toBeNull();
    expect(r!.phase.phase).toBe("第9-16周");
    expect(r!.cardioEntry).not.toBeNull();
    expect(r!.cardioEntry!.interval_example).toBe("平路2分钟/坡3分钟交替");
  });

  it("finds week 20 in phase 4", () => {
    const r = getWeekData(plan, 20);
    expect(r).not.toBeNull();
    expect(r!.phase.phase).toBe("第17-24周");
  });

  it("returns null for week 0", () => {
    expect(getWeekData(plan, 0)).toBeNull();
  });

  it("returns null for week 25", () => {
    expect(getWeekData(plan, 25)).toBeNull();
  });

  it("has cardioEntry for week 5", () => {
    const r = getWeekData(plan, 5);
    expect(r!.cardioEntry).not.toBeNull();
  });

  it("has no cardioEntry for week 17 (structure only)", () => {
    const r = getWeekData(plan, 17);
    expect(r!.cardioEntry).toBeNull();
    expect(r!.phase.cardio?.structure).toBeDefined();
    expect(r!.phase.cardio!.structure!.length).toBeGreaterThan(0);
  });
});

describe("parseWeekRange", () => {
  it("parses phase range", () => {
    expect(parseWeekRange("第1-4周")).toEqual([1, 4]);
    expect(parseWeekRange("第5-8周")).toEqual([5, 8]);
    expect(parseWeekRange("第9-16周")).toEqual([9, 16]);
    expect(parseWeekRange("第17-24周")).toEqual([17, 24]);
  });

  it("returns [0,0] for malformed input", () => {
    expect(parseWeekRange("")).toEqual([0, 0]);
    expect(parseWeekRange("hello")).toEqual([0, 0]);
  });
});
