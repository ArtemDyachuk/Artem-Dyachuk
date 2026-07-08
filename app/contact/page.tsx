import type { Metadata } from "next";
import { fetchPortfolioContact } from "@/lib/portfolio/contact";
import { contactLinkIcon, contactLinkLabel } from "@/lib/contactLinks";
import styles from "./page.module.css";
import CustomContactForm from "../components/contact-form/CustomContactForm";

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Artem Dyachuk, Lead Software Engineer & Product Manager. Available for technical consulting and collaboration.',
  openGraph: {
    title: 'Contact Artem Dyachuk - Lead Software Engineer',
    description: 'Get in touch with Artem Dyachuk, Lead Software Engineer & Product Manager. Available for technical consulting and collaboration.',
    url: 'https://www.artemdyachuk.com/contact',
  },
  twitter: {
    title: 'Contact Artem Dyachuk - Lead Software Engineer',
    description: 'Get in touch with Artem Dyachuk for product management opportunities and technical consulting.',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default async function Contact() {
  const { links } = await fetchPortfolioContact();

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
                  <li key={link.id} className={styles.linkItem}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkUrl}>
                      {contactLinkIcon(link.type)}
                      <span>{contactLinkLabel(link.type, link.label)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 