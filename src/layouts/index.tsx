import { Link, Outlet } from "umi";
import { ConfigProvider, theme, App } from "antd";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { I18nProvider, useI18n } from "@/hooks/useI18n";
import ThemeSwitch, {
  loadTheme,
  applyTheme,
  type Theme,
} from "@/components/ThemeSwitch";
import LocaleSelect from "@/components/LocaleSelect";
import UserMenu from "@/components/UserMenu";
import type { Locale } from "@/locales/index";

import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import frFR from "antd/locale/fr_FR";
import jaJP from "antd/locale/ja_JP";
import styles from "./index.less";

const antdLocales = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "fr-FR": frFR,
  "ja-JP": jaJP,
};

function AppShell() {
  const { locale, setLocale, t } = useI18n();
  const [mode, setMode] = useState<Theme>(loadTheme);

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  return (
    <ConfigProvider
      locale={antdLocales[locale]}
      theme={{
        algorithm:
          mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brand}>
            Workout Goer
          </Link>
          <div className={styles.links}>
            <Link to="/" className={styles.link}>
              {t("nav.home")}
            </Link>
            <Link to="/plans" className={styles.link}>
              {t("nav.plans")}
            </Link>
          </div>
          <div className={styles.actions}>
            <UserMenu />
            <LocaleSelect locale={locale} onChange={setLocale} />
            <ThemeSwitch theme={mode} onChange={setMode} />
          </div>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <span>Made by <a href="https://github.com/yinyanfr" target="_blank" rel="noopener noreferrer">Yan</a> · </span>
        <a href="https://github.com/yinyanfr/workout-goer" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
      </App>
    </ConfigProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <I18nProvider>
        <AppShell />
      </I18nProvider>
    </AuthProvider>
  );
}
