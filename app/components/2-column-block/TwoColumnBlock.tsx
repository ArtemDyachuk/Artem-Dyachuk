import Image from 'next/image';
import Link from 'next/link';
import styles from './TwoColumnBlock.module.css';
import DownloadResumeButton from '../resume/download/DownloadResumeButton';

interface WorkHistoryItem {
  yearRange: string;
  title: string;
  company: string;
  href?: string;
}

interface TwoColumnBlockProps {
  imageUrl?: string;
  imageAlt?: string;
  name: string;
  intro: string;
  location?: string;
  showResumeButton?: boolean;
  resumeDownloadFilename?: string;
  workHistory?: WorkHistoryItem[];
}

export default function TwoColumnBlock({
  imageUrl,
  imageAlt = '',
  name,
  intro,
  location,
  showResumeButton = false,
  resumeDownloadFilename,
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
            unoptimized={/^https?:\/\//.test(imageUrl)}
          />
          {showResumeButton && (
            <div className={styles.resumeSection}>
              <DownloadResumeButton
                variant="primary"
                size="medium"
                fullWidth
                downloadFilename={resumeDownloadFilename}
              />
            </div>
          )}
        </div>
      )}
      <div className={styles.rightCol}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.intro}>{intro}</p>
        {location && <p className={styles.location}>{location}</p>}
        <div className={styles.workHistorySection}>
          <h2 className={styles.workHistoryTitle}>Where I&rsquo;ve Worked</h2>
          <ul className={styles.workHistoryList}>
            {workHistory?.map((item, idx) => {
              const content = (
                <>
                  <div className={styles.jobInfo}>
                    <span className={styles.jobTitle}>{item.title}</span>
                    <span className={styles.company}>{item.company}</span>
                  </div>
                  <span className={styles.yearRange}>{item.yearRange}</span>
                </>
              );

              return (
                <li key={idx} className={styles.workHistoryItem}>
                  {item.href ? (
                    <Link href={item.href} className={styles.workHistoryLink}>
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
} 