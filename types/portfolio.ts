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

export type PortfolioSiteResolution =
  | { ok: true; userId: string; slug: string | null }
  | { ok: false; reason: "missing_config" | "site_not_found" | "site_disabled" };
