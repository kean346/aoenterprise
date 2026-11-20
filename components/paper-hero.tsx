"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { createPaperScene } from "./paper-scene";

const source = "/assets/hero/ao-paper-study.webp";

export function PaperHero() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const isPaused = useRef(false);
  const updatePlayback = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  function toggleMotion() {
    isPaused.current = !isPaused.current;
    setPaused(isPaused.current);
    updatePlayback.current?.();
  }

  useEffect(() => {
    const container = stage.current;
    const surface = canvas.current;
    if (!container || !surface || !("IntersectionObserver" in window)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 700px)");
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

    let scene: Awaited<ReturnType<typeof createPaperScene>> | undefined;
    let visible = false;
    let elapsed = 0;
    let last = 0;
    let frame = 0;
    let generation = 0;
    let loading = false;
    let failed = false;
    let disposed = false;

    function draw(time: number) {
      if (!scene || disposed || !visible || document.hidden || isPaused.current) {
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(draw);
      const step = time - last;
      if (last && step < (mobile.matches ? 31 : 15)) return;
      if (last) elapsed += Math.min(step, 70) / 1000;
      last = time;
      container?.style.setProperty("--unfurl", String(scene.draw(elapsed)));
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }

    function fallback() {
      generation++;
      loading = false;
      stop();
      scene?.dispose();
      scene = undefined;
      if (!disposed) setReady(false);
    }

    function sceneError() {
      failed = true;
      fallback();
    }

    function resize() {
      if (!scene || !container) return;
      scene.resize(container.clientWidth, container.clientHeight);
      container?.style.setProperty("--unfurl", String(scene.draw(elapsed)));
    }

    async function update() {
      if (disposed || failed) return;
      if (reduced.matches || device.connection?.saveData || (mobile.matches && (device.deviceMemory ?? 4) < 4)) {
        if (scene || loading) fallback();
        return;
      }
      if (!visible || document.hidden || isPaused.current) {
        stop();
        return;
      }
      if (!scene && !loading && surface) {
        loading = true;
        const version = ++generation;
        try {
          const { createPaperScene } = await import("./paper-scene");
          if (disposed || version !== generation) return;
          const loaded = await createPaperScene(surface, source, sceneError, mobile.matches);
          if (disposed || version !== generation) {
            loaded.dispose();
            return;
          }
          scene = loaded;
          resize();
          setReady(true);
        } catch {
          if (version === generation) sceneError();
          return;
        } finally {
          if (version === generation) loading = false;
        }
      }
      if (scene && visible && !document.hidden && !frame) frame = requestAnimationFrame(draw);
    }

    updatePlayback.current = update;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      void update();
    }, { threshold: 0.06 });
    const size = new ResizeObserver(resize);
    intersection.observe(container);
    size.observe(container);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      disposed = true;
      updatePlayback.current = null;
      intersection.disconnect();
      size.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
      fallback();
    };
  }, []);

  return (
    <figure className={ready ? "paper-figure live-paper" : "paper-figure"}>
      <div className="paper-stage" ref={stage} aria-hidden="true">
        <div className="paper-shadow" />
        <div className="paper-sheet">
          <Image className="paper-fallback" src={source} alt="" fill preload sizes="(max-width: 700px) 100vw, 76vw" />
          <canvas ref={canvas} className="paper-canvas" />
        </div>
      </div>
      <figcaption className="hero-caption">
        <span className="eyebrow">Pretoria, South Africa</span>
        {ready && <button type="button" className="motion-button" onClick={toggleMotion} aria-label={paused ? "Play paper animation" : "Pause paper animation"}>
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        </button>}
      </figcaption>
    </figure>
  );
}
