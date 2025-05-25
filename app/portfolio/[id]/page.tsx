import portfolioData from "@/app/data/portfolio.json";
import skillsData from "@/app/data/skills.json";
import styles from "./ProjectDetail.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const project = portfolioData.find((p) => p.id === parseInt(id));
  if (!project) notFound();

  const matchedSkills = skillsData.filter((skill) => project.skillIds.includes(skill.id));

  return (
    <div className={styles.wrapper} style={{ marginTop: 65 }}>
      {project.mainImage && project.mainImage !== "" && (
        <div className={styles.mainImageWrapper}>
          <Image
            src={project.mainImage}
            alt={project.title}
            className={styles.mainImage}
            width={700}
            height={320}
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}
      <div className={styles.headerBlock}>
        <h1 className={styles.title}>{project.title}</h1>
        <div className={styles.meta}>
          <span>{project.companyName}</span>
          <span>•</span>
          <span>{project.role}</span>
          <span>•</span>
          <span>{project.year}</span>
        </div>
        <p className={styles.description}>{project.productDescription}</p>
      </div>
      <div className={styles.sections}>
        <section>
          <h2>Challenge</h2>
          <p>{project.challenge}</p>
        </section>
        <section>
          <h2>Action</h2>
          <p>{project.action}</p>
        </section>
        <section>
          <h2>Results</h2>
          <ul>
            {project.results.map((result, i) => <li key={i}>{result}</li>)}
          </ul>
        </section>
        <section>
          <h2>Key Features</h2>
          <ul>
            {project.keyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
          </ul>
        </section>
        <section>
          <h2>Skills</h2>
          <div className={styles.skillsList}>
            {matchedSkills.map((skill) => (
              <div key={skill.id} className={styles.skillCard}>
                <div className={styles.skillTitle}>{skill.title}</div>
                <div className={styles.skillType}>{skill.type}</div>
                <div className={styles.skillDescription}>{skill.description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 