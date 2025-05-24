import styles from "./Footer.module.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import contactsData from "../../../data/contacts.json";
import ClientThemeToggle from "../../toggle/theme/ClientThemeToggle";

const github = contactsData.contacts.find(c => c.linkType === "GitHub");
const linkedin = contactsData.contacts.find(c => c.linkType === "LinkedIn");
const email = contactsData.contacts.find(c => c.type === "email");

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.socials}>
        {linkedin && (
          <a href={linkedin.value} aria-label="LinkedIn" className={styles.icon} target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={18} />
          </a>
        )}
        {github && (
          <a href={github.value} aria-label="GitHub" className={styles.icon} target="_blank" rel="noopener noreferrer">
            <FaGithub size={18} />
          </a>
        )}
        {email && (
          <a href="/contact" aria-label="Email" className={styles.icon}>
            <MdEmail size={18} />
          </a>
        )}
        <div className={styles.themeToggle}>
          <ClientThemeToggle />
        </div>
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Artem Dyachuk.
      </div>
    </footer>
  );
} 