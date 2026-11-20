import { between, clamp, cubicOut, glide, mix, springOut } from "./tide-geometry";
import type { StageDimensions } from "./tide-geometry";

const path = [
  [.33,-.03,.73],[.45,.04,.71],[.60,.13,.65],[.70,.22,.55],[.80,.31,.44],
  [.87,.325,.475],[.93,.26,.48],[1.00,.215,.45],[1.07,.225,.515],[1.15,.27,.52],
];

const letterStart = 1.9;
const letterDuration = .22;

export function createTideIntro(story: HTMLElement) {
  const letters = Array.from(story.querySelectorAll<HTMLElement>(".tide-letter"));
  const icons = Array.from(story.querySelectorAll<SVGElement>(".tide-pixel"));
  const plane = story.querySelector<HTMLElement>(".tide-flight");
  const counts = [0];
  for (const letter of letters) counts.push(counts[counts.length - 1] + (letter.textContent?.trim() ? 1 : 0));
  const totalVisible = counts[counts.length - 1] || 1;
  let positions = [0];

  function measure() {
    positions = [0];
    for (const letter of letters) positions.push(positions[positions.length - 1] + letter.offsetWidth);
  }

  function paintPlane(time: number, frame: StageDimensions) {
    if (!plane) return;
    if (time < .33 || time >= 1.33) {
      plane.style.opacity = "0";
      return;
    }
    const { width, height, icon } = frame;
    const firstSlot = width * .5 - (icons.length - 1) * icon * .6;
    const points = [...path, [1.27, firstSlot / width, .41]];
    function pointAt(t: number): [number, number] {
      const index = Math.max(0, Math.min(points.length - 2, points.findIndex(([start]) => start > t) - 1));
      if (t >= 1.27) return [firstSlot, .41 * height];
      const a = points[Math.max(0, index - 1)];
      const b = points[index];
      const c = points[index + 1];
      const d = points[Math.min(points.length - 1, index + 2)];
      const u = between(t, b[0], c[0]);
      const axis = (k: number) => .5 * (
        2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u ** 2 +
        (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u ** 3
      );
      return [axis(1) * width, axis(2) * height];
    }
    const [x, y] = pointAt(time);
    const a = pointAt(Math.min(time, 1.27) - .008);
    const b = pointAt(Math.min(time + .008, 1.27));
    const angle = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + 18;
    const landing = between(time, 1.27, 1.33);
    plane.style.opacity = String(1 - landing);
    plane.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${angle}deg) scale(${mix(1,.6,landing)})`;
  }

  function paint(time: number, frame: StageDimensions) {
    paintPlane(time, frame);
    const gap = frame.icon * .2;
    const pitch = frame.icon + gap;
    const current = clamp((time - letterStart) / letterDuration, 0, letters.length);
    const shown = Math.floor(current);
    const next = Math.min(shown + 1, letters.length);
    const timing = current - shown;
    const shift = glide(timing);
    const iconsRemaining = (index: number) => Math.ceil(icons.length * (totalVisible - counts[index]) / totalVisible);
    const row = (index: number) => {
      const remaining = iconsRemaining(index);
      const ink = positions[index];
      const margin = index > 0 && remaining > 0 ? gap * 1.6 : 0;
      return ink + margin + (remaining ? remaining * pitch - gap : 0);
    };
    const start = (frame.width - mix(row(shown), row(next), shift)) * .5;
    const oldFirst = icons.length - iconsRemaining(shown);
    const newFirst = icons.length - iconsRemaining(next);

    letters.forEach((letter, index) => {
      const visible = index < shown ? 1 : index === shown ? cubicOut(between(timing, .32, .90)) : 0;
      letter.style.opacity = String(visible > 0 ? 1 : 0);
      letter.style.clipPath = `inset(0 ${(1 - visible) * 100}% 0 0)`;
      letter.style.transform = `translate3d(${start + positions[index]}px,0,0)`;
    });

    icons.forEach((icon, index) => {
      const appear = 1.27 + (index === 0 ? 0 : .03 + (index - 1) * .07);
      const pop = between(time, appear, appear + .32);
      const entering = between(time, appear, appear + .12);
      const disappears = index >= oldFirst && index < newFirst ? timing : index < oldFirst ? 1 : 0;
      const afterSquash = between(disappears, .45, 1);
      const squash = cubicOut(between(disappears, 0, .45));
      const outgoing = index < newFirst && index >= oldFirst;
      const nowAt = (step: number, first: number) => positions[step] + (step > 0 ? gap * 1.6 : 0) + (index - first) * pitch;
      const x = start + (time < letterStart ? index * pitch : outgoing ? nowAt(shown, oldFirst) : mix(nowAt(shown, oldFirst), nowAt(next, newFirst), shift));
      icon.style.opacity = String(entering * (1 - afterSquash));
      icon.style.filter = `brightness(${1 - squash})`;
      icon.style.transform = `translate3d(${x}px,${(frame.heading - frame.icon) / 2}px,0) rotate(${-28 * squash - 62 * afterSquash}deg) scale(${springOut(pop) * (1 + .25 * squash)},${springOut(pop) * (1 - .84 * squash)})`;
    });
  }

  function finish() {
    story.removeAttribute("data-intro");
    for (const letter of letters) {
      letter.style.removeProperty("opacity");
      letter.style.removeProperty("clip-path");
      letter.style.removeProperty("transform");
    }
    for (const icon of icons) icon.removeAttribute("style");
    plane?.removeAttribute("style");
  }

  return { measure, paint, finish, duration: letterStart + letterDuration * letters.length };
}
