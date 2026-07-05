import "server-only";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
  return /^users\/[^/]+\/company-logos\//.test(key);
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
