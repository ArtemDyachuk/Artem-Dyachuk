import "server-only";

import contactsData from "@/app/data/contacts.json";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import { fetchPublicProfile } from "@/lib/portfolio/profile";
import type {
  PortfolioContactEmail,
  PortfolioContactLink,
  PortfolioContactPhone,
} from "@/types/portfolio";

export type PortfolioContact = {
  emails: PortfolioContactEmail[];
  phones: PortfolioContactPhone[];
  links: PortfolioContactLink[];
};

/** Map the bundled contacts.json into the structured contact shape (fallback). */
function contactFromJson(): PortfolioContact {
  const entries = contactsData.contacts as Array<{
    type: string;
    value: string;
    linkType?: string;
  }>;

  const emails: PortfolioContactEmail[] = [];
  const phones: PortfolioContactPhone[] = [];
  const links: PortfolioContactLink[] = [];

  entries.forEach((entry, index) => {
    if (entry.type === "email") {
      emails.push({ id: `json-email-${index}`, address: entry.value, label: "" });
    } else if (entry.type === "phone") {
      phones.push({ id: `json-phone-${index}`, number: entry.value, label: "" });
    } else if (entry.type === "link") {
      links.push({
        id: `json-link-${index}`,
        type: (entry.linkType ?? "website").toLowerCase(),
        label: entry.linkType ?? "",
        url: entry.value,
      });
    }
  });

  return {
    emails,
    phones,
    links: links.filter((link) => link.type !== "website"),
  };
}

/**
 * Public contact info for the site owner. Prefers the live Firestore
 * `publicProfile/main` mirror (only entries the owner marked public), and falls
 * back to the bundled contacts.json when Firestore has nothing (e.g. local dev
 * without a resolved host, or before anything is published).
 */
export async function fetchPortfolioContact(): Promise<PortfolioContact> {
  const fallback = contactFromJson();

  try {
    const site = await resolvePortfolioSite();
    if (!site.ok) return fallback;

    const profile = await fetchPublicProfile(site.userId);
    if (!profile) return fallback;

    const hasContact =
      profile.emails.length > 0 || profile.phones.length > 0 || profile.links.length > 0;
    if (!hasContact) return fallback;

    return {
      emails: profile.emails,
      phones: profile.phones,
      links: profile.links.filter((link) => link.type !== "website"),
    };
  } catch {
    return fallback;
  }
}
