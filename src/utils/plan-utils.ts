import type { PlanData, PhaseData, CardioWeekItem } from "@/types/plan";

export interface WeekData {
  phase: PhaseData;
  cardioEntry: CardioWeekItem | null;
}

/**
 * Find the phase containing a given week number, and the specific cardio entry for that week.
 * Returns null if weekNum is out of range.
 */
export function getWeekData(
  plan: PlanData,
  weekNum: number,
): WeekData | null {
  const phase = plan.phases.find((p) => {
    const match = p.phase.match(/第?(\d+)-(\d+)周?/);
    if (match) {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      return weekNum >= start && weekNum <= end;
    }
    return false;
  });

  if (!phase) return null;

  let cardioEntry: CardioWeekItem | null = null;
  if (phase.cardio?.plan) {
    for (const item of phase.cardio.plan) {
      if (item.week === weekNum) {
        cardioEntry = item;
        break;
      }
      if (item.weeks) {
        const match = item.weeks.match(/第?(\d+)(?:-(\d+))?周?/);
        if (match) {
          const start = parseInt(match[1]);
          const end = match[2] ? parseInt(match[2]) : start;
          if (weekNum >= start && weekNum <= end) {
            cardioEntry = item;
            break;
          }
        }
      }
    }
  }

  return { phase, cardioEntry };
}

/**
 * Parse week numbers from a Chinese week range string like "第1-4周"
 */
export function parseWeekRange(phaseName: string): [number, number] {
  const match = phaseName.match(/第?(\d+)-(\d+)周?/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2])];
  }
  return [0, 0];
}
