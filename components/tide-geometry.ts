export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const between = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
export const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
export const cubicOut = (value: number) => 1 - (1 - value) ** 3;
export const cubicInOut = (value: number) => value < .5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2;
export const springOut = (value: number) => 1 + 2.15 * (value - 1) ** 3 + 1.15 * (value - 1) ** 2;
export const damping = (weight: number, milliseconds: number) => 1 - (1 - weight) ** (milliseconds / 16.67);

export function glide(progress: number) {
  if (progress === 0 || progress === 1) return progress;
  let low = 0;
  let high = 1;
  let t = progress;
  for (let i = 0; i < 10; i++) {
    t = (low + high) / 2;
    const x = 3 * .25 * t * (1 - t) ** 2 + 3 * .2 * t ** 2 * (1 - t) + t ** 3;
    if (x < progress) low = t;
    else high = t;
  }
  return 3 * .75 * t * (1 - t) ** 2 + 3 * t ** 2 * (1 - t) + t ** 3;
}

export function dimensions(width: number, height: number) {
  const mobile = width < 820 && width < height * 1.1;
  const n = mobile ? Math.min(1, width / 560) : clamp(width / 1440, .62, 1.25);
  const heading = mobile ? Math.min(width * .12, height * .09) : Math.min(width * .074, height * .135);
  return {
    width, height, mobile, n, heading,
    icon: heading * .62,
    unit: Math.min(width / 1440, height / 800),
    process: mobile ? Math.min(width * .085, 40) : Math.min(width * .0335, height * .062),
    sky: mobile ? Math.min(width * .09, 44) : Math.min(width * .042, height * .078),
    manifesto: mobile ? Math.min(width * .11, height * .075) : Math.min(width * .05, height * .1),
    camera: mobile ? Math.min(width * .62, height * .34) : Math.min(width * .19, height * .36),
    card: mobile ? Math.min(width * .30, height * .20) : Math.min(width / 1440, height / 780) * 218,
  };
}

export type StageDimensions = ReturnType<typeof dimensions>;
export type CardPose = [x: number, y: number, angle: number, scale: number, alpha: number];

const scatterWide = [[.08,.46,-20],[.20,.86,-12],[.80,.84,14],[.38,1.04,-8],[.92,.42,16],[.62,1.04,9]];
const scatterMobile = [[.06,.60,-20],[.45,.66,12],[.94,.60,16],[.22,.93,-14],[.72,.96,9],[.5,1.3,0]];
const circleStep = (radius: number, card: number) => 2 * Math.asin(Math.min(1, 1.05 * card / (2 * radius)));

export function blend(a: CardPose, b: CardPose, amount: number): CardPose {
  return [mix(a[0], b[0], amount), mix(a[1], b[1], amount), mix(a[2], b[2], amount), mix(a[3], b[3], amount), mix(a[4], b[4], amount)];
}

export function fan(index: number, frame: StageDimensions): CardPose {
  const { width, height, card, mobile } = frame;
  if (index > 5) return [width * .5, height * 1.4, 0, 1, 0];
  const radius = width * (mobile ? 1.35 : 1250 / 1440);
  const theta = (index - 2.5) * circleStep(radius, card);
  return [
    width * (mobile ? .5 : .53) + radius * Math.sin(theta),
    height * .86 + radius * (1 - Math.cos(theta)) + (mobile ? card * .2 : 0),
    theta * 180 / Math.PI, 1, 1,
  ];
}

function scatter(index: number, frame: StageDimensions): CardPose {
  if (index > 5) return [frame.width * .5, frame.height * 1.4, 0, 1, 0];
  const [x, y, angle] = (frame.mobile ? scatterMobile : scatterWide)[index];
  return [frame.width * x, frame.height * y, angle, 1, 1];
}

function pile(index: number, frame: StageDimensions): CardPose {
  return [
    frame.width * .5 + ((index % 3) - 1) * frame.card * .08,
    frame.height * .62 + (((index * 7) % 5) - 2) * frame.card * .04,
    (4 + index * 1.3) * (index % 2 === 0 ? -1 : 1),
    1, 1,
  ];
}

function wheel(index: number, progress: number, frame: StageDimensions): CardPose {
  const { width, height, mobile, card } = frame;
  const radius = width * (mobile ? 1.2 : 900 / 1440);
  const slot = (index - 3 * progress + 12) % 12 - 5.5;
  const theta = slot * circleStep(radius, card);
  const angle = theta * 180 / Math.PI;
  return [
    width * .5 + radius * Math.sin(theta),
    height * (mobile ? .76 : .82) + radius * (1 - Math.cos(theta)),
    angle, 1, 1 - between(Math.abs(angle), 58, 62),
  ];
}

export function cardPose(index: number, progress: number, frame: StageDimensions): CardPose {
  if (progress <= .21) return blend(fan(index, frame), scatter(index, frame), cubicInOut(between(progress, .004, .085)));
  if (progress <= .31) return blend(scatter(index, frame), pile(index, frame), cubicInOut(between(progress, .21, .31)));
  if (progress <= .41) return blend(pile(index, frame), wheel(index, 0, frame), glide(between(progress, .31, .41)));
  return wheel(index, cubicInOut(between(progress, .41, .57)), frame);
}
