"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import companiesData from "../data/companies.json";
import achievementsData from "../data/achievements.json";

interface Achievement {
  id: number;
  companyId: string;
  title: string;
  description: string;
  year: string;
  skills: number[];
}

export default function Achievements() {
  // Sort companies by start date (most recent first)
  const sortedCompanies = [...companiesData].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Group achievements by company
  const achievementsByCompany = sortedCompanies.map((company) => ({
    ...company,
    achievements: (achievementsData as Achievement[])
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

  // Track expanded achievements
  const [expandedAchievements, setExpandedAchievements] = useState<{ [key: number]: boolean }>({});
  // Track which achievements are overflowing
  const [overflowing, setOverflowing] = useState<{ [key: number]: boolean }>({});
  // Refs for each achievement description
  const descriptionRefs = useRef<{ [key: number]: HTMLParagraphElement | null }>({});

  const toggleAchievement = (id: number) => {
    setExpandedAchievements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Check if a description is overflowing
  const checkOverflow = () => {
    const newOverflowing: { [key: number]: boolean } = {};
    Object.entries(descriptionRefs.current).forEach(([id, el]) => {
      if (el && el.scrollHeight > el.clientHeight + 1) {
        newOverflowing[Number(id)] = true;
      }
    });
    setOverflowing(newOverflowing);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [expandedCompany]);

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
                      {company.startDate} - {company.endDate || "Present"}
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
                    {company.achievements.map((achievement) => {
                      const expanded = expandedAchievements[achievement.id];
                      return (
                        <div key={achievement.id} className={styles.achievement}>
                          <h3 className={styles.achievementTitle}>
                            {achievement.title}
                          </h3>
                          <p
                            ref={el => { descriptionRefs.current[achievement.id] = el; }}
                            className={
                              expanded
                                ? styles.achievementDescriptionExpanded
                                : styles.achievementDescriptionClamped
                            }
                          >
                            {achievement.description}
                          </p>
                          {overflowing[achievement.id] && !expanded && (
                            <button
                              style={{ fontSize: "0.85rem", padding: 0, background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", marginBottom: "0.5rem" }}
                              onClick={() => toggleAchievement(achievement.id)}
                            >
                              Read More
                            </button>
                          )}
                          {expanded && (
                            <button
                              style={{ fontSize: "0.85rem", padding: 0, background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", marginBottom: "0.5rem" }}
                              onClick={() => toggleAchievement(achievement.id)}
                            >
                              Show Less
                            </button>
                          )}
                          <span className={styles.achievementYear}>
                            {achievement.year}
                          </span>
                        </div>
                      );
                    })}
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