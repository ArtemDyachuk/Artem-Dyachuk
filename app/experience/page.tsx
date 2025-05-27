import { Metadata } from "next";
import styles from "./page.module.css";
import companiesData from "../data/companies.json";
import achievementsData from "../data/achievements.json";
import { Achievement, Company } from "@/types";
import ExperienceAccordion from "../components/accordions/ExperienceAccordion";

export const metadata: Metadata = {
  title: "Professional Experience | Artem Dyachuk - Technical Product Manager & Full-Stack Developer",
  description: "Explore Artem Dyachuk's 10+ years of professional experience in technical product management, full-stack development, and digital transformation. From e-commerce platforms to enterprise solutions, discover key achievements and responsibilities across multiple industries.",
  keywords: "technical product manager, full-stack developer, software engineering, product management, digital transformation, e-commerce, web development, team leadership, agile development, technical strategy",
  authors: [{ name: "Artem Dyachuk" }],
  creator: "Artem Dyachuk",
  publisher: "Artem Dyachuk",
  openGraph: {
    title: "Professional Experience | Artem Dyachuk - Technical Product Manager",
    description: "10+ years of experience in technical product management and full-stack development. Explore key achievements across e-commerce, enterprise solutions, and digital transformation projects.",
    url: "https://artemdyachuk.com/experience",
    siteName: "Artem Dyachuk - Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Experience | Artem Dyachuk",
    description: "10+ years in technical product management and full-stack development. Key achievements and career journey.",
    creator: "@artemdyachuk",
  },
  alternates: {
    canonical: "https://artemdyachuk.com/experience",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Experience() {
  // Sort companies by start date (most recent first)
  const sortedCompanies = [...(companiesData as Company[])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  const achievements = achievementsData as Achievement[];

  return (
    <main className={styles.main}>
      <section className={styles.experience}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>Professional Experience</h1>
          <p className={styles.pageSummary}>
            Explore my career journey, from foundational e-commerce and digital marketing roles to Technical Product Management. Each position details key responsibilities and impactful achievements, highlighting my blend of technical expertise and strategic leadership.
          </p>
          <ExperienceAccordion companies={sortedCompanies} achievements={achievements} />
        </div>
      </section>
    </main>
  );
} 