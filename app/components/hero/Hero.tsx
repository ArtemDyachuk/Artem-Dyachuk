import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.avatarContainer}>
            <Image
              src="/avatars/artem-dyachuk-xs-crop.webp"
              alt="Artem Dyachuk"
              width={150}
              height={150}
              className={styles.avatar}
              priority
            />
          </div>
          <h1 className={styles.heroTitle}>Artem Dyachuk</h1>
          <h2 className={styles.heroSubtitle}>Product Manager & Full-Stack Developer</h2>
          <p className={styles.heroDescription}>
            As a Product Manager & Full-Stack Developer, I bring 3+ years of dedicated product leadership and over a decade of experience building impactful digital solutions. I thrive on transforming product landscapes and spearheading innovation. At Brightland Homes, my work developing core platforms supports over $1B in annual revenue and achieves significant cost efficiencies through strategic initiatives.
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
              <div className={styles.statNumber}>3+</div>
              <div className={styles.statLabel}>Years in Product Management</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10+</div>
              <div className={styles.statLabel}>Years Building Digital Solutions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 