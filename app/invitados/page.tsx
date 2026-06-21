import Link from "next/link";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import Nav from "@/components/Nav";
import { episodes } from "@/lib/data";

// Mapa explícito: nombre exacto en data → path de foto bw
const PHOTO_MAP: Record<string, string> = {
  "Agustín Suárez":           "/images/INVITADOS/Agustín Suarez bw.jpg",
  "Aida Esteban Millet":      "/images/INVITADOS/Aida Esteban Millat bw.jpg",
  "Alain Jorda":               "/images/INVITADOS/Alain Jorda bw.png",
  "Alvaro Nicolás":            "/images/INVITADOS/Alvaro Nicolás bw.jpg",
  "Alvaro Porro González":     "/images/INVITADOS/Alvaro Porro Gonzalez bw.jpg",
  "Carlos Corral":             "/images/INVITADOS/Carlos Corral bw.png",
  "Carolina Huffman":          "/images/INVITADOS/Carolina Huffman bw.jpg",
  "Claudia Peñaranda":         "/images/INVITADOS/Claudia Penaranda bw.jpg",
  "Diana Maria Parra Romero":  "/images/INVITADOS/Diana Maria Parra bw.jpg",
  "Edgardo Bilsky":            "/images/INVITADOS/Edgardo Bilsky bw.jpg",
  "Elvis García":              "/images/INVITADOS/Elvis Garcia bw.jpg",
  "Federico Bervejillo":       "/images/INVITADOS/Federico Bervejillo bw.jpg",
  "Genis Arnàs":               "/images/INVITADOS/Genis Arnal bw.jpg",
  "Isabelle Anguelovski":      "/images/INVITADOS/Isabelle Anguelovski bw.jpg",
  "Joao Porto de Albuquereque":"/images/INVITADOS/Joa Porto de Albuquerque bw.jpg",
  "Jordi Honey-Roses":         "/images/INVITADOS/Jordi Honeyroses bw.jpg",
  "Jorge Pérez Jaramillo":     "/images/INVITADOS/JorgePerez bw.jpg",
  "Josep Ferrer":              "/images/INVITADOS/Josep Ferrer bw.jpg",
  "Lorena Zárate":             "/images/INVITADOS/Lorena Zarate bw .jpg",
  "Luis Herrera Favela":       "/images/INVITADOS/Luis Herrera Favela bw.jpg",
  "Manu Fernández":            "/images/INVITADOS/ManuvFernandez bw.jpg",
  "Manuel Redondo":            "/images/INVITADOS/Manuel Redondo bw.jpg",
  "Mariana Flores Mayen":      "/images/INVITADOS/Mariana Flores Mayen bw.jpg",
  "Mariola Panzuela":          "/images/INVITADOS/Mariola Panzuela bw.jpg",
  "Mauricio Leclerc":          "/images/INVITADOS/Mauricio Leclerq bw.jpg",
  "Melisa Breda":              "/images/INVITADOS/Melisa Breda bw.jpeg",
  "Mercedes Bidart":           "/images/INVITADOS/Mercedes Bidart bw.jpg",
  "Miguel Rodríguez Planas":   "/images/INVITADOS/Miquel_Rodriguez_Planas bw.png",
  "Mónica Taher":              "/images/INVITADOS/Monica Taher bw.jpg",
  "Nancy Lozano":              "/images/INVITADOS/Nancy Lozano bw.jpg",
  "Nicolás Galarza":           "/images/INVITADOS/Nicalás Galarza bw.jpeg",
  "Octavi de la Varga Mas":    "/images/INVITADOS/Octavi de la Varga Mas bw.jpg",
  "Omar Quiroga":              "/images/INVITADOS/Omar Quiroga bw.jpg",
  "Patricia Alalta":           "/images/INVITADOS/Patricia Alata bw.jpg",
  "Pau Solanilla Franco":      "/images/INVITADOS/Pau Solanilla bw.jpg",
  "Rosa Suriñach":             "/images/INVITADOS/Rosa Suriñach bw.jpg",
  "Salvador Rueda":            "/images/INVITADOS/Salvador Rueda bw.jpg",
  "Sarah Williams":            "/images/INVITADOS/Sarah Williams bw.jpg",
  "Sergio Vinitsky":           "/images/INVITADOS/Sergio Vinitsky bw.jpg",
  "Silvia Casorrán":           "/images/INVITADOS/Silvia Casorrán bw.jpg",
  "Ugo Valenti":               "/images/INVITADOS/Ugo Valentí bw.jpg",
  "Victoria Alsina":           "/images/INVITADOS/Victoria Alsina Burgues bw.jpg",
  "Xavi Matilla":              "/images/INVITADOS/Xavier Matilla bw.jpg",
  "Zulma Bolívar":             "/images/INVITADOS/Zulma Bolivar bw.jpg",
};

function encodePath(path: string) {
  return path.split("/").map((seg) => encodeURIComponent(seg)).join("/");
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function InvitadosPage() {
  // Deduplicar invitados: un registro por nombre, el episodio más reciente (primero en array)
  const guestsMap = new Map<string, { name: string; episodeId: number; city: string }>();
  for (const ep of episodes) {
    const name = ep.guest.trim();
    if (!name || name.toLowerCase() === "ciudadhub") continue;
    if (!guestsMap.has(name)) {
      guestsMap.set(name, { name, episodeId: ep.id, city: ep.city });
    }
  }

  const guests = [...guestsMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "es")
  );

  return (
    <>
      <Nav />
      <main className="pt-36">
        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="flex items-baseline justify-between mb-14">
            <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">Invitados</h1>
            <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
              {guests.length} personas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {guests.map(({ name, episodeId, city }) => {
              const photo = PHOTO_MAP[name];
              return (
                <Link
                  key={`${name}-${episodeId}`}
                  href={`/#ep-${episodeId}`}
                  className="group flex flex-col"
                >
                  {/* Foto */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 mb-3 relative">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={encodePath(photo)}
                        alt={name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold text-xl">
                        {initials(name)}
                      </div>
                    )}
                    {/* Overlay sutil en hover */}
                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/8 transition-all duration-500 rounded-xl" />
                  </div>

                  {/* Info */}
                  <p className="text-zinc-200 text-sm font-medium leading-snug group-hover:text-orange-400 transition-colors">
                    {name}
                  </p>
                  {city && (
                    <p className="flex items-center gap-1 text-zinc-600 text-xs mt-0.5">
                      <MapPin size={9} weight="bold" />
                      {city}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}
