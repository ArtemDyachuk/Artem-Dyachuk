const HTML_TAG_PATTERN = /<[a-z][\s\S]*>/i;

export function isEmptyHtml(html: string): boolean {
  const trimmed = html.trim();
  if (!trimmed) return true;
  if (trimmed === "<p></p>" || trimmed === "<p><br></p>" || trimmed === "<p><br/></p>") {
    return true;
  }
  const textOnly = trimmed
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return !textOnly;
}

export function looksLikeHtml(text: string): boolean {
  return HTML_TAG_PATTERN.test(text);
}

export function plainTextToHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (looksLikeHtml(trimmed)) return trimmed;

  return trimmed
    .split(/\n\n+/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function normalizeRichText(value: string): string {
  return plainTextToHtml(value);
}
