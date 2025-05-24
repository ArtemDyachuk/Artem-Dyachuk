import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Artem Dyachuk</h1>
            <h2 className={styles.heroSubtitle}>Product Manager & Full-Stack Developer</h2>
            <p className={styles.heroDescription}>
              A result-oriented Product Manager with over a decade of experience transforming digital marketing efforts and product landscapes. 
              Currently driving innovation at Brightland Homes, where I&apos;ve developed software solutions supporting over $1 billion in annual revenue 
              and achieved significant cost savings through strategic initiatives.
            </p>
            <div className={styles.ctaContainer}>
              <Link href="/achievements" className={styles.ctaButton}>
                View My Achievements
              </Link>
              <Link href="/experience" className={styles.secondaryButton}> 
                Explore Experience
              </Link>
            </div>
            
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>$1B+</div>
                <div className={styles.statLabel}>Annual Revenue Supported</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>$425K</div>
                <div className={styles.statLabel}>Cost Savings Achieved</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10+</div>
                <div className={styles.statLabel}>Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
