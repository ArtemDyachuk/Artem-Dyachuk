"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioRole, PortfolioSkill } from "@/types/portfolio";
import CompanyLogo from "./CompanyLogo";
import RichTextContent from "./RichTextContent";
import RoleSectionAccordion from "./RoleSectionAccordion";
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

function groupSkillsByCategory(skills: PortfolioSkill[]) {
  const buckets = new Map<string, PortfolioSkill[]>();
  for (const skill of skills) {
    const list = buckets.get(skill.category) ?? [];
    list.push(skill);
    buckets.set(skill.category, list);
  }

  return [...buckets.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([category, items]) => ({
      category,
      items: [...items].sort((left, right) => left.name.localeCompare(right.name)),
    }));
}

function roleHasDetails(role: PortfolioRole): boolean {
  return Boolean(
    role.roleOverview?.trim() ||
      role.responsibilities.length > 0 ||
      role.achievements.length > 0 ||
      role.skills.length > 0,
  );
}

type RoleCardProps = {
  role: PortfolioRole;
  initiallyExpanded?: boolean;
};

function RoleCard({ role, initiallyExpanded = false }: RoleCardProps) {
  const expandable = roleHasDetails(role);
  const [expanded, setExpanded] = useState(initiallyExpanded && expandable);
  const skillGroups = useMemo(() => groupSkillsByCategory(role.skills), [role.skills]);
  const cardRef = useRef<HTMLElement | null>(null);

  // When deep-linked (e.g. from the achievements page), scroll the targeted
  // role into view below the fixed header once it has expanded.
  useEffect(() => {
    if (!initiallyExpanded) return;
    const el = cardRef.current;
    if (!el) return;
    const timer = window.setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [initiallyExpanded]);

  return (
    <article className={styles.card} id={`role-${role.id}`} ref={cardRef}>
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
          {role.roleOverview ? (
            <RichTextContent html={role.roleOverview} className={styles.overview} />
          ) : null}

          <RoleSectionAccordion
            title="Responsibilities"
            count={role.responsibilities.length}
            defaultOpen={false}
          >
            <ul className={styles.responsibilities}>
              {role.responsibilities.map((item) => (
                <li
                  key={item.id || `${item.name}-${item.text.slice(0, 24)}`}
                  className={styles.responsibilityItem}
                >
                  {item.name ? <p className={styles.responsibilityName}>{item.name}</p> : null}
                  <RichTextContent html={item.text} className={styles.responsibilityText} />
                </li>
              ))}
            </ul>
          </RoleSectionAccordion>

          <RoleSectionAccordion
            title="Achievements"
            count={role.achievements.length}
            defaultOpen={true}
          >
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
                    <RichTextContent
                      html={item.description}
                      className={styles.achievementDescription}
                    />
                  </li>
                );
              })}
            </ul>
          </RoleSectionAccordion>

          <RoleSectionAccordion title="Skills" count={role.skills.length} defaultOpen={false}>
            <div className={styles.skillsGroups}>
              {skillGroups.map((group) => (
                <div key={group.category} className={styles.skillGroup}>
                  <p className={styles.skillCategory}>{group.category}</p>
                  <div className={styles.skillPills}>
                    {group.items.map((skill) => (
                      <span key={skill.id} className={styles.skillPill}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </RoleSectionAccordion>
        </div>
      </div>
    </article>
  );
}

type RolesListProps = {
  roles: PortfolioRole[];
  initialRoleId?: string | null;
};

export default function RolesList({ roles, initialRoleId = null }: RolesListProps) {
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
        <RoleCard key={role.id} role={role} initiallyExpanded={role.id === initialRoleId} />
      ))}
    </div>
  );
}
