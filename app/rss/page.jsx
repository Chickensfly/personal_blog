import CopyFeedLink from "@/components/CopyFeedLink";

export const metadata = { title: "jeff — rss" };

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://jeffcreates.space"
).replace(/\/$/, "");

export default function RssPage() {
  const feedUrl = `${SITE_URL}/feed.xml`;

  return (
    <div className="page rss-page-centered">
      <p>
        Let's stay in touch - copy the link below into your RSS feed reader of choice :)
      </p>
      <CopyFeedLink url={feedUrl} />
    </div>
  );
}
