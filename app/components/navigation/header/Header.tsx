"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import contactsData from "../../../data/contacts.json";
import styles from "./Header.module.css";

const github = contactsData.contacts.find(c => c.linkType === "GitHub");
const linkedin = contactsData.contacts.find(c => c.linkType === "LinkedIn");
const email = contactsData.contacts.find(c => c.type === "email");

function HamburgerIcon({ open, ...props }: { open: boolean;[key: string]: unknown }) {
  return (
    <span className={styles.hamburgerIcon} aria-hidden="true" {...props}>
      <span className={`${styles.bar} ${open ? styles.barTopOpen : ""}`} />
      <span className={`${styles.bar} ${open ? styles.barMidOpen : ""}`} />
      <span className={`${styles.bar} ${open ? styles.barBotOpen : ""}`} />
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Handle internal navigation - close instantly
  const handleInternalNavigation = () => {
    setIsClosing(true);
    setDrawerOpen(false);
    // Reset closing state after a brief moment
    setTimeout(() => setIsClosing(false), 50);
  };

  const navigationLinks = [
    { href: "/my-work", label: "My Work" },
    { href: "/achievements", label: "Achievements" },
    { href: "/experience", label: "Experience" },
    { href: "/skills", label: "Skills" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <>
      <nav className={styles.navigation}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo} onClick={handleInternalNavigation}>
            Artem Dyachuk
          </Link>

          {/* Desktop Links */}
          <div className={styles.links}>
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.active : ""} ${link.href === '/contact' ? styles.ctaButton : ""}`}
                onClick={handleInternalNavigation}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={styles.hamburger}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <HamburgerIcon open={drawerOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawer} ${drawerOpen ? styles.open : ""} ${isClosing ? styles.closing : ""}`}
        ref={drawerRef}
      >
        <div className={styles.drawerContent}>
          {/* Mobile Navigation Links */}
          {navigationLinks.map((link) => (
            <Link
              key={`mobile-${link.href}`}
              href={link.href}
              className={`${styles.drawerLink} ${link.href === '/contact' ? styles.ctaButtonMobile : ""}`}
              onClick={handleInternalNavigation}
            >
              {link.label}
            </Link>
          ))}

          {/* Social Icons */}
          <div className={styles.socialIcons}>
            {linkedin && (
              <Link
                href={linkedin.value}
                className={styles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </Link>
            )}
            {github && (
              <Link
                href={github.value}
                className={styles.socialIcon}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </Link>
            )}
            {email && (
              <Link
                href="/contact"
                className={styles.socialIcon}
                aria-label="Email"
                onClick={handleInternalNavigation}
              >
                <MdEmail size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 