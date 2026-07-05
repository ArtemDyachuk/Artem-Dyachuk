import { isEmptyHtml, normalizeRichText } from "@/lib/richText";
import styles from "./RolesList.module.css";

type RichTextContentProps = {
  html: string;
  className?: string;
};

export default function RichTextContent({ html, className }: RichTextContentProps) {
  const normalized = normalizeRichText(html);
  if (isEmptyHtml(normalized)) return null;

  return (
    <div
      className={`${styles.richText} ${className ?? ""}`.trim()}
      dangerouslySetInnerHTML={{ __html: normalized }}
    />
  );
}
