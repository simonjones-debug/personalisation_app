import { renderContentfulRichText } from "../lib/richText";
import type { RichTextWithLinks } from "../lib/types/contentful";

type BlogSidebarProps = {
  id?: string;
  title?: string | null;
  content?: string | null;
  bodyContent?: RichTextWithLinks | null;
};

function renderRichText(bodyContent: BlogSidebarProps['bodyContent']) {
  if (!bodyContent) return null;
  return renderContentfulRichText(bodyContent.json, { links: bodyContent.links });
}

export default function BlogSidebar({ id, title, content, bodyContent }: BlogSidebarProps) {
  return (
    <aside style={{ padding: 16, borderLeft: "1px solid #e5e7eb" }}>
      {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
      {bodyContent ? (
        <div>{renderRichText(bodyContent)}</div>
      ) : content ? (
        <p>{content}</p>
      ) : (
        <p style={{ color: "#6b7280" }}>No sidebar content</p>
      )}
    </aside>
  );
}