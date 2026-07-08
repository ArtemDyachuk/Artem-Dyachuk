import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Complete sitemap of Artem Dyachuk&apos;s portfolio website. Navigate to all pages including work samples, skills, experience, and more.',
  openGraph: {
    title: 'Sitemap - Artem Dyachuk',
    description: 'Complete sitemap of Artem Dyachuk&apos;s portfolio website. Navigate to all pages including work samples, skills, experience, and more.',
    url: 'https://www.artemdyachuk.com/sitemap-page',
  },
  twitter: {
    title: 'Sitemap - Artem Dyachuk',
    description: 'Complete sitemap of Artem Dyachuk&apos;s portfolio website.',
  },
  alternates: {
    canonical: '/sitemap-page',
  },
};

export default function SitemapPage() {
  const mainPages = [
    {
      title: "Home",
      url: "/",
      description: "Welcome to Artem Dyachuk's portfolio. Lead Software Engineer & Product Manager."
    },
    {
      title: "About",
      url: "/about",
      description: "Learn about Artem Dyachuk's background, education, and professional journey."
    },
    {
      title: "Skills",
      url: "/skills",
      description: "Explore technical skills, programming languages, frameworks, and tools."
    },
    {
      title: "Experience",
      url: "/experience",
      description: "Professional work history and career highlights."
    },
    {
      title: "Achievements",
      url: "/achievements",
      description: "Professional accomplishments, certifications, and recognitions."
    },
    {
      title: "Projects",
      url: "/projects",
      description: "Portfolio of projects and professional work samples."
    },
    {
      title: "Contact",
      url: "/contact",
      description: "Get in touch for collaboration, opportunities, or inquiries."
    }
  ];

  const utilityPages = [
    {
      title: "Privacy Policy",
      url: "/privacy-policy",
      description: "Information about data collection, usage, and privacy practices."
    },
    {
      title: "Sitemap",
      url: "/sitemap-page",
      description: "Complete list of all pages on this website."
    }
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Sitemap</h1>
          <p className={styles.intro}>
            Complete navigation guide to all pages on Artem Dyachuk&apos;s portfolio website. 
            Find everything from professional work samples to background information.
          </p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Main Pages</h2>
            <div className={styles.pageGrid}>
              {mainPages.map((page) => (
                <div key={page.url} className={styles.pageCard}>
                  <h3 className={styles.pageTitle}>
                    <a href={page.url} className={styles.pageLink}>
                      {page.title}
                    </a>
                  </h3>
                  <p className={styles.pageDescription}>{page.description}</p>
                  <span className={styles.pageUrl}>{page.url}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Utility Pages</h2>
            <div className={styles.pageGrid}>
              {utilityPages.map((page) => (
                <div key={page.url} className={styles.pageCard}>
                  <h3 className={styles.pageTitle}>
                    <a href={page.url} className={styles.pageLink}>
                      {page.title}
                    </a>
                  </h3>
                  <p className={styles.pageDescription}>{page.description}</p>
                  <span className={styles.pageUrl}>{page.url}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Technical Sitemap</h2>
            <p className={styles.sectionDescription}>
              For search engines and developers, the XML sitemap is available at:{" "}
              <a href="/sitemap.xml" className={styles.xmlLink} target="_blank" rel="noopener noreferrer">
                /sitemap.xml
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 