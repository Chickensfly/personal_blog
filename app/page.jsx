import { getAboutLines } from "@/lib/posts";
import LandingCard from "@/components/LandingCard";

/**
 * Landing page — a 3D business card that tilts to follow the cursor.
 * It shows the photo first; clicking advances through the bio lines
 * as slides, then loops back to the photo.
 *
 * Replace /public/landing.JPG with your image; edit the bio text in
 * content/about.md (one line per slide). Styling lives in the "CARD"
 * section of app/globals.css.
 */
export const metadata = { title: "jeff" };

export default async function LandingPage() {
  const aboutLines = getAboutLines();

  return (
    <div className="page">
      <LandingCard imageSrc="/landing.JPG" aboutLines={aboutLines} />
    </div>
  );
}
