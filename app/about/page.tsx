import type { Metadata } from "next";
import styles from "./page.module.css";
import aboutData from "../data/about.json";
import companiesData from "../data/companies.json";
import TwoColumnBlock from "../components/2-column-block/TwoColumnBlock";
import DownloadResumeButton from "../components/resume/download/DownloadResumeButton";

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Artem Dyachuk, a results-oriented Digital Product Manager with over a decade of experience. Bachelor\'s in Economics and Management, fluent in English, Ukrainian, and Russian.',
  openGraph: {
    title: 'About Artem Dyachuk - Digital Product Manager & Developer',
    description: 'Learn about Artem Dyachuk, a results-oriented Digital Product Manager with over a decade of experience. Bachelor\'s in Economics and Management, fluent in English, Ukrainian, and Russian.',
    url: 'https://artemdyachuk.com/about',
  },
  twitter: {
    title: 'About Artem Dyachuk - Digital Product Manager & Developer',
    description: 'Learn about Artem Dyachuk, a results-oriented Digital Product Manager with over a decade of experience.',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function About() {

  const workHistory = companiesData.map((company) => ({
    yearRange: company.startDate + " - " + (company.endDate || "Present"),
    title: company.jobTitle,
    company: company.name
  }));

  return (
    <main className={styles.main}>
      <TwoColumnBlock
        imageUrl={aboutData.personalInfo.profileImage}
        imageAlt={aboutData.personalInfo.firstName + " " + aboutData.personalInfo.lastName}
        name={aboutData.personalInfo.firstName + " " + aboutData.personalInfo.lastName}
        intro={aboutData.personalInfo.currentRole}
        workHistory={workHistory}
      />
      <section className={styles.about}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {aboutData.personalInfo.firstName} {aboutData.personalInfo.lastName}
            </h1>
            <h2 className={styles.subtitle}>
              {aboutData.personalInfo.currentRole} at {aboutData.personalInfo.currentCompany}
            </h2>
            <p className={styles.location}>{aboutData.personalInfo.location}</p>
            
            {/* Download Resume Button */}
            <div className={styles.resumeSection}>
              <DownloadResumeButton variant="primary" size="medium" />
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.overview}>
              <p className={styles.summary}>{aboutData.summary}</p>

              <div className={styles.education}>
                <h3>Education</h3>
                <p>
                  {aboutData.personalInfo.education.degree} in {aboutData.personalInfo.education.field} ({aboutData.personalInfo.education.year})
                </p>
              </div>

              <div className={styles.languages}>
                <h3>Languages</h3>
                <div className={styles.languageList}>
                  {aboutData.personalInfo.languages.map((language: string) => (
                    <span key={language} className={styles.language}>
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.strengths}>
                <h3>Key Strengths</h3>
                <div className={styles.strengthsList}>
                  {aboutData.keyStrengths.map((strength: string) => (
                    <span key={strength} className={styles.strength}>
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 