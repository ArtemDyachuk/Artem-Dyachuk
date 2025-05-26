"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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

function AchievementsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetCompanyId = searchParams.get('company');

  // Sort companies by start date (most recent first)
  const sortedCompanies = [...companiesData].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Group achievements by company with featured/other separation
  const achievementsByCompany = sortedCompanies.map((company) => {
    const allCompanyAchievements = (achievementsData as Achievement[])
      .filter((achievement) => achievement.companyId === company.id)
      .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));

    // Get featured achievements (from company's achievements array) in the exact order specified
    const featuredAchievements = company.achievements
      ? company.achievements
        .map(achievementId =>
          allCompanyAchievements.find(achievement => achievement.id === achievementId)
        )
        .filter(achievement => achievement !== undefined) as Achievement[]
      : [];

    // Get other achievements (excluding featured ones)
    const otherAchievements = allCompanyAchievements.filter(achievement =>
      !company.achievements?.includes(achievement.id)
    );

    return {
      ...company,
      featuredAchievements,
      otherAchievements,
      allAchievements: allCompanyAchievements // Keep for backward compatibility if needed
    };
  });

  // Expand company based on URL parameter or default to first company
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  useEffect(() => {
    if (targetCompanyId && achievementsByCompany.find(c => c.id === targetCompanyId)) {
      setExpandedCompany(targetCompanyId);
    } else if (achievementsByCompany.length > 0) {
      // Default to first company if no target specified
      setExpandedCompany(achievementsByCompany[0].id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCompany = (companyId: string) => {
    setExpandedCompany(expandedCompany === companyId ? null : companyId);

    // Clear URL parameter when user manually toggles company
    if (targetCompanyId) {
      router.replace('/achievements', { scroll: false });
    }
  };

  // Track expanded "Other Achievements" sections by company
  const [expandedOtherSections, setExpandedOtherSections] = useState<{ [key: string]: boolean }>({});

  const toggleOtherSection = (companyId: string) => {
    setExpandedOtherSections((prev) => ({ ...prev, [companyId]: !prev[companyId] }));
  };

  // Helper function to render achievement items
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

  return (
    <main className={styles.main}>
      <section className={styles.achievements}>
        <div className={styles.container}>
          <h1 className={styles.title}>Key Achievements</h1>
          <p className={styles.pageSummary}>
            This page showcases a comprehensive list of my key achievements, organized by company. Discover impactful contributions in product strategy, technical development, and performance optimization that demonstrate a consistent record of delivering measurable results.
          </p>

          <div className={styles.achievementsList}>
            {achievementsByCompany.map((company) => (
              <div
                key={company.id}
                className={styles.companyGroup}
              >
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
                  <span className={styles.expandIcon}>
                    {expandedCompany === company.id ? "−" : "+"}
                  </span>
                </button>

                {expandedCompany === company.id && (
                  <div className={styles.achievementsColumn}>
                    {/* Link to Experience Page */}
                    <div className={styles.experienceLink}>
                      <Link href={`/experience?company=${company.id}`} className={styles.experienceButton}>
                        More about my role at this position
                      </Link>
                    </div>

                    {/* Featured Achievements Section */}
                    {company.featuredAchievements.length > 0 && (
                      <>
                        <h4 className={styles.sectionTitle}>Featured Achievements</h4>
                        {company.featuredAchievements.map(renderAchievement)}
                      </>
                    )}

                    {/* Other Achievements Section */}
                    {company.otherAchievements.length > 0 && (
                      <>
                        <button
                          className={styles.otherSectionHeader}
                          onClick={() => toggleOtherSection(company.id)}
                        >
                          <h4 className={styles.sectionTitle}>Other Achievements ({company.otherAchievements.length})</h4>
                          <span className={styles.expandIcon}>
                            {expandedOtherSections[company.id] ? "−" : "+"}
                          </span>
                        </button>
                        {expandedOtherSections[company.id] && (
                          <div className={styles.otherAchievementsContent}>
                            {company.otherAchievements.map(renderAchievement)}
                          </div>
                        )}
                      </>
                    )}
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

export default function Achievements() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <section className={styles.achievements}>
          <div className={styles.container}>
            <h1 className={styles.title}>Key Achievements</h1>
            <p className={styles.pageSummary}>
              Discover the measurable impact I&apos;ve made throughout my career. From driving $1B+ in annual revenue to achieving significant cost savings, these achievements showcase my ability to deliver transformative results across product management and software development initiatives.
            </p>
            <div>Loading...</div>
          </div>
        </section>
      </main>
    }>
      <AchievementsContent />
    </Suspense>
  );
} 