import type { ExperienceConfiguration, Reference } from "@ninetailed/experience.js";
import type { RichTextWithLinks } from "./contentful";

export type SidebarVariantRef = Reference & {
  title?: string | null;
  content?: string | null;
  bodyContent?: RichTextWithLinks | null;
};

export type NormalizedBlog = {
  post: { title: string; body: string } | null;
  sidebar: {
    id: string;
    title: string | null;
    content: string | null;
    bodyContent: RichTextWithLinks | null;
  } | null;
  ntExperiences: ExperienceConfiguration<SidebarVariantRef>[];
};

