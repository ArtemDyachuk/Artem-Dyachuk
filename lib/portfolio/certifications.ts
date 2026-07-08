import "server-only";

import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import type { PortfolioCertification } from "@/types/portfolio";

function mapCertification(id: string, raw: Record<string, unknown>): PortfolioCertification | null {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const issuer = typeof raw.issuer === "string" ? raw.issuer.trim() : "";
  if (!name) return null;

  return {
    id,
    name,
    issuer,
    category: typeof raw.category === "string" ? raw.category.trim() : "",
    issueDate: typeof raw.issueDate === "string" ? raw.issueDate : null,
    expiryDate: typeof raw.expiryDate === "string" ? raw.expiryDate : null,
    credentialUrl: typeof raw.credentialUrl === "string" ? raw.credentialUrl.trim() : "",
  };
}

function sortCertifications(items: PortfolioCertification[]): PortfolioCertification[] {
  return [...items].sort((left, right) => {
    const leftKey = left.issueDate ?? "";
    const rightKey = right.issueDate ?? "";
    return rightKey.localeCompare(leftKey);
  });
}

export async function fetchPublicCertifications(userId: string): Promise<PortfolioCertification[]> {
  const db = getServerFirestore();
  const snap = await getDocs(
    query(
      collection(db, "users", userId, "certifications"),
      where("includeOnPortfolio", "==", true),
    ),
  );

  const items = snap.docs
    .map((docSnap) => mapCertification(docSnap.id, docSnap.data() as Record<string, unknown>))
    .filter((item): item is PortfolioCertification => item != null);

  return sortCertifications(items);
}
