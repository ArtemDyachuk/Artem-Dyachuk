"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export type SkillModalData = {
  name: string;
  category: string;
  note: string | null;
};

export default function SkillModal({
  skill,
  onClose,
}: {
  skill: SkillModalData;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-modal-title"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          ref={closeRef}
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <p className={styles.modalCategory}>{skill.category}</p>
        <h3 id="skill-modal-title" className={styles.modalTitle}>
          {skill.name}
        </h3>
        {skill.note ? (
          <p className={styles.modalNote}>{skill.note}</p>
        ) : (
          <p className={styles.modalNoteEmpty}>No additional details.</p>
        )}
      </div>
    </div>
  );
}
