"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

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

  const hasFilter = activeCity !== null;
  const label = hovered ?? activeCity;
  const labelCount = label ? (cities.find((c) => c.city === label)?.count ?? 0) : 0;

  return (
    <div className="relative">
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
        className="w-full"
        height={420}
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
      </ComposableMap>
    </div>
  );
}
