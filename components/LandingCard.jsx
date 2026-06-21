"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LandingCard
 *
 * A business card that appears to float in 3D. Moving the cursor
 * anywhere on the page tilts/pans the card to follow it (the
 * pointer maps to rotateY/rotateX, smoothed each frame so the card
 * eases toward the target rather than snapping).
 *
 * Clicking the card advances through its "slides":
 *   slide 0  → the photo
 *   slide 1..n → each line of the bio, one at a time
 * After the last bio line, the next click loops back to the photo
 * and the cycle repeats.
 *
 * Implementation notes:
 *   - Tilt: pointer position is normalised to -0.5..0.5 across the
 *     viewport, multiplied by a max-degree amount. A rAF loop lerps
 *     the rendered angle toward that target for weight.
 *   - A faint glare layer shifts with the tilt to sell the 3D feel.
 *   - Slides cross-fade; only the active one is interactive.
 */

const MAX_TILT = 20; // degrees of rotation at the screen edges

export default function LandingCard({ imageSrc, aboutLines }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  // pointer-driven tilt state
  const targetRX = useRef(0);
  const targetRY = useRef(0);
  const curRX = useRef(0);
  const curRY = useRef(0);

  const [slide, setSlide] = useState(0); // 0 = photo, 1..n = bio lines
  const [reduced, setReduced] = useState(false);

  const slideCount = aboutLines.length + 1;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    function onPointer(e) {
      // -0.5 .. 0.5 across each axis of the viewport
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      // moving right tilts the right edge back (negative Y rotation
      // reads as "looking from the right"); moving down tilts the
      // bottom toward you.
      targetRY.current = nx * MAX_TILT * 2;
      targetRX.current = -ny * MAX_TILT * 2;
    }

    function onLeave() {
      targetRX.current = 0;
      targetRY.current = 0;
    }

    function frame() {
      const ease = reduced ? 1 : 0.09;
      curRX.current += (targetRX.current - curRX.current) * ease;
      curRY.current += (targetRY.current - curRY.current) * ease;

      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${curRX.current.toFixed(2)}deg) rotateY(${curRY.current.toFixed(2)}deg)`;
      }
      if (glareRef.current) {
        const gx = 50 + curRY.current * 1.6;
        const gy = 50 - curRX.current * 1.6;
        glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%)`;
      }
      rafId.current = requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);
    rafId.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId.current);
    };
  }, [reduced]);

  function advance() {
    setSlide((s) => (s + 1) % slideCount);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      advance();
    }
  }

  return (
    <div className="card-stage">
      <div className="card-perspective">
        <div
          className="card"
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-label={
            slide === 0
              ? "Portrait. Click to read on."
              : `Slide ${slide} of ${aboutLines.length}. Click to continue.`
          }
          onClick={advance}
          onKeyDown={onKeyDown}
        >
          {/* Photo slide */}
          <div
            className={`card-slide card-slide--photo ${slide === 0 ? "is-active" : ""}`}
          >
            <div
              className="card-photo"
              style={{ backgroundImage: `url(${imageSrc})` }}
              role="img"
              aria-label="Landing photograph"
            />
          </div>

          {/* Text slides */}
          {aboutLines.map((line, i) => (
            <div
              key={i}
              className={`card-slide card-slide--text ${slide === i + 1 ? "is-active" : ""}`}
            >
              <p
                className="card-text"
                dangerouslySetInnerHTML={{ __html: line }}
              />
            </div>
          ))}

          {/* Glare overlay — moves with the tilt */}
          <div className="card-glare" ref={glareRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
