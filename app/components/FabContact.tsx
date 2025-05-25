'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./FabContact.module.css";

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="none" />
      <path d="M4 8.5V16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5l-8 5-8-5Z" fill="currentColor"/>
      <path d="M20 8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2l8 5 8-5Z" fill="currentColor"/>
    </svg>
  );
}

export default function FabContact() {
  const pathname = usePathname();
  
  // Don't render the FAB on the contact page
  if (pathname === '/contact') {
    return null;
  }

  return (
    <Link href="/contact" className={styles.fab} aria-label="Contact Me">
      <MailIcon />
    </Link>
  );
} 