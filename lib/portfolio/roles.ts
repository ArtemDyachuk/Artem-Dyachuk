import "server-only";

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import { createPresignedDownloadUrl, isPublicCompanyLogoKey } from "@/lib/r2";
import { isR2Configured } from "@/lib/r2Config";
import type {
  PortfolioAchievement,
  PortfolioResponsibility,
  PortfolioRole,
  PortfolioSkill,
} from "@/types/portfolio";

type CompanyCacheEntry = {
  name: string | null;
  logoR2Key: string | null;
};

const companyCache = new Map<string, CompanyCacheEntry>();
const categoryNameCache = new Map<string, string | null>();

function isPublicOnPortfolio(value: unknown): boolean {
  return value === true;
}

async function resolveCompany(companyId: string): Promise<CompanyCacheEntry> {
  if (companyCache.has(companyId)) {
    return companyCache.get(companyId)!;
  }

  const db = getServerFirestore();
  const snap = await getDoc(doc(db, "companies", companyId));
  const data = snap.exists() ? snap.data() : null;

  const entry: CompanyCacheEntry = {
    name: data && typeof data.name === "string" ? data.name : null,
    logoR2Key: data && typeof data.logoR2Key === "string" ? data.logoR2Key : null,
  };

  companyCache.set(companyId, entry);
  return entry;
}

async function resolveCompanyLogoUrl(logoR2Key: string | null): Promise<string | null> {
  if (!logoR2Key || !isR2Configured() || !isPublicCompanyLogoKey(logoR2Key)) {
    return null;
  }

  try {
    const { downloadUrl } = await createPresignedDownloadUrl(logoR2Key);
    return downloadUrl;
  } catch {
    return null;
  }
}

function shouldShowResponsibilityOnPortfolio(raw: Record<string, unknown>): boolean {
  if (raw.includeOnPortfolio === false) return false;
  if (raw.includeOnPortfolio === true) return true;
  // Role is already public — inherit resume-pool items unless explicitly hidden from portfolio.
  return raw.includeInResume !== false;
}

function mapResponsibility(raw: Record<string, unknown>): PortfolioResponsibility | null {
  if (!shouldShowResponsibilityOnPortfolio(raw)) return null;

  const id = typeof raw.id === "string" ? raw.id : "";
  const name = typeof raw.name === "string" ? raw.name : "";
  const text = typeof raw.text === "string" ? raw.text : "";
  if (!text.trim()) return null;

  return { id, name, text };
}

function normalizeExperienceIds(raw: Record<string, unknown>): string[] {
  const ids = new Set<string>();
  if (Array.isArray(raw.experienceIds)) {
    for (const id of raw.experienceIds) {
      if (typeof id === "string" && id.trim()) ids.add(id.trim());
    }
  }
  if (typeof raw.experienceId === "string" && raw.experienceId.trim()) {
    ids.add(raw.experienceId.trim());
  }
  return [...ids];
}

async function resolveCategoryName(categoryId: string): Promise<string | null> {
  if (categoryNameCache.has(categoryId)) {
    return categoryNameCache.get(categoryId) ?? null;
  }

  const db = getServerFirestore();
  const snap = await getDoc(doc(db, "categories", categoryId));
  const name = snap.exists() && typeof snap.data()?.name === "string" ? snap.data()!.name : null;
  categoryNameCache.set(categoryId, name);
  return name;
}

function sortSkills(items: PortfolioSkill[]): PortfolioSkill[] {
  return [...items].sort(
    (left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name),
  );
}

async function fetchPublicSkillsByRole(
  userId: string,
  roleIds: string[],
): Promise<Map<string, PortfolioSkill[]>> {
  const byRole = new Map<string, PortfolioSkill[]>();
  for (const roleId of roleIds) {
    byRole.set(roleId, []);
  }
  if (roleIds.length === 0) return byRole;

  const roleIdSet = new Set(roleIds);
  const db = getServerFirestore();
  const userSkillsSnap = await getDocs(collection(db, "users", userId, "userSkills"));

  type LinkedSkill = {
    userSkillId: string;
    skillId: string;
    level: string;
    roleIds: string[];
  };

  const linked: LinkedSkill[] = [];
  const globalSkillIds = new Set<string>();

  for (const docSnap of userSkillsSnap.docs) {
    const data = docSnap.data() as Record<string, unknown>;
    const roleLinks = normalizeExperienceIds(data).filter((id) => roleIdSet.has(id));
    if (roleLinks.length === 0) continue;

    const skillId = typeof data.skillId === "string" ? data.skillId.trim() : "";
    if (!skillId) continue;

    globalSkillIds.add(skillId);
    linked.push({
      userSkillId: docSnap.id,
      skillId,
      level: typeof data.level === "string" ? data.level : "familiar",
      roleIds: roleLinks,
    });
  }

  const globalSkillById = new Map<string, { name: string; categoryId: string }>();
  await Promise.all(
    [...globalSkillIds].map(async (skillId) => {
      const snap = await getDoc(doc(db, "skills", skillId));
      if (!snap.exists()) return;
      const data = snap.data();
      const name = typeof data?.name === "string" ? data.name : "";
      const categoryId = typeof data?.categoryId === "string" ? data.categoryId : "";
      if (name && categoryId) {
        globalSkillById.set(skillId, { name, categoryId });
      }
    }),
  );

  for (const item of linked) {
    const globalSkill = globalSkillById.get(item.skillId);
    if (!globalSkill) continue;

    const category = (await resolveCategoryName(globalSkill.categoryId)) ?? "Other";
    const portfolioSkill: PortfolioSkill = {
      id: item.userSkillId,
      name: globalSkill.name,
      category,
    };

    for (const roleId of item.roleIds) {
      byRole.get(roleId)?.push(portfolioSkill);
    }
  }

  for (const [roleId, skills] of byRole) {
    byRole.set(roleId, sortSkills(skills));
  }

  return byRole;
}

function mapAchievement(id: string, raw: Record<string, unknown>): PortfolioAchievement | null {
  if (!isPublicOnPortfolio(raw.includeOnPortfolio)) return null;

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const description = typeof raw.description === "string" ? raw.description.trim() : "";
  if (!title || !description) return null;

  return {
    id,
    title,
    description,
    date: typeof raw.date === "string" ? raw.date : null,
  };
}

async function mapRole(id: string, raw: Record<string, unknown>): Promise<PortfolioRole | null> {
  if (!isPublicOnPortfolio(raw.includeOnPortfolio)) return null;

  const role = typeof raw.role === "string" ? raw.role : "";
  if (!role.trim()) return null;

  let company = typeof raw.company === "string" ? raw.company.trim() : "";
  let logoR2Key: string | null = null;

  if (typeof raw.companyId === "string" && raw.companyId.trim()) {
    const resolved = await resolveCompany(raw.companyId.trim());
    if (!company) {
      company = resolved.name ?? "";
    }
    logoR2Key = resolved.logoR2Key;
  }

  if (!company) return null;

  const responsibilities = Array.isArray(raw.responsibilities)
    ? raw.responsibilities
        .map((item) =>
          item && typeof item === "object" ? mapResponsibility(item as Record<string, unknown>) : null,
        )
        .filter((item): item is PortfolioResponsibility => item != null)
    : [];

  const companyLogoUrl = await resolveCompanyLogoUrl(logoR2Key);

  return {
    id,
    company,
    companyLogoUrl,
    role,
    location: typeof raw.location === "string" ? raw.location : null,
    startDate: typeof raw.startDate === "string" ? raw.startDate : "",
    endDate: typeof raw.endDate === "string" ? raw.endDate : null,
    roleOverview: typeof raw.roleOverview === "string" ? raw.roleOverview : null,
    responsibilities,
    achievements: [],
    skills: [],
  };
}

function sortAchievements(items: PortfolioAchievement[]): PortfolioAchievement[] {
  return [...items].sort((left, right) => {
    if (left.date && right.date) return right.date.localeCompare(left.date);
    if (left.date) return -1;
    if (right.date) return 1;
    return left.title.localeCompare(right.title);
  });
}

function sortRoles(roles: PortfolioRole[]): PortfolioRole[] {
  return [...roles].sort((left, right) => right.startDate.localeCompare(left.startDate));
}

async function fetchPublicAchievementsByRole(userId: string): Promise<Map<string, PortfolioAchievement[]>> {
  const db = getServerFirestore();
  const snap = await getDocs(
    query(
      collection(db, "users", userId, "achievements"),
      where("includeOnPortfolio", "==", true),
    ),
  );

  const byRole = new Map<string, PortfolioAchievement[]>();
  for (const docSnap of snap.docs) {
    const achievement = mapAchievement(docSnap.id, docSnap.data() as Record<string, unknown>);
    if (!achievement) continue;

    const experienceId = docSnap.data().experienceId;
    if (typeof experienceId !== "string" || !experienceId.trim()) continue;

    const list = byRole.get(experienceId) ?? [];
    list.push(achievement);
    byRole.set(experienceId, list);
  }

  for (const [roleId, items] of byRole) {
    byRole.set(roleId, sortAchievements(items));
  }

  return byRole;
}

export async function fetchPublicRoles(userId: string): Promise<PortfolioRole[]> {
  const [rolesSnap, achievementsByRole] = await Promise.all([
    getDocs(
      query(
        collection(getServerFirestore(), "users", userId, "roles"),
        where("includeOnPortfolio", "==", true),
      ),
    ),
    fetchPublicAchievementsByRole(userId),
  ]);

  const roles = await Promise.all(
    rolesSnap.docs.map((docSnap) => mapRole(docSnap.id, docSnap.data() as Record<string, unknown>)),
  );

  const publicRoles = roles.filter((role): role is PortfolioRole => role != null);

  let skillsByRole = new Map<string, PortfolioSkill[]>();
  try {
    skillsByRole = await fetchPublicSkillsByRole(
      userId,
      publicRoles.map((role) => role.id),
    );
  } catch {
    // Skills need public read on userSkills/skills/categories — page still works without them.
  }

  return sortRoles(
    publicRoles.map((role) => ({
      ...role,
      achievements: achievementsByRole.get(role.id) ?? [],
      skills: skillsByRole.get(role.id) ?? [],
    })),
  );
}
