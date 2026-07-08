import type { Metadata } from "next";
import styles from "./page.module.css";
import ProjectsList from "@/app/components/projects/ProjectsList";
import { fetchPublicProjects } from "@/lib/portfolio/projects";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import type { PortfolioProject } from "@/types/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects | Artem Dyachuk - Lead Software Engineer & Product Manager",
  description:
    "Selected projects by Artem Dyachuk - Lead Software Engineer and Technical Product Manager. Digital products and software solutions spanning full-stack development, cloud architecture, custom CMS platforms, and marketing integrations.",
  openGraph: {
    title: "Projects | Artem Dyachuk - Digital Products & Software Solutions",
    description:
      "Selected projects by Artem Dyachuk spanning full-stack development, cloud architecture, custom CMS platforms, and marketing integrations.",
    url: "https://www.artemdyachuk.com/projects",
    siteName: "Artem Dyachuk - Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Artem Dyachuk",
    description:
      "Selected projects spanning full-stack development, cloud architecture, custom CMS platforms, and marketing integrations.",
    creator: "@artemdyachuk",
  },
  alternates: {
    canonical: "https://www.artemdyachuk.com/projects",
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

export default async function ProjectsPage() {
  const site = await resolvePortfolioSite();

  let projects: PortfolioProject[] = [];
  let errorMessage: string | null = null;

  if (site.ok) {
    try {
      projects = await fetchPublicProjects(site.userId);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Unable to load projects right now.";
    }
  } else {
    errorMessage = "This page is temporarily unavailable.";
  }

  return (
    <main className={styles.main}>
      <section>
        <div className={styles.container}>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.pageSummary}>
            A selection of digital products and software solutions I&apos;ve built — from full-stack
            applications to custom platforms and integrations. Each project links back to the role
            where it was delivered.
          </p>

          {errorMessage ? (
            <p className={styles.error}>{errorMessage}</p>
          ) : (
            <ProjectsList projects={projects} />
          )}
        </div>
      </section>
    </main>
  );
}
