import { Metadata } from "next";
import RolesList from "../components/roles/RolesList";
import { fetchPublicRoles } from "@/lib/portfolio/roles";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import type { PortfolioRole } from "@/types/portfolio";
import styles from "./page.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Professional Experience | Artem Dyachuk - Lead Software Engineer & Product Manager",
  description:
    "Professional experience of Artem Dyachuk - Lead Software Engineer and Technical Product Manager. 6+ years in cloud architecture, software engineering, full-stack development, and technical product management. Experience includes IoT solutions, cloud infrastructure, and enterprise software at AT&T, Brightland Homes, and other companies.",
  authors: [{ name: "Artem Dyachuk" }],
  creator: "Artem Dyachuk",
  publisher: "Artem Dyachuk",
  openGraph: {
    title: "Professional Experience | Artem Dyachuk - Technical Product Manager",
    description:
      "6+ years of experience in cloud architecture, software engineering, technical product management, and full-stack development. Key achievements in IoT solutions, cloud infrastructure, and enterprise software.",
    url: "https://www.artemdyachuk.com/experience",
    siteName: "Artem Dyachuk - Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Experience | Artem Dyachuk",
    description:
      "Lead Software Engineer and Technical Product Manager with 6+ years in cloud architecture, software engineering, and full-stack development. Career journey and achievements.",
    creator: "@artemdyachuk",
  },
  alternates: {
    canonical: "https://www.artemdyachuk.com/experience",
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

type ExperiencePageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function ExperiencePage({ searchParams }: ExperiencePageProps) {
  const site = await resolvePortfolioSite();
  const { role: initialRoleId } = await searchParams;

  if (!site.ok) {
    return (
      <main className={styles.main}>
        <section className={styles.experience}>
          <div className={styles.container}>
            <h1 className={styles.sectionTitle}>Professional Experience</h1>
            <p className={styles.pageSummary}>{siteMessage(site.reason)}</p>
          </div>
        </section>
      </main>
    );
  }

  let roles: PortfolioRole[] = [];
  let errorMessage: string | null = null;

  try {
    roles = await fetchPublicRoles(site.userId);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load experience right now.";
  }

  return (
    <main className={styles.main}>
      <section className={styles.experience}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>Professional Experience</h1>
          <p className={styles.pageSummary}>
            Explore my career journey across software engineering and product leadership. Expand
            each role to view responsibilities and highlights.
          </p>
          {errorMessage ? (
            <p className={styles.error}>{errorMessage}</p>
          ) : (
            <RolesList roles={roles} initialRoleId={initialRoleId ?? null} />
          )}
        </div>
      </section>
    </main>
  );
}
