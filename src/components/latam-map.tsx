/**
 * Coordinates derived from real geographic waypoints:
 *   x = (longitude + 120) * 3.333
 *   y = (35 - latitude) * 5
 * ViewBox 0 0 300 460
 */

const OUTLINE = `
  M 10,15
  Q 28,12 45,16
  L 75,45
  Q 80,38 82,30
  Q 78,22 75,16
  L 45,16
  Q 28,12 10,15

  M 33,60
  Q 38,68 47,65
  Q 50,60 47,52
  Q 42,46 35,50
  Q 30,55 33,60

  M 47,60
  Q 55,55 62,50
  Q 67,55 72,62
  Q 67,72 67,82
  Q 72,88 78,93
  Q 85,98 93,105
  Q 100,105 110,105
  Q 115,110 120,118
  Q 125,125 133,130
  Q 140,128 150,125
  Q 160,120 170,120
  Q 177,122 185,120
  Q 193,122 200,128
  Q 208,138 217,148
  Q 228,155 240,165
  Q 255,175 268,188
  Q 278,198 283,208
  Q 285,218 280,230
  Q 275,242 270,255
  Q 262,272 257,285
  Q 250,295 243,300
  Q 235,312 230,325
  Q 220,338 213,350
  L 207,350
  Q 200,362 195,375
  Q 188,390 183,405
  Q 178,420 173,435
  L 168,445
  L 160,442
  Q 158,435 160,425
  Q 162,412 163,398
  Q 163,380 163,365
  Q 163,348 163,335
  Q 165,318 167,300
  Q 167,280 167,265
  Q 162,252 155,242
  Q 148,232 143,225
  Q 138,215 135,205
  Q 133,192 133,180
  Q 133,170 135,160
  Q 138,150 140,145
  Q 135,138 130,132
  Q 125,128 120,122
  Q 115,115 110,108
  Q 105,102 98,98
  Q 90,92 82,85
  Q 78,78 75,70
  Q 72,65 68,60
  Q 60,55 52,52
  Q 47,56 47,60
  Z
`;

const MEXICO_MAINLAND = `
  M 75,16
  L 82,30
  Q 80,38 78,45
  Q 75,55 72,62
  Q 68,60 62,55
  Q 55,50 47,52
  Q 50,48 52,42
  Q 57,35 62,30
  Q 68,22 75,16
  Z
`;

const cities = [
  { x: 68, y: 80 },
  { x: 150, y: 125 },
  { x: 177, y: 122 },
  { x: 133, y: 175 },
  { x: 143, y: 232 },
  { x: 270, y: 195 },
  { x: 257, y: 290 },
  { x: 163, y: 340 },
  { x: 207, y: 350 },
];

const connections = [
  [0, 1], [1, 2], [1, 3], [3, 4],
  [2, 5], [5, 6], [4, 7], [6, 8],
  [7, 8],
];

const COLS = 32;
const ROWS = 50;
const SPACING = 9.5;
const DOT_OFFSET = 3;

export function LatamMap({ className }: { className?: string }) {
  const dots: { x: number; y: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      dots.push({
        x: DOT_OFFSET + c * SPACING,
        y: DOT_OFFSET + r * SPACING,
      });
    }
  }

  return (
    <svg
      viewBox="0 0 300 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="latam-clip">
          <path d={OUTLINE} fillRule="evenodd" />
          <path d={MEXICO_MAINLAND} />
        </clipPath>
        <radialGradient id="city-glow">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Faint background dots */}
      <g>
        {dots.map((d, i) => (
          <circle
            key={`bg-${i}`}
            cx={d.x}
            cy={d.y}
            r="0.7"
            fill="currentColor"
            fillOpacity="0.05"
          />
        ))}
      </g>

      {/* Continent dots — clipped to real LATAM shape */}
      <g clipPath="url(#latam-clip)">
        {dots.map((d, i) => (
          <circle
            key={`land-${i}`}
            cx={d.x}
            cy={d.y}
            r="1.5"
            fill="currentColor"
            fillOpacity="0.22"
          />
        ))}
      </g>

      {/* Subtle continent outline */}
      <path
        d={OUTLINE}
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="0.5"
        fillRule="evenodd"
      />
      <path
        d={MEXICO_MAINLAND}
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="0.5"
      />

      {/* Connection lines between cities */}
      {connections.map(([a, b], i) => (
        <line
          key={`conn-${i}`}
          x1={cities[a].x}
          y1={cities[a].y}
          x2={cities[b].x}
          y2={cities[b].y}
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="0.5"
          strokeDasharray="3 3"
        />
      ))}

      {/* City markers */}
      {cities.map((city, i) => (
        <g key={`city-${i}`}>
          <circle cx={city.x} cy={city.y} r="8" fill="url(#city-glow)">
            <animate
              attributeName="r"
              values="6;10;6"
              dur={`${3 + i * 0.35}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.4;1"
              dur={`${3 + i * 0.35}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={city.x}
            cy={city.y}
            r="2"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </g>
      ))}
    </svg>
  );
}
