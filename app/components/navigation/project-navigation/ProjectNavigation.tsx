import Link from "next/link";
import styles from "./ProjectNavigation.module.css";
import portfolioData from "@/app/data/portfolio.json";

interface ProjectNavigationProps {
  currentProjectId: number;
}

export default function ProjectNavigation({ currentProjectId }: ProjectNavigationProps) {
  // Sort projects by ID to ensure proper order
  const sortedProjects = [...portfolioData].sort((a, b) => a.id - b.id);
  const currentIndex = sortedProjects.findIndex(project => project.id === currentProjectId);
  
  const previousProject = currentIndex > 0 ? sortedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : null;

  if (!previousProject && !nextProject) {
    return null; // Don't render if there's only one project
  }

  return (
    <nav className={styles.projectNavigation}>
      <div className={styles.navigationContainer}>
        {previousProject ? (
          <Link href={`/my-work/${previousProject.id}`} className={`${styles.navButton} ${styles.previous}`}>
            <div className={styles.navDirection}>← Previous</div>
            <div className={styles.navTitle}>{previousProject.title}</div>
          </Link>
        ) : (
          <div className={styles.navPlaceholder}></div>
        )}
        
        {nextProject ? (
          <Link href={`/my-work/${nextProject.id}`} className={`${styles.navButton} ${styles.next}`}>
            <div className={styles.navDirection}>Next →</div>
            <div className={styles.navTitle}>{nextProject.title}</div>
          </Link>
        ) : (
          <div className={styles.navPlaceholder}></div>
        )}
      </div>
    </nav>
  );
} 