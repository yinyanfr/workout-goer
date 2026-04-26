import { useEffect, useState } from "react";
import { Link } from "umi";
import { Card, Form, Input, InputNumber, Select, Button, Avatar, Typography, message } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { getUserProfile, saveUserProfile, type UserProfile } from "@/services/index";

const { Title, Text } = Typography;
const { TextArea } = Input;

const GENDER_OPTIONS = [
  { value: "male", labelKey: "Male" },
  { value: "female", labelKey: "Female" },
  { value: "other", labelKey: "Other" },
  { value: "prefer_not_to_say", labelKey: "Prefer not to say" },
];

const GENDER_LABELS: Record<string, Record<string, string>> = {
  male: {
    "zh-CN": "男",
    "en-US": "Male",
    "fr-FR": "Homme",
    "ja-JP": "男性",
  },
  female: {
    "zh-CN": "女",
    "en-US": "Female",
    "fr-FR": "Femme",
    "ja-JP": "女性",
  },
  other: {
    "zh-CN": "其他",
    "en-US": "Other",
    "fr-FR": "Autre",
    "ja-JP": "その他",
  },
  prefer_not_to_say: {
    "zh-CN": "不愿透露",
    "en-US": "Prefer not to say",
    "fr-FR": "Préfère ne pas dire",
    "ja-JP": "回答しない",
  },
};

export default function UserPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, locale } = useI18n();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((p) => {
      if (p) {
        setProfile(p);
        form.setFieldsValue(p);
      } else {
        form.setFieldsValue({ displayName: user.displayName || "" });
      }
    });
  }, [user, form]);

  if (authLoading) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "48px 20px" }}>
        <Text type="secondary">Loading...</Text>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: "48px 20px",
          textAlign: "center",
        }}
      >
        <Title level={3}>{t("user.loginRequired")}</Title>
        <Link to="/">
          <Button type="primary">{t("nav.home")}</Button>
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await saveUserProfile(user.uid, values);
      message.success(t("user.saved"));
      setProfile({ ...profile, ...values } as UserProfile);
    } catch (err) {
      console.error(err);
      // validation failed
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "48px 20px" }}>
      <Card styles={{ body: { padding: 32 } }} style={{ textAlign: "center" }}>
        <Avatar src={user.photoURL} size={72} style={{ marginBottom: 16 }}>
          {user.displayName?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <Title level={3} style={{ marginBottom: 8 }}>
          {user.displayName}
        </Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 28 }}>
          {user.email}
        </Text>

        <Form
          form={form}
          layout="vertical"
          size="large"
          initialValues={{
            displayName: user.displayName || "",
          }}
        >
          <Form.Item label={t("user.displayName")} name="displayName">
            <Input />
          </Form.Item>

          <Form.Item label={t("user.gender")} name="gender">
            <Select
              allowClear
              placeholder={t("user.gender")}
              options={GENDER_OPTIONS.map((opt) => ({
                value: opt.value,
                label: GENDER_LABELS[opt.value]?.[locale] ?? opt.labelKey,
              }))}
            />
          </Form.Item>

          <Form.Item label={t("user.age")} name="age">
            <InputNumber min={1} max={150} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label={t("user.height")} name="height">
            <InputNumber min={50} max={300} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label={t("user.weight")} name="weight">
            <InputNumber min={20} max={500} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label={t("user.bio")} name="bio">
            <TextArea rows={4} placeholder={t("user.bio")} />
          </Form.Item>

          <Button
            type="primary"
            block
            loading={saving}
            onClick={handleSave}
            size="large"
            style={{ marginTop: 8 }}
          >
            {saving ? t("user.saving") : t("user.save")}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
