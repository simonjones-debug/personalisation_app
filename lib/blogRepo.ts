import type { Document } from "@contentful/rich-text-types";
import { gql } from "graphql-request";
import { contentfulGraphqlClient } from "./contentfulGql";
import { NtExperienceFragment } from "./gql/fragments";
import { mapExperiences } from "./experience/map";
import type { NormalizedBlog } from "./types/blog";

export type { NormalizedBlog };

export async function getBlogPostBySlug(slug: string): Promise<NormalizedBlog> {
  
  const query = gql`
    query BlogBySlug($slug: String!) {
      blogPostCollection(limit: 1, where: { slug: $slug }) {
        items {
          title
          body
          sideBar {
            sys { id }
            title
            content
            bodyContent {
                    json
                    links {
                        entries {
                            inline {
                                sys { id }
                                ... on NtMergetag {
                                    _id
                                    ntFallback
                                    ntMergetagId
                                    ntName
                                }
                            }
                        }
                    }
                }
            nt_experiencesCollection: ntExperiencesCollection(limit: 5) {
              items {
                ... on NtExperience { ...NtExperienceFragment }
              }
            }
          }
        }
      }
    }
    ${NtExperienceFragment}
  `;

  const variables: { slug: string } = { slug };

  try {
    const data = await contentfulGraphqlClient.request<any>(query, variables);
    
    const item = data.blogPostCollection.items[0]; // grab first item for testing purposes
    const sidebarEntry = item.sideBar;

    return {
      post: { title: item.title || "", body: item.body || "" },
      sidebar: {
        id: sidebarEntry.sys.id,
        title: sidebarEntry.title ?? null,
        content: sidebarEntry.content ?? null,
        bodyContent: sidebarEntry.bodyContent
          ? {
              json: sidebarEntry.bodyContent.json as Document,
              links: sidebarEntry.bodyContent.links,
            }
          : null,
      },
      ntExperiences: mapExperiences(sidebarEntry.nt_experiencesCollection.items),
    };
  } catch (error: any) {
    throw error;
  }
}
