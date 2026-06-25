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

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const posts = getAllPosts();

  return (
    <html lang="en" className={`${fraunces.variable} ${newsreader.variable}`}>
      <head>
        <meta name="theme-color" content="#6b261d" />
      </head>
      <body>
        <Nav posts={posts} />
        <div className="content">{children}</div>
      </body>
    </html>
  );
}
