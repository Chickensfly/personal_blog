"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./MobilePostMenu.module.css";

/**
 * MobilePostMenu
 *
 * Mobile-only navigation for the blog. The desktop layout shows all
 * post titles in a fixed margin column, but that column is hidden on
 * narrow screens — leaving no way to move between posts. This fills
 * that gap: a floating button on post pages opens a vertical dropdown
 * of every post; tapping one navigates to it and collapses the menu,
 * so the post reads full-screen until the button is tapped again.
 *
 * Rendered on every writings page but CSS-hidden above the mobile
 * breakpoint (desktop already has its margin column), so it never
 * interferes with the desktop experience.
 */
export default function MobilePostMenu({ posts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu whenever the route changes (i.e. after a selection).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the menu is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape for keyboard/accessibility.
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!posts || posts.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {/* Backdrop — tap outside the sheet to close */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dropdown sheet of posts */}
      <div
        className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}
        role="menu"
        aria-hidden={!open}
      >
        <p className={styles.sheetHead}>writings</p>
        <div className={styles.list}>
          {posts.map((post) => {
            const active = pathname === `/writings/${post.slug}`;
            return (
              <Link
                key={post.slug}
                href={`/writings/${post.slug}`}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                className={`${styles.item} ${active ? styles.itemActive : ""}`}
              >
                <span className={styles.itemTitle}>{post.title}</span>
                {post.displayDate && (
                  <span className={styles.itemDate}>{post.displayDate}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating toggle button */}
      <button
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close posts menu" : "Open posts menu"}
      >
        <span className={styles.toggleLabel}>
          {open ? "close" : "posts"}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronUp : ""}`}>
          ▾
        </span>
      </button>
    </div>
  );
}
