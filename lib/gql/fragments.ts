import { gql } from "graphql-request";

export const NtAudienceFragment = gql`
  fragment NtAudienceFragment on NtAudience {
    ntAudienceId
    ntName
  }
`;

export const SidebarVariantFragment = gql`
  fragment SidebarVariantFragment on BlogPostSideBar {
    sys { id }
    title
    content
  }
`;

export const NtExperienceFragment = gql`
  fragment NtExperienceFragment on NtExperience {
    sys { id }
    ntExperienceId
    ntName
    ntType
    ntConfig
    ntAudience { ...NtAudienceFragment }
    ntVariantsCollection(limit: 10) {
      items { ...SidebarVariantFragment }
    }
  }
  ${NtAudienceFragment}
  ${SidebarVariantFragment}
`;


