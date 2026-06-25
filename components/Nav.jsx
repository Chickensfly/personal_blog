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
    <>
      <div className={styles.safeAreaFill} aria-hidden="true" />
      <nav className={styles.nav} aria-label="Site navigation">
        {/* Site name — links to the merged landing/about page */}
        <Link href="/" className={styles.name}>
          jeff
        </Link>

        <div className="debugFixedTop" aria-hidden="true" />
        <div className="debugSafeTop" aria-hidden="true" />

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
                <span className={styles.postTitle}>{post.title}</span>
                {post.displayDate && (
                  <span className={styles.postDate}>{post.displayDate}</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
