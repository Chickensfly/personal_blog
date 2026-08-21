"use client";

import { useState } from "react";
import styles from "./CopyFeedLink.module.css";

/**
 * CopyFeedLink
 *
 * A read-only URL box with a copy button. Split out as its own
 * client component so the rest of the /rss page can stay a plain
 * server component, same pattern as BackToTop.
 */
export default function CopyFeedLink({ url }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable (older browser, non-HTTPS context) —
      // fall back to a manual select so the user can still Cmd/Ctrl+C.
      const input = document.getElementById("feed-url-input");
      input?.select();
      document.execCommand?.("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.row}>
      <input
        id="feed-url-input"
        className={styles.box}
        type="text"
        readOnly
        value={url}
        onFocus={(e) => e.target.select()}
      />
      <button className={styles.button} onClick={copy}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
