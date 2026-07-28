import type { Icon } from "@phosphor-icons/react";
import {
  Plant, Bicycle, Handshake, Database, TrendUp, Cpu, Lightning, Scales,
  Park, House, Gavel, Code, Lightbulb, Globe, Storefront, Buildings,
  Car, ShieldCheck, Heartbeat, TrafficSign, Robot, Leaf, SquaresFour,
  Hash,
} from "@phosphor-icons/react/dist/ssr";

// Hue distribuido uniformemente (paso ~15.65°) sobre el orden alfabético de
// los temas: el color solo diferencia categorías a simple vista, el
// significado lo lleva el icono.
export const TOPIC_ICONS: Record<string, { icon: Icon; hue: number }> = {
  "Agricultura":          { icon: Plant,       hue: 18  },
  "Bicicleta":            { icon: Bicycle,     hue: 34  },
  "Cooperación":          { icon: Handshake,   hue: 49  },
  "Datos":                { icon: Database,    hue: 65  },
  "Desarrollo":           { icon: TrendUp,     hue: 81  },
  "Digitalización":       { icon: Cpu,         hue: 96  },
  "Electrificación":      { icon: Lightning,   hue: 112 },
  "Equidad":              { icon: Scales,      hue: 128 },
  "Espacio Público":      { icon: Park,        hue: 143 },
  "Gentrificación":       { icon: House,       hue: 159 },
  "Gobernanza":           { icon: Gavel,       hue: 175 },
  "Gov-Tech":             { icon: Code,        hue: 190 },
  "Innovación":           { icon: Lightbulb,   hue: 206 },
  "Internacionalización": { icon: Globe,       hue: 222 },
  "Mercados":             { icon: Storefront,  hue: 237 },
  "Metrópolis":           { icon: Buildings,   hue: 253 },
  "Movilidad":            { icon: Car,         hue: 268 },
  "Resiliencia":          { icon: ShieldCheck, hue: 284 },
  "Salud":                { icon: Heartbeat,   hue: 300 },
  "Seguridad Vial":       { icon: TrafficSign, hue: 315 },
  "Smart Cities":         { icon: Robot,       hue: 331 },
  "Sostenibilidad":       { icon: Leaf,        hue: 347 },
  "Urbanismo":            { icon: SquaresFour, hue: 2   },
};

export const DEFAULT_TOPIC_ICON = Hash;

export function topicIconColor(topic: string, active: boolean): string {
  if (active) return "#09090b";
  const entry = TOPIC_ICONS[topic];
  return entry ? `hsl(${entry.hue} 75% 62%)` : "#a1a1aa";
}

export function topicStyle(topic: string, active: boolean, hovered: boolean) {
  if (active) {
    return {
      background: "#f97316",
      color: "#09090b",
      borderColor: "#f97316",
    };
  }
  if (hovered) {
    return {
      background: "transparent",
      color: "#e4e4e7",
      borderColor: "#71717a",
    };
  }
  return {
    background: "transparent",
    color: "#a1a1aa",
    borderColor: "#3f3f46",
  };
}
