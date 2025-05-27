"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./AchievementsAccordion.module.css";
import { Achievement, CompanyWithProcessedAchievements } from "@/types";

interface AchievementsAccordionProps {
  companies: CompanyWithProcessedAchievements[];
  initialCompanyId?: string | null;
}

const AchievementsAccordion: React.FC<AchievementsAccordionProps> = ({ companies, initialCompanyId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetCompanyIdFromUrl = searchParams.get('company');

  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      if (targetCompanyIdFromUrl && companies.find(c => c.id === targetCompanyIdFromUrl)) {
        setExpandedCompany(targetCompanyIdFromUrl);
      } else if (initialCompanyId && companies.find(c => c.id === initialCompanyId)) {
        setExpandedCompany(initialCompanyId);
      } else if (companies.length > 0) {
        setExpandedCompany(companies[0].id);
      }
      setHasInitialized(true);
    } else {
      // Only update if there's a URL parameter change and we find a matching company
      if (targetCompanyIdFromUrl && companies.find(c => c.id === targetCompanyIdFromUrl)) {
        setExpandedCompany(targetCompanyIdFromUrl);
      }
    }
  }, [targetCompanyIdFromUrl, initialCompanyId, companies, hasInitialized]);

  const toggleCompany = (companyId: string) => {
    const newExpandedCompany = expandedCompany === companyId ? null : companyId;
    setExpandedCompany(newExpandedCompany);

    if (newExpandedCompany) {
      router.replace(`/achievements?company=${newExpandedCompany}`, { scroll: false });
    } else {
      router.replace('/achievements', { scroll: false });
    }
  };

  const [expandedOtherSections, setExpandedOtherSections] = useState<{ [key: string]: boolean }>({});

  const toggleOtherSection = (companyId: string) => {
    setExpandedOtherSections((prev) => ({ ...prev, [companyId]: !prev[companyId] }));
  };

  const renderAchievement = (achievement: Achievement) => {
    return (
      <div key={achievement.id} className={styles.achievement}>
        <h3 className={styles.achievementTitle}>
          {achievement.title}
        </h3>
        <p className={styles.achievementDescriptionExpanded}>
          {achievement.description}
        </p>
        <span className={styles.achievementYear}>
          {achievement.year}
        </span>
      </div>
    );
  };

  if (!companies || companies.length === 0) {
    return <p>No achievements to display.</p>;
  }

  return (
    <div className={styles.achievementsList}>
      {companies.map((company) => (
        <div
          key={company.id}
          className={styles.companyGroup}
        >
          <button
            className={`${styles.companyHeader} ${expandedCompany === company.id ? styles.expanded : ""}`}
            onClick={() => toggleCompany(company.id)}
            aria-expanded={expandedCompany === company.id}
            aria-controls={`company-achievements-${company.id}`}
          >
            <div className={styles.companyInfo}>
              <h2 className={styles.companyName}>{company.name}</h2>
              <span className={styles.companyJobTitle}>{company.jobTitle}</span>
              <span className={styles.companyYears}>
                {company.startDate} - {company.endDate || "Present"}
              </span>
            </div>
            <span className={styles.expandIcon} aria-hidden="true">
              {expandedCompany === company.id ? "−" : "+"}
            </span>
          </button>

          {expandedCompany === company.id && (
            <div className={styles.achievementsColumn} id={`company-achievements-${company.id}`}>
              <div className={styles.experienceLink}>
                <Link href={`/experience?company=${company.id}`} className={styles.experienceButton}>
                  More about my role at this position
                </Link>
              </div>

              {company.featuredAchievements.length > 0 && (
                <section aria-labelledby={`featured-title-${company.id}`}>
                  <h4 className={styles.sectionTitle} id={`featured-title-${company.id}`}>Featured Achievements</h4>
                  {company.featuredAchievements.map(renderAchievement)}
                </section>
              )}

              {company.otherAchievements.length > 0 && (
                <section>
                  <button
                    className={styles.otherSectionHeader}
                    onClick={() => toggleOtherSection(company.id)}
                    aria-expanded={!!expandedOtherSections[company.id]}
                    aria-controls={`other-achievements-content-${company.id}`}
                  >
                    <h4 className={styles.sectionTitle}>Other Achievements ({company.otherAchievements.length})</h4>
                    <span className={styles.expandIcon} aria-hidden="true">
                      {expandedOtherSections[company.id] ? "−" : "+"}
                    </span>
                  </button>
                  {expandedOtherSections[company.id] && (
                    <div className={styles.otherAchievementsContent} id={`other-achievements-content-${company.id}`}>
                      {company.otherAchievements.map(renderAchievement)}
                    </div>
                  )}
                </section>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AchievementsAccordion;
