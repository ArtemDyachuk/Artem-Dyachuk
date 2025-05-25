import portfolioData from "@/app/data/portfolio.json";
import styles from "./PortfolioPage.module.css"; // We'll create this CSS module next
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  productDescription: string;
  companyName: string;
  role: string;
  year: string;
  challenge: string;
  action: string;
  results: string[];
  keyFeatures: string[];
  skillIds: number[]; // Assuming skillIds are numbers, adjust if they are strings or other types
}

export default function PortfolioPage() {
  const projects: Project[] = portfolioData;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Portfolio</h1>
      <div className={styles.projectsList}>
        {projects.map((project) => (
          <Link href={`/portfolio/${project.id}`} key={project.id} className={styles.projectCard}>
            <h2 className={styles.projectTitle}>{project.title}</h2>
            <div className={styles.contentRow}>
              <div className={`${styles.contentBlock} ${styles.descriptionBlock}`}>
                <h3 className={styles.blockTitle}>About</h3>
                <p>{project.productDescription || project.challenge}</p>
                <div className={styles.placeholderImage}></div>
              </div>

              <div className={`${styles.contentBlock} ${styles.impactBlock}`}>
                <h3 className={styles.blockTitle}>Impact</h3>
                {project.results.length > 0 ? (
                  <ul>
                    {project.results.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Details about the impact will be provided here.</p>
                )}
              </div>

              <div className={`${styles.contentBlock} ${styles.featuresBlock}`}>
                <h3 className={styles.blockTitle}>Key Projects</h3>
                {project.keyFeatures.length > 0 ? (
                  <ul>
                    {project.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Key features will be listed here.</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 