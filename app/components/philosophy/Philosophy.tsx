import styles from './Philosophy.module.css';

interface PhilosophyPrinciple {
  title: string;
  description: string;
}

interface PhilosophyProps {
  intro: string;
  principles: PhilosophyPrinciple[];
}

export default function Philosophy({ intro, principles }: PhilosophyProps) {
  return (
    <section className={styles.philosophy}>
      <div className={styles.container}>
        <h2 className={styles.title}>My Product Philosophy</h2>
        <p className={styles.intro}>{intro}</p>
        <ul className={styles.principlesList}>
          {principles.map((principle, index) => (
            <li key={index} className={styles.principleItem}>
              <strong className={styles.principleTitle}>{principle.title}:</strong>{' '}
              <span className={styles.principleDescription}>{principle.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
} 