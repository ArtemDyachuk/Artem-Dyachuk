import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

const DEFAULT_NAME = 'Artem Dyachuk';
const DEFAULT_HEADLINE = 'Lead Software Engineer & Product Manager';
const DEFAULT_SUMMARY =
  "As a Lead Software Engineer & Product Manager based in Dallas, I bring 8+ years of experience building impactful digital solutions and scalable cloud architectures. I specialize in cloud architecture, full-stack development, and technical product management, currently leading engineering initiatives at AT&T's Connected Solutions department. My expertise spans IoT solutions, cloud infrastructure design, and product strategy, combining hands-on coding with strategic business leadership.";
const DEFAULT_AVATAR = '/avatars/artem-dyachuk-xs-crop.webp';

interface HeroProps {
  /** Owner name from the resume-tailor account; falls back to the bundled default. */
  name?: string;
  /** Professional headline from the resume-tailor profile. */
  headline?: string;
  /** Professional summary from the resume-tailor profile. */
  summary?: string;
  /** Presigned avatar URL from the resume-tailor account; falls back to the bundled image. */
  avatarUrl?: string | null;
}

const Hero = ({ name, headline, summary, avatarUrl }: HeroProps) => {
  const displayName = name?.trim() || DEFAULT_NAME;
  const displayHeadline = headline?.trim() || DEFAULT_HEADLINE;
  const displaySummary = summary?.trim() || DEFAULT_SUMMARY;
  const avatarSrc = avatarUrl?.trim() || DEFAULT_AVATAR;
  const usingRemoteAvatar = Boolean(avatarUrl?.trim());

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.avatarContainer}>
            <Image
              src={avatarSrc}
              alt={displayName}
              width={150}
              height={150}
              className={styles.avatar}
              priority
              unoptimized={usingRemoteAvatar}
            />
          </div>
          <h1 className={styles.heroTitle}>{displayName}</h1>
          <h2 className={styles.heroSubtitle}>{displayHeadline}</h2>
          <p className={styles.heroDescription}>{displaySummary}</p>
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
              <div className={styles.statNumber}>$500K</div>
              <div className={styles.statLabel}>Cost Savings Achieved</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>4+</div>
              <div className={styles.statLabel}>Years in Product Management</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>8+</div>
              <div className={styles.statLabel}>Years Building Digital Solutions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 