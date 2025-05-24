import styles from "./page.module.css";
import Hero from './components/hero/Hero';
import { FeaturedProjects } from './components/featured-products/FeaturedProjects';
import portfolioData from './data/portfolio.json';
import { Project } from './components/featured-products/ProjectCard';

export default function Home() {
  const projects: Project[] = portfolioData
    .filter(project => project.featured)
    .map(project => ({
      id: project.id,
      title: project.title,
      // imageUrl: `/images/projects/${project.id}.jpg`, // Assuming images follow this naming convention
      altText: `${project.title} - ${project.productDescription}`,
      description: project.productDescription,
      caseStudyUrl: `/portfolio/${project.id}`
    }));

  return (
    <main className={styles.main}>
      <Hero />
      {projects.length > 0 && <FeaturedProjects projects={projects} />}
    </main>
  );
}
