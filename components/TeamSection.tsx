const TEAM = [
  {
    name: "Andrés Carpanzano",
    photo: "/images/equipo/Andres Carpanzano_edited.jpg",
    bio: "Trabajo como consultor para gobiernos e instituciones en el desarrollo de estrategias de internacionalización. Delegado para Canadá, Argentina, Uruguay, Paraguay, Costa Rica, Panamá y República Dominicana del Smart City Expo World Congress de Barcelona.",
  },
  {
    name: "Ignacio Argonz",
    photo: "/images/equipo/Ignacio Argonz.jpg",
    bio: "Rosarino, radicado en la Ciudad Autónoma Buenos Aires. Licenciado en Relaciones Internacionales y Magíster en Políticas Públicas, especializado en gestión urbana y ciudades inteligentes. Hace más de 15 años trabaja con gobiernos y decisores del sector público y privado en estrategias de desarrollo territorial, transformación digital y Smart Cities. Acompaña procesos de innovación con foco en desarrollo económico y arraigo, articulando tecnología, gestión y comunicación estratégica. Piensa lo global con impacto local, adaptando buenas prácticas internacionales a ciudades de América Latina.",
  },
  {
    name: "Oscar Chamat",
    photo: "/images/equipo/Oscar Chamat.jpg",
    bio: "Bogotano de nacimiento, Colombiano por adopción. Desde finales de los años 90 tratando de entender el fenómeno urbano en diferentes escalas, desde pequeñas ciudades en Colombia hasta escalas metropolitanas/regionales en Europa. Radicado en Barcelona desde hace 16 años pero con la suerte de poder seguir vinculado a Latinoamérica en lo profesional, personal y académico.",
  },
];

export default function TeamSection() {
  return (
    <section id="equipo" className="py-24 border-t border-zinc-800">
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
              <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-50 leading-snug mb-3">
                  {member.name}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
