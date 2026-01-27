import React from 'react';
import type { Metadata } from "next";
import contactsData from "../data/contacts.json";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "./page.module.css";
import DownloadResumeButton from "../components/resume/download/DownloadResumeButton";
import CustomContactForm from "../components/contact-form/CustomContactForm";

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Artem Dyachuk, Digital Product Manager and Full-Stack Developer. Available for product management opportunities, technical consulting, and collaboration.',
  openGraph: {
    title: 'Contact Artem Dyachuk - Digital Product Manager',
    description: 'Get in touch with Artem Dyachuk, Digital Product Manager and Full-Stack Developer. Available for product management opportunities, technical consulting, and collaboration.',
    url: 'https://artemdyachuk.com/contact',
  },
  twitter: {
    title: 'Contact Artem Dyachuk - Digital Product Manager',
    description: 'Get in touch with Artem Dyachuk for product management opportunities and technical consulting.',
  },
  alternates: {
    canonical: '/contact',
  },
};

const iconMap: Record<string, React.ReactNode> = {
  GitHub: <FaGithub size={22} color="#333" />,
  LinkedIn: <FaLinkedin size={22} color="#2563eb" />,
};

export default async function Contact() {
  const links = contactsData.contacts.filter((c) => c.type === "link");

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Contact</h1>
      <div className={styles.contactContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.formDescription}>
            <p>
              Please reach out if you have any questions or opportunities. I&apos;d love to hear from you!
            </p>
            <p className={styles.formNote}>
              Do not contact with marketing requests.
            </p>
          </div>
          <div className={styles.contactForm}>
            <CustomContactForm />
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          {links.length > 0 && (
            <div className={styles.linksSection}>
              <h3 className={styles.linksTitle}>Links</h3>
              <ul className={styles.linksList}>
                {links.map((link) => (
                  <li key={link.value} className={styles.linkItem}>
                    <a href={link.value} target="_blank" rel="noopener noreferrer" className={styles.linkUrl}>
                      {link.linkType && iconMap[link.linkType]}
                      <span>{link.linkType}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className={styles.resumeSection}>
            <DownloadResumeButton variant="primary" size="medium" />
          </div>
        </div>
      </div>
    </main>
  );
} 