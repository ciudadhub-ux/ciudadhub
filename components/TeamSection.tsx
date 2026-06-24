const TEAM = [
  {
    name: "Andrés Carpanzano",
    country: "Canadá",
    photo: "/images/equipo/Andres Carpanzano_edited.jpg",
    bio: "Argentino, de Santa Fe, Director de [Diplomacity](https://www.diploma.city) consultor especializado en estrategias de comunicación para personalidades, instituciones, ciudades y empresas.\n\nEs delegado oficial del Smart City Expo World Congress de Barcelona para: Canada, Argentina, Uruguay, Paraguay, República Dominicana, Costa Rica, Panamá y Bolivia.\n\nBasado entre Wakefield, Québec y Buenos Aires, su trabajo conecta perspectivas globales con las realidades y desafíos urbanos de la región.",
  },
  {
    name: "Ignacio Argonz",
    country: "Argentina",
    photo: "/images/equipo/Ignacio Argonz.jpg",
    bio: "Rosarino, radicado en la Ciudad Autónoma Buenos Aires. Licenciado en Relaciones Internacionales y Magíster en Políticas Públicas, especializado en gestión urbana y ciudades inteligentes. Hace más de 15 años trabaja con gobiernos y decisores del sector público y privado en estrategias de desarrollo territorial, transformación digital y Smart Cities. Acompaña procesos de innovación con foco en desarrollo económico y arraigo, articulando tecnología, gestión y comunicación estratégica. Piensa lo global con impacto local, adaptando buenas prácticas internacionales a ciudades de América Latina.",
  },
  {
    name: "Oscar Chamat",
    country: "España",
    photo: "/images/equipo/Oscar Chamat.jpg",
    bio: "Bogotano de nacimiento, Colombiano por adopción. Desde finales de los años 90 tratando de entender el fenómeno urbano en diferentes escalas, desde pequeñas ciudades en Colombia hasta escalas metropolitanas/regionales en Europa. Radicado en Barcelona desde hace 16 años pero con la suerte de poder seguir vinculado a Latinoamérica en lo profesional, personal y académico.",
  },
];

function BioText({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((para, i) => {
        const parts = para.split(/\[([^\]]+)\]\(([^)]+)\)/g);
        return (
          <p key={i} className="text-base text-zinc-300 leading-relaxed">
            {parts.map((part, j) => {
              if (j % 3 === 1) return (
                <a key={j} href={parts[j + 1]} target="_blank" rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors">
                  {part}
                </a>
              );
              if (j % 3 === 2) return null;
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function TeamSection() {
  return (
    <section id="equipo" className="py-24 border-t border-zinc-800 scroll-mt-[88px] md:scroll-mt-[220px]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-baseline justify-between mb-16">
          <h2 className="text-3xl font-bold text-zinc-50 tracking-tight">Equipo</h2>
          <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
            {TEAM.length} personas
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-zinc-800">
          {TEAM.map((member) => (
            <div key={member.name} className="bg-zinc-950 p-8 flex flex-col gap-5">
              {/* Photo */}
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Name + country */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-50 leading-snug">
                  {member.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">{member.country}</p>
              </div>
              <BioText text={member.bio} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
