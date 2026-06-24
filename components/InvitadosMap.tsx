"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const GEO_URL = "/countries-110m.json";

export type CityDot = {
  city: string;
  country: string;
  coordinates: [number, number];
  count: number;
};

interface Props {
  cities: CityDot[];
  activeCity: string | null;
  onCityClick: (city: string) => void;
}

export default function InvitadosMap({ cities, activeCity, onCityClick }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([-20, 5]);
  const [tooltip, setTooltip] = useState<{ city: string; country: string; count: number; x: number; y: number } | null>(null);
  const [mapWidth, setMapWidth] = useState<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setMapWidth(Math.round(width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const zoomIn  = () => setZoom((z) => Math.min(parseFloat((z * 1.6).toFixed(2)), 12));
  const zoomOut = () => setZoom((z) => Math.max(parseFloat((z / 1.6).toFixed(2)), 1));
  const reset   = () => { setZoom(1); setCenter([-20, 5]); };

  const hasFilter = activeCity !== null;

  return (
    <div ref={containerRef} className="relative select-none">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button onClick={zoomIn}  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-700 transition-colors flex items-center justify-center text-lg font-light leading-none">+</button>
        <button onClick={zoomOut} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-700 transition-colors flex items-center justify-center text-lg font-light leading-none">−</button>
        {zoom > 1 && (
          <button onClick={reset} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center justify-center text-[9px] font-mono uppercase tracking-wide leading-none">↺</button>
        )}
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 shadow-xl shadow-black/40"
          style={{ left: tooltip.x + 12, top: tooltip.y - 48 }}
        >
          <p className="text-xs font-semibold text-zinc-100 leading-none">{tooltip.city}</p>
          {tooltip.country && (
            <p className="text-[10px] text-zinc-500 mt-0.5 leading-none">{tooltip.country}</p>
          )}
          <p className="text-[10px] text-orange-400 mt-1.5 leading-none font-mono">
            {tooltip.count} invitado{tooltip.count !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160, center: [-20, 5] }}
        style={{ background: "transparent" }}
        className="w-full cursor-grab active:cursor-grabbing"
        width={mapWidth}
        height={420}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          minZoom={1}
          maxZoom={12}
          onMoveEnd={({ zoom: z, coordinates }) => {
            setZoom(parseFloat(z.toFixed(2)));
            setCenter(coordinates as [number, number]);
          }}
        >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#18181b"
                stroke="#27272a"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {cities.map(({ city, country, coordinates, count  }) => {
          const isActive = activeCity === city;
          const isDimmed = hasFilter && !isActive;
          // Divide by zoom so dots stay the same visual size regardless of zoom level
          const base = Math.max(4, Math.min(11, 4 + Math.sqrt(count) * 1.8));
          const r  = base / zoom;
          const sw = (isActive ? 1.5 : 0.8) / zoom;
          const ringR = (base + 5) / zoom;

          return (
            <Marker key={city} coordinates={coordinates}>
              {isActive && (
                <circle
                  r={ringR}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth={1 / zoom}
                  opacity={0.35}
                  style={{ pointerEvents: "none" }}
                />
              )}
              <circle
                r={r}
                fill={isDimmed ? "#f9731620" : isActive ? "#f97316" : hovered === city ? "#fb923c" : "#f9731699"}
                stroke={isActive || hovered === city ? "#fdba74" : "#f97316"}
                strokeWidth={sw}
                style={{ cursor: "pointer" }}
                onClick={() => onCityClick(city)}
                onMouseEnter={(e) => {
                  setHovered(city);
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltip({ city, country, count, x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }
                }}
                onMouseMove={(e) => {
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltip((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
                  }
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  setTooltip(null);
                }}
              />
            </Marker>
          );
        })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
