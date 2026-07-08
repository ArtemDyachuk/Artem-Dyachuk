"use client";

import { useState } from "react";
import Link from "next/link";
import type { PortfolioRole } from "@/types/portfolio";
import CompanyLogo from "../roles/CompanyLogo";
import RichTextContent from "../roles/RichTextContent";
import styles from "./AchievementsByRole.module.css";

function formatMonthYear(value: string): string {
  const monthMatch = value.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const date = new Date(Number(monthMatch[1]), Number(monthMatch[2]) - 1, 1);
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  }
  return value;
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = startDate ? formatMonthYear(startDate) : "";
  const end = endDate ? formatMonthYear(endDate) : "Present";
  if (!start) return end;
  return `${start} – ${end}`;
}

function formatAchievementDate(value: string | null): string | null {
  if (!value) return null;
  return formatMonthYear(value);
}

type RoleAchievementsCardProps = {
  role: PortfolioRole;
  defaultOpen?: boolean;
};

function RoleAchievementsCard({ role, defaultOpen = false }: RoleAchievementsCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `achievements-panel-${role.id}`;
  const count = role.achievements.length;

  return (
    <article className={styles.card} id={`role-${role.id}`}>
      <div className={styles.header}>
        <CompanyLogo name={role.company} logoUrl={role.companyLogoUrl} />
        <div className={styles.headerMain}>
          <h2 className={styles.roleTitle}>{role.role}</h2>
          <p className={styles.company}>{role.company}</p>
          <div className={styles.meta}>
            <p>{formatDateRange(role.startDate, role.endDate)}</p>
            {role.location ? <p>{role.location}</p> : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.toggle} ${open ? styles.toggleOpen : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>Achievements ({count})</span>
        <span className={styles.toggleIcon} aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      <div
        id={panelId}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.panelInner}>
          <ul className={styles.achievements}>
            {role.achievements.map((achievement) => {
              const dateLabel = formatAchievementDate(achievement.date);
              return (
                <li key={achievement.id}>
                  <p className={styles.achievementTitle}>
                    {achievement.title}
                    {dateLabel ? (
                      <span className={styles.achievementDate}> · {dateLabel}</span>
                    ) : null}
                  </p>
                  <RichTextContent
                    html={achievement.description}
                    className={styles.achievementDescription}
                  />
                </li>
              );
            })}
          </ul>

          <Link href={`/experience?role=${role.id}`} className={styles.detailsLink}>
            View role details →
          </Link>
        </div>
      </div>
    </article>
  );
}

type AchievementsByRoleProps = {
  roles: PortfolioRole[];
};

export default function AchievementsByRole({ roles }: AchievementsByRoleProps) {
  const rolesWithAchievements = roles.filter((role) => role.achievements.length > 0);

  if (rolesWithAchievements.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No achievements published yet</p>
        <p className={styles.emptyText}>Check back soon for highlights from my work.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {rolesWithAchievements.map((role, index) => (
        <RoleAchievementsCard key={role.id} role={role} defaultOpen={index === 0} />
      ))}
    </div>
  );
}
