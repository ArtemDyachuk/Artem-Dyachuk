import { NextResponse } from "next/server";
import { resolvePortfolioSite } from "@/lib/portfolio/resolveSite";
import {
  fetchPrimaryResume,
  pickBestResumeFile,
  primaryResumeDownloadFilename,
  resumeAttachmentContentDisposition,
} from "@/lib/portfolio/resume";
import { getR2Object } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET() {
  const site = await resolvePortfolioSite();
  if (!site.ok) {
    return NextResponse.json({ error: "Resume not available" }, { status: 404 });
  }

  const primary = await fetchPrimaryResume(site.userId);
  const file = primary ? pickBestResumeFile(primary.files) : null;
  if (!file || !primary) {
    return NextResponse.json({ error: "Resume not available" }, { status: 404 });
  }

  try {
    const { body, contentType } = await getR2Object(file.r2Key);
    const filename = primaryResumeDownloadFilename(primary)!;
    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": contentType || file.contentType || "application/octet-stream",
        "Content-Disposition": resumeAttachmentContentDisposition(filename),
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json({ error: "Resume not available" }, { status: 404 });
  }
}
