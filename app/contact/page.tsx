import contactsData from "../data/contacts.json";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "./page.module.css";
import { headers } from "next/headers";

const iconMap: Record<string, JSX.Element> = {
  email: <MdEmail size={22} color="#2563eb" style={{ marginRight: 8 }} />,
  phone: <MdPhone size={22} color="#2563eb" style={{ marginRight: 8 }} />,
  GitHub: <FaGithub size={22} color="#333" style={{ marginRight: 8 }} />,
  LinkedIn: <FaLinkedin size={22} color="#2563eb" style={{ marginRight: 8 }} />,
};

async function submitForm(formData: FormData) {
  "use server";
  
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch(`${protocol}://${host}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Form submission error:", error);
    return false;
  }
}

export default function Contact() {
  const email = contactsData.contacts.find((c) => c.type === "email");
  const phone = contactsData.contacts.find((c) => c.type === "phone");
  const links = contactsData.contacts.filter((c) => c.type === "link");

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Contact</h1>
      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <h2 className={styles.subtitle}>Get in Touch</h2>
          <p className={styles.intro}>Feel free to reach out if you have any questions or opportunities.</p>
          <div className={styles.infoSection}>
            {email && (
              <div className={styles.infoRow}>
                {iconMap.email}
                <span><strong>Email:</strong> {email.value}</span>
              </div>
            )}
            {phone && (
              <div className={styles.infoRow}>
                {iconMap.phone}
                <span><strong>Phone:</strong> {phone.value}</span>
              </div>
            )}
          </div>
          {links.length > 0 && (
            <div className={styles.linksSection}>
              <h3 className={styles.linksTitle}>Links</h3>
              <ul className={styles.linksList}>
                {links.map((link) => (
                  <li key={link.value} className={styles.linkItem}>
                    <div className={styles.linkLabel}>
                      {link.linkType && iconMap[link.linkType]}
                      <strong>{link.linkType}:</strong>
                    </div>
                    <a href={link.value} target="_blank" rel="noopener noreferrer" className={styles.linkUrl}>{link.value}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <form className={styles.contactForm} action={submitForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
} 