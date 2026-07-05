import "server-only";

import { headers } from "next/headers";
import { doc, getDoc } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import type { PortfolioSiteResolution } from "@/types/portfolio";

function normalizeHost(host: string | null): string | null {
  if (!host) return null;
  const withoutPort = host.split(":")[0]?.trim().toLowerCase();
  if (!withoutPort || withoutPort === "localhost" || withoutPort === "127.0.0.1") {
    return null;
  }
  return withoutPort;
}

async function resolveByCustomDomain(hostname: string): Promise<PortfolioSiteResolution> {
  const db = getServerFirestore();
  const snap = await getDoc(doc(db, "customDomains", hostname));
  if (!snap.exists()) {
    return { ok: false, reason: "site_not_found" };
  }

  const data = snap.data();
  const userId = typeof data.userId === "string" ? data.userId : null;
  if (!userId) {
    return { ok: false, reason: "site_not_found" };
  }

  const slug = typeof data.slug === "string" ? data.slug : null;
  return { ok: true, userId, slug };
}

export async function resolvePortfolioSite(): Promise<PortfolioSiteResolution> {
  const headerStore = await headers();
  let hostname = normalizeHost(headerStore.get("host"));

  // localhost sends Host: localhost — Firestore keys are real domains (e.g. www.artemdyachuk.com).
  if (!hostname && process.env.NODE_ENV === "development") {
    const devHost = process.env.PORTFOLIO_DEV_HOST?.trim().toLowerCase();
    if (devHost) {
      hostname = devHost;
    }
  }

  if (!hostname) {
    return { ok: false, reason: "missing_config" };
  }

  return resolveByCustomDomain(hostname);
}
