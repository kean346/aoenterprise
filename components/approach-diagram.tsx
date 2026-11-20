export function ApproachDiagram() {
  return (
    <figure className="approach-figure" data-ambient>
      <svg className="approach-art" viewBox="0 0 620 400" aria-hidden="true">
        <defs>
          <pattern id="approach-grid" width="58" height="58" patternUnits="userSpaceOnUse" patternTransform="matrix(.87 .5 -.87 .5 310 20)">
            <path d="M0 0H58M0 0V58" fill="none" stroke="#928576" strokeOpacity=".22" />
          </pattern>
          <radialGradient id="approach-fade">
            <stop offset=".24" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </radialGradient>
          <mask id="approach-mask"><rect width="620" height="400" fill="url(#approach-fade)" /></mask>
          <linearGradient id="approach-top" x2=".76" y2="1" gradientUnits="objectBoundingBox">
            <stop stopColor="#fffefa" /><stop offset="1" stopColor="#ead8cc" />
          </linearGradient>
          <linearGradient id="approach-side">
            <stop stopColor="#decfc3" /><stop offset="1" stopColor="#c6a592" />
          </linearGradient>
          <filter id="approach-shadow" x="-50%" y="-70%" width="200%" height="240%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <rect width="620" height="400" fill="url(#approach-grid)" mask="url(#approach-mask)" />
        <path d="M111 161 310 276 512 160M173 277 310 197 447 277M310 197 310 104" className="diagram-tracks" />
        <path d="M111 161 310 276 512 160M173 277 310 197 447 277M310 197 310 104" className="diagram-pulse" />
        <g fill="#675341" opacity=".18" filter="url(#approach-shadow)">
          <path d="m246 198 72-42 98 49-73 42Z"/><path d="m100 155 65-33 68 32-63 36Z"/>
          <path d="m392 152 65-32 76 31-65 37Z"/><path d="m365 269 65-34 78 35-66 38Z"/>
          <path d="m140 265 59-28 62 34-59 33Z"/>
        </g>
        <g className="diagram-float">
          <path d="m235 188 75 44 77-44v23l-77 45-75-44Z" fill="url(#approach-side)" />
          <path d="M310 232v24l77-45v-23Z" fill="#ddd0c5" />
          <path d="m235 188 75-44 77 44-77 44Z" fill="url(#approach-top)" stroke="#fffdf8" />
          <path d="m274 188 37-22 37 22-37 22Z" fill="#fffaf5" stroke="#ae8069" />
          <path d="m299 190 20 2 3-12" fill="none" stroke="#a47760" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="diagram-float diagram-delay-1">
          <path d="m98 143 53 31 58-33v7l-58 33-53-31Z" fill="#d3b6a5" />
          <path d="m98 143 58-33 53 31-58 33Z" fill="#f8f0e8" stroke="#fffaf5" />
          <path d="m114 136 42-24 38 22v7l-42 24-38-22Z" fill="#c6a48f" />
          <path d="m114 136 42-24 38 22-42 24Z" fill="#fffaf5" stroke="#fff" />
          <path d="m134 135 23-13m-17 17 23-13m-16 17 16-9" fill="none" stroke="#ad836f" strokeWidth="1.2" />
        </g>
        <g className="diagram-float diagram-delay-2">
          <path d="m407 140 51 30 60-34v7l-60 35-51-30Z" fill="#d1b6a7" />
          <path d="m407 140 60-34 51 30-60 35Z" fill="#f7ede5" stroke="#fffaf5" />
          <path d="m433 123 31 18 30-17v-10l-31-18-30 17Z" fill="#c5a38f" />
          <path d="m433 113 30-17 31 18-30 17Z" fill="url(#approach-top)" stroke="#fffaf5" />
          <path d="m446 128 18 10 19-11m-24-15 9-5 9 5" fill="none" stroke="#926550" strokeWidth="1.3" />
          <path d="m444 134 16 10 21-12-4-4-16 9-12-7Z" fill="#fffaf4" />
        </g>
        <g className="diagram-float diagram-delay-3">
          <path d="m390 257 48 28 55-32v7l-55 32-48-28Z" fill="#d1b6a7" />
          <path d="m390 257 55-32 48 28-55 32Z" fill="#f7ede5" stroke="#fffaf5" />
          <path d="m416 237 25 15 29-17v21l-29 17-25-15Z" fill="url(#approach-side)" />
          <path d="m416 237 29-17 25 15-29 17Z" fill="url(#approach-top)" stroke="#fffaf5" />
          <path d="m431 228 25 15v11" fill="none" stroke="#ad836f" strokeWidth="2" />
        </g>
        <g className="diagram-float diagram-delay-4">
          <path d="m136 252 46 27 55-31v7l-55 31-46-27Z" fill="#d1b6a7" />
          <path d="m136 252 55-32 46 28-55 31Z" fill="#f7ede5" stroke="#fffaf5" />
          <path d="m160 241 24 13 30-17v7l-30 18-24-14Z" fill="#bd9c87" />
          <path d="m160 241 30-17 24 13-30 17Z" fill="#fffaf5" stroke="#fff" />
          <path d="m176 241 10 1 8-9" fill="none" stroke="#a47760" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </svg>
      <figcaption className="eyebrow">Source <i /> Print <i /> Supply</figcaption>
    </figure>
  );
}
