import type { ExperienceConfiguration, Reference } from "@ninetailed/experience.js";
import { ExperienceMapper } from "@ninetailed/experience.js-utils";

export type SidebarVariantRef = Reference & { title?: string | null; content?: string | null };

export function mapExperiences(rawExperiences: unknown[]): ExperienceConfiguration<SidebarVariantRef>[] {
  return (rawExperiences || [])
    .map((exp: any) => ({
      id: exp?.ntExperienceId || exp?.sys?.id,
      name: exp?.ntName,
      type: exp?.ntType,
      config: exp?.ntConfig,
      ...(exp?.ntAudience
        ? { audience: { id: exp.ntAudience.ntAudienceId, name: exp.ntAudience.ntName } }
        : {}),
      variants: (exp?.ntVariantsCollection?.items || []).map((v: any) => ({
        id: v?.sys?.id,
        title: v?.title,
        content: v?.content,
      })),
    }))
    .filter(ExperienceMapper.isExperienceEntry)
    .map(ExperienceMapper.mapExperience);
}
