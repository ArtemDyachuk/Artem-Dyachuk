import { Metadata } from "next";
import RolesList from "../components/roles/RolesList";
import { fetchPublicRoles } from "@/lib/portfolio/roles";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import type { PortfolioRole } from "@/types/portfolio";
import styles from "./page.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Professional Experience | Artem Dyachuk",
  description:
    "Professional experience of Artem Dyachuk — engineering and product leadership roles, responsibilities, and career highlights.",
  robots: {
    index: false,
    follow: false,
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

export default async function RolesPage() {
  const site = await resolvePortfolioSite();

  if (!site.ok) {
    return (
      <main className={styles.main}>
        <section className={styles.roles}>
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
      <section className={styles.roles}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>Professional Experience</h1>
          <p className={styles.pageSummary}>
            Explore my career journey across software engineering and product leadership. Expand
            each role to view responsibilities and highlights.
          </p>
          {errorMessage ? <p className={styles.error}>{errorMessage}</p> : <RolesList roles={roles} />}
        </div>
      </section>
    </main>
  );
}
