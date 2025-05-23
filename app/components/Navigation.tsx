"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import styles from "./Navigation.module.css";
import ThemeToggle from "./toggle/theme/ThemeToggle";

function HamburgerIcon({ open, ...props }: { open: boolean; [key: string]: unknown }) {
  return (
    <span className={styles.hamburgerIcon} aria-hidden="true" {...props}>
      <span className={`${styles.bar} ${open ? styles.barTopOpen : ""}`} />
      <span className={`${styles.bar} ${open ? styles.barMidOpen : ""}`} />
      <span className={`${styles.bar} ${open ? styles.barBotOpen : ""}`} />
    </span>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Add/remove drawer-open class to body
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (drawerOpen) {
        document.body.classList.add("drawer-open");
      } else {
        document.body.classList.remove("drawer-open");
      }
    }
    // Cleanup on unmount
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("drawer-open");
      }
    };
  }, [drawerOpen]);

  // Close drawer on ESC or click outside (but not on hamburger)
  useEffect(() => {
    if (!drawerOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setDrawerOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [drawerOpen]);

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Artem Dyachuk
        </Link>
        <button
          className={styles.hamburger}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          ref={hamburgerRef}
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <HamburgerIcon open={drawerOpen} />
        </button>
        <div className={styles.links}>
          <Link 
            href="/skills" 
            className={`${styles.link} ${pathname === "/skills" ? styles.active : ""}`}
          >
            Skills
          </Link>
          <Link 
            href="/experience" 
            className={`${styles.link} ${pathname === "/experience" ? styles.active : ""}`}
          >
            Experience
          </Link>
          <Link 
            href="/achievements" 
            className={`${styles.link} ${pathname === "/achievements" ? styles.active : ""}`}
          >
            Achievements
          </Link>
          <Link 
            href="/contact" 
            className={`${styles.link} ${pathname === "/contact" ? styles.active : ""}`}
          >
            Contact
          </Link>
        </div>
        <div className={styles.themeToggleWrapper}>
          <ThemeToggle />
        </div>
      </div>
      {/* Drawer overlay */}
      <div
        className={`${styles.drawerOverlay} ${drawerOpen ? styles.open : ""}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className={`${styles.drawer}`}
          id="mobile-drawer"
          ref={drawerRef}
          tabIndex={-1}
        >
          <div className={styles.drawerLinks}>
            <Link href="/skills" className={styles.link} onClick={() => setDrawerOpen(false)}>
              Skills
            </Link>
            <Link href="/experience" className={styles.link} onClick={() => setDrawerOpen(false)}>
              Experience
            </Link>
            <Link href="/achievements" className={styles.link} onClick={() => setDrawerOpen(false)}>
              Achievements
            </Link>
            <Link href="/contact" className={styles.link} onClick={() => setDrawerOpen(false)}>
              Contact
            </Link>
          </div>
          <div className={styles.drawerThemeToggle}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 