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
};

export type PortfolioSiteResolution =
  | { ok: true; userId: string; slug: string | null }
  | { ok: false; reason: "missing_config" | "site_not_found" | "site_disabled" };
