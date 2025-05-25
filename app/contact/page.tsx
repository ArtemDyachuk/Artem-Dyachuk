import React from 'react';
import type { Metadata } from "next";
import contactsData from "../data/contacts.json";
import { MdEmail, MdPhone } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import styles from "./page.module.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DownloadResumeButton from "../components/resume/download/DownloadResumeButton";

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
  email: <MdEmail size={22} color="#2563eb" style={{ marginRight: 8 }} />,
  phone: <MdPhone size={22} color="#2563eb" style={{ marginRight: 8 }} />,
  GitHub: <FaGithub size={22} color="#333" style={{ marginRight: 8 }} />,
  LinkedIn: <FaLinkedin size={22} color="#2563eb" style={{ marginRight: 8 }} />,
};

async function submitForm(formData: FormData) {
  "use server";
  
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  let result;
  try {
    const response = await fetch(`${protocol}://${host}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    result = await response.json();
  } catch (error) {
    console.error("Form submission error:", error);
    redirect('/contact?error=true');
  }
  
  // Handle redirects outside of try-catch to avoid catching NEXT_REDIRECT
  if (result && result.success) {
    redirect('/contact?success=true');
  } else {
    redirect('/contact?error=true');
  }
}

export default async function Contact({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams;
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
          
          {/* Download Resume Button */}
          <div className={styles.resumeSection}>
            <DownloadResumeButton variant="primary" size="medium" />
          </div>

          <div className={styles.infoSection}>
            {email && (
              <div className={styles.infoRow}>
                {iconMap.email}
                <span><strong>Email:</strong> <a href={`mailto:${email.value}`}>{email.value}</a></span>
              </div>
            )}
            {phone && (
              <div className={styles.infoRow}>
                {iconMap.phone}
                <span><strong>Phone:</strong> <a href={`tel:${phone.value}`}>{phone.value}</a></span>
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
          {params.success && (
            <div className={styles.successMessage}>
              Thank you for your inquiry! I will get in touch with you soon.
            </div>
          )}
          {params.error && (
            <div className={styles.errorMessage}>
              Sorry, there was an error sending your inquiry. Please try again or contact me directly via email.
            </div>
          )}
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
            <textarea id="message" name="message" rows={5}></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
} 