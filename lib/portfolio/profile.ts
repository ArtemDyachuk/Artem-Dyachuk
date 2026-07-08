import "server-only";

import { doc, getDoc } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import type {
  PortfolioContactEmail,
  PortfolioContactLink,
  PortfolioContactPhone,
  PortfolioProfile,
} from "@/types/portfolio";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseEmails(value: unknown): PortfolioContactEmail[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry, index) => {
      const record = (entry ?? {}) as Record<string, unknown>;
      return {
        id: asString(record.id) || `email-${index}`,
        address: asString(record.address),
        label: asString(record.label),
      };
    })
    .filter((entry) => entry.address);
}

function parsePhones(value: unknown): PortfolioContactPhone[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry, index) => {
      const record = (entry ?? {}) as Record<string, unknown>;
      return {
        id: asString(record.id) || `phone-${index}`,
        number: asString(record.number),
        label: asString(record.label),
      };
    })
    .filter((entry) => entry.number);
}

function parseLinks(value: unknown): PortfolioContactLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry, index) => {
      const record = (entry ?? {}) as Record<string, unknown>;
      return {
        id: asString(record.id) || `link-${index}`,
        type: asString(record.type) || "website",
        label: asString(record.label),
        url: asString(record.url),
      };
    })
    .filter((entry) => entry.url);
}

/**
 * Reads the portfolio-safe subset of the profile that resume-tailor mirrors
 * into `users/{uid}/publicProfile/main`. This includes the About-page narrative
 * (summary + careerFocus) and any contact emails/phones/links the owner marked
 * as public. Returns null only when nothing has been published yet.
 */
export async function fetchPublicProfile(userId: string): Promise<PortfolioProfile | null> {
  const db = getServerFirestore();
  const snap = await getDoc(doc(db, "users", userId, "publicProfile", "main"));
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  const profile: PortfolioProfile = {
    summary: asString(data.summary),
    careerFocus: asString(data.careerFocus),
    emails: parseEmails(data.emails),
    phones: parsePhones(data.phones),
    links: parseLinks(data.links),
  };

  const isEmpty =
    !profile.summary &&
    !profile.careerFocus &&
    profile.emails.length === 0 &&
    profile.phones.length === 0 &&
    profile.links.length === 0;

  return isEmpty ? null : profile;
}
