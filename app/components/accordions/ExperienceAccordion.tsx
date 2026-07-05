"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./ExperienceAccordion.module.css";
import { Achievement, Company } from "@/types";

interface ExperienceAccordionProps {
  companies: Company[];
  achievements: Achievement[];
}

function AccordionContent({ companies, achievements }: ExperienceAccordionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetCompanyId = searchParams.get('company');

  const [activeAccordion, setActiveAccordion] = useState<string | null>(() =>
    targetCompanyId && companies.find((c) => c.id === targetCompanyId) ? targetCompanyId : null,
  );

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);

    // Clear URL parameter when user manually toggles accordion
    if (targetCompanyId) {
      router.replace('/experience', { scroll: false });
    }
  };

  // Get achievements for a company
  const getCompanyAchievements = (company: Company) => {
    return achievements
      .filter(achievement => company.achievements.includes(achievement.id))
      .sort((a, b) => company.achievements.indexOf(a.id) - company.achievements.indexOf(b.id));
  };

  return (
    <>
      {companies.map((company) => {
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
    </>
  );
}

export default function ExperienceAccordion({ companies, achievements }: ExperienceAccordionProps) {
  return (
    <Suspense fallback={<div>Loading experience...</div>}>
      <AccordionContent companies={companies} achievements={achievements} />
    </Suspense>
  );
} 