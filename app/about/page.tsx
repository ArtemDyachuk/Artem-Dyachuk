import styles from "./page.module.css";
import aboutData from "../data/about.json";

export default function About() {
  return (
    <main className={styles.main}>
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