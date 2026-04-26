import PlanList from "@/components/PlanList";
import planData from "@/examples/plans.json";
import type { PlanData } from "@/types/plan";

const plan = planData as PlanData;

const PlansPage = () => {
  return <PlanList plan={plan} />;
};

export default PlansPage;
