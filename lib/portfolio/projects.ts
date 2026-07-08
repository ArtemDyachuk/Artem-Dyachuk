import "server-only";

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import type { PortfolioProject, PortfolioProjectSkill } from "@/types/portfolio";

const globalSkillNameCache = new Map<string, string | null>();
const companyNameCache = new Map<string, string | null>();

type RoleLabel = { roleId: string; label: string };
const roleLabelCache = new Map<string, RoleLabel | null>();

async function resolveSkillName(skillId: string): Promise<string | null> {
  if (globalSkillNameCache.has(skillId)) {
    return globalSkillNameCache.get(skillId) ?? null;
  }

  const db = getServerFirestore();
  let name: string | null = null;
  try {
    const snap = await getDoc(doc(db, "skills", skillId));
    if (snap.exists() && typeof snap.data()?.name === "string") {
      name = snap.data()!.name as string;
    }
  } catch {
    name = null;
  }

  globalSkillNameCache.set(skillId, name);
  return name;
}

async function resolveCompanyName(companyId: string): Promise<string | null> {
  if (companyNameCache.has(companyId)) {
    return companyNameCache.get(companyId) ?? null;
  }

  const db = getServerFirestore();
  let name: string | null = null;
  try {
    const snap = await getDoc(doc(db, "companies", companyId));
    if (snap.exists() && typeof snap.data()?.name === "string") {
      name = snap.data()!.name as string;
    }
  } catch {
    name = null;
  }

  companyNameCache.set(companyId, name);
  return name;
}

/**
 * Resolves a display label + link target for a project's linked role. Returns
 * null when the role isn't published to the portfolio (private roles must not be
 * linked, since /experience only renders public roles).
 */
async function resolveRoleLabel(userId: string, roleId: string): Promise<RoleLabel | null> {
  const cacheKey = `${userId}/${roleId}`;
  if (roleLabelCache.has(cacheKey)) {
    return roleLabelCache.get(cacheKey) ?? null;
  }

  const db = getServerFirestore();
  let result: RoleLabel | null = null;

  try {
    const snap = await getDoc(doc(db, "users", userId, "roles", roleId));
    if (snap.exists()) {
      const data = snap.data() as Record<string, unknown>;
      if (data.includeOnPortfolio === true) {
        const role = typeof data.role === "string" ? data.role.trim() : "";
        let company = typeof data.company === "string" ? data.company.trim() : "";
        if (!company && typeof data.companyId === "string" && data.companyId.trim()) {
          company = (await resolveCompanyName(data.companyId.trim())) ?? "";
        }
        const label = [role, company].filter(Boolean).join(" · ");
        if (label) {
          result = { roleId, label };
        }
      }
    }
  } catch {
    result = null;
  }

  roleLabelCache.set(cacheKey, result);
  return result;
}

function sortProjects(items: PortfolioProject[]): PortfolioProject[] {
  return [...items].sort((left, right) => {
    if (left.featured !== right.featured) return left.featured ? -1 : 1;

    const leftEnd = left.endDate ?? "9999-99";
    const rightEnd = right.endDate ?? "9999-99";
    if (leftEnd !== rightEnd) return rightEnd.localeCompare(leftEnd);

    const leftStart = left.startDate ?? "";
    const rightStart = right.startDate ?? "";
    if (leftStart !== rightStart) return rightStart.localeCompare(leftStart);

    return left.name.localeCompare(right.name);
  });
}

async function mapProject(
  userId: string,
  id: string,
  raw: Record<string, unknown>,
): Promise<PortfolioProject | null> {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) return null;

  const skillIds = Array.isArray(raw.skillIds)
    ? raw.skillIds.filter((value): value is string => typeof value === "string" && value.trim() !== "")
    : [];

  const skills = (
    await Promise.all(
      skillIds.map(async (skillId): Promise<PortfolioProjectSkill | null> => {
        const skillName = await resolveSkillName(skillId);
        return skillName ? { id: skillId, name: skillName } : null;
      }),
    )
  ).filter((skill): skill is PortfolioProjectSkill => skill != null);

  skills.sort((left, right) => left.name.localeCompare(right.name));

  const experienceId =
    typeof raw.experienceId === "string" && raw.experienceId.trim() ? raw.experienceId.trim() : null;
  const role = experienceId ? await resolveRoleLabel(userId, experienceId) : null;

  return {
    id,
    name,
    description: typeof raw.description === "string" ? raw.description : "",
    startDate: typeof raw.startDate === "string" ? raw.startDate : null,
    endDate: typeof raw.endDate === "string" ? raw.endDate : null,
    featured: raw.featured === true,
    skills,
    roleId: role?.roleId ?? null,
    roleLabel: role?.label ?? null,
  };
}

export async function fetchPublicProjects(userId: string): Promise<PortfolioProject[]> {
  const db = getServerFirestore();
  const snap = await getDocs(
    query(collection(db, "users", userId, "projects"), where("includeOnPortfolio", "==", true)),
  );

  const projects = await Promise.all(
    snap.docs.map((docSnap) => mapProject(userId, docSnap.id, docSnap.data() as Record<string, unknown>)),
  );

  return sortProjects(projects.filter((project): project is PortfolioProject => project != null));
}
