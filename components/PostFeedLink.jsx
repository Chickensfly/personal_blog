import styles from "./PostFeedLink.module.css";

/**
 * PostFeedLink
 *
 * A quiet "subscribe via RSS" line for the bottom of a post,
 * between the article body and the back-to-top control.
 */
export default function PostFeedLink() {
  return (
    <div className={styles.wrap}>
      <a href="/feed.xml" className={styles.link}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
        </svg>
        subscribe via rss
      </a>
    </div>
  );
}
