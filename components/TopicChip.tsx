"use client";

import { useState } from "react";

const TOPIC_COLORS: Record<string, { h: number; s: number }> = {
  "Smart Cities":      { h: 213, s: 94 },
  "Datos":             { h: 258, s: 89 },
  "Movilidad":         { h: 142, s: 71 },
  "Sostenibilidad":    { h: 160, s: 84 },
  "Urbanismo":         { h: 38,  s: 92 },
  "Equidad":           { h: 343, s: 88 },
  "Gobernanza":        { h: 199, s: 89 },
  "Salud":             { h: 173, s: 80 },
  "Innovación":        { h: 24,  s: 94 },
  "Espacio Público":   { h: 84,  s: 81 },
};

export function topicHsl(topic: string, lightness: number, alpha = 1) {
  const c = TOPIC_COLORS[topic] ?? { h: 30, s: 60 };
  return alpha < 1
    ? `hsl(${c.h} ${c.s}% ${lightness}% / ${alpha})`
    : `hsl(${c.h} ${c.s}% ${lightness}%)`;
}

export function topicStyle(topic: string, active: boolean, hovered: boolean) {
  const c = TOPIC_COLORS[topic] ?? { h: 30, s: 60 };
  if (active) {
    return {
      background: `hsl(${c.h} ${c.s}% 55%)`,
      color: "#09090b",
      borderColor: `hsl(${c.h} ${c.s}% 55%)`,
    };
  }
  if (hovered) {
    return {
      background: `hsl(${c.h} ${c.s}% 50% / 0.22)`,
      color: `hsl(${c.h} ${c.s}% 88%)`,
      borderColor: `hsl(${c.h} ${c.s}% 55% / 0.6)`,
    };
  }
  return {
    background: `hsl(${c.h} ${c.s}% 50% / 0.1)`,
    color: `hsl(${c.h} ${c.s}% 75%)`,
    borderColor: `hsl(${c.h} ${c.s}% 50% / 0.25)`,
  };
}

export function TopicChip({
  topic,
  active,
  onClick,
  className = "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
}: {
  topic: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={topicStyle(topic, active, hovered)}
    >
      {topic}
    </button>
  );
}
