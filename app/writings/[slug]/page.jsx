import { getAllPosts, getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { marked } from "marked";
import MobilePostMenu from "@/components/MobilePostMenu";
import BackToTop from "@/components/BackToTop";
import PostFeedLink from "@/components/PostFeedLink";

// Tells Next.js which slugs to pre-render at build time.
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post ? `jeff — ${post.title}` : "jeff",
    description: post?.blurb || undefined,
    alternates: { canonical: `/writings/${slug}` },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  // Full post list — drives the mobile dropdown menu. (Desktop uses
  // the nav margin column instead; the menu is CSS-hidden there.)
  const posts = getAllPosts();

  return (
    <div className="page post-page">
      {/* Eyebrow + mobile posts button share a flex row, so the
          button is guaranteed to sit on the same line as "WRITING"
          by layout rather than by a computed offset. */}
      <div className="post-header-row">
        <p className="post-eyebrow">writing</p>
        <MobilePostMenu posts={posts} />
      </div>
      <h1 className="post-title">{post.title}</h1>
      {post.blurb && (
        <p
          className="post-blurb"
          dangerouslySetInnerHTML={{ __html: marked.parseInline(post.blurb) }}
        />
      )}
      {post.displayDate && <p className="post-date">{post.displayDate}</p>}
      {post.tags.length > 0 && (
        <ul className="post-tags" aria-label="Tags">
          {post.tags.map((tag) => (
            /* When filtering is added later, swap this <span> for
               a <Link href={`/writings?tag=${tag}`}> and the list
               will become a filterable tag index automatically. */
            <li key={tag} className="post-tag">
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      )}
      <div
        className="post-body prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <PostFeedLink />
      <BackToTop />
    </div>
  );
}
