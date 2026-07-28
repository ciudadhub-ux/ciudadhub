function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function BlogCover({
  hue,
  title,
  className = "",
}: {
  hue: number;
  title: string;
  className?: string;
}) {
  const rand = seededRand(hue * 97 + title.length);
  const buildings = Array.from({ length: 9 }).map((_, i) => {
    const w = 26 + rand() * 20;
    const h = 40 + rand() * 110;
    return { w, h, i };
  });

  let x = -10;
  const positioned = buildings.map((b) => {
    const rect = { ...b, x };
    x += b.w - 4;
    return rect;
  });

  return (
    <svg
      viewBox="0 0 400 225"
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMax slice"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={`sky-${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 45% 14%)`} />
          <stop offset="100%" stopColor={`hsl(${hue} 55% 6%)`} />
        </linearGradient>
        <radialGradient id={`sun-${hue}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="225" fill={`url(#sky-${hue})`} />
      <circle cx="320" cy="55" r="70" fill={`url(#sun-${hue})`} />
      <circle cx="320" cy="55" r="16" fill="#f97316" opacity="0.85" />

      {positioned.map((b) => (
        <rect
          key={b.i}
          x={b.x}
          y={225 - b.h}
          width={b.w}
          height={b.h}
          fill={`hsl(${hue} 30% ${10 + b.i * 1.5}%)`}
          stroke={`hsl(${hue} 40% 20%)`}
          strokeWidth="0.5"
        />
      ))}

      {positioned.flatMap((b) =>
        Array.from({ length: Math.floor(b.h / 18) }).map((_, wy) =>
          Array.from({ length: Math.max(1, Math.floor(b.w / 10)) }).map((_, wx) => {
            const lit = rand() > 0.45;
            return (
              <rect
                key={`${b.i}-${wy}-${wx}`}
                x={b.x + 4 + wx * 9}
                y={225 - b.h + 6 + wy * 16}
                width="4"
                height="6"
                fill={lit ? "hsl(38 92% 65%)" : `hsl(${hue} 20% 22%)`}
                opacity={lit ? 0.85 : 0.4}
              />
            );
          })
        )
      )}

      <rect x="0" y="219" width="400" height="6" fill={`hsl(${hue} 40% 4%)`} />
    </svg>
  );
}
