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
 * that gap: a button beside the "WRITING" eyebrow opens a dropdown
 * of every post; tapping one navigates to it and collapses the menu.
 *
 * Rendered on every writings page but CSS-hidden above the mobile
 * breakpoint (desktop already has its margin column), so it never
 * interferes with the desktop experience.
 *
 * POSITIONING: this component sits inside `.post-header-row` (a flex
 * row shared with the eyebrow, see page.jsx), so the button lines up
 * with "WRITING" purely through layout — no fixed positioning, no
 * measured offsets. Earlier versions used `position: fixed` with a
 * computed `top`, which broke whenever anything above it changed
 * height (a title wrapping to two lines, nav height, device safe-area
 * insets). Being in the normal document flow removes that whole class
 * of bug: the button cannot drift out of line with the eyebrow,
 * because they are literally the same flex row.
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

      {/* Floating toggle button */}
      <button
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close posts menu" : "Open posts menu"}
      >
        <span className={styles.toggleLabel}>{open ? "close" : "posts"}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronUp : ""}`}>
          ▾
        </span>
      </button>

      {/* Dropdown sheet of posts — anchored to the button above it */}
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
    </div>
  );
}
