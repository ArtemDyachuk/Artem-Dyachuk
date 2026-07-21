import "server-only";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { isLegacyPrivateCompanyLogoKey, isPublicAssetKey, publicAssetUrl } from "./publicAssets";
import { getR2Config } from "./r2Config";

const PRESIGN_TTL_SECONDS = 3600;

let client: S3Client | null = null;

function getR2Client(): S3Client {
  if (client) return client;

  const config = getR2Config();
  client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return client;
}

export function isPublicCompanyLogoKey(key: string): boolean {
  return isPublicAssetKey(key) || isLegacyPrivateCompanyLogoKey(key);
}

export function isPublicAvatarKey(key: string): boolean {
  return /^users\/[^/]+\/avatars\//.test(key);
}

export function isPublicResumeKey(key: string): boolean {
  return /^users\/[^/]+\/manual-resumes\//.test(key);
}

export async function createPresignedDownloadUrl(
  key: string,
): Promise<{ downloadUrl: string; expiresIn: number }> {
  const { bucket } = getR2Config();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const downloadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: PRESIGN_TTL_SECONDS,
  });

  return { downloadUrl, expiresIn: PRESIGN_TTL_SECONDS };
}

export async function getR2Object(
  key: string,
): Promise<{ body: Uint8Array; contentType: string }> {
  const { bucket } = getR2Config();
  const response = await getR2Client().send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error("Empty object body");
  }

  const bytes = await response.Body.transformToByteArray();
  return {
    body: bytes,
    contentType: response.ContentType ?? "application/octet-stream",
  };
}

/** Resolve a company logo to a stable public URL, or a short-lived signed URL for legacy keys. */
export async function resolveCompanyLogoUrl(logoR2Key: string | null): Promise<string | null> {
  if (!logoR2Key || !isPublicCompanyLogoKey(logoR2Key)) {
    return null;
  }

  if (isPublicAssetKey(logoR2Key)) {
    return publicAssetUrl(logoR2Key);
  }

  try {
    const { downloadUrl } = await createPresignedDownloadUrl(logoR2Key);
    return downloadUrl;
  } catch {
    return null;
  }
}
