/**
 * lib/posts.js
 *
 * All file-system reading lives here.
 * Everything runs server-side only — never shipped to the browser.
 */

import fs   from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIR   = path.join(process.cwd(), 'posts');
const CONTENT_DIR = path.join(process.cwd(), 'content');

// ── Markdown rendering ────────────────────────────────────────────────────────

marked.setOptions({ gfm: true, breaks: false });

function toHtml(markdown) {
  return marked.parse(markdown);
}

// ── Utility ───────────────────────────────────────────────────────────────────

function slugToTitle(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Posts ─────────────────────────────────────────────────────────────────────

/**
 * Returns a sorted list of all posts.
 * Used in layout (to build the nav) and on the writings index page.
 */
export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw  = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      const slug = filename.replace(/\.md$/, '');
      return {
        slug,
        title: data.title || slugToTitle(slug),
        date:  data.date ? String(data.date) : null,
      };
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
}

/**
 * Returns the full content of a single post.
 */
export function getPost(slug) {
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    title:       data.title || slugToTitle(slug),
    date:        data.date ? String(data.date) : null,
    displayDate: formatDate(data.date),
    html:        toHtml(content),
  };
}

// ── About ─────────────────────────────────────────────────────────────────────

/**
 * Reads content/about.md.
 * Edit that file to change the about page.
 */
export function getAbout() {
  const filepath = path.join(CONTENT_DIR, 'about.md');
  if (!fs.existsSync(filepath)) {
    return '<p>Add your text to <code>content/about.md</code>.</p>';
  }
  const { content } = matter(fs.readFileSync(filepath, 'utf-8'));
  return toHtml(content);
}

// ── Links ─────────────────────────────────────────────────────────────────────

/**
 * Reads content/links.js.
 * Edit that file to change the links page.
 */
export async function getLinks() {
  try {
    // dynamic import so the module is re-evaluated at build time
    const mod = await import('@/content/links.js');
    return mod.default ?? [];
  } catch {
    return [];
  }
}

/**
 * Extracts a readable hostname from a URL.
 */
export function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
