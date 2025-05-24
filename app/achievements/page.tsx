"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import companiesData from "../data/companies.json";
import achievementsData from "../data/achievements.json";

export default function Achievements() {
  // Sort companies by start year (most recent first)
  const sortedCompanies = [...companiesData.companies].sort(
    (a, b) => (Number(b.startMonthYear) || 0) - (Number(a.startMonthYear) || 0)
  );

  // Group achievements by company
  const achievementsByCompany = sortedCompanies.map((company) => ({
    ...company,
    achievements: achievementsData.achievements
      .filter((achievement) => achievement.companyId === company.id)
      .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)),
  }));

  // Always expand the first company on initial load
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  useEffect(() => {
    if (achievementsByCompany.length > 0) {
      setExpandedCompany(achievementsByCompany[0].id);
    }
  }, []); // Only run on mount

  const toggleCompany = (companyId: string) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);
  };

  return (
    <main className={styles.main}>
      <section className={styles.achievements}>
        <div className={styles.container}>
          <h1 className={styles.title}>Key Achievements</h1>

          <div className={styles.achievementsList}>
            {achievementsByCompany.map((company) => (
              <div key={company.id} className={styles.companyGroup}>
                <button
                  className={`${styles.companyHeader} ${expandedCompany === company.id ? styles.expanded : ""
                    }`}
                  onClick={() => toggleCompany(company.id)}
                >
                  <div className={styles.companyInfo}>
                    <h2 className={styles.companyName}>{company.name}</h2>
                    <span className={styles.companyJobTitle}>{company.jobTitle}</span>
                    <span className={styles.companyYears}>
                      {company.startMonthYear} - {company.endMonthYear || "Present"}
                    </span>
                  </div>
                  <span className={styles.achievementCount}>
                    {company.achievements.length} Achievements
                  </span>
                  <span className={styles.expandIcon}>
                    {expandedCompany === company.id ? "−" : "+"}
                  </span>
                </button>

                {expandedCompany === company.id && (
                  <div className={styles.achievementsColumn}>
                    {company.achievements.map((achievement) => (
                      <div key={achievement.id} className={styles.achievement}>
                        <h3 className={styles.achievementTitle}>
                          {achievement.title}
                        </h3>
                        <p className={styles.achievementDescription}>
                          {achievement.description}
                        </p>
                        <span className={styles.achievementYear}>
                          {achievement.year}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 