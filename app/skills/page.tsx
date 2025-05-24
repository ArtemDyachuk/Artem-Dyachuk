import styles from "./page.module.css";
import skillsData from "../data/skills.json";

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

const sortedTypes = Object.keys(skillsByType).sort((a, b) => a.localeCompare(b));

export default function Skills() {
  return (
    <main className={styles.main}>
      <section className={styles.skills}>
        <div className={styles.container}>
          <h1 className={styles.title}>Skills & Expertise</h1>

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