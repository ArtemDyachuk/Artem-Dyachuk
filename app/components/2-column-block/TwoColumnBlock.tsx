import Image from 'next/image';
import styles from './TwoColumnBlock.module.css';

interface WorkHistoryItem {
  yearRange: string;
  title: string;
  company: string;
}

interface TwoColumnBlockProps {
  imageUrl?: string;
  imageAlt?: string;
  name: string;
  intro: string;
  workHistory?: WorkHistoryItem[];
}

export default function TwoColumnBlock({
  imageUrl,
  imageAlt = '',
  name,
  intro,
  workHistory,
}: TwoColumnBlockProps) {


  return (
    <section className={`${styles.twoColumnBlock} ${!imageUrl ? styles.singleColumn : ''}`}>
      {imageUrl && (
        <div className={styles.leftCol}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={340}
            height={340}
            className={styles.profileImg}
          />
        </div>
      )}
      <div className={styles.rightCol}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.intro}>{intro}</p>
        <div className={styles.workHistorySection}>
          <h2 className={styles.workHistoryTitle}>Where I&rsquo;ve Worked</h2>
          <ul className={styles.workHistoryList}>
            {workHistory?.map((item, idx) => (
              <li key={idx} className={styles.workHistoryItem}>
                <div className={styles.jobInfo}>
                  <span className={styles.jobTitle}>{item.title}</span>
                  <span className={styles.company}>{item.company}</span>
                </div>
                <span className={styles.yearRange}>{item.yearRange}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
} 