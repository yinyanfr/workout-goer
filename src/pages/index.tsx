import { Link } from "umi";
import { useI18n } from "@/hooks/useI18n";
import HeroCanvas from "@/components/HeroCanvas";
import styles from "./index.less";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <HeroCanvas />

      <div className={styles.container}>
        <h1 className={styles.title}>Workout Goer</h1>
        <p className={styles.subtitle}>{t("landing.subtitle")}</p>
        <Link to="/plans" className={styles.cta}>
          {t("landing.cta")}
        </Link>
      </div>

      <div className={styles.footer}>{t("landing.footer")}</div>

      <a
        className={styles.github}
        href="https://github.com/anomalyco/workout-goer"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub ↗
      </a>
    </>
  );
}
