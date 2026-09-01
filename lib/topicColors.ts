import type { Icon } from "@phosphor-icons/react";
import {
  Plant, Bicycle, Handshake, Database, TrendUp, Cpu, Lightning, Scales,
  Park, House, Gavel, Code, Lightbulb, Globe, Storefront, Buildings,
  Car, ShieldCheck, Heartbeat, TrafficSign, Robot, Leaf, SquaresFour, MapPin, ForkKnife,
  Hash,
} from "@phosphor-icons/react/dist/ssr";

// Hue distribuido uniformemente (paso 14,4°) sobre el orden alfabético de
// los temas: el color solo diferencia categorías a simple vista, el
// significado lo lleva el icono.
export const TOPIC_ICONS: Record<string, { icon: Icon; hue: number }> = {
  "Agricultura":          { icon: Plant,       hue: 18  },
  "Alimentación":         { icon: ForkKnife,   hue: 32  },
  "Bicicleta":            { icon: Bicycle,     hue: 47  },
  "Cooperación":          { icon: Handshake,   hue: 61  },
  "Datos":                { icon: Database,    hue: 76  },
  "Desarrollo":           { icon: TrendUp,     hue: 90  },
  "Digitalización":       { icon: Cpu,         hue: 104 },
  "Electrificación":      { icon: Lightning,   hue: 119 },
  "Equidad":              { icon: Scales,      hue: 133 },
  "Espacio Público":      { icon: Park,        hue: 148 },
  "Gentrificación":       { icon: House,       hue: 162 },
  "Gobernanza":           { icon: Gavel,       hue: 176 },
  "Gov-Tech":             { icon: Code,        hue: 191 },
  "Innovación":           { icon: Lightbulb,   hue: 205 },
  "Internacionalización": { icon: Globe,       hue: 220 },
  "Mercados":             { icon: Storefront,  hue: 234 },
  "Metrópolis":           { icon: Buildings,   hue: 248 },
  "Movilidad":            { icon: Car,         hue: 263 },
  "Placemaking":          { icon: MapPin,      hue: 277 },
  "Resiliencia":          { icon: ShieldCheck, hue: 292 },
  "Salud":                { icon: Heartbeat,   hue: 306 },
  "Seguridad Vial":       { icon: TrafficSign, hue: 320 },
  "Smart Cities":         { icon: Robot,       hue: 335 },
  "Sostenibilidad":       { icon: Leaf,        hue: 349 },
  "Urbanismo":            { icon: SquaresFour, hue: 4   },
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
