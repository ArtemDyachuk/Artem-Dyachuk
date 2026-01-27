import type { Metadata } from "next";
import styles from "./page.module.css";
import aboutData from "../data/about.json";
import companiesData from "../data/companies.json";
import TwoColumnBlock from "../components/2-column-block/TwoColumnBlock";
import Philosophy from "../components/philosophy/Philosophy";

export const metadata: Metadata = {
  title: 'About',
  description: 'About Artem Dyachuk - Lead Software Engineer and Technical Product Manager in Dallas, Texas. 6+ years of experience in cloud architecture, software engineering, full-stack development, and IoT solutions. Currently at AT&T Connected Solutions.',
  openGraph: {
    title: 'About Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'About Artem Dyachuk - Lead Software Engineer and Technical Product Manager in Dallas, Texas. 6+ years of experience in cloud architecture, software engineering, full-stack development, and IoT solutions. Currently at AT&T Connected Solutions.',
    url: 'https://www.artemdyachuk.com/about',
  },
  twitter: {
    title: 'About Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Learn about Artem Dyachuk, a results-oriented Lead Software Engineer with 6+ years of experience.',
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
        location={aboutData.personalInfo.location}
        showResumeButton={false}
        workHistory={workHistory}
      />
      <Philosophy 
        intro={aboutData.philosophy.intro}
        principles={aboutData.philosophy.principles}
      />
      <section className={styles.about}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.overview}>

              <h2 className={styles.subtitle}>About Me</h2>
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