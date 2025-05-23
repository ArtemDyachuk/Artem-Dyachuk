"use client";

import styles from "../page.module.css";
import companiesData from "../data/companies.json";
import achievementsData from "../data/achievements.json";

export default function Roles() {
  // Sort companies by start year (most recent first)
  const sortedCompanies = [...companiesData.companies].sort(
    (a, b) => b.startYear - a.startYear
  );

  // Group achievements by company
  const achievementsByCompany = sortedCompanies.map((company) => ({
    ...company,
    achievements: achievementsData.achievements
      .filter((achievement) => achievement.companyId === company.id)
      .sort((a, b) => b.year - a.year),
  }));

  return (
    <main className={styles.main}>
      <section className={styles.experiencePreview}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>Professional Journey</h1>
          <div className={styles.experienceGrid}>
            {achievementsByCompany.map((company) => (
              <div key={company.id} className={styles.experienceCard}>
                <h3>{company.jobTitle}</h3>
                <p className={styles.company}>{company.name}{company.location ? `, ${company.location}` : ""}</p>
                <p className={styles.period}>
                  {company.startYear} - {company.endYear || "Present"}
                </p>
                <ul className={styles.highlights}>
                  {company.achievements.map((achievement) => (
                    <li key={achievement.id}>{achievement.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 