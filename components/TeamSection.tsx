import { XLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

const TEAM = [
  {
    name: "Andrés Carpanzano",
    country: "Canadá",
    twitter: "andrescarpan",
    linkedin: "https://www.linkedin.com/in/andrescarpanzano",
    photo: "/images/equipo/Andres Carpanzano_edited.jpg",
    bio: "Argentino, de Santa Fe, Director de [Diplomacity](https://www.diploma.city) consultor especializado en estrategias de comunicación para personalidades, instituciones, ciudades y empresas.\n\nEs delegado oficial del Smart City Expo World Congress de Barcelona para: Canada, Argentina, Uruguay, Paraguay, República Dominicana, Costa Rica, Panamá y Bolivia.\n\nBasado entre Wakefield, Québec y Buenos Aires, su trabajo conecta perspectivas globales con las realidades y desafíos urbanos de la región.",
  },
  {
    name: "Ignacio Argonz",
    country: "Argentina",
    twitter: "iargonz",
    linkedin: "https://www.linkedin.com/in/ignacioargonz/",
    photo: "/images/equipo/Ignacio Argonz.jpg",
    bio: "Rosarino, radicado en la Ciudad Autónoma Buenos Aires. Licenciado en Relaciones Internacionales y Magíster en Políticas Públicas, especializado en gestión urbana y ciudades inteligentes. Hace más de 15 años trabaja con gobiernos y decisores del sector público y privado en estrategias de desarrollo territorial, transformación digital y Smart Cities. Acompaña procesos de innovación con foco en desarrollo económico y arraigo, articulando tecnología, gestión y comunicación estratégica. Piensa lo global con impacto local, adaptando buenas prácticas internacionales a ciudades de América Latina.",
  },
  {
    name: "Oscar Chamat",
    country: "España",
    twitter: null,
    linkedin: "https://www.linkedin.com/in/oscarchamat/",
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
    <section id="equipo" className="pt-2 pb-8 md:pt-6 md:pb-16 border-t border-zinc-800 scroll-mt-[98px] md:scroll-mt-48">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-2xl font-bold text-zinc-50 mb-8">Equipo</h2>

        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          {TEAM.map((member) => (
            <div key={member.name} className="group flex flex-col gap-5 py-8 first:pt-0 last:pb-0 md:py-0 md:px-8 md:first:pl-0 md:last:pr-0 flex-1">
              {/* Photo + name/social row */}
              <div className="flex gap-4 items-start">
                <div className="w-1/2 aspect-square shrink-0 rounded-xl overflow-hidden bg-zinc-900 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/8 transition-all duration-500 rounded-xl" />
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-50 leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">{member.country}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {member.twitter && (
                      <a
                        href={`https://twitter.com/${member.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="text-zinc-400 hover:text-orange-400 transition-colors"
                      >
                        <XLogo size={20} weight="fill" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-zinc-400 hover:text-orange-400 transition-colors"
                      >
                        <LinkedinLogo size={20} weight="fill" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <BioText text={member.bio} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
