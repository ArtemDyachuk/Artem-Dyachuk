import type { Metadata } from "next";
import styles from "./page.module.css"; // Keep for main page layout
import companiesData from "../data/companies.json";
import achievementsData from "../data/achievements.json";
import { Achievement, Company } from "@/types";
import AchievementsAccordion from "@/app/components/accordions/AchievementsAccordion";
import { processAchievementsForCompanies } from "@/lib/achievements";

export const metadata: Metadata = {
  title: 'Key Achievements | Artem Dyachuk - Product Manager & Software Developer',
  description: 'Explore Artem Dyachuk\'s measurable achievements: $1B+ revenue platform leadership, $500K+ cost savings, 30% under-budget project delivery, and performance optimizations across product management and software development roles.',
  openGraph: {
    title: 'Key Achievements | Artem Dyachuk - Product Manager & Software Developer',
    description: 'Explore measurable achievements: $1B+ revenue platform leadership, $500K+ cost savings, 30% under-budget delivery, and performance optimizations.',
    url: 'https://artemdyachuk.com/achievements',
    siteName: 'Artem Dyachuk Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Key Achievements | Artem Dyachuk',
    description: 'Explore measurable achievements: $1B+ revenue platform leadership, $500K+ cost savings, and performance optimizations.',
    creator: '@artemdyachuk',
  },
  alternates: {
    canonical: 'https://artemdyachuk.com/achievements',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface AchievementsPageProps {
  searchParams: Promise<{
    company?: string;
  }>;
}

export default async function AchievementsPage({ searchParams }: AchievementsPageProps) {
  // Data fetching and processing is done on the server
  const processedCompanies = processAchievementsForCompanies(
    companiesData as Company[],
    achievementsData as Achievement[]
  );

  const resolvedSearchParams = await searchParams;
  const targetCompanyId = resolvedSearchParams?.company;

  return (
    <main className={styles.main}>
      <section className={styles.achievements}>
        <div className={styles.container}>
          <h1 className={styles.title}>Key Achievements</h1>
          <p className={styles.pageSummary}>
            This page showcases a comprehensive list of my key achievements, organized by company. Discover impactful contributions in product strategy, technical development, and performance optimization that demonstrate a consistent record of delivering measurable results.
          </p>

          <AchievementsAccordion 
            companies={processedCompanies} 
            initialCompanyId={targetCompanyId}
          />
          
        </div>
      </section>
    </main>
  );
}
