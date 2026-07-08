"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import SkillModal, { type SkillModalData } from "./SkillModal";
import type { PortfolioLanguage, PortfolioSkillCategory } from "@/types/portfolio";

const LANGUAGES_LABEL = "Languages";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type NavItem = {
  id: string;
  label: string;
};

export default function SkillsContent({
  categories,
  languages,
}: {
  categories: PortfolioSkillCategory[];
  languages: PortfolioLanguage[];
}) {
  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [];
    if (languages.length > 0) {
      items.push({ id: slugify(LANGUAGES_LABEL), label: LANGUAGES_LABEL });
    }
    for (const group of categories) {
      items.push({ id: slugify(group.category), label: group.category });
    }
    return items;
  }, [categories, languages]);

  const [activeId, setActiveId] = useState<string>(navItems[0]?.id ?? "");
  const [selectedSkill, setSelectedSkill] = useState<SkillModalData | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  // While a click-driven smooth scroll is in flight, ignore scroll-spy so the
  // active indicator doesn't churn through every intermediate section.
  const suppressSpyRef = useRef(false);
  const clickTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (navItems.length === 0) return;

    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const visible = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (suppressSpyRef.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }

        // Pick the section closest to the top that is currently visible.
        let topId = "";
        let topOffset = Number.POSITIVE_INFINITY;
        for (const id of visible.keys()) {
          const el = document.getElementById(id);
          if (!el) continue;
          const offset = Math.abs(el.getBoundingClientRect().top);
          if (offset < topOffset) {
            topOffset = offset;
            topId = id;
          }
        }

        if (topId) setActiveId(topId);
      },
      {
        // Account for the fixed 65px header; trigger a bit before the section
        // reaches the very top of the viewport.
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    for (const section of sections) {
      observerRef.current.observe(section);
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [navItems]);

  // Once the page finishes scrolling, re-enable scroll-spy.
  useEffect(() => {
    const release = () => {
      suppressSpyRef.current = false;
    };
    window.addEventListener("scrollend", release);
    return () => window.removeEventListener("scrollend", release);
  }, []);

  // Keep the active chip visible in the horizontal mobile bar.
  useEffect(() => {
    const container = mobileNavRef.current;
    const chip = chipRefs.current.get(activeId);
    if (!container || !chip) return;
    const target = chip.offsetLeft - container.clientWidth / 2 + chip.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [activeId]);

  if (categories.length === 0 && languages.length === 0) {
    return <p className={styles.empty}>No skills published yet.</p>;
  }

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    suppressSpyRef.current = true;
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Fallback: if `scrollend` never fires (e.g. target already in view or
    // older browsers), lift the suppression after a short delay.
    window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      suppressSpyRef.current = false;
    }, 800);
  };

  return (
    <>
      <nav className={styles.mobileNav} aria-label="Skill categories">
        <div className={styles.mobileNavTrack} ref={mobileNavRef}>
          {navItems.map((item) => (
            <a
              key={item.id}
              ref={(el) => {
                if (el) chipRefs.current.set(item.id, el);
                else chipRefs.current.delete(item.id);
              }}
              href={`#${item.id}`}
              className={`${styles.mobileChip} ${
                activeId === item.id ? styles.mobileChipActive : ""
              }`}
              onClick={(event) => handleNavClick(event, item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className={styles.layout}>
        <div className={styles.content}>
        {languages.length > 0 ? (
          <section id={slugify(LANGUAGES_LABEL)} className={styles.skillSection}>
            <h2 className={styles.sectionTitle}>{LANGUAGES_LABEL}</h2>
            <div className={styles.skillGrid}>
              {languages.map((language) => (
                <div key={language.id} className={styles.skillBadge}>
                  <span className={styles.skillTitle}>{language.name}</span>
                  <span className={styles.skillDescription}>{language.fluencyLabel}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {categories.map((group) => (
          <section
            key={group.category}
            id={slugify(group.category)}
            className={styles.skillSection}
          >
            <h2 className={styles.sectionTitle}>{group.category}</h2>
            <div className={styles.skillGrid}>
              {group.skills.map((skill) => (
                <div key={skill.id} className={styles.skillBadge}>
                  <span className={styles.skillTitle}>{skill.name}</span>
                  {skill.note ? (
                    <button
                      type="button"
                      className={styles.infoButton}
                      aria-label={`Details about ${skill.name}`}
                      title={skill.note}
                      onClick={() =>
                        setSelectedSkill({
                          name: skill.name,
                          category: group.category,
                          note: skill.note,
                        })
                      }
                    >
                      i
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className={styles.sidebar} aria-label="Skill categories">
        <nav className={styles.sidebarNav}>
          <p className={styles.sidebarHeading}>Categories</p>
          <ul className={styles.sidebarList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`${styles.sidebarLink} ${
                    activeId === item.id ? styles.sidebarLinkActive : ""
                  }`}
                  onClick={(event) => handleNavClick(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

        {selectedSkill ? (
          <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
        ) : null}
      </div>
    </>
  );
}
