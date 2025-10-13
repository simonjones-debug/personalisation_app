import type { Document } from "@contentful/rich-text-types";

export type InlineEntry = {
  sys: { id: string };
  _id?: string;
  ntMergetagId?: string;
  ntFallback?: string;
  ntName?: string;
};

export type RichTextWithLinks = {
  json: Document;
  links?: {
    entries?: {
      inline?: InlineEntry[];
    };
  };
};

