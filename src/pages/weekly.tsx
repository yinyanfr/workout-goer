import { useParams } from "umi";
import WeeklyPlan from "@/components/WeeklyPlan";
import planData from "@/examples/plans.json";
import type { PlanData } from "@/types/plan";

const plan = planData as PlanData;

const WeeklyPage = () => {
  const params = useParams<{ week?: string }>();
  const weekNum = parseInt(params.week || "0", 10);

  return <WeeklyPlan plan={plan} weekNum={weekNum} />;
};

export default WeeklyPage;
