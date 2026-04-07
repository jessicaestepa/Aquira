export function LatamMap({ className }: { className?: string }) {
  const cities = [
    { cx: 110, cy: 42 },
    { cx: 130, cy: 62 },
    { cx: 108, cy: 100 },
    { cx: 165, cy: 92 },
    { cx: 78, cy: 160 },
    { cx: 70, cy: 192 },
    { cx: 168, cy: 175 },
    { cx: 162, cy: 238 },
    { cx: 68, cy: 295 },
    { cx: 125, cy: 312 },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [2, 4],
    [4, 5], [3, 6], [6, 7], [5, 8],
    [7, 9], [8, 9],
  ];

  return (
    <svg
      viewBox="0 0 200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="map-fill" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="map-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="dot-glow">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Continental outline */}
      <path
        d={`
          M 100,5
          Q 130,5 135,20
          Q 140,38 134,52
          Q 138,60 132,65
          Q 126,68 123,75
          Q 120,85 122,92
          Q 132,88 148,90
          Q 168,88 178,95
          Q 188,105 190,120
          Q 194,142 196,162
          Q 194,182 184,200
          Q 172,222 162,248
          Q 150,272 140,298
          Q 130,325 118,355
          Q 110,380 98,388
          Q 86,392 78,378
          Q 68,348 62,310
          Q 58,272 60,235
          Q 64,200 72,175
          Q 80,155 86,138
          Q 92,118 100,105
          Q 106,95 110,85
          Q 112,72 108,58
          Q 105,40 100,25
          Q 98,12 100,5
          Z
        `}
        fill="url(#map-fill)"
        stroke="url(#map-stroke)"
        strokeWidth="1"
      />

      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <line
          key={i}
          x1={cities[a].cx}
          y1={cities[a].cy}
          x2={cities[b].cx}
          y2={cities[b].cy}
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="0.6"
          strokeDasharray="2 2"
        />
      ))}

      {/* City dots */}
      {cities.map((city, i) => (
        <g key={i}>
          <circle cx={city.cx} cy={city.cy} r="8" fill="url(#dot-glow)" />
          <circle
            cx={city.cx}
            cy={city.cy}
            r="2.2"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <circle cx={city.cx} cy={city.cy} r="1" fill="currentColor" fillOpacity="0.6">
            <animate
              attributeName="r"
              values="1;1.5;1"
              dur={`${2.5 + i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              values="0.6;0.9;0.6"
              dur={`${2.5 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}
