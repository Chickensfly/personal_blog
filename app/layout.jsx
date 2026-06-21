import { Cormorant_Garamond, Fraunces, Newsreader } from "next/font/google";
import Nav from "@/components/Nav";
import { getAllPosts } from "@/lib/posts";
import "./globals.css";

// ── Fonts ─────────────────────────────────────────────────────────────────────
// next/font handles loading, subsetting, and injects CSS variables.

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata = {
  title: "jeff",
  description: "dissections and digressions",
};

// `viewport-fit: cover` lets the page extend under the iPhone's
// Dynamic Island / status bar safe area instead of stopping short of
// it. Without this, that strip is reserved space the page can't draw
// into — which is why the nav's photo previously stopped just below
// it, leaving a gap of bare background showing through. Paired with
// the safe-area padding in Nav.module.css so the nav now fills that
// area with its own background instead of leaving it empty.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// ── Layout ────────────────────────────────────────────────────────────────────

export default async function RootLayout({ children }) {
  // Posts are read here once — the list is passed to Nav so it can show
  // writing titles in the margin when you're in the writings section.
  const posts = getAllPosts();

  return (
    <html lang="en" className={`${fraunces.variable} ${newsreader.variable}`}>
      <body>
        <Nav posts={posts} />
        <div className="content">{children}</div>
      </body>
    </html>
  );
}
