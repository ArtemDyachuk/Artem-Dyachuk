"use client";

import { useState } from "react";
import styles from "./page.module.css";
import companiesData from "../data/companies.json";
import achievementsData from "../data/achievements.json";
import skillsData from "../data/skills.json";

// Note: Since this is a client component, we need to export metadata from a separate file
// or convert this to a server component. For now, I'll add it here but it won't work in client components.
// You'll need to either:
// 1. Convert this to a server component, or
// 2. Create a separate layout.tsx file in the experience folder

interface Achievement {
  id: number;
  companyId: string;
  title: string;
  description: string;
  year: string;
  skills: number[];
}

interface JobDuty {
  title: string;
  description: string;
}

interface Company {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  location: string;
  jobTitle: string;
  jobDuties: JobDuty[];
  achievements: number[];
}

interface Skill {
  id: number;
  title: string;
  type: string;
  description: string;
  order: number;
}

export default function Experience() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Map skill ID to title for quick lookup
  const skillMap = new Map<number, string>(
    (skillsData as Skill[]).map((skill) => [skill.id, skill.title])
  );

  // Sort companies by start date (most recent first)
  const sortedCompanies = [...(companiesData as Company[])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Get achievements for a company
  const getCompanyAchievements = (company: Company) => {
    return (achievementsData as Achievement[])
      .filter(achievement => company.achievements.includes(achievement.id))
      .sort((a, b) => company.achievements.indexOf(a.id) - company.achievements.indexOf(b.id));
  };

  return (
    <main className={styles.main}>
      <section className={styles.experience}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>Professional Experience</h1>
          {sortedCompanies.map((company) => {
            const companyAchievements = getCompanyAchievements(company);
            return (
              <div key={company.id} className={styles.accordionItem}>
                <button
                  onClick={() => toggleAccordion(company.id)}
                  className={`${styles.accordionButton} ${activeAccordion === company.id ? styles.active : ""}`}
                >
                  <div className={styles.accordionHeader}>
                    <span className={styles.roleTitle}>{company.jobTitle}</span>
                    <span className={styles.companyInfo}>{company.name}, {company.location}</span>
                    <span className={styles.period}>
                      {company.startDate} - {company.endDate || "Present"}
                      <span
                        className={styles.accordionExpandIconBtn}
                        role="button"
                        tabIndex={0}
                        aria-label={activeAccordion === company.id ? 'Collapse' : 'Expand'}
                        onClick={e => { e.stopPropagation(); toggleAccordion(company.id); }}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); toggleAccordion(company.id); } }}
                      >
                        <span className={styles.accordionExpandIcon}>
                          {activeAccordion === company.id ? '−' : '+'}
                        </span>
                      </span>
                    </span>
                  </div>
                </button>
                {activeAccordion === company.id && (
                  <div className={styles.accordionContent}>
                    <div className={styles.responsibilitiesBlock}>
                      <h5 className={styles.achievementsTitle}>Key Responsibilities</h5>
                      <ul className={styles.responsibilitiesList}>
                        {company.jobDuties.map((duty, index) => (
                          <li key={index} className={styles.responsibilityItem}>
                            <div className={styles.responsibilityContent}>
                              <div className={styles.responsibilityTitle}>{duty.title}</div>
                              <div className={styles.responsibilityDescription}>{duty.description}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {companyAchievements.length > 0 && (
                      <div className={styles.achievementsBlock}>
                        <h5 className={styles.achievementsTitle}>Key Achievements</h5>
                        <ul className={styles.achievementsList}>
                          {companyAchievements.map((achievement) => (
                            <li key={achievement.id} className={styles.achievementItem}>
                              <span className={styles.checkmark}>✓</span>
                              <div className={styles.achievementContent}>

                                {/* Useful for managing what's included in the list */}
                                {/* <div className={styles.achievementTitle}>{achievement.id}</div> */}

                                <div className={styles.achievementTitle}>{achievement.title}</div>

                                <div className={styles.achievementDescription}>{achievement.description}</div>
                                {achievement.skills && achievement.skills.length > 0 && (
                                  <div className={styles.achievementSkills}>
                                    <div className={styles.skillsLabel}>Demonstrates skills:</div>
                                    <div className={styles.skillBadges}>
                                      {achievement.skills.map((skillId) => (
                                        <span key={skillId} className={styles.skillBadge}>
                                          {skillMap.get(skillId)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
} 