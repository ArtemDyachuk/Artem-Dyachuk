import styles from "./Footer.module.css";
import { MdEmail } from "react-icons/md";
import { contactLinkIcon, contactLinkLabel } from "@/lib/contactLinks";
import type { PortfolioContactLink } from "@/types/portfolio";
import ClientThemeToggle from "../../toggle/theme/ClientThemeToggle";

type FooterProps = {
  links: PortfolioContactLink[];
  email?: string;
};

export default function Footer({ links, email }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            aria-label={contactLinkLabel(link.type, link.label)}
            title={contactLinkLabel(link.type, link.label)}
            className={styles.icon}
            target="_blank"
            rel="noopener noreferrer"
          >
            {contactLinkIcon(link.type, 18)}
          </a>
        ))}
        {email && (
          <a
            href={`mailto:${email}`}
            aria-label="Email"
            title={email}
            className={styles.icon}
          >
            <MdEmail size={18} />
          </a>
        )}
        <div className={styles.themeToggle}>
          <ClientThemeToggle />
        </div>
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Artem Dyachuk <a href="/privacy-policy" className={styles.privacyLink}>Privacy Policy</a> | <a href="/sitemap-page" className={styles.sitemapLink}>Sitemap</a>
      </div>
    </footer>
  );
}
