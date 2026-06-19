"use client";

import { useRef, useEffect } from "react";

export default function LandingCanvas() {
  const canvasRef = useRef(null);

  const s = useRef({
    image: null,
    pixelSize: 1,
    hovering: false,
    offscreen: null,
    rafId: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const state = s.current;
    state.offscreen = document.createElement("canvas");

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }

    const img = new Image();
    img.src = "/landing.jpg";
    img.onload = () => {
      state.image = img;
      resize();
    };

    window.addEventListener("resize", resize);

    function draw() {
      if (!state.image || canvas.width === 0) return;

      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;
      const ps = Math.max(1, Math.round(state.pixelSize));

      if (ps <= 1) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(state.image, 0, 0, w, h);
        return;
      }

      // Scale down to 1/ps resolution, then back up without smoothing.
      // This merges blocks of pixels into single flat colours.
      const off = state.offscreen;
      const sw = Math.max(1, Math.floor(w / ps));
      const sh = Math.max(1, Math.floor(h / ps));
      off.width = sw;
      off.height = sh;

      const offCtx = off.getContext("2d");
      offCtx.imageSmoothingEnabled = true;
      offCtx.drawImage(state.image, 0, 0, sw, sh);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, w, h);
    }

    let lastTime = performance.now();

    function tick(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (state.hovering) {
        // Degrade — adjust the multiplier to change speed
        state.pixelSize = Math.min(64, state.pixelSize + dt * 14);
      } else {
        // Recover — slower than degradation
        state.pixelSize = Math.max(1, state.pixelSize - dt * 5);
      }

      draw();
      state.rafId = requestAnimationFrame(tick);
    }

    state.rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "crosshair",
      }}
      onMouseEnter={() => {
        s.current.hovering = true;
      }}
      onMouseLeave={() => {
        s.current.hovering = false;
      }}
    />
  );
}
