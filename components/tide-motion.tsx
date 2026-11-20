"use client";

import { useEffect } from "react";
import { startTideMotion } from "./tide-engine";

export function TideMotion() {
  useEffect(() => {
    if (!matchMedia("(scripting: enabled)").matches) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let stop: (() => void) | undefined;

    function sync() {
      stop?.();
      stop = !preference.matches ? startTideMotion() : undefined;
    }

    sync();
    preference.addEventListener("change", sync);
    return () => {
      preference.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return null;
}
