import type { Metadata } from "next";
import styles from "./page.module.css";
import skillsData from "../data/skills.json";

export const metadata: Metadata = {
  title: 'Skills & Expertise',
  description: 'Technical skills and expertise of Artem Dyachuk - Lead Software Engineer and Technical Product Manager. Expertise in cloud architecture (AWS, Kubernetes, Terraform), full-stack development (React, Next.js, Node.js), software engineering, IoT solutions, and technical product management.',
  openGraph: {
    title: 'Skills & Expertise - Artem Dyachuk',
    description: 'Technical skills and expertise of Artem Dyachuk - Lead Software Engineer and Technical Product Manager. Expertise in cloud architecture (AWS, Kubernetes, Terraform), full-stack development (React, Next.js, Node.js), software engineering, IoT solutions, and technical product management.',
    url: 'https://www.artemdyachuk.com/skills',
  },
  twitter: {
    title: 'Skills & Expertise - Artem Dyachuk',
    description: 'Explore Artem Dyachuk\'s technical skills and expertise including Full-Stack Development, Product Strategy, and more.',
  },
  alternates: {
    canonical: '/skills',
  },
};

interface Skill {
  id: number;
  title: string;
  type: string;
  description: string;
  order: number;
}

// Group skills by type
const skillsByType = (skillsData as Skill[]).reduce((acc: Record<string, Skill[]>, skill: Skill) => {
  if (!acc[skill.type]) acc[skill.type] = [];
  acc[skill.type].push(skill);
  return acc;
}, {});

const sortedTypes = Object.keys(skillsByType).sort((a, b) => {
  const priorityOrder = ["Product Management", "Technical Expertise", "Digital Marketing"];
  const aIndex = priorityOrder.indexOf(a);
  const bIndex = priorityOrder.indexOf(b);

  // If both are in priority list, sort by their priority order
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }

  // If only a is in priority list, a comes first
  if (aIndex !== -1) return -1;

  // If only b is in priority list, b comes first
  if (bIndex !== -1) return 1;

  // If neither is in priority list, sort alphabetically
  return a.localeCompare(b);
});

export default function Skills() {
  return (
    <main className={styles.main}>
      <section className={styles.skills}>
        <div className={styles.container}>
          <h1 className={styles.title}>Skills & Expertise</h1>
          <p className={styles.pageSummary}>
            This page outlines my core professional competencies as a Lead Software Engineer and Technical Product Manager. It reflects deep expertise in cloud architecture, software engineering, full-stack development (React, Next.js, Node.js), technical product management, IoT solutions, and DevOps practices, accumulated throughout my 6+ year career.
          </p>

          {sortedTypes.map((type) => {
            // Sort by order (as number), then by title
            const sortedSkills = [...skillsByType[type]].sort((a, b) => {
              if (a.order === b.order) {
                return a.title.localeCompare(b.title);
              }
              return a.order - b.order;
            });
            return (
              <section key={type} className={styles.skillSection}>
                <h2 className={styles.sectionTitle}>{type}</h2>
                <div className={styles.skillGrid}>
                  {sortedSkills.map((skill) => (
                    <div key={skill.id} className={styles.skillBadge}>
                      <span className={styles.skillTitle}>{skill.title}</span>
                      {skill.description && skill.description.trim() !== "" && (
                        <span className={styles.skillDescription}>{skill.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
} 