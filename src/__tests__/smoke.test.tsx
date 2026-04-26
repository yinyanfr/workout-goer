import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlanList from "@/components/PlanList";
import WeeklyPlan from "@/components/WeeklyPlan";
import type { PlanData } from "@/types/plan";

// mock i18n hook
vi.mock("@/hooks/useI18n", () => ({
  I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  useI18n: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (params) {
        let s = key;
        for (const [k, v] of Object.entries(params)) s = s.replace(`{${k}}`, String(v));
        return s;
      }
      return key;
    },
    locale: "zh-CN" as const,
    setLocale: vi.fn(),
  }),
}));

// mock umi Link
vi.mock("umi", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
  useParams: () => ({ week: "5" }),
}));

const mockPlan: PlanData = {
  goal: "Test Goal",
  principles: ["P1", "P2"],
  phases: [
    {
      phase: "第1-4周",
      objective: "Test Objective",
      cardio: {
        frequency_per_week: "5天",
        plan: [
          {
            weeks: "第1-2周",
            duration_minutes: 25,
            speed_kmh: 3.0,
            incline_percent: 0,
          },
        ],
      },
      strength: {
        status: "暂不安排",
      },
      expected_result: {
        weight_loss_kg: "4-7",
      },
    },
  ],
  weekly_recovery_rules: ["R1"],
  red_flags: ["F1"],
};

describe("PlanList", () => {
  it("renders plan goal", () => {
    render(<PlanList plan={mockPlan} />);
    expect(screen.getByText("Test Goal")).toBeTruthy();
  });

  it("renders phase header", () => {
    render(<PlanList plan={mockPlan} />);
    expect(screen.getByText(/第1-4周/)).toBeTruthy();
  });

  it("renders cardio plan table", () => {
    render(<PlanList plan={mockPlan} />);
    expect(screen.getByText("第1-2周")).toBeTruthy();
  });
});

describe("WeeklyPlan", () => {
  it("renders week title", () => {
    render(<WeeklyPlan plan={mockPlan} weekNum={2} />);
    expect(screen.getByText("weekly.weekTitle")).toBeTruthy();
  });

  it("renders back link", () => {
    render(<WeeklyPlan plan={mockPlan} weekNum={2} />);
    expect(screen.getByText("weekly.back")).toBeTruthy();
  });
});
