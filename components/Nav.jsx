"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import styles from "./Nav.module.css";

export default function Nav({ posts }) {
  const pathname = usePathname();
  const inWritings = pathname?.startsWith("/writings") ?? false;

  // Shift page content right when the post list column is visible
  useEffect(() => {
    document.body.classList.toggle("in-writings", inWritings);
    return () => document.body.classList.remove("in-writings");
  }, [inWritings]);

  return (
    <nav className={styles.nav} aria-label="Site navigation">
      {/* Site name — links to about */}
      <Link href="/about" className={styles.name}>
        jeff
      </Link>

      {/* Primary links */}
      <div className={styles.navLinks}>
        <Link
          href="/writings"
          className={
            inWritings
              ? `${styles.navLink} ${styles.navLinkActive}`
              : styles.navLink
          }
        >
          writings
        </Link>
        <Link
          href="/links"
          className={
            pathname === "/links"
              ? `${styles.navLink} ${styles.navLinkActive}`
              : styles.navLink
          }
        >
          links
        </Link>
      </div>

      {/* Writing titles — appear in the margin when in the writings section */}
      {inWritings && posts.length > 0 && (
        <div className={styles.postList} aria-label="Posts">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writings/${post.slug}`}
              className={
                pathname === `/writings/${post.slug}`
                  ? `${styles.postLink} ${styles.postLinkActive}`
                  : styles.postLink
              }
            >
              {post.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
