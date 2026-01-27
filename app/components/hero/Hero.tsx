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
          <h2 className={styles.heroSubtitle}>Lead Software Engineer & Product Manager</h2>
          <p className={styles.heroDescription}>
            As a Lead Software Engineer & Product Manager based in Dallas, I bring 6+ years of experience building impactful digital solutions and scalable cloud architectures. I specialize in cloud architecture, full-stack development, and technical product management, currently leading engineering initiatives at AT&T's Connected Solutions department. My expertise spans IoT solutions, cloud infrastructure design, and product strategy, combining hands-on coding with strategic business leadership.
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
              <div className={styles.statNumber}>6+</div>
              <div className={styles.statLabel}>Years Building Digital Solutions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 