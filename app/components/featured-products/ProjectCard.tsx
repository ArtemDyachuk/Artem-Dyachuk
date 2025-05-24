import Image from 'next/image';
// import Link from 'next/link';
import styles from './ProjectCard.module.css';

export interface Project {
  id: string;
  title: string;
  imageUrl?: string;
  altText: string;
  description: string;
  caseStudyUrl: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className={styles.card}>
      {project.imageUrl && (
        <div className={styles.imageContainer}>
          <Image
            src={project.imageUrl}
            alt={project.altText}
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
        {/* <Link href={project.caseStudyUrl} className={styles.link}>
          View Case Study
        </Link> */}
      </div>
    </article>
  );
}; 