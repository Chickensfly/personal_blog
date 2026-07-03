"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";

/**
 * BackToTop
 *
 * A small pill button that appears once the user has scrolled
 * past a threshold and smoothly returns them to the top of the
 * page on tap. Hidden on desktop (where the nav column is always
 * visible and orientation is easier to maintain) and only shown
 * on mobile via CSS.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      className={`${styles.btn} ${visible ? styles.visible : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      &#8963;
    </button>
  );
}
