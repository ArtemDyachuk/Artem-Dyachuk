import type { ReactNode } from "react";
import {
  FaBehance,
  FaDev,
  FaDribbble,
  FaGithub,
  FaGitlab,
  FaGlobe,
  FaLinkedin,
  FaMedium,
  FaStackOverflow,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiGooglescholar, SiOrcid } from "react-icons/si";

/** Human-readable labels for the link types mirrored from resume-tailor. */
export const CONTACT_LINK_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  gitlab: "GitLab",
  portfolio: "Portfolio",
  website: "Website",
  twitter: "X (Twitter)",
  dribbble: "Dribbble",
  behance: "Behance",
  stackoverflow: "Stack Overflow",
  medium: "Medium",
  devto: "Dev.to",
  youtube: "YouTube",
  scholar: "Google Scholar",
  orcid: "ORCID",
  other: "Link",
};

/** Display label for a link, preferring a custom label for `other`/unknown types. */
export function contactLinkLabel(type: string, customLabel?: string): string {
  const custom = customLabel?.trim();
  if (type === "other" || !CONTACT_LINK_LABELS[type]) {
    return custom || CONTACT_LINK_LABELS[type] || "Link";
  }
  return custom || CONTACT_LINK_LABELS[type];
}

/** Icon element for a link type. Falls back to a globe for unknown/website types. */
export function contactLinkIcon(type: string, size = 22): ReactNode {
  switch (type) {
    case "linkedin":
      return <FaLinkedin size={size} />;
    case "github":
      return <FaGithub size={size} />;
    case "gitlab":
      return <FaGitlab size={size} />;
    case "twitter":
      return <FaXTwitter size={size} />;
    case "dribbble":
      return <FaDribbble size={size} />;
    case "behance":
      return <FaBehance size={size} />;
    case "stackoverflow":
      return <FaStackOverflow size={size} />;
    case "medium":
      return <FaMedium size={size} />;
    case "devto":
      return <FaDev size={size} />;
    case "youtube":
      return <FaYoutube size={size} />;
    case "scholar":
      return <SiGooglescholar size={size} />;
    case "orcid":
      return <SiOrcid size={size} />;
    default:
      return <FaGlobe size={size} />;
  }
}
