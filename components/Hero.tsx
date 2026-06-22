export default function Hero() {
  return (
    <section className="relative pt-56 pb-16 overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.05] blur-[120px] bg-orange-500" />
      </div>

      <div className="relative max-w-7xl mx-auto pl-8 pr-6 w-full">
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          Diálogos con los investigadores, urbanistas, funcionarios y emprendedores que estudian, diseñan y gobiernan las ciudades del mundo. Cada podcast es una conversación sobre los desafíos y las ideas que están transformando la vida urbana.
        </p>
      </div>
    </section>
  );
}
