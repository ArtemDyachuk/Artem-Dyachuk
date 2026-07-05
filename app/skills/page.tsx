import type { Metadata } from "next";
import styles from "./page.module.css";
import { fetchUserSkills } from "@/lib/portfolio/skills";
import { fetchUserLanguages } from "@/lib/portfolio/languages";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import type { PortfolioLanguage, PortfolioSkillCategory } from "@/types/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Skills & Expertise",
  description:
    "Technical skills and expertise of Artem Dyachuk - Lead Software Engineer and Technical Product Manager. Expertise in cloud architecture (AWS, Kubernetes, Terraform), full-stack development (React, Next.js, Node.js), software engineering, IoT solutions, and technical product management.",
  openGraph: {
    title: "Skills & Expertise - Artem Dyachuk",
    description:
      "Technical skills and expertise of Artem Dyachuk - Lead Software Engineer and Technical Product Manager. Expertise in cloud architecture (AWS, Kubernetes, Terraform), full-stack development (React, Next.js, Node.js), software engineering, IoT solutions, and technical product management.",
    url: "https://www.artemdyachuk.com/skills",
  },
  twitter: {
    title: "Skills & Expertise - Artem Dyachuk",
    description:
      "Explore Artem Dyachuk's technical skills and expertise including Full-Stack Development, Product Strategy, and more.",
  },
  alternates: {
    canonical: "/skills",
  },
};

function siteMessage(reason: "missing_config" | "site_not_found" | "site_disabled"): string {
  switch (reason) {
    case "missing_config":
      return "This page is temporarily unavailable.";
    case "site_disabled":
      return "This page is temporarily unavailable.";
    default:
      return "This page is temporarily unavailable.";
  }
}

function LanguagesSection({ languages }: { languages: PortfolioLanguage[] }) {
  if (languages.length === 0) return null;

  return (
    <section className={styles.skillSection}>
      <h2 className={styles.sectionTitle}>Languages</h2>
      <div className={styles.skillGrid}>
        {languages.map((language) => (
          <div key={language.id} className={styles.skillBadge}>
            <span className={styles.skillTitle}>{language.name}</span>
            <span className={styles.skillDescription}>{language.fluencyLabel}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsContent({
  categories,
  languages,
}: {
  categories: PortfolioSkillCategory[];
  languages: PortfolioLanguage[];
}) {
  if (categories.length === 0 && languages.length === 0) {
    return <p className={styles.empty}>No skills published yet.</p>;
  }

  return (
    <>
      <LanguagesSection languages={languages} />
      {categories.map((group) => (
        <section key={group.category} className={styles.skillSection}>
          <h2 className={styles.sectionTitle}>{group.category}</h2>
          <div className={styles.skillGrid}>
            {group.skills.map((skill) => (
              <div key={skill.id} className={styles.skillBadge}>
                <span className={styles.skillTitle}>{skill.name}</span>
                {skill.note ? <span className={styles.skillDescription}>{skill.note}</span> : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default async function SkillsPage() {
  const site = await resolvePortfolioSite();

  if (!site.ok) {
    return (
      <main className={styles.main}>
        <section className={styles.skills}>
          <div className={styles.container}>
            <h1 className={styles.title}>Skills & Expertise</h1>
            <p className={styles.pageSummary}>{siteMessage(site.reason)}</p>
          </div>
        </section>
      </main>
    );
  }

  let categories: PortfolioSkillCategory[] = [];
  let languages: PortfolioLanguage[] = [];
  let errorMessage: string | null = null;

  const loadErrors: string[] = [];

  try {
    categories = await fetchUserSkills(site.userId);
  } catch (error) {
    loadErrors.push(error instanceof Error ? error.message : "Unable to load skills.");
  }

  try {
    languages = await fetchUserLanguages(site.userId);
  } catch (error) {
    loadErrors.push(error instanceof Error ? error.message : "Unable to load languages.");
  }

  if (loadErrors.length === 2) {
    errorMessage = loadErrors.join(" ");
  } else if (loadErrors.length === 1) {
    errorMessage = loadErrors[0] ?? null;
  }

  return (
    <main className={styles.main}>
      <section className={styles.skills}>
        <div className={styles.container}>
          <h1 className={styles.title}>Skills & Expertise</h1>
          <p className={styles.pageSummary}>
            Core professional competencies across cloud architecture, software engineering,
            full-stack development, technical product management, and DevOps — maintained in
            sync with my career profile.
          </p>
          {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
          {!errorMessage || categories.length > 0 || languages.length > 0 ? (
            <SkillsContent categories={categories} languages={languages} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
