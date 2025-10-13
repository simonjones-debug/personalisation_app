import type { GetServerSideProps } from "next";
import { useEffect } from "react";
import BlogSidebar from "../../components/BlogSidebar";
import LevelSelect from "../../components/LevelSelect";
import { Experience } from "@ninetailed/experience.js-next";
import { usePersonalization } from "../../lib/usePersonalization";
import { getBlogPostBySlug } from "../../lib/blogRepo";
import type { NormalizedBlog } from "../../lib/types/blog";

type Props = NormalizedBlog;

export default function BlogPage({ post, sidebar, ntExperiences }: Props) {
  const { setTraits } = usePersonalization<{ level: "beginner" | "advanced"; username: string }>();
 
  if (!post) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Not found</h1>
      </main>
    );
  }

  // set the trait on the initial render
  useEffect(() => {
    setTraits({ level: "beginner" });
    setTraits({ username: "Roger" });
  }, [setTraits]);

  function handleLevelChange(value: "beginner" | "advanced") {
    setTraits({ level: value });
  }

  return (
    <>
      <main style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, padding: 24 }}>
        
        <article>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </article>
        
        {sidebar ? (
          <Experience experiences={ntExperiences || []} component={BlogSidebar} {...sidebar} />
        ) : null}

        <LevelSelect defaultValue="beginner" onChange={handleLevelChange} />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const result = await getBlogPostBySlug(slug);
  
  if (!result || !result.post) return { notFound: true };

  return {
    props: {
      post: result.post,
      sidebar: result.sidebar,
      ntExperiences: result.ntExperiences,
    },
  };
};
