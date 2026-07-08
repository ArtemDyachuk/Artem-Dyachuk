import "server-only";

import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import type { PortfolioEducation } from "@/types/portfolio";

function mapEducation(id: string, raw: Record<string, unknown>): PortfolioEducation | null {
  const institution = typeof raw.institution === "string" ? raw.institution.trim() : "";
  const degree = typeof raw.degree === "string" ? raw.degree.trim() : "";
  if (!institution || !degree) return null;

  return {
    id,
    institution,
    degree,
    fieldOfStudy: typeof raw.fieldOfStudy === "string" ? raw.fieldOfStudy.trim() : "",
    startDate: typeof raw.startDate === "string" ? raw.startDate : null,
    endDate: typeof raw.endDate === "string" ? raw.endDate : null,
    notes: typeof raw.notes === "string" ? raw.notes.trim() : "",
  };
}

function sortEducation(items: PortfolioEducation[]): PortfolioEducation[] {
  return [...items].sort((left, right) => {
    const leftKey = left.endDate ?? left.startDate ?? "";
    const rightKey = right.endDate ?? right.startDate ?? "";
    return rightKey.localeCompare(leftKey);
  });
}

export async function fetchPublicEducation(userId: string): Promise<PortfolioEducation[]> {
  const db = getServerFirestore();
  const snap = await getDocs(
    query(
      collection(db, "users", userId, "education"),
      where("includeOnPortfolio", "==", true),
    ),
  );

  const items = snap.docs
    .map((docSnap) => mapEducation(docSnap.id, docSnap.data() as Record<string, unknown>))
    .filter((item): item is PortfolioEducation => item != null);

  return sortEducation(items);
}
