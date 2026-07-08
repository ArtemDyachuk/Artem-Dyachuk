import Link from "next/link";
import type { PortfolioProject } from "@/types/portfolio";
import RichTextContent from "../roles/RichTextContent";
import styles from "./ProjectsList.module.css";

function formatMonthYear(value: string): string {
  const monthMatch = value.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const date = new Date(Number(monthMatch[1]), Number(monthMatch[2]) - 1, 1);
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  }
  const yearMatch = value.match(/^(\d{4})$/);
  if (yearMatch) return yearMatch[1];
  return value;
}

function formatDateRange(startDate: string | null, endDate: string | null): string | null {
  const start = startDate ? formatMonthYear(startDate) : "";
  const end = endDate ? formatMonthYear(endDate) : "";
  if (start && end) return start === end ? start : `${start} – ${end}`;
  return start || end || null;
}

type ProjectsListProps = {
  projects: PortfolioProject[];
};

export default function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No projects published yet</p>
        <p className={styles.emptyText}>Check back soon for a look at my work.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {projects.map((project) => {
        const dateLabel = formatDateRange(project.startDate, project.endDate);
        return (
          <article key={project.id} className={styles.card} id={`project-${project.id}`}>
            <div className={styles.header}>
              <h2 className={styles.projectTitle}>{project.name}</h2>
              {dateLabel ? <span className={styles.date}>{dateLabel}</span> : null}
            </div>

            <div className={styles.body}>
              <RichTextContent html={project.description} className={styles.description} />

              {project.skills.length > 0 ? (
                <div className={styles.skills}>
                  {project.skills.map((skill) => (
                    <span key={skill.id} className={styles.skill}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : null}

              {project.roleId && project.roleLabel ? (
                <Link href={`/experience?role=${project.roleId}`} className={styles.detailsLink}>
                  {project.roleLabel} →
                </Link>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
