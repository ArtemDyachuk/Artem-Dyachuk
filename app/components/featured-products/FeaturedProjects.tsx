import { Project, ProjectCard } from './ProjectCard';
import styles from './FeaturedProjects.module.css';

interface FeaturedProjectsProps {
  projects: Project[];
  title?: string;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  title = 'Featured Projects'
}) => {
  const getGridClass = (count: number) => {
    switch (count) {
      case 1:
        return styles.grid1;
      case 2:
        return styles.grid2;
      case 3:
        return styles.grid3;
      case 4:
        return styles.grid4;
      case 5:
        return styles.grid5;
      case 6:
        return styles.grid6;
      default:
        return styles.gridDefault;
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={`${styles.grid} ${getGridClass(projects.length)}`}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}; 