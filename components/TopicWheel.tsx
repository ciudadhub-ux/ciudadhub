"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

const ITEM_H = 44;      // alto de cada opción (px)
const VISIBLE = 3;      // opciones visibles: anterior, seleccionada y siguiente
const H = ITEM_H * VISIBLE;
const PAD = (H - ITEM_H) / 2;

// "Todos" = sin filtro; se representa como cadena vacía en la rueda
const ALL = "";

export default function TopicWheel({
  topics,
  activeTopic,
  onChange,
}: {
  topics: string[];
  activeTopic: string | null;
  onChange: (topic: string | null) => void;
}) {
  const items = useMemo(() => [ALL, ...topics], [topics]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  // Ancho de la barra naranja = ancho del label más largo + margen
  const [bandW, setBandW] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const settleTimer = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  const activeIndex = Math.max(0, items.indexOf(activeTopic ?? ALL));
  // Índice donde la propia rueda se detuvo por última vez: evita que el
  // efecto de sincronización vuelva a hacer scroll cuando el cambio de
  // filtro lo originó el usuario girando la rueda.
  const settledIndex = useRef(activeIndex);

  // Aplica la curva 3D a cada opción según su distancia al centro
  const paint = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollTop + H / 2;
    itemRefs.current.forEach((el) => {
      if (!el) return;
      const itemCenter = el.offsetTop + ITEM_H / 2;
      const d = (itemCenter - center) / ITEM_H; // 0 = centrado
      const ad = Math.abs(d);
      const angle = Math.max(-72, Math.min(72, d * 24));
      const scale = 1 - Math.min(ad, 3) * 0.06;
      el.style.transform = `rotateX(${angle}deg) scale(${scale})`;
      el.style.opacity = String(Math.max(0.12, 1 - ad * 0.3));
    });
  }, []);

  const settle = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(scroller.scrollTop / ITEM_H)));
    settledIndex.current = idx;
    const picked = items[idx];
    if (picked !== undefined && picked !== (activeTopic ?? ALL)) {
      onChange(picked === ALL ? null : picked);
    }
  }, [items, activeTopic, onChange]);

  // Listeners nativos: onScroll de React es poco fiable con scroll de alta
  // frecuencia. addEventListener passive + scrollend es lo robusto en iOS.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const handleScroll = () => {
      if (rafId.current == null) {
        rafId.current = requestAnimationFrame(() => {
          rafId.current = null;
          paint();
        });
      }
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(settle, 140);
    };
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    scroller.addEventListener("scrollend", settle);
    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      scroller.removeEventListener("scrollend", settle);
    };
  }, [paint, settle]);

  // Pintar al montar y cuando cambian los temas
  useEffect(() => {
    paint();
  }, [paint, topics.length]);

  // Medir el label más largo para dimensionar la barra naranja
  useEffect(() => {
    const measure = () => {
      const el = sizerRef.current;
      if (!el) return;
      let max = 0;
      el.querySelectorAll("span").forEach((s) => {
        max = Math.max(max, s.offsetWidth);
      });
      if (max > 0) setBandW(Math.ceil(max) + 40); // +20px de margen a cada lado
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [items]);

  // Sincronizar posición cuando el filtro cambia desde afuera (o al montar).
  // Si el índice activo ya coincide con donde se detuvo la rueda, el cambio
  // lo originó el propio giro → no reposicionar (evita la pelea de scroll).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (activeIndex === settledIndex.current) return;
    settledIndex.current = activeIndex;
    scroller.scrollTo({ top: activeIndex * ITEM_H, behavior: "smooth" });
    // el scroll suave dispara onScroll → paint(); pintamos igual por si acaso
    requestAnimationFrame(paint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div
      className="relative select-none"
      style={{ height: H, perspective: 900 }}
      aria-label="Filtro de temas"
    >
      {/* Sizer oculto: mide el ancho de cada label con la tipografía real */}
      <div
        ref={sizerRef}
        aria-hidden
        className="pointer-events-none absolute -z-10 opacity-0"
      >
        {items.map((topic, i) => (
          <span
            key={i}
            className="inline-block whitespace-nowrap font-extrabold uppercase tracking-wide"
            style={{ fontSize: "1rem" }}
          >
            {topic === ALL ? "Todos" : topic}
          </span>
        ))}
      </div>

      {/* Banda central que marca la selección */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500"
        style={{ height: ITEM_H, width: bandW ?? "55%" }}
      />

      <div
        ref={scrollerRef}
        className="h-full overflow-y-auto scrollbar-none"
        style={{
          scrollSnapType: "y mandatory",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
          transformStyle: "preserve-3d",
        }}
      >
        <div style={{ height: PAD }} />
        {items.map((topic, i) => {
          const isSel = i === activeIndex;
          const label = topic === ALL ? "Todos" : topic;
          return (
            <button
              key={label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() =>
                scrollerRef.current?.scrollTo({
                  top: i * ITEM_H,
                  behavior: "smooth",
                })
              }
              className="flex w-full items-center justify-center font-extrabold uppercase tracking-wide transition-colors duration-150"
              style={{
                height: ITEM_H,
                scrollSnapAlign: "center",
                transformOrigin: "center center",
                fontSize: isSel ? "1rem" : "0.95rem",
                color: isSel ? "#ffffff" : "#a1a1aa",
                willChange: "transform, opacity",
              }}
            >
              {label}
            </button>
          );
        })}
        <div style={{ height: PAD }} />
      </div>
    </div>
  );
}
