import "server-only";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import type { PortfolioLanguage } from "@/types/portfolio";

const FLUENCY_LABELS: Record<string, string> = {
  native: "Native",
  fluent: "Fluent",
  conversational: "Conversational",
  basic: "Basic",
  bilingual: "Fluent",
  professional: "Fluent",
  full: "Fluent",
  working: "Conversational",
  limited: "Basic",
};

function normalizeFluencyLevel(value: string): string {
  const lower = value.toLowerCase().trim();
  if (FLUENCY_LABELS[lower]) return lower;
  return "conversational";
}

function fluencyLabel(value: string): string {
  const normalized = normalizeFluencyLevel(value);
  return FLUENCY_LABELS[normalized] ?? value;
}

export async function fetchUserLanguages(userId: string): Promise<PortfolioLanguage[]> {
  const db = getServerFirestore();
  const userLanguagesSnap = await getDocs(collection(db, "users", userId, "userLanguages"));

  type LinkedLanguage = {
    userLanguageId: string;
    languageId: string;
    fluencyLevel: string;
  };

  const linked: LinkedLanguage[] = [];
  const globalLanguageIds = new Set<string>();

  for (const docSnap of userLanguagesSnap.docs) {
    const data = docSnap.data() as Record<string, unknown>;
    const languageId = typeof data.languageId === "string" ? data.languageId.trim() : "";
    if (!languageId) continue;

    globalLanguageIds.add(languageId);
    linked.push({
      userLanguageId: docSnap.id,
      languageId,
      fluencyLevel: typeof data.fluencyLevel === "string" ? data.fluencyLevel : "conversational",
    });
  }

  const globalLanguageById = new Map<string, string>();
  await Promise.all(
    [...globalLanguageIds].map(async (languageId) => {
      const snap = await getDoc(doc(db, "languages", languageId));
      if (!snap.exists()) return;
      const name = typeof snap.data()?.name === "string" ? snap.data()!.name : "";
      if (name) globalLanguageById.set(languageId, name);
    }),
  );

  const seenLanguageIds = new Set<string>();
  const languages: PortfolioLanguage[] = [];

  for (const item of linked) {
    if (seenLanguageIds.has(item.languageId)) continue;

    const name = globalLanguageById.get(item.languageId);
    if (!name) continue;

    seenLanguageIds.add(item.languageId);
    languages.push({
      id: item.userLanguageId,
      name,
      fluencyLevel: normalizeFluencyLevel(item.fluencyLevel),
      fluencyLabel: fluencyLabel(item.fluencyLevel),
    });
  }

  return languages.sort((left, right) => left.name.localeCompare(right.name));
}
