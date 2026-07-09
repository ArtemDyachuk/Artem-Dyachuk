import "server-only";

import { doc, getDoc } from "firebase/firestore";
import { getServerFirestore } from "@/lib/firebase-server";
import { isPublicResumeKey } from "@/lib/r2";
import { isR2Configured } from "@/lib/r2Config";

export type PrimaryResumeFile = {
  filename: string;
  contentType: string;
  r2Key: string;
};

export type PrimaryResume = {
  label: string;
  files: PrimaryResumeFile[];
  /** Owner display name from publicProfile (first + last, or mirrored `name`). */
  ownerName: string;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPdf(file: PrimaryResumeFile): boolean {
  return (
    file.contentType === "application/pdf" || file.filename.toLowerCase().endsWith(".pdf")
  );
}

function isDocx(file: PrimaryResumeFile): boolean {
  return (
    file.contentType.includes("wordprocessingml") ||
    file.filename.toLowerCase().endsWith(".docx")
  );
}

/**
 * Chooses the best downloadable file for the primary resume: PDF first, then
 * Word (.docx), then whatever is available.
 */
export function pickBestResumeFile(files: PrimaryResumeFile[]): PrimaryResumeFile | null {
  return files.find(isPdf) ?? files.find(isDocx) ?? files[0] ?? null;
}

/**
 * Reads the primary resume that resume-tailor mirrors into the publicly
 * readable `users/{uid}/publicProfile/main` doc. Returns null when no primary
 * resume with downloadable files exists or R2 is not configured.
 */
export async function fetchPrimaryResume(userId: string): Promise<PrimaryResume | null> {
  if (!isR2Configured()) return null;

  const db = getServerFirestore();
  const snap = await getDoc(doc(db, "users", userId, "publicProfile", "main"));
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  const raw = data.primaryResume;
  if (!raw || typeof raw !== "object") return null;

  const record = raw as Record<string, unknown>;
  const rawFiles = Array.isArray(record.files) ? record.files : [];
  const files: PrimaryResumeFile[] = rawFiles
    .map((entry) => {
      const file = (entry ?? {}) as Record<string, unknown>;
      return {
        filename: asString(file.filename),
        contentType: asString(file.contentType),
        r2Key: asString(file.r2Key),
      };
    })
    .filter((file) => file.r2Key && isPublicResumeKey(file.r2Key));

  if (files.length === 0) return null;

  const firstName = asString(data.firstName);
  const lastName = asString(data.lastName);
  const ownerName =
    asString(data.name) || [firstName, lastName].filter(Boolean).join(" ");

  return {
    label: asString(record.label) || "Resume",
    files,
    ownerName,
  };
}

function fileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return "";
  return filename.slice(dot).toLowerCase();
}

/** Safe attachment basename — keeps spaces and en/em dashes. */
function sanitizeDownloadBasename(name: string): string {
  const cleaned = name
    .replace(/[^\w.\-() \u2013\u2014]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || "Resume";
}

/**
 * Builds a download filename: "[Owner Name] – [Resume Label].ext"
 * e.g. "Artem Dyachuk – Product Manager.pdf"
 */
export function buildPrimaryResumeDownloadFilename(
  ownerName: string,
  resumeLabel: string,
  originalFilename: string,
): string {
  const ext = fileExtension(originalFilename) || ".pdf";
  const person = sanitizeDownloadBasename(ownerName);
  const label = sanitizeDownloadBasename(resumeLabel);
  return `${person} \u2013 ${label}${ext}`;
}

/** Filename for a mirrored primary resume, if downloadable files exist. */
export function primaryResumeDownloadFilename(primary: PrimaryResume | null): string | undefined {
  if (!primary) return undefined;
  const file = pickBestResumeFile(primary.files);
  if (!file) return undefined;
  return buildPrimaryResumeDownloadFilename(primary.ownerName, primary.label, file.filename);
}

function encodeRFC5987(value: string): string {
  return encodeURIComponent(value).replace(/['()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

/** Content-Disposition value with ASCII fallback and UTF-8 filename*. */
export function resumeAttachmentContentDisposition(filename: string): string {
  const ascii = filename.replace(/\u2013|\u2014/g, "-");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeRFC5987(filename)}`;
}
