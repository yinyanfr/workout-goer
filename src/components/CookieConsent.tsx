import { useState, useEffect } from "react";
import { Button } from "antd";
import { useI18n } from "@/hooks/useI18n";

const COOKIE_CONSENT_KEY = "cookie_consent";

function hasConsented(): boolean {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "1";
  } catch {
    return false;
  }
}

function setConsented(): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, "1");
  } catch {
    // ignore
  }
}

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsented()) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setConsented();
    setVisible(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: "var(--nav-bg)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid var(--nav-border)",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        flexWrap: "wrap",
        fontSize: 13,
        color: "var(--link-color)",
        textAlign: "center",
      }}
    >
      <span style={{ maxWidth: 640, lineHeight: 1.6 }}>{t("cookie.text")}</span>
      <Button type="primary" size="small" onClick={handleAccept}>
        {t("cookie.accept")}
      </Button>
    </div>
  );
}
