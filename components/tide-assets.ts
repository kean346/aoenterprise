import type { CSSProperties } from "react";

const source = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

function image(file: string, width: number) {
  const url = encodeURIComponent(source + file);
  return `https://images.higgs.ai/?default=1&output=webp&url=${url}&w=${width}&q=85`;
}

const gridC = "hf_20261118_061433_df51e37b-d8b8-40b1-9830-01ea6c20c83d.png";
const stickers = "hf_20261118_061547_979f8673-f904-4102-90a0-6458bce33bc8.png";

export const tideAssets = {
  a: image("hf_20261118_061436_77e1a13d-60a0-4746-bf7b-53b2365609f5.png", 900),
  b: image("hf_20261118_061435_8a1828bc-a149-44ea-80fd-c4c33eef7407.png", 900),
  c: image(gridC, 900),
  chip: image(gridC, 300),
  sky: image("hf_20261118_061434_a222c9d2-715b-44b7-873f-0548d1624211.png", 2400),
  video: source + "hf_20261118_065029_a6ae2ebb-cd79-41fd-ae60-6b66fdda04ee.mp4",
  camera: image("hf_20261118_061547_10365665-40d3-4390-944f-7bcb10dc6d4a.png", 1400),
  flight: image(stickers, 1200),
  stickers: image(stickers, 700),
};

export const productArt = [
  [tideAssets.b, 3, "#c0c9d9"],
  [tideAssets.a, 1, "#ddad95"],
  [tideAssets.a, 2, "#7da3bb"],
  [tideAssets.a, 3, "#ebc9ae"],
  [tideAssets.b, 0, "#bf9fa5"],
  [tideAssets.b, 1, "#4c6165"],
  [tideAssets.c, 1, "#b0aec6"],
  [tideAssets.c, 0, "#ebc9ae"],
  [tideAssets.b, 2, "#7da3bb"],
  [tideAssets.a, 0, "#bf9fa5"],
  [tideAssets.c, 2, "#4c6165"],
  [tideAssets.c, 3, "#bad9e6"],
] as const;

export function quadrant(sheet: string, index: number, color?: string): CSSProperties {
  return {
    backgroundImage: `url("${sheet}")`,
    backgroundSize: "200% 200%",
    backgroundPosition: `${(index % 2) * 100}% ${Math.floor(index / 2) * 100}%`,
    backgroundColor: color,
  };
}

export function sprite(url: string, [x0, y0, x1, y1]: readonly [number, number, number, number]): CSSProperties {
  const dx = x1 - x0;
  const dy = y1 - y0;
  return {
    aspectRatio: dx / dy,
    backgroundImage: `url("${url}")`,
    backgroundSize: `${100 / dx}% ${100 / dy}%`,
    backgroundPosition: `${dx === 1 ? 0 : x0 / (1 - dx) * 100}% ${dy === 1 ? 0 : y0 / (1 - dy) * 100}%`,
  };
}

export const crops = {
  plane: [.594, .613, .891, .816],
  camera: [.148, .141, .879, .809],
  shell: [.109, .121, .430, .422],
  pearl: [.625, .152, .863, .395],
  capsule: [.094, .656, .418, .793],
} as const;
