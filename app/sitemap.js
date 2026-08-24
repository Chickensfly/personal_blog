import { getAllPosts } from "@/lib/posts";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.jeffcreates.space"
).replace(/\/$/, "");

export default function sitemap() {
  const posts = getAllPosts();

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/writings/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: postEntries[0]?.lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...postEntries,
  ];
}
