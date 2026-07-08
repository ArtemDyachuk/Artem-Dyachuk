import type { Metadata } from "next";
import styles from "./page.module.css";
import Hero from './components/hero/Hero';
import { FeaturedProjects } from './components/featured-products/FeaturedProjects';
import aboutData from './data/about.json';
import contactsData from './data/contacts.json';
import { Project } from './components/featured-products/ProjectCard';
import { fetchPublicProjects } from '@/lib/portfolio/projects';
import { fetchPublicProfile } from '@/lib/portfolio/profile';
import { resolvePortfolioSite } from '@/lib/portfolio/resolveSite';
import type { PortfolioProfile } from '@/types/portfolio';

export const revalidate = 60;

function toPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export const metadata: Metadata = {
  title: 'Home',
  description: 'Portfolio of Artem Dyachuk - Lead Software Engineer and Technical Product Manager in Dallas. 6+ years of experience in cloud architecture, full-stack development, IoT solutions, and software engineering. Currently at AT&T Connected Solutions.',
  openGraph: {
    title: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Portfolio of Artem Dyachuk - Lead Software Engineer and Technical Product Manager in Dallas. 6+ years of experience in cloud architecture, full-stack development, IoT solutions, and software engineering. Currently at AT&T Connected Solutions.',
    url: 'https://www.artemdyachuk.com',
  },
  twitter: {
    title: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Portfolio of Artem Dyachuk - Lead Software Engineer and Technical Product Manager in Dallas. 6+ years of experience in cloud architecture, full-stack development, IoT solutions, and software engineering. Currently at AT&T Connected Solutions.',
  },
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const site = await resolvePortfolioSite();

  let projects: Project[] = [];
  let profile: PortfolioProfile | null = null;
  if (site.ok) {
    const [projectsResult, profileResult] = await Promise.allSettled([
      fetchPublicProjects(site.userId),
      fetchPublicProfile(site.userId),
    ]);

    if (projectsResult.status === 'fulfilled') {
      projects = projectsResult.value
        .filter((project) => project.featured)
        .map((project) => ({
          id: project.id,
          title: project.name,
          description: toPlainText(project.description),
          caseStudyUrl: '/projects',
        }));
    }

    if (profileResult.status === 'fulfilled') {
      profile = profileResult.value;
    }
  }

  // Structured data for SEO
  const socialLinks = contactsData.contacts
    .filter((c) => c.type === "link" && c.linkType)
    .map((c) => c.value);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": `${aboutData.personalInfo.firstName} ${aboutData.personalInfo.lastName}`,
    "jobTitle": aboutData.personalInfo.currentRole,
    "worksFor": {
      "@type": "Organization",
      "name": aboutData.personalInfo.currentCompany
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": aboutData.personalInfo.location
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Kyiv national university of trade and economics",
      "description": `${aboutData.personalInfo.education.degree} in ${aboutData.personalInfo.education.field} (${aboutData.personalInfo.education.year})`
    },
    "knowsLanguage": aboutData.personalInfo.languages,
    "skills": aboutData.keyStrengths,
    "url": "https://www.artemdyachuk.com",
    "sameAs": socialLinks.length > 0 ? socialLinks : undefined,
    "description": aboutData.summary,
    "email": contactsData.contacts.find((c) => c.type === "email")?.value
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className={styles.main}>
        <Hero
          name={profile?.name}
          headline={profile?.headline}
          summary={profile?.summary}
          avatarUrl={profile?.avatarUrl}
        />
        {projects.length > 0 && <FeaturedProjects projects={projects} />}
      </main>
    </>
  );
}
