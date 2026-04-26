import { Link } from "umi";
import { Button, Avatar, Dropdown, Space } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function UserMenu() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return <div style={{ width: 32 }} />;
  }

  if (!user) {
    return (
      <Button
        onClick={signInWithGoogle}
        icon={<GoogleIcon />}
        style={{
          borderColor: "rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.85)",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 8,
          height: 34,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {t("nav.signIn")}
      </Button>
    );
  }

  return (
    <Dropdown
      placement="bottomRight"
      menu={{
        items: [
          {
            key: "profile",
            label: <Link to="/user">{t("nav.profile")}</Link>,
          },
          { type: "divider" },
          {
            key: "signout",
            label: t("nav.signOut"),
            onClick: signOut,
          },
        ],
      }}
    >
      <Button
        type="text"
        style={{
          color: "rgba(255,255,255,0.85)",
          height: 34,
          padding: "0 8px",
          fontSize: 13,
        }}
      >
        <Space size={8}>
          <Avatar src={user.photoURL} size={24} style={{ flexShrink: 0 }}>
            {user.displayName?.charAt(0) || "U"}
          </Avatar>
          <span>{user.displayName || "User"}</span>
        </Space>
      </Button>
    </Dropdown>
  );
}
