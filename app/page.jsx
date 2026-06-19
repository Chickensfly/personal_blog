/**
 * Landing page — just a photograph.
 *
 * ► Replace /public/landing.jpg with your image.
 *   (JPEG, PNG, or WebP — keep it under ~2 MB for fast loading)
 *
 * The image fills the right-hand area of the viewport.
 * The nav floats over the paper-coloured left margin.
 */
export default function LandingPage() {
  return (
    <div className="page landing-page">
      <div className="landing-photo" role="img" aria-label="Landing photograph" />
    </div>
  );
}
