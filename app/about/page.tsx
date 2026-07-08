import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import aboutData from "../data/about.json";
import companiesData from "../data/companies.json";
import TwoColumnBlock from "../components/2-column-block/TwoColumnBlock";
import Philosophy from "../components/philosophy/Philosophy";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import { fetchPublicRoles } from "@/lib/portfolio/roles";
import { fetchPublicProfile } from "@/lib/portfolio/profile";
import { fetchPublicEducation } from "@/lib/portfolio/education";
import { fetchUserLanguages } from "@/lib/portfolio/languages";
import type {
  PortfolioEducation,
  PortfolioLanguage,
  PortfolioProfile,
  PortfolioRole,
} from "@/types/portfolio";

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About',
  description: 'About Artem Dyachuk - Lead Software Engineer and Technical Product Manager in Dallas, Texas. 6+ years of experience in cloud architecture, software engineering, full-stack development, and IoT solutions. Currently at AT&T Connected Solutions.',
  openGraph: {
    title: 'About Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'About Artem Dyachuk - Lead Software Engineer and Technical Product Manager in Dallas, Texas. 6+ years of experience in cloud architecture, software engineering, full-stack development, and IoT solutions. Currently at AT&T Connected Solutions.',
    url: 'https://www.artemdyachuk.com/about',
  },
  twitter: {
    title: 'About Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Learn about Artem Dyachuk, a results-oriented Lead Software Engineer with 6+ years of experience.',
  },
  alternates: {
    canonical: '/about',
  },
};

type WorkHistoryItem = {
  yearRange: string;
  title: string;
  company: string;
};

type EducationEntry = {
  id: string;
  primary: string;
  secondary: string;
  dateLabel: string | null;
};

type LanguageEntry = {
  id: string;
  name: string;
  fluencyLabel: string | null;
};

function formatMonthYear(value: string): string {
  const monthMatch = value.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    const date = new Date(Number(monthMatch[1]), Number(monthMatch[2]) - 1, 1);
    return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  }
  return value;
}

function formatDateRange(startDate: string | null, endDate: string | null): string {
  const start = startDate ? formatMonthYear(startDate) : "";
  const end = endDate ? formatMonthYear(endDate) : "Present";
  if (!start) return end;
  return `${start} – ${end}`;
}

function yearOf(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/(\d{4})/);
  return match ? match[1] : null;
}

function workHistoryFromRoles(roles: PortfolioRole[]): WorkHistoryItem[] {
  return roles.map((role) => ({
    yearRange: formatDateRange(role.startDate, role.endDate),
    title: role.role,
    company: role.company,
  }));
}

function workHistoryFromJson(): WorkHistoryItem[] {
  return companiesData.map((company) => ({
    yearRange: `${company.startDate} - ${company.endDate || "Present"}`,
    title: company.jobTitle,
    company: company.name,
  }));
}

function educationFromFirebase(items: PortfolioEducation[]): EducationEntry[] {
  return items.map((item) => ({
    id: item.id,
    primary: item.fieldOfStudy ? `${item.degree} in ${item.fieldOfStudy}` : item.degree,
    secondary: item.institution,
    dateLabel: yearOf(item.endDate) ?? yearOf(item.startDate),
  }));
}

function educationFromJson(): EducationEntry[] {
  const edu = aboutData.personalInfo.education;
  if (!edu?.degree) return [];
  return [
    {
      id: "json-education",
      primary: edu.field ? `${edu.degree} in ${edu.field}` : edu.degree,
      secondary: "",
      dateLabel: edu.year ? String(edu.year) : null,
    },
  ];
}

function languagesFromFirebase(items: PortfolioLanguage[]): LanguageEntry[] {
  return items.map((language) => ({
    id: language.id,
    name: language.name,
    fluencyLabel: language.fluencyLabel,
  }));
}

function languagesFromJson(): LanguageEntry[] {
  return aboutData.personalInfo.languages.map((name: string) => ({
    id: name,
    name,
    fluencyLabel: null,
  }));
}

export default async function About() {
  const site = await resolvePortfolioSite();

  let roles: PortfolioRole[] = [];
  let profile: PortfolioProfile | null = null;
  let education: PortfolioEducation[] = [];
  let languages: PortfolioLanguage[] = [];

  if (site.ok) {
    const [rolesResult, profileResult, educationResult, languagesResult] = await Promise.allSettled([
      fetchPublicRoles(site.userId),
      fetchPublicProfile(site.userId),
      fetchPublicEducation(site.userId),
      fetchUserLanguages(site.userId),
    ]);

    if (rolesResult.status === "fulfilled") roles = rolesResult.value;
    if (profileResult.status === "fulfilled") profile = profileResult.value;
    if (educationResult.status === "fulfilled") education = educationResult.value;
    if (languagesResult.status === "fulfilled") languages = languagesResult.value;
  }

  // Prefer live data from the career database; fall back to bundled JSON so the
  // page never renders empty if Firebase is unavailable.
  const workHistory = roles.length > 0 ? workHistoryFromRoles(roles) : workHistoryFromJson();
  const summary = profile?.summary || aboutData.summary;
  const careerFocus = profile?.careerFocus ?? "";
  const educationEntries = education.length > 0 ? educationFromFirebase(education) : educationFromJson();
  const languageEntries = languages.length > 0 ? languagesFromFirebase(languages) : languagesFromJson();

  return (
    <main className={styles.main}>
      <TwoColumnBlock
        imageUrl={aboutData.personalInfo.profileImage}
        imageAlt={aboutData.personalInfo.firstName + " " + aboutData.personalInfo.lastName}
        name={aboutData.personalInfo.firstName + " " + aboutData.personalInfo.lastName}
        intro={aboutData.personalInfo.currentRole}
        location={aboutData.personalInfo.location}
        showResumeButton={false}
        workHistory={workHistory}
      />
      <Philosophy
        intro={aboutData.philosophy.intro}
        principles={aboutData.philosophy.principles}
      />
      <section className={styles.about}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.overview}>

              <h2 className={styles.subtitle}>About Me</h2>
              <p className={styles.summary}>{summary}</p>

              {careerFocus ? (
                <div className={styles.careerFocus}>
                  <h3>Career Focus</h3>
                  <p className={styles.summary}>{careerFocus}</p>
                </div>
              ) : null}

              {educationEntries.length > 0 ? (
                <div className={styles.education}>
                  <h3>Education</h3>
                  <ul className={styles.educationList}>
                    {educationEntries.map((item) => (
                      <li key={item.id} className={styles.educationItem}>
                        <span className={styles.educationPrimary}>{item.primary}</span>
                        {item.secondary ? (
                          <span className={styles.educationSecondary}>{item.secondary}</span>
                        ) : null}
                        {item.dateLabel ? (
                          <span className={styles.educationDate}>{item.dateLabel}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {languageEntries.length > 0 ? (
                <div className={styles.languages}>
                  <h3>Languages</h3>
                  <div className={styles.languageList}>
                    {languageEntries.map((language) => (
                      <span key={language.id} className={styles.language}>
                        {language.name}
                        {language.fluencyLabel ? (
                          <span className={styles.languageFluency}> · {language.fluencyLabel}</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={styles.strengths}>
                <h3>Skills</h3>
                <p className={styles.summary}>
                  My core technical and professional competencies — from cloud architecture and
                  full-stack development to technical product management — are kept in sync with my
                  career profile.
                </p>
                <Link href="/skills" className={styles.skillsLink}>
                  Explore skills &amp; expertise →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
