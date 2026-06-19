import { getLinks, hostname } from "@/lib/posts";

export const metadata = { title: "jeff — links" };

export default async function LinksPage() {
  const sections = await getLinks();

  return (
    <div className="page links-page">
      <h1 className="links-title">Links</h1>
      <div>
        <p className="links-description">Where to find me</p>
      </div>

      {sections.map((section) => (
        <section key={section.heading} className="links-section">
          <p className="links-section-head">{section.heading}</p>

          {section.items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              className="link-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="link-item-label">{item.label}</span>
              <span className="link-item-host">{hostname(item.url)}</span>
            </a>
          ))}
        </section>
      ))}

      {sections.length === 0 && (
        <p style={{ fontStyle: "italic", color: "var(--faded)" }}>
          Add your links to <code>content/links.js</code>.
        </p>
      )}
    </div>
  );
}
