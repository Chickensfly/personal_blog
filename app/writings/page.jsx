import { getAllPosts } from '@/lib/posts';
import { redirect } from 'next/navigation';

export const metadata = { title: 'jeff — writings' };

/**
 * Redirects to the most recent post automatically.
 * Falls back to a placeholder if there are no posts yet.
 */
export default function WritingsPage() {
  const posts = getAllPosts();

  if (posts.length > 0) {
    redirect(`/writings/${posts[0].slug}`);
  }

  return (
    <div className="page writings-splash">
      <p>no writings yet</p>
    </div>
  );
}
