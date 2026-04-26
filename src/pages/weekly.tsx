import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "umi";
import { Spin, Empty } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { getUserPlan } from "@/services/index";
import type { PlanData } from "@/types/plan";
import WeeklyPlan from "@/components/WeeklyPlan";

const WeeklyPage = () => {
  const params = useParams<{ week?: string }>();
  const weekNum = parseInt(params.week || "0", 10);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = useCallback(async (uid: string) => {
    setLoading(true);
    try {
      const p = await getUserPlan(uid);
      setPlan(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/user", { replace: true });
      return;
    }
    loadPlan(user.uid);
  }, [user, authLoading, loadPlan, navigate]);

  if (authLoading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!user) return null;

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px" }}>
        <Empty description="No plan found. Import a plan first." />
      </div>
    );
  }

  return <WeeklyPlan plan={plan} weekNum={weekNum} />;
};

export default WeeklyPage;
