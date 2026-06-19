import { getAllPosts, getPost } from '@/lib/posts';
import { notFound } from 'next/navigation';

// Tells Next.js which slugs to pre-render at build time.
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `jeff — ${post.title}` : 'jeff' };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <div className="page post-page">
      <p className="post-eyebrow">writing</p>
      <h1 className="post-title">{post.title}</h1>
      {post.displayDate && (
        <p className="post-date">{post.displayDate}</p>
      )}
      <div
        className="post-body prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  );
}
