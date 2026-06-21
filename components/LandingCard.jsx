"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LandingCard
 *
 * A business card that appears to float in 3D.
 *
 * Desktop: moving the cursor anywhere tilts/pans the card to follow
 * it (pointer mapped to rotateY/rotateX, smoothed each frame).
 *
 * Mobile: the device's own tilt (accelerometer / orientation) drives
 * the same rotation, so physically tipping the phone tips the card.
 * On iOS this requires a one-time permission tap, so a small "enable
 * tilt" prompt is shown until the user grants it (or dismisses it).
 *
 * Clicking/tapping the card advances through its "slides":
 *   slide 0    → the photo
 *   slide 1..n → each line of the bio, one at a time
 * After the last bio line, the next tap loops back to the photo.
 */

const MAX_TILT = 20; // degrees of rotation at full pointer/device deflection

export default function LandingCard({ imageSrc, aboutLines }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  // shared tilt target/current state (used by both pointer + device)
  const targetRX = useRef(0);
  const targetRY = useRef(0);
  const curRX = useRef(0);
  const curRY = useRef(0);

  // device-orientation calibration: first reading becomes "flat"
  const baseBeta = useRef(null);
  const baseGamma = useRef(null);

  const [slide, setSlide] = useState(0); // 0 = photo, 1..n = bio lines
  const [reduced, setReduced] = useState(false);

  // tilt prompt state: "hidden" (desktop / not needed), "ask" (show
  // the enable button), "on" (granted + listening), "denied"
  const [tiltState, setTiltState] = useState("hidden");

  const slideCount = aboutLines.length + 1;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // ── Decide whether to offer device-tilt (mobile only) ──────────────
  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const hasOrientation =
      typeof window !== "undefined" && "DeviceOrientationEvent" in window;

    if (isTouch && hasOrientation) {
      // iOS 13+ gates orientation behind an explicit permission call.
      const needsPermission =
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function";

      if (needsPermission) {
        setTiltState("ask"); // must wait for a user gesture
      } else {
        // Android / older iOS — can just start listening.
        setTiltState("on");
      }
    }
  }, []);

  // ── Device orientation listener (when tilt is "on") ────────────────
  useEffect(() => {
    if (tiltState !== "on") return;

    function onOrient(e) {
      // beta: front-back tilt (-180..180), gamma: left-right (-90..90)
      if (e.beta == null || e.gamma == null) return;

      // Calibrate to wherever the phone is first held, so "neutral"
      // isn't necessarily dead flat on a table.
      if (baseBeta.current === null) {
        baseBeta.current = e.beta;
        baseGamma.current = e.gamma;
      }

      const db = e.beta - baseBeta.current; // relative front-back
      const dg = e.gamma - baseGamma.current; // relative left-right

      // Map a comfortable ±25° of physical tilt to full card tilt.
      const norm = (v) => Math.max(-1, Math.min(1, v / 25));
      targetRX.current = norm(db) * MAX_TILT; // tip forward → top tips toward you
      targetRY.current = norm(dg) * MAX_TILT; // tip right → right edge back
    }

    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [tiltState]);

  // ── Pointer listener (desktop) — only when device tilt isn't on ────
  useEffect(() => {
    if (tiltState === "on") return; // device tilt takes over

    function onPointer(e) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetRY.current = nx * MAX_TILT * 2;
      targetRX.current = -ny * MAX_TILT * 2;
    }
    function onLeave() {
      targetRX.current = 0;
      targetRY.current = 0;
    }

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [tiltState]);

  // ── Render loop: ease current → target every frame ─────────────────
  useEffect(() => {
    function frame() {
      const ease = reduced ? 1 : 0.09;
      curRX.current += (targetRX.current - curRX.current) * ease;
      curRY.current += (targetRY.current - curRY.current) * ease;

      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${curRX.current.toFixed(
          2,
        )}deg) rotateY(${curRY.current.toFixed(2)}deg)`;
      }
      if (glareRef.current) {
        const gx = 50 + curRY.current * 1.6;
        const gy = 50 - curRX.current * 1.6;
        glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%)`;
      }
      rafId.current = requestAnimationFrame(frame);
    }
    rafId.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId.current);
  }, [reduced]);

  // ── iOS permission request (must be inside a user gesture) ─────────
  async function enableTilt(e) {
    e.stopPropagation(); // don't also advance the slide
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      setTiltState(res === "granted" ? "on" : "denied");
    } catch {
      setTiltState("denied");
    }
  }

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
              ? "Portrait. Tap to read on."
              : `Slide ${slide} of ${aboutLines.length}. Tap to continue.`
          }
          onClick={advance}
          onKeyDown={onKeyDown}
        >
          {/* Photo slide */}
          <div
            className={`card-slide card-slide--photo ${
              slide === 0 ? "is-active" : ""
            }`}
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
              className={`card-slide card-slide--text ${
                slide === i + 1 ? "is-active" : ""
              }`}
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

      {/* Mobile-only: prompt to enable motion tilt (iOS permission) */}
      {tiltState === "ask" && (
        <button className="tilt-prompt" onClick={enableTilt}>
          enable tilt
        </button>
      )}
    </div>
  );
}
