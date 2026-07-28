export interface BlogStat {
  value: string;
  label: string;
}

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "stats"; title: string; items: BlogStat[] };

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  author: string;
  date: string; // YYYY-MM-DD
  readTime: string;
  tags: string[];
  hue: number;
  blocks: BlogBlock[];
}

export const posts: BlogPost[] = [
  {
    slug: "movilidad-activa-futuro-urbano",
    title: "Movilidad activa: por qué caminar y pedalear define el futuro urbano",
    summary:
      "Las ciudades que más avanzan en calidad de vida no son las que mueven más autos, sino las que mueven mejor a las personas. Un repaso a por qué la movilidad activa se volvió el termómetro del urbanismo contemporáneo.",
    author: "Redacción ciudadhub",
    date: "2026-06-02",
    readTime: "6 min",
    tags: ["Movilidad", "Espacio Público", "Sostenibilidad"],
    hue: 142,
    blocks: [
      {
        type: "paragraph",
        text: "Durante décadas, el éxito de una ciudad se midió en carriles construidos y minutos ahorrados en auto. Ese indicador está envejeciendo mal. Cada vez más gobiernos locales miden otra cosa: cuánta gente puede llegar a pie o en bici a lo que necesita todos los días — trabajo, salud, educación, ocio — sin depender de un vehículo motorizado.",
      },
      {
        type: "paragraph",
        text: "El cambio no es solo ambiental. Es también económico y social. Una calle diseñada para caminar concentra más comercio de proximidad, reduce el gasto en transporte de los hogares y genera espacio público que antes ocupaban autos estacionados. La movilidad activa, en ese sentido, funciona como una política urbana transversal: toca salud pública, economía local y uso del suelo al mismo tiempo.",
      },
      {
        type: "quote",
        text: "Una ciudad caminable no es una ciudad sin autos: es una ciudad donde el auto dejó de ser la única opción razonable para moverse.",
      },
      {
        type: "paragraph",
        text: "El obstáculo más común no es técnico, es cultural: reasignar espacio vial genera resistencia inmediata, mientras que sus beneficios —menos ruido, más ventas en comercios locales, calles más seguras— se perciben recién meses después. Las ciudades que lograron avanzar lo hicieron con pilotos reversibles, datos abiertos sobre el impacto y una narrativa clara sobre a quién beneficia el cambio.",
      },
      {
        type: "stats",
        title: "La movilidad activa en números",
        items: [
          { value: "54%", label: "de los viajes urbanos en Latinoamérica son menores a 3 km" },
          { value: "30%", label: "más comercio local en calles peatonalizadas, en promedio" },
          { value: "2.5x", label: "más espacio público por persona en barrios caminables" },
        ],
      },
      {
        type: "paragraph",
        text: "Lo que muestran los casos exitosos es que la infraestructura por sí sola no alcanza: hace falta continuidad en la red de ciclovías, prioridad semafórica para el peatón y, sobre todo, voluntad política sostenida más allá de un mandato. La movilidad activa no se inaugura una vez, se construye episodio a episodio, cuadra a cuadra.",
      },
    ],
  },
  {
    slug: "datos-abiertos-gobernar-con-evidencia",
    title: "Datos abiertos y smart cities: gobernar con evidencia",
    summary:
      "Sensores, tableros y dashboards no vuelven inteligente a una ciudad por sí solos. La diferencia la hace lo que un gobierno local decide hacer con esos datos — y con quién los comparte.",
    author: "Redacción ciudadhub",
    date: "2026-05-18",
    readTime: "7 min",
    tags: ["Datos", "Smart Cities", "Gobernanza"],
    hue: 213,
    blocks: [
      {
        type: "paragraph",
        text: "El término 'smart city' se usó tanto en la última década que perdió parte de su sentido. Hoy sirve tanto para nombrar una red de semáforos sincronizados como para vender un proyecto inmobiliario. Lo que distingue a una gestión urbana basada en datos de una simple vitrina tecnológica es una pregunta simple: ¿esa información cambia una decisión real, o solo decora un tablero?",
      },
      {
        type: "paragraph",
        text: "Las ciudades que mejor aprovechan sus datos no empiezan comprando sensores: empiezan mapeando decisiones. Dónde priorizar el bacheo, qué rutas de transporte público ajustar, en qué barrios reforzar el alumbrado. Recién después buscan qué dato falta para tomar esa decisión con evidencia en lugar de intuición.",
      },
      {
        type: "quote",
        text: "Los datos no gobiernan una ciudad. Ayudan a que quien gobierna se equivoque menos y explique mejor por qué decidió lo que decidió.",
      },
      {
        type: "paragraph",
        text: "Hay además una dimensión democrática que suele quedar afuera del debate técnico: la apertura de datos. Cuando un municipio publica en formato abierto la información que genera —presupuesto ejecutado, calidad del aire, tiempos de espera en trámites— habilita que periodistas, universidades y organizaciones civiles la auditen. Esa capa de escrutinio externo termina siendo, muchas veces, el verdadero motor de mejora.",
      },
      {
        type: "stats",
        title: "Gestión urbana basada en evidencia",
        items: [
          { value: "68%", label: "de los municipios con portal de datos abiertos reportan mejor rendición de cuentas" },
          { value: "3x", label: "más rápida la detección de fallas en servicios con monitoreo en tiempo real" },
          { value: "40%", label: "de los proyectos 'smart' fracasan por falta de gobernanza del dato, no de tecnología" },
        ],
      },
      {
        type: "paragraph",
        text: "El desafío que viene no es conseguir más datos, sino construir la capacidad institucional para interpretarlos y actuar en consecuencia. Eso significa equipos con perfiles mixtos —analistas de datos trabajando codo a codo con quienes diseñan política pública— y una cultura organizacional que tolere revisar una decisión cuando la evidencia dice que estaba equivocada.",
      },
    ],
  },
  {
    slug: "salud-urbana-diseno-de-ciudad",
    title: "Ciudades que cuidan: salud pública y diseño urbano",
    summary:
      "El código postal predice la esperanza de vida mejor que el código genético. Por qué la salud de una comunidad se decide, en buena parte, en cómo está trazada la ciudad donde vive.",
    author: "Redacción ciudadhub",
    date: "2026-04-27",
    readTime: "5 min",
    tags: ["Salud", "Equidad", "Urbanismo"],
    hue: 173,
    blocks: [
      {
        type: "paragraph",
        text: "La epidemiología urbana lleva años repitiendo una idea incómoda: dos personas que viven a quince minutos de distancia pueden tener una diferencia de más de una década en esperanza de vida, no por su biología, sino por el barrio donde nacieron. Acceso a espacios verdes, calidad del aire, cercanía a servicios de salud y seguridad vial explican buena parte de esa brecha.",
      },
      {
        type: "paragraph",
        text: "Pensar la salud como un problema exclusivamente médico deja afuera a quien realmente tiene la llave de muchas de esas variables: el urbanismo. Una ciclovía protegida reduce siniestros viales. Un parque a diez minutos caminando baja el estrés y facilita actividad física regular. Una parada de colectivo con sombra y buena iluminación no es solo comodidad: es prevención.",
      },
      {
        type: "quote",
        text: "No hay política de salud pública más efectiva y menos costosa que una ciudad bien diseñada.",
      },
      {
        type: "paragraph",
        text: "El reto de integrar salud y urbanismo es sobre todo institucional: son áreas de gobierno que históricamente no comparten datos ni presupuesto. Las experiencias que mejor funcionaron partieron de mapear indicadores de salud por barrio y cruzarlos con variables urbanas —cobertura de verde, calidad del transporte, densidad de comercio de cercanía— para identificar dónde intervenir primero.",
      },
      {
        type: "stats",
        title: "Salud y entorno construido",
        items: [
          { value: "11 años", label: "de diferencia en esperanza de vida entre barrios de una misma ciudad" },
          { value: "20%", label: "menos consultas por estrés en zonas con acceso a espacio verde cercano" },
          { value: "1 de cada 3", label: "muertes por siniestro vial ocurre en zonas sin infraestructura peatonal segura" },
        ],
      },
      {
        type: "paragraph",
        text: "Diseñar para la salud no requiere necesariamente más presupuesto: muchas veces alcanza con redirigir inversión ya planificada —una repavimentación, un cambio de semaforización— con ese criterio explícito. La salud urbana, bien mirada, no es un área nueva de gobierno: es un lente que puede aplicarse sobre casi todas las que ya existen.",
      },
    ],
  },
  {
    slug: "espacio-publico-motor-innovacion-social",
    title: "Espacio público como motor de innovación social",
    summary:
      "Plazas, veredas anchas y mercados no son solo lugares de paso: son la infraestructura donde ocurre buena parte de la vida comunitaria. Cómo algunas ciudades los están usando como laboratorio de política pública.",
    author: "Redacción ciudadhub",
    date: "2026-03-14",
    readTime: "6 min",
    tags: ["Espacio Público", "Innovación", "Equidad"],
    hue: 84,
    blocks: [
      {
        type: "paragraph",
        text: "Cuando se habla de innovación urbana, la imagen que suele venir a la cabeza es una app o un sensor. Pero buena parte de la innovación social más efectiva de los últimos años ocurrió en un terreno mucho más simple: la calle. Reorganizar cómo se usa el espacio público —quién lo ocupa, en qué horario, con qué reglas— cambia dinámicas sociales enteras sin requerir tecnología sofisticada.",
      },
      {
        type: "paragraph",
        text: "Ferias itinerantes que activan terrenos baldíos, calles que se cierran al tránsito los domingos, plazas que se convierten en aulas al aire libre: son intervenciones de bajo costo con un denominador común. Todas parten de una pregunta poco habitual en la gestión pública tradicional: ¿qué pasaría si probamos esto por un tiempo limitado antes de decidir si lo hacemos permanente?",
      },
      {
        type: "quote",
        text: "El espacio público es el único lugar de la ciudad donde todas las clases sociales comparten, aunque sea por un rato, el mismo territorio.",
      },
      {
        type: "paragraph",
        text: "Esa lógica de experimentación —pilotos rápidos, reversibles, medidos con datos simples como conteo de personas o encuestas de percepción— es lo que distingue a la innovación social urbana de un simple embellecimiento urbano. No se trata de poner más mobiliario bonito, sino de testear reglas nuevas de convivencia y quedarse con las que funcionan.",
      },
      {
        type: "stats",
        title: "El espacio público como laboratorio",
        items: [
          { value: "65%", label: "de los proyectos piloto de urbanismo táctico se vuelven permanentes" },
          { value: "4 semanas", label: "tiempo promedio para evaluar el impacto de una intervención reversible" },
          { value: "1.8x", label: "más interacción comunitaria reportada en plazas rediseñadas participativamente" },
        ],
      },
      {
        type: "paragraph",
        text: "El mayor riesgo no es que una intervención en el espacio público fracase — es barata y reversible si lo hace. El riesgo real es no intentarlo nunca por miedo al conflicto inicial. Las ciudades que mejor gestionan su espacio público son, casi siempre, las que se permitieron más pruebas.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatBlogDate(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}
