export type PortfolioResponsibility = {
  id: string;
  name: string;
  text: string;
};

export type PortfolioAchievement = {
  id: string;
  title: string;
  description: string;
  date: string | null;
  /** Drag order from resume-tailor; null for legacy items. */
  sortOrder: number | null;
};

export type PortfolioSkill = {
  id: string;
  name: string;
  category: string;
};

export type PortfolioUserSkill = {
  id: string;
  name: string;
  category: string;
  note: string | null;
};

export type PortfolioSkillCategory = {
  category: string;
  skills: PortfolioUserSkill[];
};

export type PortfolioLanguage = {
  id: string;
  name: string;
  fluencyLevel: string;
  fluencyLabel: string;
};

export type PortfolioRole = {
  id: string;
  company: string;
  companyLogoUrl: string | null;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  roleOverview: string | null;
  responsibilities: PortfolioResponsibility[];
  achievements: PortfolioAchievement[];
  skills: PortfolioSkill[];
};

export type PortfolioContactLink = {
  id: string;
  /** Preset key mirrored from resume-tailor (linkedin, github, portfolio, …). */
  type: string;
  label: string;
  url: string;
};

export type PortfolioContactEmail = {
  id: string;
  address: string;
  label: string;
};

export type PortfolioContactPhone = {
  id: string;
  number: string;
  label: string;
};

export type PortfolioProfile = {
  /** Owner's display name, mirrored from the resume-tailor account. */
  name: string;
  firstName: string;
  lastName: string;
  /** Presigned URL for a self-uploaded avatar, or null to use the site default. */
  avatarUrl: string | null;
  headline: string;
  summary: string;
  careerFocus: string;
  emails: PortfolioContactEmail[];
  phones: PortfolioContactPhone[];
  links: PortfolioContactLink[];
};

export type PortfolioEducation = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | null;
  endDate: string | null;
  notes: string;
};

export type PortfolioCertification = {
  id: string;
  name: string;
  issuer: string;
  category: string;
  issueDate: string | null;
  expiryDate: string | null;
  credentialUrl: string;
};

export type PortfolioProjectSkill = {
  id: string;
  name: string;
};

export type PortfolioProject = {
  id: string;
  name: string;
  /** HTML from the rich text editor. */
  description: string;
  startDate: string | null;
  endDate: string | null;
  featured: boolean;
  skills: PortfolioProjectSkill[];
  /** Linked public role id (only set when the role is published to the portfolio). */
  roleId: string | null;
  roleLabel: string | null;
};

export type PortfolioSiteResolution =
  | { ok: true; userId: string; slug: string | null }
  | { ok: false; reason: "missing_config" | "site_not_found" | "site_disabled" };
