import type { Metadata } from "next";
import styles from "./page.module.css";
import Hero from './components/hero/Hero';
import { FeaturedProjects } from './components/featured-products/FeaturedProjects';
import portfolioData from './data/portfolio.json';
import aboutData from './data/about.json';
import { Project } from './components/featured-products/ProjectCard';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Artem Dyachuk\'s portfolio. Lead Software Engineer & Product Manager with 6+ years of experience designing cloud architectures, building scalable solutions, and leading engineering teams at AT&T.',
  openGraph: {
    title: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Welcome to Artem Dyachuk\'s portfolio. Lead Software Engineer & Product Manager with 6+ years of experience designing cloud architectures, building scalable solutions, and leading engineering teams at AT&T.',
    url: 'https://artemdyachuk.com',
  },
  twitter: {
    title: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Welcome to Artem Dyachuk\'s portfolio. Lead Software Engineer & Product Manager with 6+ years of experience designing cloud architectures, building scalable solutions, and leading engineering teams at AT&T.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const projects: Project[] = portfolioData
    .filter(project => project.featured)
    .map(project => ({
      id: project.id,
      title: project.title,
      // imageUrl: `/images/projects/${project.id}.jpg`, // Assuming images follow this naming convention
      altText: `${project.title} - ${project.productDescription}`,
      description: project.productDescription,
      caseStudyUrl: `/my-work/${project.id}`
    }));

  // Structured data for SEO
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
      "name": "University",
      "description": `${aboutData.personalInfo.education.degree} in ${aboutData.personalInfo.education.field}`
    },
    "knowsLanguage": aboutData.personalInfo.languages,
    "skills": aboutData.keyStrengths,
    "url": "https://artemdyachuk.com",
    "sameAs": [
      // Add social media URLs here when available
    ],
    "description": aboutData.summary
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className={styles.main}>
        <Hero />
        {projects.length > 0 && <FeaturedProjects projects={projects} />}
      </main>
    </>
  );
}
