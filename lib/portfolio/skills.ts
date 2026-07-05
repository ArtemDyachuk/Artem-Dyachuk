import "server-only";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import type { PortfolioSkillCategory, PortfolioUserSkill } from "@/types/portfolio";

const categoryNameCache = new Map<string, string | null>();

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

function groupByCategory(skills: PortfolioUserSkill[]): PortfolioSkillCategory[] {
  const byCategory = new Map<string, PortfolioUserSkill[]>();

  for (const skill of skills) {
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill);
    byCategory.set(skill.category, list);
  }

  return [...byCategory.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([category, categorySkills]) => ({
      category,
      skills: [...categorySkills].sort((left, right) => left.name.localeCompare(right.name)),
    }));
}

export async function fetchUserSkills(userId: string): Promise<PortfolioSkillCategory[]> {
  const db = getServerFirestore();
  const userSkillsSnap = await getDocs(collection(db, "users", userId, "userSkills"));

  type LinkedSkill = {
    userSkillId: string;
    skillId: string;
    note: string | null;
  };

  const linked: LinkedSkill[] = [];
  const globalSkillIds = new Set<string>();

  for (const docSnap of userSkillsSnap.docs) {
    const data = docSnap.data() as Record<string, unknown>;
    const skillId = typeof data.skillId === "string" ? data.skillId.trim() : "";
    if (!skillId) continue;

    globalSkillIds.add(skillId);
    const noteRaw = typeof data.note === "string" ? data.note.trim() : "";
    linked.push({
      userSkillId: docSnap.id,
      skillId,
      note: noteRaw || null,
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

  const seenSkillIds = new Set<string>();
  const skills: PortfolioUserSkill[] = [];

  for (const item of linked) {
    if (seenSkillIds.has(item.skillId)) continue;

    const globalSkill = globalSkillById.get(item.skillId);
    if (!globalSkill) continue;

    const category = (await resolveCategoryName(globalSkill.categoryId)) ?? "Other";
    seenSkillIds.add(item.skillId);
    skills.push({
      id: item.userSkillId,
      name: globalSkill.name,
      category,
      note: item.note,
    });
  }

  return groupByCategory(skills);
}
