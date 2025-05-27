"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import companiesData from "../data/companies.json";
import achievementsData from "../data/achievements.json";
import { Achievement, Company } from "@/types";

// Note: Since this is a client component, we need to export metadata from a separate file
// or convert this to a server component. For now, I'll add it here but it won't work in client components.
// You'll need to either:
// 1. Convert this to a server component, or
// 2. Create a separate layout.tsx file in the experience folder

function ExperienceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetCompanyId = searchParams.get('company');

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);

    // Clear URL parameter when user manually toggles accordion
    if (targetCompanyId) {
      router.replace('/experience', { scroll: false });
    }
  };

  // Sort companies by start date (most recent first)
  const sortedCompanies = [...(companiesData as Company[])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Handle URL parameter for auto-expanding specific company (only on initial load)
  useEffect(() => {
    if (targetCompanyId && sortedCompanies.find(c => c.id === targetCompanyId)) {
      setActiveAccordion(targetCompanyId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <p className={styles.pageSummary}>
            Explore my career journey, from foundational e-commerce and digital marketing roles to Technical Product Management. Each position details key responsibilities and impactful achievements, highlighting my blend of technical expertise and strategic leadership.
          </p>
          {sortedCompanies.map((company) => {
            const companyAchievements = getCompanyAchievements(company);
            return (
              <div
                key={company.id}
                className={styles.accordionItem}
              >
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
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className={styles.viewMoreLink}>
                          <Link href={`/achievements?company=${company.id}`} className={styles.viewMoreButton}>
                            View More Achievements
                          </Link>
                          <Link href="/skills" className={styles.viewMoreButton}>
                            Learn more about my skills
                          </Link>
                        </div>
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

export default function Experience() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <section className={styles.experience}>
          <div className={styles.container}>
            <h1 className={styles.sectionTitle}>Professional Experience</h1>
            <p className={styles.pageSummary}>
              Explore my professional journey spanning over a decade of building impactful digital solutions. From full-stack development to product management, I&apos;ve consistently delivered results that drive business growth and operational efficiency across multiple industries.
            </p>
            <div>Loading...</div>
          </div>
        </section>
      </main>
    }>
      <ExperienceContent />
    </Suspense>
  );
} 