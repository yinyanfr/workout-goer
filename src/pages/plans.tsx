import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "umi";
import { Button, Typography, Empty, Spin, App } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import {
  getUserPlan,
  saveUserPlan,
  deleteUserPlan,
} from "@/services/index";
import type { PlanData } from "@/types/plan";
import PlanList from "@/components/PlanList";
import PlanImporter from "@/components/PlanImporter";

const { Title, Paragraph, Text } = Typography;

const PlansPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { modal } = App.useApp();

  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [importerOpen, setImporterOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Redirect if not logged in
  if (authLoading) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!user) return null;

  const handleImport = async (imported: PlanData) => {
    await saveUserPlan(user.uid, imported);
    await loadPlan(user.uid);
  };

  const handleDelete = () => {
    if (!user) return;
    modal.confirm({
      title: t("plans.confirmDelete"),
      okText: t("plans.delete"),
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteUserPlan(user.uid);
        setPlan(null);
      },
    });
  };

  // No plan → empty state
  if (!loading && !plan) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "48px 20px" }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Title level={4} style={{ marginBottom: 8 }}>{t("plans.emptyTitle")}</Title>
              <Text type="secondary">{t("plans.emptyHint")}</Text>
            </div>
          }
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setImporterOpen(true)}
            size="large"
          >
            {t("plans.import")}
          </Button>
        </Empty>
        <PlanImporter
          open={importerOpen}
          onClose={() => setImporterOpen(false)}
          onImport={handleImport}
        />
      </div>
    );
  }

  // Plan exists
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "flex-end" }}>
        <Button icon={<PlusOutlined />} onClick={() => setImporterOpen(true)}>
          {t("plans.importNew")}
        </Button>
        <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
          {t("plans.delete")}
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : plan ? (
        <PlanList plan={plan} />
      ) : null}

      <PlanImporter
        open={importerOpen}
        onClose={() => setImporterOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default PlansPage;
