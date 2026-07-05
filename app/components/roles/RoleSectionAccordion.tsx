"use client";

import { useState, type ReactNode } from "react";
import styles from "./RolesList.module.css";

type RoleSectionAccordionProps = {
  title: string;
  count: number;
  defaultOpen: boolean;
  children: ReactNode;
};

export default function RoleSectionAccordion({
  title,
  count,
  defaultOpen,
  children,
}: RoleSectionAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (count === 0) return null;

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={`${styles.sectionToggle} ${open ? styles.sectionToggleOpen : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className={styles.sectionTitle}>
          {title}
          <span className={styles.sectionCount}>({count})</span>
        </span>
        <span className={styles.sectionExpandIcon} aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      <div className={`${styles.sectionPanel} ${open ? styles.sectionPanelOpen : ""}`} aria-hidden={!open}>
        <div className={styles.sectionPanelInner}>{children}</div>
      </div>
    </section>
  );
}
