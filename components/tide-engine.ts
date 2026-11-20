import { between, blend, cardPose, cubicInOut, damping, dimensions, mix, springOut } from "./tide-geometry";
import type { CardPose } from "./tide-geometry";
import { createTideIntro } from "./tide-intro";

const riseOrder = [5, 2, 0, 1, 3, 4];
const riseTimes = [.53, .60, .63, .70, .80, .86];
const sizeNames = ["--u", "--n", "--hfs", "--ic", "--pfs", "--sfs", "--mfs", "--camw", "--cw"] as const;

function remaining(pose: CardPose, target: CardPose) {
  return Math.hypot(pose[0] - target[0], pose[1] - target[1]) > 2.4 ||
    Math.abs(pose[2] - target[2]) > .8 || Math.abs(pose[4] - target[4]) > .012;
}

function trackOffset(element: HTMLElement, track: HTMLElement) {
  let left = 0;
  for (let item: HTMLElement | null = element; item && item !== track; item = item.offsetParent as HTMLElement | null) {
    left += item.offsetLeft;
  }
  return left;
}

export function startTideMotion() {
  const root = document.documentElement;
  const story = document.querySelector<HTMLElement>(".tide-story");
  const hero = document.querySelector<HTMLElement>(".tide-hero");
  const stage = document.querySelector<HTMLElement>(".tide-stage");
  const process = document.querySelector<HTMLElement>(".tide-process");
  const sky = document.querySelector<HTMLElement>(".tide-sky");
  const skyMedia = sky?.querySelector<HTMLElement>(".sky-media");
  const camera = sky?.querySelector<HTMLElement>(".tide-camera");
  const video = sky?.querySelector<HTMLVideoElement>("video");
  const blackout = document.querySelector<HTMLElement>(".tide-blackout");
  const manifesto = document.querySelector<HTMLElement>(".manifesto");
  const track = manifesto?.querySelector<HTMLElement>(".manifesto-track");
  const nav = document.querySelector<HTMLElement>(".site-header");
  if (!story || !hero || !stage || !process || !sky || !skyMedia || !camera || !video || !blackout || !manifesto || !track) return;

  const scene = { story, hero, stage, process, sky, skyMedia, camera, video, blackout, manifesto, track, nav };
  const cards = Array.from(story.querySelectorAll<HTMLElement>(".tide-card"));
  const manifestoParts = Array.from(track.querySelectorAll<HTMLElement>(".manifesto-part"));
  const intro = createTideIntro(story);
  const supportsWheel = window.matchMedia("(hover: hover) and (pointer: fine)");
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  let frame = dimensions(innerWidth, innerHeight);
  let storyTop = 0;
  let storyLength = 0;
  let manifestoTop = 0;
  let manifestoLength = 0;
  let trackWidth = 0;
  let partOffsets: number[] = [];
  let poses: CardPose[] = [];
  let skyAmount = 0;
  let videoVisible = false;
  let raf = 0;
  let lastTime = performance.now();
  const openedAt = lastTime;
  let viewY = scrollY;
  let wheelAt = -Infinity;
  let introPlaying = scrollY < 12;
  let disposed = false;

  story.dataset.enhanced = "";
  manifesto.dataset.enhanced = "";
  if (introPlaying) story.dataset.intro = "";

  function size() {
    frame = dimensions(scene.stage.clientWidth, scene.stage.clientHeight);
    const values = [`${frame.unit}px`, frame.n, `${frame.heading}px`, `${frame.icon}px`, `${frame.process}px`, `${frame.sky}px`, `${frame.manifesto}px`, `${frame.camera}px`, frame.card];
    sizeNames.forEach((name, index) => root.style.setProperty(name, String(values[index])));
    storyTop = scene.story.getBoundingClientRect().top + scrollY;
    storyLength = scene.story.offsetHeight - frame.height;
    manifestoTop = scene.manifesto.getBoundingClientRect().top + scrollY;
    manifestoLength = scene.manifesto.offsetHeight - frame.height;
    trackWidth = scene.track.scrollWidth;
    partOffsets = manifestoParts.map((item) => trackOffset(item, scene.track));
    intro.measure();
    viewY = scrollY;
    poses = [];
    schedule();
  }

  function schedule() {
    if (!raf && !disposed) raf = requestAnimationFrame(paint);
  }

  function setVideo(visible: boolean) {
    if (visible === videoVisible) return;
    videoVisible = visible;
    if (!visible) {
      scene.video.pause();
      return;
    }
    if (connection?.saveData || !scene.video.dataset.src) return;
    if (!scene.video.hasAttribute("src")) scene.video.src = scene.video.dataset.src;
    scene.video.defaultPlaybackRate = .6;
    scene.video.playbackRate = .6;
    void scene.video.play().catch(() => {});
  }

  function drawCards(progress: number, time: number, dt: number) {
    let moving = false;
    cards.forEach((card, index) => {
      const target = cardPose(index, progress, frame);
      let pose = poses[index] ?? target;
      if (progress < .004 && introPlaying && index < 6 && time < 1.56) {
        const start = riseTimes[riseOrder.indexOf(index)];
        const reveal = between(time, start, start + .70);
        const rise: CardPose = [target[0], frame.height + frame.card * 1.2, target[2] + 8, 1, 0];
        pose = blend(rise, target, springOut(reveal));
        pose[4] = reveal > 0 ? 1 : 0;
      } else if (progress < .004 || !remaining(pose, target)) {
        pose = target;
      } else {
        pose = blend(pose, target, damping(.055 + index % 4 * .008, dt));
        moving = true;
      }
      poses[index] = pose;
      const [x, y, angle, scale, alpha] = pose;
      card.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${angle}deg) scale(${scale})`;
      card.style.opacity = String(alpha);
    });
    return moving;
  }

  function drawSky(progress: number, ready: boolean, now: number, dt: number) {
    const target = ready ? between(progress, .62, .74) : 0;
    skyAmount = Math.abs(skyAmount - target) < .001 ? target : mix(skyAmount, target, damping(.09, dt));
    const growing = Math.abs(skyAmount - target) > .001;
    const open = skyAmount > .001;
    scene.sky.toggleAttribute("data-visible", open);
    scene.sky.toggleAttribute("data-revealed", skyAmount >= .997);
    setVideo(open && progress < .98 && !document.hidden);
    if (!open) {
      scene.blackout.style.opacity = "0";
      return growing;
    }
    const opening = cubicInOut(skyAmount);
    const side = (frame.mobile ? 29 : 41.5) * (1 - opening);
    const top = (frame.mobile ? 36 : 28) * (1 - opening);
    const bottom = (frame.mobile ? 48 : 52) * (1 - opening);
    scene.sky.style.clipPath = `inset(${top}% ${side}% ${bottom}% ${side}% round ${14 * (1 - opening)}px)`;
    scene.skyMedia.style.transform = `scale(${mix(1.18, 1, opening)})`;
    const lens = between(progress, .88, .97) ** 1.6 * between(skyAmount, .9, 1);
    const scale = mix(.5, 1, opening) * (1 + lens * lens * 28);
    const yaw = mix(-10, 10, between(progress, .74, .88));
    const bob = Math.sin(now * .0016) * 6 * frame.n * opening;
    scene.camera.style.transform = `translateY(${bob}px) perspective(900px) rotateY(${yaw}deg) scale(${scale})`;
    scene.blackout.style.opacity = String(between(lens, .45, .85));
    return growing || (open && progress < .975);
  }

  function drawManifesto(progress: number, position: number) {
    const x = mix(frame.width * (frame.mobile ? .08 : .06), -(trackWidth - frame.width * .9), progress);
    scene.track.style.setProperty("--track-x", `${x}px`);
    if (position < manifestoTop - frame.height * .2) return;
    const limit = frame.width * (frame.mobile ? .92 : .86);
    manifestoParts.forEach((part, index) => {
      if (!part.hasAttribute("data-revealed") && partOffsets[index] + x < limit) part.dataset.revealed = "";
    });
  }

  function paint(now: number) {
    raf = 0;
    if (document.hidden) return;
    const dt = Math.min(64, now - lastTime || 16.67);
    lastTime = now;
    const nativeY = scrollY;
    const dampScroll = now - wheelAt < 250;
    viewY = dampScroll ? mix(viewY, nativeY, damping(.06, dt)) : nativeY;
    const progress = between(viewY - storyTop, 0, Math.max(1, storyLength));
    const storyActive = nativeY >= storyTop - frame.height && nativeY < manifestoTop;
    const initialTitleTop = frame.height * .41 - frame.heading * .5;
    const titleTop = initialTitleTop + storyTop - nativeY;
    const bar = scene.nav?.offsetHeight ?? 86 * frame.n;
    const fadeEnd = bar + frame.heading * .55;
    const fadeStart = Math.max(fadeEnd + 1, Math.min(initialTitleTop, bar + frame.heading * 1.9));
    const titleAlpha = nativeY <= storyTop ? 1 : between(titleTop, fadeEnd, fadeStart);
    const elapsed = (now - openedAt) / 1000;
    let running = dampScroll && Math.abs(viewY - nativeY) > .05;

    if (introPlaying && (!storyActive || progress >= .03 || elapsed >= intro.duration)) {
      introPlaying = false;
      intro.finish();
    }
    if (storyActive) {
      scene.hero.style.opacity = String(titleAlpha);
      if (introPlaying) intro.paint(elapsed, frame);
      const moving = drawCards(progress, elapsed, dt);
      const processAlpha = between(progress, .05, .075);
      const processVisible = progress > .05 && progress < .91;
      scene.process.toggleAttribute("data-visible", processVisible);
      scene.process.toggleAttribute("data-revealed", processVisible && progress > .078);
      scene.process.style.opacity = String(processVisible ? processAlpha : 0);
      const skyMoving = drawSky(progress, !moving && progress >= .62, now, dt);
      running ||= moving || introPlaying || skyMoving;
    } else {
      setVideo(false);
      poses = [];
      skyAmount = 0;
    }

    const inManifesto = nativeY >= manifestoTop - frame.height && nativeY < manifestoTop + manifestoLength + frame.height;
    if (inManifesto) drawManifesto(between(viewY - manifestoTop, 0, Math.max(1, manifestoLength)), nativeY);
    const darkNav = (storyActive && progress > .985) || (
      nativeY + bar * .55 >= manifestoTop && nativeY + bar * .55 < manifestoTop + manifestoLength + frame.height
    );
    document.body.classList.toggle("dark-nav", darkNav);
    if (running) schedule();
  }

  function wheel(event: WheelEvent) {
    const menu = scene.nav?.querySelector("details[open]");
    if (!supportsWheel.matches || menu || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (scrollY < storyTop || scrollY >= manifestoTop + manifestoLength + frame.height || !event.cancelable) return;
    const unit = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? frame.height : 1;
    event.preventDefault();
    wheelAt = performance.now();
    window.scrollBy(0, event.deltaY * unit * .75);
    schedule();
  }

  function playing() { scene.video.dataset.playing = ""; }
  function onVisibility() { if (document.hidden) setVideo(false); else schedule(); }

  size();
  document.fonts.ready.then(() => { if (!disposed) size(); });
  window.addEventListener("resize", size);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("wheel", wheel, { passive: false });
  document.addEventListener("visibilitychange", onVisibility);
  video.addEventListener("playing", playing);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", size);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("wheel", wheel);
    document.removeEventListener("visibilitychange", onVisibility);
    video.removeEventListener("playing", playing);
    video.pause();
    video.removeAttribute("src");
    video.removeAttribute("data-playing");
    video.load();
    hero.removeAttribute("style");
    process.removeAttribute("style");
    process.removeAttribute("data-visible");
    process.removeAttribute("data-revealed");
    sky.removeAttribute("data-visible");
    sky.removeAttribute("data-revealed");
    sky.style.removeProperty("clip-path");
    skyMedia.style.removeProperty("transform");
    camera.style.removeProperty("transform");
    blackout.removeAttribute("style");
    story.removeAttribute("data-enhanced");
    manifesto.removeAttribute("data-enhanced");
    track.style.removeProperty("--track-x");
    for (const card of cards) {
      card.style.removeProperty("transform");
      card.style.removeProperty("opacity");
    }
    for (const part of manifestoParts) part.removeAttribute("data-revealed");
    intro.finish();
    for (const sizeName of sizeNames) root.style.removeProperty(sizeName);
    document.body.classList.remove("dark-nav");
  };
}
