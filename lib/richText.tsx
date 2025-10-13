import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { INLINES } from "@contentful/rich-text-types";
import { MergeTag } from "@ninetailed/experience.js-next";
import type { InlineEntry } from "./types/contentful";

export type RenderRichTextOptions = {
  renderNode?: NonNullable<Parameters<typeof documentToReactComponents>[1]>["renderNode"];
  links?: { entries?: { inline?: InlineEntry[] } };
};

export function renderContentfulRichText(doc: Document | null | undefined, options?: RenderRichTextOptions) {
  if (!doc) return null;

  const inlineById = new Map(
    options?.links?.entries?.inline?.map((e) => [e.sys.id, e]) || []
  );

  return documentToReactComponents(doc, {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
        const target = node?.data?.target;
        const linked = inlineById.get(target?.sys?.id);

        if (linked?.ntMergetagId) {
          return (
            <MergeTag id={`traits.${linked.ntMergetagId}`} fallback={linked.ntFallback} />
          );
        }

        return null;
      },
      ...(options?.renderNode || {}),
    },
  });
}


