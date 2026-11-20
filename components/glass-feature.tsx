"use client";

import { useEffect, useRef, useState } from "react";
import type { createFacetScene } from "./facet-scene";

const terms = [
  ["Iridescence", "A thin film splits reflections into colours that shift with the viewing angle."],
  ["Index of refraction", "A measure of how much light bends when it enters a material."],
  ["Dispersion", "Different wavelengths bend by different amounts, separating light into colour."],
  ["Transmission", "The share of light that passes through the surface instead of reflecting off it."],
  ["Roughness", "Microscopic texture scatters light and softens reflections."],
] as const;

export function GlassFeature() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const block = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const readPaper = useRef<HTMLButtonElement>(null);
  const scene = useRef<ReturnType<typeof createFacetScene> | null>(null);
  const details = useRef(false);
  const inspected = useRef(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [inspect, setInspect] = useState(false);

  function showDetails() {
    details.current = true;
    setOpen(true);
    scene.current?.setView(true);
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }

  function showStudio() {
    if (!details.current) {
      readPaper.current?.focus({ preventScroll: true });
      return;
    }
    details.current = false;
    setOpen(false);
    scene.current?.setView(false);
    requestAnimationFrame(() => readPaper.current?.focus({ preventScroll: true }));
  }

  function toggleInspection() {
    inspected.current = !inspected.current;
    setInspect(inspected.current);
    requestAnimationFrame(() => scene.current?.setInspection(inspected.current));
  }

  useEffect(() => {
    const panel = stage.current;
    const surface = canvas.current;
    const overlay = block.current;
    if (!panel || !surface || !overlay || !("IntersectionObserver" in window)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let pending = false;
    let failed = false;
    let ended = false;

    function loseContext() {
      failed = true;
      scene.current?.dispose();
      scene.current = null;
      setReady(false);
    }

    async function update() {
      if (ended || failed) return;
      if (reduced.matches) {
        if (scene.current) {
          scene.current.dispose();
          scene.current = null;
          setReady(false);
        }
        return;
      }
      if (!visible || document.hidden) {
        scene.current?.setVisible(false);
        return;
      }
      if (scene.current) {
        scene.current.setVisible(true);
        return;
      }
      if (pending || !panel || !surface || !overlay) return;
      pending = true;
      try {
        const [{ createFacetScene }] = await Promise.all([import("./facet-scene"), document.fonts.ready]);
        if (ended || !visible || reduced.matches) return;
        scene.current = createFacetScene(surface, overlay, panel, loseContext);
        scene.current.setInspection(inspected.current);
        scene.current.setView(details.current);
        scene.current.setVisible(true);
        setReady(true);
      } catch {
        loseContext();
      } finally {
        pending = false;
      }
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      void update();
    }, { threshold: .02 });
    const size = new ResizeObserver(() => scene.current?.resize());
    intersection.observe(panel);
    size.observe(panel);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      ended = true;
      intersection.disconnect();
      size.disconnect();
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  return (
    <section className="glass-feature" id="material-study" aria-label="Facet glass material study" tabIndex={-1}>
      <div ref={stage} className={`facet-stage${ready ? " facet-webgl" : ""}${open ? " details-active" : ""}${inspect ? " inspection-active" : ""}`}>
        <canvas ref={canvas} className="facet-canvas" aria-hidden="true" />
        <div ref={block} className="facet-block" inert={open}>
          <div className="facet-nav">
            <p data-ink className="facet-mark">◈&nbsp; Facet</p>
            <div className="facet-nav-links">
              <button type="button" data-ink onClick={showStudio}>Studio</button>
              <button type="button" data-ink onClick={showDetails}>Materials</button>
            </div>
          </div>
          <div className="facet-panel">
            <div className="facet-copy">
              <p className="facet-eyebrow" data-ink>Real-time material studio</p>
              <h2 data-ink>Designed<br />in glass.</h2>
              <p className="facet-summary" data-ink>Explore dispersion, transmission and refraction in the browser.</p>
              <div className="facet-actions">
                <button type="button" data-ink data-ink-button aria-pressed={inspect} onClick={toggleInspection}>Open studio</button>
                <button type="button" ref={readPaper} data-ink data-ink-arrow onClick={showDetails}>Read paper <span aria-hidden="true">→</span></button>
              </div>
            </div>
            <p className="facet-credit" data-ink>© Facet Lab</p>
            <p className="facet-spec" data-ink>KHR_materials_dispersion</p>
          </div>
        </div>
        <div className="facet-definitions" inert={!open} aria-hidden={!open}>
          <button type="button" className="facet-back" onClick={showStudio}><span>← Back</span></button>
          <div className="facet-reading">
            <h3 ref={heading} tabIndex={-1}>Real-time glass, in five terms.</h3>
            <dl>{terms.map(([term, body]) => <div key={term}><dt>{term}</dt><dd>{body}</dd></div>)}</dl>
          </div>
        </div>
      </div>
    </section>
  );
}
