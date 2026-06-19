# jeff — personal site

A quiet corner of the internet. Built with Next.js, deployed on Vercel.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding content

### Landing photo
Drop a file named `landing.jpg` into `public/`. JPEG, PNG, or WebP — keep it under 2 MB. The image fills the right side of the page, cropped to fit.

### About page
Edit `content/about.md`. Markdown works.

### Links
Edit `content/links.js`. The structure is straightforward — sections with headings and lists of `{ label, url }` items.

### Writing
Drop any `.md` file into `posts/`. Add front matter at the top:

```markdown
---
title: Your title
date: 2025-06-15
---

Your writing here.
```

The post appears in the nav margin automatically on the next build. Posts sort newest-first by date.

---

## Deploying to Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo
4. Click Deploy — no configuration needed

Vercel detects Next.js automatically. Every push to main redeploys the site.

---

## Customising the design

All visual variables live at the top of `app/globals.css` under the `:root` block — colours, fonts, spacing, reading width. Change them there to retheme the whole site. The nav styles are in `components/Nav.module.css`.
