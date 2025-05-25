import type { Metadata } from "next";
import portfolioData from "@/app/data/portfolio.json";
import skillsData from "@/app/data/skills.json";
import styles from "./ProjectDetail.module.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import Breadcrumbs from "@/app/components/navigation/breadcrumbs/Breadcrumbs";
import ProjectNavigation from "@/app/components/navigation/project-navigation/ProjectNavigation";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = portfolioData.find((p) => p.id === parseInt(id));

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} - ${project.companyName}`,
    description: `${project.productDescription} - ${project.role} project at ${project.companyName} (${project.year}). ${project.challenge.substring(0, 100)}...`,
    openGraph: {
      title: `${project.title} - ${project.companyName}`,
      description: `${project.productDescription} - ${project.role} project at ${project.companyName}.`,
      url: `https://artemdyachuk.com/my-work/${project.id}`,
      images: project.mainImage ? [
        {
          url: project.mainImage,
          width: 700,
          height: 320,
          alt: project.title,
        }
      ] : [],
    },
    twitter: {
      title: `${project.title} - ${project.companyName}`,
      description: `${project.productDescription} - ${project.role} project at ${project.companyName}.`,
      images: project.mainImage ? [project.mainImage] : [],
    },
    alternates: {
      canonical: `/my-work/${project.id}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  const project = portfolioData.find((p) => p.id === parseInt(id));
  if (!project) notFound();

  const matchedSkills = skillsData.filter((skill) => project.skillIds.includes(skill.id));

  const breadcrumbItems = [
    { label: "My Work", href: "/my-work" },
    { label: project.title }
  ];

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs items={breadcrumbItems} />
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
      <ProjectNavigation currentProjectId={project.id} />
    </div>
  );
} 