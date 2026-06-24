import Nav from "@/components/Nav";
import InvitadosClient, { type GuestData } from "@/components/InvitadosClient";
import { episodes } from "@/lib/data";

const PHOTO_MAP: Record<string, string> = {
  "Agustí Fernández de Losada":  "/images/INVITADOS/Agusti Fernandez  deLosada bw.png",
  "Agustín Suárez":              "/images/INVITADOS/Agustín Suarez bw.jpg",
  "Aida Esteban Millet":         "/images/INVITADOS/Aida Esteban Millat bw.jpg",
  "Alain Jorda":                  "/images/INVITADOS/Alain Jorda bw.png",
  "Alvaro Nicolás":               "/images/INVITADOS/Alvaro Nicolás bw.jpg",
  "Alvaro Porro González":        "/images/INVITADOS/Alvaro Porro Gonzalez bw.jpg",
  "Carles Benito":                "/images/INVITADOS/Carles Benito bw.jpg",
  "Carlos Corral":                "/images/INVITADOS/Carlos Corral bw.png",
  "Carlos Eduardo Correa":        "/images/INVITADOS/Carlos Eduardo Correa bw.jpg",
  "Carlos Hernández":             "/images/INVITADOS/Carlos Hernandez bw.jpg",
  "Carlos Pardo":                 "/images/INVITADOS/Carlos Pardo bw.jpg",
  "Carolina Huffman":             "/images/INVITADOS/Carolina Huffman bw.jpg",
  "Carolina Pozo":                "/images/INVITADOS/Carolina Pozo bw.jpeg",
  "Claudia Peñaranda":            "/images/INVITADOS/Claudia Penaranda bw.jpg",
  "Cristina Zubillaga":           "/images/INVITADOS/Cristina Zubillaga bw.png",
  "Daniel Abadie":                "/images/INVITADOS/Daniel Abadie bw.jpg",
  "Daniel Treviño":               "/images/INVITADOS/Daniel Treviño bw.jpg",
  "Darío Hidalgo":                "/images/INVITADOS/Darío Hidalgo bw.png",
  "David Uniman":                 "/images/INVITADOS/David Uniman bw.jpeg",
  "Diana Celis":                  "/images/INVITADOS/Diana Celis bw.jpeg",
  "Diana Maria Parra Romero":     "/images/INVITADOS/Diana Maria Parra bw.jpg",
  "Edgardo Bilsky":               "/images/INVITADOS/Edgardo Bilsky bw.jpg",
  "Elkin Velasquez":              "/images/INVITADOS/Elkin Velazques bw.jpg",
  "Ellis Juan":                   "/images/INVITADOS/Ellis Juan bw.jpeg",
  "Elvis García":                 "/images/INVITADOS/Elvis Garcia bw.jpg",
  "Esteban León":                 "/images/INVITADOS/Esteban León bw.png",
  "Fabio Quetglas":               "/images/INVITADOS/Fabio Quetglas bw.jpeg",
  "Federico Bervejillo":          "/images/INVITADOS/Federico Bervejillo bw.jpg",
  "Fernando García":              "/images/INVITADOS/Fernando Garcia bw.png",
  "Franco Rinaldi":               "/images/INVITADOS/Franco Rinaldi bw.png",
  "Gabriel Lanfranchi":           "/images/INVITADOS/Gabriel Lanfranchi bw.jpg",
  "Genis Arnàs":                  "/images/INVITADOS/Genis Arnal bw.jpg",
  "Guillermo Bernal":             "/images/INVITADOS/Guillermo Bernal bw.png",
  "Guillermo Chávez":             "/images/INVITADOS/Guillermo Chávez García bw.png",
  "Guillermo Peñalosa":           "/images/INVITADOS/Guillermo Gil Peñaloza bw.jpeg",
  "Iván Acevedo":                 "/images/INVITADOS/Ivan Acevedo bw.jpg",
  "Ignacio Alcalde":              "/images/INVITADOS/Ignacio Alcalde bw.jpg",
  "Isabelle Anguelovski":         "/images/INVITADOS/Isabelle Anguelovski bw.jpg",
  "Javier Creus":                 "/images/INVITADOS/Javier Creus bw.jpeg",
  "Joao Porto de Albuquereque":   "/images/INVITADOS/Joa Porto de Albuquerque bw.jpg",
  "Johnny López":                 "/images/INVITADOS/Johnny López bw.jpeg",
  "Jordi Hereu":                  "/images/INVITADOS/Jordi Hereu bw.jpeg",
  "Jordi Honey-Roses":            "/images/INVITADOS/Jordi Honeyroses bw.jpg",
  "Jorge Pérez Jaramillo":        "/images/INVITADOS/JorgePerez bw.jpg",
  "Josep Ferrer":                 "/images/INVITADOS/Josep Ferrer bw.jpg",
  "Juan Ortiz":                   "/images/INVITADOS/Juan Ortiz Taboada bw.jpeg",
  "Julián Bautista Rojas":        "/images/INVITADOS/Julián Bautista Rojas bw.jpeg",
  "Lorena Zárate":                "/images/INVITADOS/Lorena Zarate bw .jpg",
  "Leonardo Brawl":               "/images/INVITADOS/Leonardo Brawl bw.jpeg",
  "Luis Gómez":                   "/images/INVITADOS/Luis Gomez bw.jpeg",
  "Luis Herrera Favela":          "/images/INVITADOS/Luis Herrera Favela bw.jpg",
  "Luis Romhan Diez":             "/images/INVITADOS/Luis Romhan Diez bw.jpeg",
  "Luz Amparo Medina":            "/images/INVITADOS/Luz Amparo Medina bw.jpg",
  "Manu Fernández":               "/images/INVITADOS/ManuvFernandez bw.jpg",
  "Manuel Redondo":               "/images/INVITADOS/Manuel Redondo bw.jpg",
  "Mariana Flores Mayen":         "/images/INVITADOS/Mariana Flores Mayen bw.jpg",
  "Mariano Turzi":                "/images/INVITADOS/mariano turzi bw.png",
  "Mariola Panzuela":             "/images/INVITADOS/Mariola Panzuela bw.jpg",
  "Martin Yeza":                  "/images/INVITADOS/martin yeza bw.jpeg",
  "Mauricio Leclerc":             "/images/INVITADOS/Mauricio Leclerq bw.jpg",
  "Melisa Breda":                 "/images/INVITADOS/Melisa Breda bw.jpeg",
  "Mercedes Bidart":              "/images/INVITADOS/Mercedes Bidart bw.jpg",
  "Miguel Rodríguez Planas":      "/images/INVITADOS/Miquel_Rodriguez_Planas bw.png",
  "Mireia Piqueras":              "/images/INVITADOS/Mireia Piqueras bw.jpeg",
  "Mónica Taher":                 "/images/INVITADOS/Monica Taher bw.jpg",
  "Nancy Lozano":                 "/images/INVITADOS/Nancy Lozano bw.jpg",
  "Nicolás Galarza":              "/images/INVITADOS/Nicalás Galarza bw.jpeg",
  "Octavi de la Varga Mas":       "/images/INVITADOS/Octavi de la Varga Mas bw.jpg",
  "Omar Quiroga":                 "/images/INVITADOS/Omar Quiroga bw.jpg",
  "Patricia Alalta":              "/images/INVITADOS/Patricia Alata bw.jpg",
  "Patricio Ovalle Woods":        "/images/INVITADOS/Patricio Ovalle Woods bw.png",
  "Pau Solanilla Franco":         "/images/INVITADOS/Pau Solanilla bw.jpg",
  "Pedro Espondaburu":            "/images/INVITADOS/Pedro Espondaburu bw.jpeg",
  "Pedro Uribe":                  "/images/INVITADOS/Pedro Uribe bw.jpg",
  "Pilar Conesa":                 "/images/INVITADOS/Pilar Conesa bw.jpeg",
  "Ramon Gras Alumà":             "/images/INVITADOS/Ramon Gras Alumà bw.png",
  "Rosa Suriñach":                "/images/INVITADOS/Rosa Suriñach bw.jpg",
  "Salvador Rueda":               "/images/INVITADOS/Salvador Rueda bw.jpg",
  "Samanta Szusterman":           "/images/INVITADOS/Samanta Szusterman bw.jpeg",
  "Sara Ortiz":                   "/images/INVITADOS/Sara Ortiz bw.jpg",
  "Sarah Williams":               "/images/INVITADOS/Sarah Williams bw.jpg",
  "Sebastián Fermani":            "/images/INVITADOS/Sebastián Fermani bw.png",
  "Stephane Bazire":              "/images/INVITADOS/Stephane Bazire bw.png",
  "Sergio Vinitsky":              "/images/INVITADOS/Sergio Vinitsky bw.jpg",
  "Silvia Casorrán":              "/images/INVITADOS/Silvia Casorrán bw.jpg",
  "Ugo Valenti":                  "/images/INVITADOS/Ugo Valentí bw.jpg",
  "Usama Bilal":                  "/images/INVITADOS/Usama Bilal bw.png",
  "Verónica Kuchinow":            "/images/INVITADOS/Verónica Kuchinow bw.jpeg",
  "Verónica Mansilla":            "/images/INVITADOS/Verónica Mansilla bw.jpeg",
  "Víctor Pineda":                "/images/INVITADOS/Víctor Pineda bw.jpeg",
  "Victoria Alsina":              "/images/INVITADOS/Victoria Alsina Burgues bw.jpg",
  "Xavi Matilla":                 "/images/INVITADOS/Xavier Matilla bw.jpg",
  "Zulma Bolívar":                "/images/INVITADOS/Zulma Bolivar bw.jpg",
};

function encodePath(p: string) {
  return p.split("/").map((s) => encodeURIComponent(s)).join("/");
}

export default function InvitadosPage() {
  const seen = new Map<string, GuestData>();

  for (const ep of episodes) {
    const name = ep.guest.trim();
    if (!name || name.toLowerCase() === "ciudadhub") continue;
    if (seen.has(name)) continue;

    const topics: string[] = ep.topics ?? [];
    const raw = PHOTO_MAP[name];
    seen.set(name, {
      name,
      guestRole: ep.guestRole,
      episodeId: ep.id,
      city: ep.city,
      country: ep.country,
      topics,
      photoSrc: raw ? encodePath(raw) : null,
      href: `/#ep-${ep.id}`,
      spotifyUrl: ep.spotifyUrl,
      appleUrl: ep.appleUrl,
    });
  }

  const guests = [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const allTopics = [...new Set(guests.flatMap((g) => g.topics))].sort((a, b) => a.localeCompare(b, "es"));

  return (
    <>
      <Nav />
      <main className="pt-[72px] md:pt-[200px]">
        <InvitadosClient guests={guests} allTopics={allTopics} />
      </main>
    </>
  );
}
