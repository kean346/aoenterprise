"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const poster = "/assets/motion/isometric-poster.webp";
const movie = "/assets/motion/isometric-scroll.mp4";

export function ScrollFilm() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrapper = section.current;
    const clip = video.current;
    if (!wrapper || !clip || !("IntersectionObserver" in window)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const device = navigator as Navigator & { connection?: { saveData?: boolean } };
    let inRange = false;
    let frame = 0;

    function seek() {
      frame = 0;
      if (!inRange || !wrapper || !clip || reduce.matches || !Number.isFinite(clip.duration) || clip.seeking) return;
      const bounds = wrapper.getBoundingClientRect();
      const start = Math.min(innerHeight * .72, 590);
      const picture = clip.parentElement;
      const top = picture ? parseFloat(getComputedStyle(picture).top) || 0 : 0;
      const distance = start + Math.max(0, bounds.height - clip.clientHeight - top);
      const progress = Math.max(0, Math.min(1, (start - bounds.top) / distance));
      const target = progress * (clip.duration - 1 / 24);
      if (Math.abs(clip.currentTime - target) >= 1 / 48) clip.currentTime = target;
      else if (clip.readyState >= 2) clip.dataset.frame = "ready";
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(seek);
    }

    function enable() {
      if (!clip || reduce.matches || device.connection?.saveData) {
        if (clip) {
          delete clip.dataset.frame;
          if (clip.hasAttribute("src")) {
            clip.removeAttribute("src");
            clip.load();
          }
        }
        return;
      }
      if (inRange && !clip.hasAttribute("src")) {
        clip.src = movie;
        clip.preload = "auto";
      }
      schedule();
    }

    const observer = new IntersectionObserver(([entry]) => {
      inRange = entry.isIntersecting;
      if (inRange) enable();
    }, { rootMargin: "160px" });
    observer.observe(wrapper);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    clip.addEventListener("loadeddata", schedule);
    clip.addEventListener("seeked", schedule);
    reduce.addEventListener("change", enable);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      clip.removeEventListener("loadeddata", schedule);
      clip.removeEventListener("seeked", schedule);
      reduce.removeEventListener("change", enable);
    };
  }, []);

  return (
    <section ref={section} className="scroll-film" aria-label="An illustrated supply network">
      <figure className="film-picture">
        <Image src={poster} alt="Four white objects around a central platform connected by lines on an isometric grid" width={1294} height={850} sizes="100vw" />
        <video ref={video} poster={poster} preload="none" muted playsInline disablePictureInPicture aria-hidden="true" />
      </figure>
    </section>
  );
}
