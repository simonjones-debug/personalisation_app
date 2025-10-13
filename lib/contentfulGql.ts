import { GraphQLClient } from "graphql-request";

const SPACE = process.env.CONTENTFUL_SPACE_ID as string;
const TOKEN = process.env.CONTENTFUL_CDA_TOKEN as string;
const ENV = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!SPACE || !TOKEN) {
  throw new Error("Missing Contentful configuration: set CONTENTFUL_SPACE_ID and CONTENTFUL_CDA_TOKEN");
}

const ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${SPACE}/environments/${ENV}`;


export const contentfulGraphqlClient = new GraphQLClient(ENDPOINT, {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});


