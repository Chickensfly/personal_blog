/**
 * app/feed.xml/route.js
 *
 * RSS 2.0 feed, generated at build time from the same posts/ directory
 * the rest of the site reads. Served at /feed.xml.
 */

import { getAllPosts, getPost } from '@/lib/posts';

// Prerender once at build time instead of on every request.
export const dynamic = 'force-static';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jeffcreates.space'
).replace(/\/$/, '');

const FEED_TITLE = 'jeff';
const FEED_DESCRIPTION = 'dissections and digressions';

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeXml(value) {
  return String(value).replace(
    /[<>&'"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c],
  );
}

/** Feed readers strip the origin, so root-relative URLs must be absolute. */
function absolutize(html) {
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${SITE_URL}/`);
}

/** Safe to drop inside <![CDATA[ ]]> even if the post contains "]]>". */
function cdata(html) {
  return `<![CDATA[${html.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function toRfc822(raw) {
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d.toUTCString();
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((meta) => {
      const post = getPost(meta.slug);
      if (!post) return '';

      const url = `${SITE_URL}/writings/${post.slug}`;
      const pubDate = post.date ? toRfc822(post.date) : null;

      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
        ...post.tags.map((t) => `      <category>${escapeXml(t)}</category>`),
        `      <description>${cdata(absolutize(post.html))}</description>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .filter(Boolean)
    .join('\n');

  const latest = posts.find((p) => p.date)?.date;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${latest ? `    <lastBuildDate>${toRfc822(latest)}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
