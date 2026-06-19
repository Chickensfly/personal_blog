import { getAbout } from "@/lib/posts";

export const metadata = { title: "jeff — about" };

export default async function AboutPage() {
  const html = await getAbout();

  return (
    <div className="page about-page">
      <h1 className="about-name">jeff</h1>

      <div
        className="about-body prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
