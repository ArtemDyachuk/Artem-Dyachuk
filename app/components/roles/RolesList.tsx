"use client";

import { useState } from "react";
import type { PortfolioRole } from "@/types/portfolio";
import CompanyLogo from "./CompanyLogo";
import styles from "./RolesList.module.css";

function formatDateRange(startDate: string, endDate: string | null): string {
  const formatPart = (value: string) => {
    const monthMatch = value.match(/^(\d{4})-(\d{2})$/);
    if (monthMatch) {
      const date = new Date(Number(monthMatch[1]), Number(monthMatch[2]) - 1, 1);
      return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
    }
    return value;
  };

  const start = startDate ? formatPart(startDate) : "";
  const end = endDate ? formatPart(endDate) : "Present";
  if (!start) return end;
  return `${start} – ${end}`;
}

function formatAchievementDate(value: string | null): string | null {
  if (!value) return null;
  const monthMatch = value.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const date = new Date(Number(monthMatch[1]), Number(monthMatch[2]) - 1, 1);
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  }
  return value;
}

function roleHasDetails(role: PortfolioRole): boolean {
  return Boolean(
    role.roleOverview?.trim() ||
      role.responsibilities.length > 0 ||
      role.achievements.length > 0,
  );
}

type RoleCardProps = {
  role: PortfolioRole;
};

function RoleCard({ role }: RoleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const expandable = roleHasDetails(role);

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={`${styles.cardHeader} ${expanded ? styles.cardHeaderActive : ""}`}
        onClick={() => expandable && setExpanded((value) => !value)}
        aria-expanded={expandable ? expanded : undefined}
        disabled={!expandable}
      >
        <CompanyLogo name={role.company} logoUrl={role.companyLogoUrl} />

        <div className={styles.cardHeaderMain}>
          <h2 className={styles.roleTitle}>{role.role}</h2>
          <p className={styles.company}>{role.company}</p>
          <div className={styles.meta}>
            <p>{formatDateRange(role.startDate, role.endDate)}</p>
            {role.location ? <p>{role.location}</p> : null}
          </div>
        </div>

        {expandable ? (
          <span className={styles.expandIcon} aria-hidden>
            {expanded ? "−" : "+"}
          </span>
        ) : null}
      </button>

      <div className={`${styles.panel} ${expanded ? styles.panelOpen : ""}`} aria-hidden={!expanded}>
        <div className={styles.panelInner}>
          {role.roleOverview ? <p className={styles.overview}>{role.roleOverview}</p> : null}

          {role.responsibilities.length > 0 ? (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Responsibilities</h3>
              <ul className={styles.responsibilities}>
                {role.responsibilities.map((item) => (
                  <li key={item.id || `${item.name}-${item.text.slice(0, 24)}`}>
                    {item.name ? <strong>{item.name}: </strong> : null}
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {role.achievements.length > 0 ? (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Achievements</h3>
              <ul className={styles.achievements}>
                {role.achievements.map((item) => {
                  const dateLabel = formatAchievementDate(item.date);
                  return (
                    <li key={item.id}>
                      <p className={styles.achievementTitle}>
                        {item.title}
                        {dateLabel ? (
                          <span className={styles.achievementDate}> · {dateLabel}</span>
                        ) : null}
                      </p>
                      <p className={styles.achievementDescription}>{item.description}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type RolesListProps = {
  roles: PortfolioRole[];
};

export default function RolesList({ roles }: RolesListProps) {
  if (roles.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No experience published yet</p>
        <p className={styles.emptyText}>Check back soon for updates to my career timeline.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </div>
  );
}
