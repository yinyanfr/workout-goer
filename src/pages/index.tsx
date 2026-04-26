import { Link } from "umi";
import HeroCanvas from "@/components/HeroCanvas";
import styles from "./index.less";

export default function HomePage() {
  return (
    <>
      <HeroCanvas />

      <div className={styles.container}>
        <h1 className={styles.title}>Workout Goer</h1>
        <p className={styles.subtitle}>
          AI帮你思考，你只负责练
        </p>
        <Link to="/plans" className={styles.cta}>
          查看计划 →
        </Link>
      </div>

      <div className={styles.footer}>v0.1 · 仅供娱乐</div>

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
