import type { Metadata } from "next";
import styles from "./page.module.css";
import AchievementsByRole from "@/app/components/achievements/AchievementsByRole";
import { fetchPublicRoles } from "@/lib/portfolio/roles";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import type { PortfolioRole } from "@/types/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Key Achievements | Artem Dyachuk - Product Manager & Software Developer',
  description: 'Key achievements of Artem Dyachuk - Lead Software Engineer and Technical Product Manager. $1B+ revenue platform leadership, $500K+ cost savings, cloud architecture implementations, IoT solutions, and software engineering achievements at AT&T, Brightland Homes, and other companies.',
  openGraph: {
    title: 'Key Achievements | Artem Dyachuk - Product Manager & Software Developer',
    description: 'Explore measurable achievements: $1B+ revenue platform leadership, $500K+ cost savings, 30% under-budget delivery, and performance optimizations.',
    url: 'https://www.artemdyachuk.com/achievements',
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
    canonical: 'https://www.artemdyachuk.com/achievements',
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

export default async function AchievementsPage() {
  const site = await resolvePortfolioSite();

  let roles: PortfolioRole[] = [];
  let errorMessage: string | null = null;

  if (site.ok) {
    try {
      roles = await fetchPublicRoles(site.userId);
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "Unable to load achievements right now.";
    }
  } else {
    errorMessage = "This page is temporarily unavailable.";
  }

  return (
    <main className={styles.main}>
      <section className={styles.achievements}>
        <div className={styles.container}>
          <h1 className={styles.title}>Key Achievements</h1>
          <p className={styles.pageSummary}>
            Measurable highlights from my career, grouped by role. Explore impactful contributions
            across product strategy, technical development, and performance optimization — then open
            any role for the full story.
          </p>

          {errorMessage ? (
            <p className={styles.error}>{errorMessage}</p>
          ) : (
            <AchievementsByRole roles={roles} />
          )}
        </div>
      </section>
    </main>
  );
}
