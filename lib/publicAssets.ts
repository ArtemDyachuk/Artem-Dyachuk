/**
 * Client-safe helpers for world-readable R2 public assets.
 * Keys live in the public bucket (e.g. company-logos/{companyId}.webp).
 */

export function isPublicAssetKey(key: string): boolean {
  return (
    (key.startsWith("company-logos/") || key.startsWith("public/")) &&
    !key.includes("..") &&
    !key.startsWith("/")
  );
}

/** Legacy private-bucket logo keys written before the public-assets migration. */
export function isLegacyPrivateCompanyLogoKey(key: string): boolean {
  return /^users\/[^/]+\/company-logos\//.test(key);
}

export function publicAssetUrl(key: string): string | null {
  if (!isPublicAssetKey(key)) return null;
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (!base) return null;
  return `${base}/${key}`;
}
