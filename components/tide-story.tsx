import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { crops, productArt, quadrant, sprite, tideAssets } from "./tide-assets";
import { TideMotion } from "./tide-motion";

const title = "Supply in Motion";
const icons = [
  ["........k", "......kkb", "....kkwkb", "..kkwwkb.", "kkwwwkbb.", "..kkkbb..", "....kb...", "....k....", "........."],
  ["...kkk...", "..kbwbk..", ".kbwbwbk.", "kbwbwbwbk", "kwbwbwbwk", ".kbwbwbk.", "..kbbbk..", "...kkk...", "........."],
  ["....k....", "....kb...", "....kbb..", "...wkbbb.", "..wwkbbb.", "....k....", "kkkkkkkkk", ".kpppppk.", "..kkkkk.."],
  ["...kkk...", "..kbbbk..", "...kwk...", "...kbk...", "...kwk...", "...kbk...", "..kwwwk..", "..kbbbk..", ".kkkkkkk."],
  [".........", "...kkk..k", "..kbbbkkk", ".kbwbbbbk", "kbbbbbkkk", ".kbbbbk.k", "..kkkk...", ".........", "........."],
  [".........", "...kkk...", "..kbbbk..", ".kbwwbbk.", "kbw..kbbk", "kb....kbk", "bbbbbbbbb", "kkkkkkkkk", "........."],
  ["....p....", ".p..k..p.", "...kpk...", "..kpppk..", "pkpppppkp", "..kpppk..", "...kpk...", ".p..k..p.", "....p...."],
];

const pixelColors: Record<string, string> = { k: "#1F2430", b: "#7DA3BB", w: "#fff", p: "#DDAD95" };

function PixelIcon({ rows }: { rows: string[] }) {
  return (
    <svg className="tide-pixel" viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) => [...row].map((cell, x) => cell === "." ? null :
        <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={pixelColors[cell]} />,
      ))}
    </svg>
  );
}

function CueWords({ words, from = 0, step = .11 }: { words: ReactNode[]; from?: number; step?: number }) {
  return words.map((word, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span className="cue-word" style={{ "--cue": `${from + index * step}s` } as CSSProperties}>{word}</span>
    </Fragment>
  ));
}

function Sparkle() {
  return (
    <svg className="manifesto-sparkle" viewBox="0 0 20 20" aria-hidden="true">
      <path fill="currentColor" d="M10 0c.8 5.6 3.6 8.6 10 10-6.4 1.4-9.2 4.4-10 10-.8-5.6-3.6-8.6-10-10 6.4-1.4 9.2-4.4 10-10z" />
    </svg>
  );
}

function ManifestoWord({ text, mute = false }: { text: string; mute?: boolean }) {
  return (
    <span className={`manifesto-part word-part${mute ? " muted-word" : ""}`}>
      <span className="sr-only">{text} </span>
      <span aria-hidden="true">
        {[...text].map((character, index) => <span key={index} className="manifesto-letter" style={{ "--letter": index } as CSSProperties}>{character}</span>)}
      </span>
    </span>
  );
}

function Sticker({ children, color, angle = -8 }: { children: ReactNode; color: string; angle?: number }) {
  return <span className="manifesto-part manifesto-pop manifesto-tag" style={{ "--tilt": `${angle}deg`, backgroundColor: color } as CSSProperties}>{children}</span>;
}

function Trinket({ name, size, angle }: { name: "shell" | "pearl" | "capsule"; size: string; angle: number }) {
  return (
    <span aria-hidden="true" className="manifesto-part manifesto-pop manifesto-object" style={{
      ...sprite(tideAssets.stickers, crops[name]),
      "--tilt": `${angle}deg`,
      width: size,
    } as CSSProperties} />
  );
}

export function TideStory() {
  return (
    <>
      <section id="story" className="tide-story" aria-label="Supply in Motion">
        <header className="tide-hero" id="top">
          <h1 className="tide-title" aria-label={title}>
            <span aria-hidden="true" className="tide-title-text">
              {[...title].map((letter, index) => <span className="tide-letter" key={index}>{letter}</span>)}
            </span>
            <span className="tide-icons" aria-hidden="true">
              {icons.map((rows, index) => <PixelIcon key={index} rows={rows} />)}
            </span>
          </h1>
          <p className="tide-hero-copy">Bulk stationery, commercial printing and supply contracts.</p>
          <div className="tide-flight" aria-hidden="true"><span style={sprite(tideAssets.flight, crops.plane)} /></div>
        </header>

        <div className="tide-stage">
          <div className="tide-cards" aria-hidden="true">
            {productArt.map(([sheet, cell, backdrop], index) => (
              <div className="tide-card" key={index} style={quadrant(sheet, cell, backdrop)} />
            ))}
          </div>

          <div className="tide-process">
            <h2>
              <span className="process-line">
                <CueWords words={[<em key="from">From</em>, "brief"]} />
                {" "}<span className="tide-chip cue-word" aria-hidden="true" style={{ ...quadrant(tideAssets.chip, 1, "#B0AEC6"), "--cue": ".22s" } as CSSProperties} />{" "}
                <CueWords from={.33} words={[<em key="to">to</em>, "delivery."]} />
              </span>
              <span className="process-line"><CueWords from={.53} words={["Built", <em key="through">through</em>, "a", "clear", "process."]} /></span>
            </h2>
            <p className="cue-word" style={{ "--cue": ".7s" } as CSSProperties}>From the first enquiry to the final order.</p>
            <a href="#services" className="tide-button cue-word" style={{ "--cue": ".85s" } as CSSProperties}>Explore services <ArrowRight size={16} aria-hidden="true" /></a>
          </div>

          <div className="tide-sky">
            <div className="sky-media" style={{ backgroundImage: `url("${tideAssets.sky}")` }} aria-hidden="true">
              <video muted loop playsInline preload="none" data-src={tideAssets.video} />
            </div>
            <div className="tide-camera" style={sprite(tideAssets.camera, crops.camera)} aria-hidden="true" />
            <p className="sky-words sky-words-start"><CueWords step={.12} words={[<em key="reliable">Reliable</em>, "supply."]} /></p>
            <p className="sky-words sky-words-end"><CueWords from={.45} step={.12} words={[<em key="thoughtfully">Thoughtfully</em>, "delivered."]} /></p>
          </div>
          <div className="tide-blackout" aria-hidden="true" />
        </div>
      </section>

      <section id="manifesto" className="manifesto" aria-label="The AO approach">
        <div className="manifesto-stage">
          <p className="manifesto-track">
            <span className="manifesto-intro">
              <span className="manifesto-part manifesto-pop manifesto-tag intro-tag intro-tag-first">bulk stationery</span>
              <span className="manifesto-part manifesto-pop manifesto-tag intro-tag intro-tag-second">commercial print</span>
              <span className="manifesto-part manifesto-pop manifesto-tag intro-tag intro-tag-third">supply contracts</span>
              <span className="manifesto-intro-line"><ManifestoWord text="Reliable" mute /><ManifestoWord text="supply" /></span>
              <span className="manifesto-intro-line"><ManifestoWord text="moves" /><ManifestoWord text="business." mute /></span>
            </span>
            <Trinket name="shell" size="1.25em" angle={-12} />
            <ManifestoWord text="Built" mute />
            <span className="manifesto-tag-pair">
              <Sticker color="#DDAD95">at scale</Sticker>
              <Sticker color="#B0AEC6" angle={6}>with care</Sticker>
            </span>
            <ManifestoWord text="for" />
            <ManifestoWord text="work" />
            <ManifestoWord text="that" mute />
            <ManifestoWord text="keeps" />
            <ManifestoWord text="moving." />
            <span className="manifesto-part manifesto-pop"><Sparkle /></span>
            <Trinket name="pearl" size=".8em" angle={0} />
            <ManifestoWord text="From" mute />
            <ManifestoWord text="first" />
            <Sticker color="#EFCEBE">enquiry</Sticker>
            <Trinket name="shell" size="1.05em" angle={10} />
            <Trinket name="pearl" size=".53em" angle={0} />
            <span className="manifesto-part manifesto-pop"><Sparkle /></span>
            <ManifestoWord text="to" mute />
            <Sticker color="#BAD9E6" angle={4}>fulfilment.</Sticker>
            <Trinket name="capsule" size="1.05em" angle={-8} />
            {["Paper,", "print", "and", "supply", "for", "South", "African", "organisations."].map((word, index) => (
              <ManifestoWord key={word} text={word} mute={index === 2 || index === 4} />
            ))}
            <span className="manifesto-spacer" aria-hidden="true" />
          </p>
        </div>
      </section>
      <TideMotion />
    </>
  );
}
