"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const GEO_URL = "/countries-110m.json";

export type CityDot = {
  city: string;
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

  const zoomIn  = () => setZoom((z) => Math.min(parseFloat((z * 1.6).toFixed(2)), 12));
  const zoomOut = () => setZoom((z) => Math.max(parseFloat((z / 1.6).toFixed(2)), 1));
  const reset   = () => { setZoom(1); setCenter([-20, 5]); };

  const hasFilter = activeCity !== null;
  const label = hovered ?? activeCity;
  const labelCount = label ? (cities.find((c) => c.city === label)?.count ?? 0) : 0;

  return (
    <div className="relative select-none">
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <button onClick={zoomIn}  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-700 transition-colors flex items-center justify-center text-lg font-light leading-none">+</button>
        <button onClick={zoomOut} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-zinc-50 hover:bg-zinc-700 transition-colors flex items-center justify-center text-lg font-light leading-none">−</button>
        {zoom > 1 && (
          <button onClick={reset} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors flex items-center justify-center text-[9px] font-mono uppercase tracking-wide leading-none">↺</button>
        )}
      </div>

      {/* Status label */}
      <div className="h-7 mb-1 flex items-center">
        {label ? (
          <p className="text-sm font-medium text-orange-400">
            {label}
            <span className="text-zinc-500 font-normal ml-2">
              {labelCount} invitado{labelCount !== 1 ? "s" : ""}
            </span>
          </p>
        ) : (
          <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">
            Hacé clic en una ciudad para filtrar
          </p>
        )}
      </div>

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160, center: [-20, 5] }}
        style={{ background: "transparent" }}
        className="w-full cursor-grab active:cursor-grabbing"
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

        {cities.map(({ city, coordinates, count }) => {
          const isActive = activeCity === city;
          const isDimmed = hasFilter && !isActive;
          const r = Math.max(4, Math.min(11, 4 + Math.sqrt(count) * 1.8));

          return (
            <Marker key={city} coordinates={coordinates}>
              {isActive && (
                <circle
                  r={r + 5}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth={1}
                  opacity={0.35}
                  style={{ pointerEvents: "none" }}
                />
              )}
              <circle
                r={r}
                fill={isDimmed ? "#f9731620" : isActive ? "#f97316" : hovered === city ? "#fb923c" : "#f9731699"}
                stroke={isActive || hovered === city ? "#fdba74" : "#f97316"}
                strokeWidth={isActive ? 1.5 : 0.8}
                style={{ cursor: "pointer", transition: "all 0.18s ease" }}
                onClick={() => onCityClick(city)}
                onMouseEnter={() => setHovered(city)}
                onMouseLeave={() => setHovered(null)}
              />
            </Marker>
          );
        })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
