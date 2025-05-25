import Image from 'next/image';
import Link from 'next/link';
import styles from './ProjectCard.module.css';

export interface Project {
  id: number;
  title: string;
  mainImage?: string;
  images?: {
    url?: string;
    order?: number;
    alt?: string;
  };
  description: string;
  caseStudyUrl: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className={styles.card}>
      {project.mainImage && (
        <div className={styles.imageContainer}>
          <Image
            src={project.mainImage}
            alt={project.title + " main image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
            priority={false}
          />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <Link href={`/my-work/${project.id}`} className={styles.link}>
          View Case Study
        </Link>
      </div>
    </article>
  );
}; 