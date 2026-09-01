import type { Icon } from "@phosphor-icons/react";
import {
  Bicycle, Handshake, Database, TrendUp, Cpu, Lightning, Scales,
  Park, House, Gavel, Code, Lightbulb, Globe, Storefront, Buildings,
  Car, ShieldCheck, Heartbeat, TrafficSign, Robot, Leaf, SquaresFour, MapPin, ForkKnife,
  Hash,
} from "@phosphor-icons/react/dist/ssr";

// Hue distribuido uniformemente (paso 15°) sobre el orden alfabético de
// los temas: el color solo diferencia categorías a simple vista, el
// significado lo lleva el icono.
export const TOPIC_ICONS: Record<string, { icon: Icon; hue: number }> = {
  "Alimentación":         { icon: ForkKnife,   hue: 18  },
  "Bicicleta":            { icon: Bicycle,     hue: 33  },
  "Cooperación":          { icon: Handshake,   hue: 48  },
  "Datos":                { icon: Database,    hue: 63  },
  "Desarrollo":           { icon: TrendUp,     hue: 78  },
  "Digitalización":       { icon: Cpu,         hue: 93  },
  "Electrificación":      { icon: Lightning,   hue: 108 },
  "Equidad":              { icon: Scales,      hue: 123 },
  "Espacio Público":      { icon: Park,        hue: 138 },
  "Gentrificación":       { icon: House,       hue: 153 },
  "Gobernanza":           { icon: Gavel,       hue: 168 },
  "Gov-Tech":             { icon: Code,        hue: 183 },
  "Innovación":           { icon: Lightbulb,   hue: 198 },
  "Internacionalización": { icon: Globe,       hue: 213 },
  "Mercados":             { icon: Storefront,  hue: 228 },
  "Metrópolis":           { icon: Buildings,   hue: 243 },
  "Movilidad":            { icon: Car,         hue: 258 },
  "Placemaking":          { icon: MapPin,      hue: 273 },
  "Resiliencia":          { icon: ShieldCheck, hue: 288 },
  "Salud":                { icon: Heartbeat,   hue: 303 },
  "Seguridad Vial":       { icon: TrafficSign, hue: 318 },
  "Smart Cities":         { icon: Robot,       hue: 333 },
  "Sostenibilidad":       { icon: Leaf,        hue: 348 },
  "Urbanismo":            { icon: SquaresFour, hue: 3   },
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
