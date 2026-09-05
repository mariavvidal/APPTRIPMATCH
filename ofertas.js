/* ================================================================
   TRIPMATCH — datos/ofertas.js
   ================================================================
   BANCO DE OFERTAS — Clase 15 (array de objetos)
   Esta es la "fuente de verdad" del prototipo: antes vivía adentro
   de main.js, pero al crecer tanto (de 14 a 76 viajes) tiene más
   sentido como su propio archivo dentro de una carpeta de datos,
   separado de la lógica (main.js). Sigue siendo un simple <script>
   clásico (sin módulos/import-export, no lo vimos en clase): como
   se carga en el <head>/antes que main.js en cada página, la
   constante catalogoViajes queda disponible igual que si estuviera
   en el mismo archivo.

   Patrón de 3 niveles por destino (mismo criterio que ya se usaba
   para Croacia): una opción MOCHILERA/económica, una CLÁSICA de
   precio medio, y una EXCLUSIVA/de lujo. Así, buscar cualquier
   destino de este banco siempre trae mínimo 3 propuestas distintas
   en precio, dificultad, tamaño de grupo y actividades — necesario
   para que calcularMatch() (en main.js) tenga con qué diferenciar
   ofertas y el % de match no quede pegado en un solo número.

   Las imágenes se reutilizan de un pool de 8 fotos ya usadas en el
   catálogo original (no hay assets nuevos ni URLs sin probar).
   ================================================================ */
const catalogoViajes = [
  {
    id: 1,
    destino: "Croacia",
    subtitulo: "Costa Dálmata · Adriatic Travel Co.",
    precio: 1690,
    fechaDesde: "2025-03-01",
    fechaHasta: "2025-03-12",
    dificultad: "Relax total",
    grupoMin: 10,
    grupoMax: 14,
    alojamiento: "Hotel 4★ Dubrovnik",
    actividades: ["Cultura", "Playa", "Gastronomía"],
    incluye: "Vuelos, desayunos, ferry, guía local",
    rating: 4.8,
    reviews: 47,
    badge: "Mejor precio",
    imagen: "https://images.unsplash.com/photo-1672841828459-bc913fdcd995?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 2,
    destino: "Croacia",
    subtitulo: "Costa Dálmata · Euro Group Tours",
    precio: 1950,
    fechaDesde: "2025-03-01",
    fechaHasta: "2025-03-12",
    dificultad: "Relax total",
    grupoMin: 8,
    grupoMax: 10,
    alojamiento: "Villa boutique frente al mar",
    actividades: ["Cultura", "Senderismo", "Playa"],
    incluye: "Vuelos, todas las comidas, ferry, guía, seguro",
    rating: 4.9,
    reviews: 61,
    badge: "Todo incluido",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 3,
    destino: "Patagonia",
    subtitulo: "Torres del Paine · Andes Trekking Group",
    precio: 1850,
    fechaDesde: "2025-11-05",
    fechaHasta: "2025-11-14",
    dificultad: "Full actividades",
    grupoMin: 8,
    grupoMax: 12,
    alojamiento: "Refugios de montaña",
    actividades: ["Aventura", "Naturaleza", "Senderismo", "Fotografía"],
    incluye: "Traslados, guía de montaña, equipo de trekking",
    rating: 4.9,
    reviews: 38,
    badge: "Trekking premium",
    imagen: "https://images.unsplash.com/photo-1715356758153-6d58ae44e8fe?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 4,
    destino: "Guatemala",
    subtitulo: "Volcanes de Guatemala · Ruta Maya Adventures",
    precio: 1200,
    fechaDesde: "2025-06-10",
    fechaHasta: "2025-06-17",
    dificultad: "Equilibrado",
    grupoMin: 6,
    grupoMax: 12,
    alojamiento: "Hostels con encanto en Antigua",
    actividades: ["Aventura", "Naturaleza", "Senderismo", "Económico"],
    incluye: "Traslados, guía local, entradas a parques",
    rating: 4.6,
    reviews: 29,
    badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1638069790489-b5b7dbeef2b0?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 5,
    destino: "Nepal",
    subtitulo: "Everest Base Camp · Himalaya Trails",
    precio: 2400,
    fechaDesde: "2025-10-01",
    fechaHasta: "2025-10-16",
    dificultad: "Full actividades",
    grupoMin: 6,
    grupoMax: 10,
    alojamiento: "Lodges de montaña",
    actividades: ["Aventura", "Naturaleza", "Senderismo", "Bienestar"],
    incluye: "Permisos, guía y porteador, alojamiento en ruta",
    rating: 5.0,
    reviews: 22,
    badge: "Alta dificultad",
    imagen: "https://images.unsplash.com/photo-1509883488717-779cd2d85976?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 6,
    destino: "Perú",
    subtitulo: "Machu Picchu Express · Andes Vivos",
    precio: 1400,
    fechaDesde: "2025-05-01",
    fechaHasta: "2025-05-07",
    dificultad: "Equilibrado",
    grupoMin: 10,
    grupoMax: 16,
    alojamiento: "Hotel 3★ en Cusco",
    actividades: ["Cultura", "Naturaleza", "Fotografía", "Amigos"],
    incluye: "Tren a Machu Picchu, entradas, guía certificado",
    rating: 4.7,
    reviews: 54,
    badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1465513527097-544020a68b06?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 7,
    destino: "Costa Rica",
    subtitulo: "Pura Vida Tour · Tico Adventures",
    precio: 1650,
    fechaDesde: "2025-07-14",
    fechaHasta: "2025-07-22",
    dificultad: "Relax total",
    grupoMin: 8,
    grupoMax: 14,
    alojamiento: "Eco-lodges en la selva",
    actividades: ["Naturaleza", "Playa", "Bienestar", "Fotografía"],
    incluye: "Traslados, tours guiados, 2 noches de playa",
    rating: 4.8,
    reviews: 33,
    badge: "Eco-friendly",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 8,
    destino: "Japón",
    subtitulo: "Japón en Flor de Cerezo · Sakura Journeys",
    precio: 2900,
    fechaDesde: "2025-04-01",
    fechaHasta: "2025-04-10",
    dificultad: "Relax total",
    grupoMin: 10,
    grupoMax: 18,
    alojamiento: "Hotel 4★ + una noche en ryokan",
    actividades: ["Cultura", "Gastronomía", "Fotografía", "Lujo"],
    incluye: "Vuelos internos, JR Pass, guía en español",
    rating: 4.9,
    reviews: 41,
    badge: "Temporada alta",
    imagen: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 9,
    destino: "Croacia",
    subtitulo: "Islas Kornati · Backpacker Adriático",
    precio: 980,
    fechaDesde: "2025-03-03",
    fechaHasta: "2025-03-10",
    dificultad: "Equilibrado",
    grupoMin: 12,
    grupoMax: 20,
    alojamiento: "Hostel frente al puerto",
    actividades: ["Aventura", "Playa", "Buceo"],
    incluye: "Traslados, tour en catamarán, guía local",
    rating: 4.5,
    reviews: 19,
    badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1672841828459-bc913fdcd995?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 10,
    destino: "Croacia",
    subtitulo: "Ruta de Castillos y Viñedos · Dalmatia Lux",
    precio: 2600,
    fechaDesde: "2025-03-05",
    fechaHasta: "2025-03-14",
    dificultad: "Relax total",
    grupoMin: 4,
    grupoMax: 8,
    alojamiento: "Suite en castillo restaurado",
    actividades: ["Cultura", "Gastronomía", "Lujo"],
    incluye: "Vuelos, chofer privado, cata de vinos, guía exclusivo",
    rating: 5.0,
    reviews: 12,
    badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 11,
    destino: "Grecia",
    subtitulo: "Santorini y Cícladas · Aegean Dream Tours",
    precio: 2100,
    fechaDesde: "2025-06-01",
    fechaHasta: "2025-06-09",
    dificultad: "Relax total",
    grupoMin: 6,
    grupoMax: 12,
    alojamiento: "Hotel boutique con vista al caldera",
    actividades: ["Playa", "Bienestar", "Fotografía"],
    incluye: "Vuelos, ferry entre islas, catamarán al atardecer",
    rating: 4.9,
    reviews: 44,
    badge: "Luna de miel",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 12,
    destino: "Vietnam",
    subtitulo: "De Hanói a Ho Chi Minh · Indochina Trails",
    precio: 1350,
    fechaDesde: "2025-09-05",
    fechaHasta: "2025-09-17",
    dificultad: "Equilibrado",
    grupoMin: 8,
    grupoMax: 16,
    alojamiento: "Hoteles 3★ + noche en junco en Ha Long",
    actividades: ["Aventura", "Gastronomía", "Cultura", "Económico"],
    incluye: "Vuelos internos, tren nocturno, guía local, city tours",
    rating: 4.7,
    reviews: 36,
    badge: "Aventura + cultura",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 13,
    destino: "Marruecos",
    subtitulo: "Desierto y Medinas · Sahara Nómade",
    precio: 1550,
    fechaDesde: "2025-04-12",
    fechaHasta: "2025-04-20",
    dificultad: "Equilibrado",
    grupoMin: 8,
    grupoMax: 14,
    alojamiento: "Riad tradicional + noche en jaima en el desierto",
    actividades: ["Cultura", "Aventura", "Fotografía"],
    incluye: "Traslados en 4x4, guía beduino, paseo en camello",
    rating: 4.8,
    reviews: 27,
    badge: "Exótico",
    imagen: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 14,
    destino: "Islandia",
    subtitulo: "Círculo Dorado y Auroras · Nordic Expeditions",
    precio: 3200,
    fechaDesde: "2025-11-20",
    fechaHasta: "2025-11-28",
    dificultad: "Full actividades",
    grupoMin: 6,
    grupoMax: 10,
    alojamiento: "Lodge de vidrio para ver auroras",
    actividades: ["Naturaleza", "Aventura", "Fotografía", "Lujo"],
    incluye: "Vuelos, 4x4 con calefacción, guía especializado en auroras",
    rating: 4.9,
    reviews: 31,
    badge: "Bucket list",
    imagen: "https://images.unsplash.com/photo-1517438546260-ba9763fc7d51?w=600&h=400&fit=crop&auto=format"
  },

  /* --------------------------------------------------------------
     COMPLETAR A 3 OPCIONES MÍNIMO — Patagonia, Guatemala, Perú y
     Costa Rica ya tenían 1 sola oferta en el catálogo original.
     -------------------------------------------------------------- */
  {
    id: 15,
    destino: "Patagonia",
    subtitulo: "El Chaltén · Fitz Roy Trekking Hostel",
    precio: 890,
    fechaDesde: "2026-10-10",
    fechaHasta: "2026-10-17",
    dificultad: "Equilibrado",
    grupoMin: 14,
    grupoMax: 22,
    alojamiento: "Hostel de montaña en El Chaltén",
    actividades: ["Aventura", "Senderismo", "Naturaleza", "Económico"],
    incluye: "Traslados, guía de trekking, refugio compartido",
    rating: 4.6,
    reviews: 24,
    badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 16,
    destino: "Patagonia",
    subtitulo: "Glaciar Perito Moreno · Patagonia Lodge Exclusivo",
    precio: 3100,
    fechaDesde: "2026-11-15",
    fechaHasta: "2026-11-23",
    dificultad: "Relax total",
    grupoMin: 4,
    grupoMax: 8,
    alojamiento: "Lodge de lujo frente al glaciar",
    actividades: ["Naturaleza", "Fotografía", "Lujo"],
    incluye: "Vuelos, navegación al glaciar, cenas gourmet, guía privado",
    rating: 5.0,
    reviews: 15,
    badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1715356758153-6d58ae44e8fe?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 17,
    destino: "Guatemala",
    subtitulo: "Lago Atitlán · Backpacker Trail",
    precio: 780,
    fechaDesde: "2026-05-08",
    fechaHasta: "2026-05-14",
    dificultad: "Equilibrado",
    grupoMin: 12,
    grupoMax: 20,
    alojamiento: "Hostel a orillas del lago",
    actividades: ["Aventura", "Naturaleza", "Económico"],
    incluye: "Traslados, kayak, caminata a mirador",
    rating: 4.5,
    reviews: 21,
    badge: "Mochilero",
    imagen: "https://images.unsplash.com/photo-1638069790489-b5b7dbeef2b0?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 18,
    destino: "Guatemala",
    subtitulo: "Tikal y Antigua Colonial · Ruta Maya Cultural",
    precio: 1550,
    fechaDesde: "2026-06-20",
    fechaHasta: "2026-06-28",
    dificultad: "Relax total",
    grupoMin: 8,
    grupoMax: 14,
    alojamiento: "Hotel boutique colonial en Antigua",
    actividades: ["Cultura", "Historia", "Gastronomía"],
    incluye: "Vuelos internos, entradas a Tikal, guía arqueológico",
    rating: 4.8,
    reviews: 30,
    badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1638069790489-b5b7dbeef2b0?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 19,
    destino: "Perú",
    subtitulo: "Amazonía y Manu · Selva Perú Expediciones",
    precio: 1750,
    fechaDesde: "2026-08-01",
    fechaHasta: "2026-08-09",
    dificultad: "Full actividades",
    grupoMin: 6,
    grupoMax: 10,
    alojamiento: "Lodge en la selva del Manu",
    actividades: ["Aventura", "Fauna Silvestre", "Naturaleza"],
    incluye: "Vuelos internos, navegación fluvial, guía naturalista",
    rating: 4.9,
    reviews: 18,
    badge: "Aventura extrema",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 20,
    destino: "Perú",
    subtitulo: "Valle Sagrado & Sanctuary Lodge · Andes Lux",
    precio: 3400,
    fechaDesde: "2026-09-10",
    fechaHasta: "2026-09-17",
    dificultad: "Relax total",
    grupoMin: 4,
    grupoMax: 6,
    alojamiento: "Sanctuary Lodge frente a Machu Picchu",
    actividades: ["Cultura", "Lujo", "Gastronomía"],
    incluye: "Vuelos, tren de lujo, cenas de autor, guía privado",
    rating: 5.0,
    reviews: 11,
    badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1465513527097-544020a68b06?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 21,
    destino: "Costa Rica",
    subtitulo: "Monteverde y La Fortuna · Volcano Backpackers",
    precio: 990,
    fechaDesde: "2026-07-05",
    fechaHasta: "2026-07-12",
    dificultad: "Equilibrado",
    grupoMin: 12,
    grupoMax: 18,
    alojamiento: "Hostel con vista al volcán Arenal",
    actividades: ["Aventura", "Naturaleza", "Económico"],
    incluye: "Traslados, canopy, caminata por puentes colgantes",
    rating: 4.6,
    reviews: 26,
    badge: "Aventura + económico",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 22,
    destino: "Costa Rica",
    subtitulo: "Península de Papagayo · Costa Rica Lujo Total",
    precio: 3050,
    fechaDesde: "2026-12-05",
    fechaHasta: "2026-12-13",
    dificultad: "Relax total",
    grupoMin: 4,
    grupoMax: 6,
    alojamiento: "Resort 5★ todo incluido",
    actividades: ["Playa", "Bienestar", "Lujo"],
    incluye: "Vuelos, spa, catamarán privado, todas las comidas",
    rating: 4.9,
    reviews: 20,
    badge: "Todo incluido",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },

  /* --------------------------------------------------------------
     MENDOZA — pedido explícito, además de Patagonia
     -------------------------------------------------------------- */
  {
    id: 23,
    destino: "Mendoza",
    subtitulo: "Ruta del Vino Low Cost · Cuyo Backpacker",
    precio: 850,
    fechaDesde: "2026-10-02",
    fechaHasta: "2026-10-07",
    dificultad: "Equilibrado",
    grupoMin: 12,
    grupoMax: 18,
    alojamiento: "Hostel en Ciudad de Mendoza",
    actividades: ["Gastronomía", "Aventura", "Económico"],
    incluye: "Traslados, degustación en 2 bodegas, bici por Maipú",
    rating: 4.5,
    reviews: 23,
    badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 24,
    destino: "Mendoza",
    subtitulo: "Bodegas y Aconcagua Base · Mendoza Clásico",
    precio: 1500,
    fechaDesde: "2026-11-01",
    fechaHasta: "2026-11-07",
    dificultad: "Equilibrado",
    grupoMin: 8,
    grupoMax: 14,
    alojamiento: "Hotel 4★ en Chacras de Coria",
    actividades: ["Gastronomía", "Naturaleza", "Fotografía"],
    incluye: "Traslados, 4 bodegas premium, excursión a Uspallata",
    rating: 4.8,
    reviews: 37,
    badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 25,
    destino: "Mendoza",
    subtitulo: "Wine Lodge & Spa · Mendoza Exclusivo",
    precio: 2700,
    fechaDesde: "2027-03-05",
    fechaHasta: "2027-03-10",
    dificultad: "Relax total",
    grupoMin: 4,
    grupoMax: 6,
    alojamiento: "Wine lodge 5★ con spa de vinoterapia",
    actividades: ["Gastronomía", "Bienestar", "Lujo"],
    incluye: "Vuelos, cenas maridaje, spa, sommelier privado",
    rating: 5.0,
    reviews: 14,
    badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&h=400&fit=crop&auto=format"
  },

  /* --------------------------------------------------------------
     ITALIA — pedido explícito
     -------------------------------------------------------------- */
  {
    id: 26,
    destino: "Italia",
    subtitulo: "Roma Mochilera · Eterna Ciudad Hostel Tour",
    precio: 1300,
    fechaDesde: "2026-09-12",
    fechaHasta: "2026-09-19",
    dificultad: "Equilibrado",
    grupoMin: 12,
    grupoMax: 20,
    alojamiento: "Hostel cerca del centro histórico",
    actividades: ["Cultura", "Historia", "Económico"],
    incluye: "Traslados, entradas al Coliseo, free tour a pie",
    rating: 4.6,
    reviews: 39,
    badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 27,
    destino: "Italia",
    subtitulo: "Toscana y Cinque Terre · Bella Italia Tours",
    precio: 2400,
    fechaDesde: "2026-05-14",
    fechaHasta: "2026-05-23",
    dificultad: "Relax total",
    grupoMin: 8,
    grupoMax: 14,
    alojamiento: "Agriturismo boutique en la Toscana",
    actividades: ["Cultura", "Gastronomía", "Fotografía"],
    incluye: "Vuelos, tren de alta velocidad, cata de vinos",
    rating: 4.9,
    reviews: 48,
    badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 28,
    destino: "Italia",
    subtitulo: "Costa Amalfitana & Capri · Dolce Vita Lux",
    precio: 4200,
    fechaDesde: "2027-06-10",
    fechaHasta: "2027-06-18",
    dificultad: "Relax total",
    grupoMin: 4,
    grupoMax: 6,
    alojamiento: "Hotel 5★ con vista al mar en Positano",
    actividades: ["Playa", "Lujo", "Gastronomía"],
    incluye: "Vuelos, yate privado a Capri, cenas de autor",
    rating: 5.0,
    reviews: 17,
    badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  /* --------------------------------------------------------------
     LATINOAMÉRICA — los 19 países, 3 niveles cada uno
     (económico / clásico / exclusivo, mismo patrón que arriba)
     -------------------------------------------------------------- */

  // Argentina (país completo, distinto de las regiones Patagonia/Mendoza)
  {
    id: 29, destino: "Argentina", subtitulo: "Buenos Aires Porteño · City Hostel Experience",
    precio: 750, fechaDesde: "2026-09-01", fechaHasta: "2026-09-06", dificultad: "Equilibrado",
    grupoMin: 14, grupoMax: 22, alojamiento: "Hostel en San Telmo",
    actividades: ["Vida Nocturna", "Cultura", "Económico"],
    incluye: "Traslados, free tour, noche de tango popular",
    rating: 4.5, reviews: 28, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1640604542825-8d934dc2e5d1?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 30, destino: "Argentina", subtitulo: "Buenos Aires + Iguazú · Argentina Imperdible",
    precio: 1650, fechaDesde: "2026-10-15", fechaHasta: "2026-10-22", dificultad: "Equilibrado",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 4★ + lodge en Iguazú",
    actividades: ["Naturaleza", "Cultura", "Fotografía"],
    incluye: "Vuelos internos, entradas al Parque Nacional, guía",
    rating: 4.8, reviews: 45, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 31, destino: "Argentina", subtitulo: "Estancia de Lujo & Tango Privado · BA Exclusivo",
    precio: 2900, fechaDesde: "2027-01-10", fechaHasta: "2027-01-16", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Estancia 5★ + suite en Recoleta",
    actividades: ["Lujo", "Gastronomía", "Vida Nocturna"],
    incluye: "Vuelos, show de tango privado, cenas de autor",
    rating: 4.9, reviews: 16, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&h=400&fit=crop&auto=format"
  },

  // Bolivia
  {
    id: 32, destino: "Bolivia", subtitulo: "Salar de Uyuni Mochilero · Altiplano Trail",
    precio: 690, fechaDesde: "2026-08-10", fechaHasta: "2026-08-16", dificultad: "Full actividades",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel de altura en Uyuni",
    actividades: ["Aventura", "Naturaleza", "Económico"],
    incluye: "Traslados en 4x4, guía local, entradas al salar",
    rating: 4.6, reviews: 24, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 33, destino: "Bolivia", subtitulo: "La Paz y Uyuni Completo · Bolivia Andina Tours",
    precio: 1350, fechaDesde: "2026-06-05", fechaHasta: "2026-06-13", dificultad: "Equilibrado",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 3★ en La Paz",
    actividades: ["Cultura", "Naturaleza", "Fotografía"],
    incluye: "Vuelos internos, teleférico, tour al salar 2 días",
    rating: 4.7, reviews: 32, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 34, destino: "Bolivia", subtitulo: "Uyuni Sky Lodge de Sal · Bolivia Premium",
    precio: 2600, fechaDesde: "2027-02-01", fechaHasta: "2027-02-07", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Hotel de sal de lujo frente al salar",
    actividades: ["Naturaleza", "Lujo", "Fotografía"],
    incluye: "Vuelos, 4x4 privado, cena bajo las estrellas",
    rating: 5.0, reviews: 10, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&h=400&fit=crop&auto=format"
  },

  // Brasil
  {
    id: 35, destino: "Brasil", subtitulo: "Río Mochilero · Cristo & Copacabana Hostel",
    precio: 950, fechaDesde: "2026-11-03", fechaHasta: "2026-11-09", dificultad: "Equilibrado",
    grupoMin: 14, grupoMax: 22, alojamiento: "Hostel frente a Copacabana",
    actividades: ["Playa", "Vida Nocturna", "Económico"],
    incluye: "Traslados, subida al Cristo Redentor, samba tour",
    rating: 4.5, reviews: 33, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1640604542825-8d934dc2e5d1?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 36, destino: "Brasil", subtitulo: "Río + Cataratas de Iguazú · Brasil Clásico",
    precio: 1900, fechaDesde: "2026-12-01", fechaHasta: "2026-12-09", dificultad: "Equilibrado",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 4★ + lodge en Foz de Iguaçu",
    actividades: ["Naturaleza", "Playa", "Fotografía"],
    incluye: "Vuelos internos, entradas al parque, paseo en lancha",
    rating: 4.8, reviews: 41, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 37, destino: "Brasil", subtitulo: "Fernando de Noronha · Brasil Exclusivo",
    precio: 3800, fechaDesde: "2027-04-05", fechaHasta: "2027-04-12", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Pousada de lujo frente al mar",
    actividades: ["Playa", "Buceo", "Lujo"],
    incluye: "Vuelos, buceo con tortugas, todas las comidas",
    rating: 5.0, reviews: 13, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Chile
  {
    id: 38, destino: "Chile", subtitulo: "San Pedro de Atacama Mochilero · Desierto Backpacker",
    precio: 880, fechaDesde: "2026-09-20", fechaHasta: "2026-09-26", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en San Pedro",
    actividades: ["Aventura", "Naturaleza", "Económico"],
    incluye: "Traslados, tour a Valle de la Luna, géiseres del Tatio",
    rating: 4.6, reviews: 27, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 39, destino: "Chile", subtitulo: "Santiago y Valparaíso · Chile Esencial",
    precio: 1450, fechaDesde: "2026-04-08", fechaHasta: "2026-04-15", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel boutique en Valparaíso",
    actividades: ["Cultura", "Gastronomía", "Vida Local"],
    incluye: "Traslados, tour de murales, cata de vinos del Maipo",
    rating: 4.7, reviews: 35, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 40, destino: "Chile", subtitulo: "Atacama Lodge de Lujo · Chile Premium",
    precio: 3300, fechaDesde: "2027-03-15", fechaHasta: "2027-03-21", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Lodge 5★ con observatorio privado",
    actividades: ["Naturaleza", "Lujo", "Bienestar"],
    incluye: "Vuelos, spa, tour astronómico privado",
    rating: 5.0, reviews: 12, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=600&h=400&fit=crop&auto=format"
  },

  // Colombia
  {
    id: 41, destino: "Colombia", subtitulo: "Medellín y Guatapé Mochilero · Colombia Backpacker",
    precio: 720, fechaDesde: "2026-08-18", fechaHasta: "2026-08-24", dificultad: "Equilibrado",
    grupoMin: 14, grupoMax: 20, alojamiento: "Hostel en El Poblado",
    actividades: ["Vida Nocturna", "Aventura", "Económico"],
    incluye: "Traslados, subida al Peñón de Guatapé, comuna 13",
    rating: 4.6, reviews: 30, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1640604542825-8d934dc2e5d1?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 42, destino: "Colombia", subtitulo: "Cartagena y Eje Cafetero · Colombia Clásico",
    precio: 1550, fechaDesde: "2026-07-01", fechaHasta: "2026-07-09", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel colonial en Cartagena",
    actividades: ["Cultura", "Gastronomía", "Playa"],
    incluye: "Vuelos internos, tour cafetero, ciudad amurallada",
    rating: 4.8, reviews: 38, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 43, destino: "Colombia", subtitulo: "Cartagena Colonial de Lujo · Colombia Exclusivo",
    precio: 2950, fechaDesde: "2027-01-20", fechaHasta: "2027-01-27", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Hotel boutique 5★ en el centro histórico",
    actividades: ["Playa", "Lujo", "Cultura"],
    incluye: "Vuelos, cenas de autor, paseo en velero privado",
    rating: 4.9, reviews: 14, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Cuba
  {
    id: 44, destino: "Cuba", subtitulo: "La Habana Vieja Mochilero · Casa Particular Tour",
    precio: 800, fechaDesde: "2026-10-05", fechaHasta: "2026-10-11", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Casa particular en La Habana Vieja",
    actividades: ["Cultura", "Vida Nocturna", "Económico"],
    incluye: "Traslados, tour en auto clásico, clase de salsa",
    rating: 4.5, reviews: 22, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 45, destino: "Cuba", subtitulo: "La Habana y Varadero · Cuba Clásico",
    precio: 1600, fechaDesde: "2026-12-10", fechaHasta: "2026-12-18", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 4★ en Varadero",
    actividades: ["Playa", "Cultura", "Vida Nocturna"],
    incluye: "Vuelos internos, city tour, 3 noches de playa",
    rating: 4.7, reviews: 29, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 46, destino: "Cuba", subtitulo: "Cayo Santa María Todo Incluido · Cuba Exclusivo",
    precio: 2750, fechaDesde: "2027-02-14", fechaHasta: "2027-02-21", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Resort 5★ todo incluido",
    actividades: ["Playa", "Lujo", "Bienestar"],
    incluye: "Vuelos, spa, todas las comidas y bebidas",
    rating: 4.9, reviews: 11, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Ecuador
  {
    id: 47, destino: "Ecuador", subtitulo: "Quito y Otavalo Mochilero · Andes Backpacker",
    precio: 730, fechaDesde: "2026-09-08", fechaHasta: "2026-09-14", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en el centro histórico de Quito",
    actividades: ["Cultura", "Aventura", "Económico"],
    incluye: "Traslados, mercado de Otavalo, mitad del mundo",
    rating: 4.5, reviews: 20, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 48, destino: "Ecuador", subtitulo: "Quito Colonial y Mindo · Ecuador Clásico",
    precio: 1400, fechaDesde: "2026-05-20", fechaHasta: "2026-05-27", dificultad: "Equilibrado",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel boutique + lodge en Mindo",
    actividades: ["Naturaleza", "Cultura", "Fotografía"],
    incluye: "Traslados, avistamiento de aves, teleférico",
    rating: 4.7, reviews: 26, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 49, destino: "Ecuador", subtitulo: "Islas Galápagos en Crucero · Ecuador Exclusivo",
    precio: 4500, fechaDesde: "2027-05-01", fechaHasta: "2027-05-09", dificultad: "Relax total",
    grupoMin: 6, grupoMax: 8, alojamiento: "Crucero de expedición 5★",
    actividades: ["Fauna Silvestre", "Buceo", "Lujo"],
    incluye: "Vuelos, crucero todo incluido, guía naturalista certificado",
    rating: 5.0, reviews: 9, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // El Salvador
  {
    id: 50, destino: "El Salvador", subtitulo: "Ruta de las Flores Mochilero · El Salvador Backpacker",
    precio: 640, fechaDesde: "2026-11-08", fechaHasta: "2026-11-13", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en Juayúa",
    actividades: ["Aventura", "Vida Local", "Económico"],
    incluye: "Traslados, caminata a cascadas, feria gastronómica",
    rating: 4.4, reviews: 15, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 51, destino: "El Salvador", subtitulo: "Surf y Volcanes · El Salvador Clásico",
    precio: 1250, fechaDesde: "2026-03-10", fechaHasta: "2026-03-16", dificultad: "Equilibrado",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel frente al mar en El Tunco",
    actividades: ["Deportes Extremos", "Playa", "Naturaleza"],
    incluye: "Traslados, clases de surf, caminata al volcán Izalco",
    rating: 4.7, reviews: 24, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 52, destino: "El Salvador", subtitulo: "Costa del Bálsamo Boutique · El Salvador Exclusivo",
    precio: 2400, fechaDesde: "2027-01-05", fechaHasta: "2027-01-11", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Hotel boutique 5★ frente al mar",
    actividades: ["Playa", "Lujo", "Bienestar"],
    incluye: "Vuelos, spa, cenas privadas frente al mar",
    rating: 4.9, reviews: 8, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Honduras
  {
    id: 53, destino: "Honduras", subtitulo: "Copán Ruinas Mochilero · Honduras Backpacker",
    precio: 700, fechaDesde: "2026-06-15", fechaHasta: "2026-06-21", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en Copán Ruinas",
    actividades: ["Cultura", "Historia", "Económico"],
    incluye: "Traslados, entradas al parque arqueológico, guía",
    rating: 4.5, reviews: 17, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 54, destino: "Honduras", subtitulo: "Roatán Clásico · Islas de la Bahía Tour",
    precio: 1450, fechaDesde: "2026-04-20", fechaHasta: "2026-04-27", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 3★ frente al mar en Roatán",
    actividades: ["Playa", "Buceo", "Fotografía"],
    incluye: "Vuelos internos, 2 inmersiones de buceo, snorkel",
    rating: 4.7, reviews: 25, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 55, destino: "Honduras", subtitulo: "Roatán Resort Todo Incluido · Honduras Exclusivo",
    precio: 2650, fechaDesde: "2027-02-08", fechaHasta: "2027-02-15", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Resort 5★ todo incluido",
    actividades: ["Playa", "Buceo", "Lujo"],
    incluye: "Vuelos, buceo ilimitado, todas las comidas y bebidas",
    rating: 4.9, reviews: 10, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // México
  {
    id: 56, destino: "México", subtitulo: "CDMX Mochilero · Ciudad de México Backpacker",
    precio: 820, fechaDesde: "2026-09-25", fechaHasta: "2026-10-01", dificultad: "Equilibrado",
    grupoMin: 14, grupoMax: 20, alojamiento: "Hostel en la Roma-Condesa",
    actividades: ["Cultura", "Vida Nocturna", "Económico"],
    incluye: "Traslados, tour a Teotihuacán, mercado de Coyoacán",
    rating: 4.6, reviews: 34, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1640604542825-8d934dc2e5d1?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 57, destino: "México", subtitulo: "Riviera Maya y Chichén Itzá · México Clásico",
    precio: 1750, fechaDesde: "2026-11-12", fechaHasta: "2026-11-20", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 4★ en Playa del Carmen",
    actividades: ["Playa", "Cultura", "Historia"],
    incluye: "Vuelos, tour a Chichén Itzá, cenote incluido",
    rating: 4.8, reviews: 46, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 58, destino: "México", subtitulo: "Los Cabos Resort de Lujo · México Exclusivo",
    precio: 3200, fechaDesde: "2027-03-01", fechaHasta: "2027-03-08", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Resort 5★ frente al mar",
    actividades: ["Playa", "Lujo", "Bienestar"],
    incluye: "Vuelos, spa, catamarán al atardecer, todas las comidas",
    rating: 5.0, reviews: 13, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Nicaragua
  {
    id: 59, destino: "Nicaragua", subtitulo: "León y Volcán Cerro Negro · Nicaragua Backpacker",
    precio: 610, fechaDesde: "2026-08-22", fechaHasta: "2026-08-27", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en León",
    actividades: ["Deportes Extremos", "Aventura", "Económico"],
    incluye: "Traslados, sandboard en el volcán, city tour",
    rating: 4.5, reviews: 16, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 60, destino: "Nicaragua", subtitulo: "Isla de Ometepe · Nicaragua Clásico",
    precio: 1150, fechaDesde: "2026-02-10", fechaHasta: "2026-02-16", dificultad: "Equilibrado",
    grupoMin: 8, grupoMax: 14, alojamiento: "Eco-lodge en la isla",
    actividades: ["Naturaleza", "Cultura", "Fotografía"],
    incluye: "Ferry, caminata a la laguna verde, guía local",
    rating: 4.7, reviews: 19, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 61, destino: "Nicaragua", subtitulo: "San Juan del Sur Boutique · Nicaragua Exclusivo",
    precio: 2300, fechaDesde: "2027-01-15", fechaHasta: "2027-01-21", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Hotel boutique 5★ frente al mar",
    actividades: ["Playa", "Lujo", "Bienestar"],
    incluye: "Vuelos, spa, cenas privadas al atardecer",
    rating: 4.8, reviews: 9, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Panamá
  {
    id: 62, destino: "Panamá", subtitulo: "Ciudad de Panamá Mochilero · Canal Backpacker",
    precio: 690, fechaDesde: "2026-10-18", fechaHasta: "2026-10-23", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en el Casco Antiguo",
    actividades: ["Cultura", "Vida Local", "Económico"],
    incluye: "Traslados, visita a las esclusas del Canal, city tour",
    rating: 4.5, reviews: 18, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 63, destino: "Panamá", subtitulo: "Panamá y San Blas · Panamá Clásico",
    precio: 1500, fechaDesde: "2026-07-20", fechaHasta: "2026-07-27", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 4★ + cabañas en San Blas",
    actividades: ["Playa", "Cultura", "Naturaleza"],
    incluye: "Traslados, lancha a las islas, comunidad Guna Yala",
    rating: 4.7, reviews: 22, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 64, destino: "Panamá", subtitulo: "San Blas Islas Privadas · Panamá Exclusivo",
    precio: 2850, fechaDesde: "2027-02-20", fechaHasta: "2027-02-27", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Cabaña privada sobre el mar",
    actividades: ["Playa", "Lujo", "Buceo"],
    incluye: "Vuelos, lancha privada, todas las comidas",
    rating: 4.9, reviews: 7, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Paraguay
  {
    id: 65, destino: "Paraguay", subtitulo: "Asunción Mochilero · Paraguay Backpacker",
    precio: 590, fechaDesde: "2026-09-14", fechaHasta: "2026-09-19", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en el centro de Asunción",
    actividades: ["Cultura", "Vida Local", "Económico"],
    incluye: "Traslados, city tour, costanera de Asunción",
    rating: 4.4, reviews: 12, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 66, destino: "Paraguay", subtitulo: "Misiones Jesuíticas · Paraguay Clásico",
    precio: 1200, fechaDesde: "2026-05-05", fechaHasta: "2026-05-11", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 3★ en Encarnación",
    actividades: ["Cultura", "Historia", "Fotografía"],
    incluye: "Traslados, entradas a Trinidad y Jesús, guía histórico",
    rating: 4.6, reviews: 15, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 67, destino: "Paraguay", subtitulo: "Ciudad del Este & Saltos del Monday · Paraguay Exclusivo",
    precio: 2100, fechaDesde: "2027-04-10", fechaHasta: "2027-04-16", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Hotel boutique 5★",
    actividades: ["Naturaleza", "Lujo", "Compras"],
    incluye: "Vuelos, excursión privada a los saltos, guía exclusivo",
    rating: 4.8, reviews: 6, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  },

  // República Dominicana
  {
    id: 68, destino: "República Dominicana", subtitulo: "Santo Domingo Colonial Mochilero · RD Backpacker",
    precio: 750, fechaDesde: "2026-11-22", fechaHasta: "2026-11-27", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en la Zona Colonial",
    actividades: ["Cultura", "Historia", "Económico"],
    incluye: "Traslados, tour por la Zona Colonial, guía local",
    rating: 4.5, reviews: 21, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 69, destino: "República Dominicana", subtitulo: "Punta Cana Clásico · República Dominicana Tour",
    precio: 1600, fechaDesde: "2026-06-01", fechaHasta: "2026-06-08", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel 4★ frente al mar",
    actividades: ["Playa", "Bienestar", "Fotografía"],
    incluye: "Vuelos, excursión a Isla Saona, snorkel",
    rating: 4.8, reviews: 40, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 70, destino: "República Dominicana", subtitulo: "Punta Cana All-Inclusive Premium · RD Exclusivo",
    precio: 3100, fechaDesde: "2027-03-18", fechaHasta: "2027-03-25", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Resort 5★ todo incluido",
    actividades: ["Playa", "Lujo", "Bienestar"],
    incluye: "Vuelos, spa, todas las comidas y bebidas premium",
    rating: 5.0, reviews: 15, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },

  // Uruguay
  {
    id: 71, destino: "Uruguay", subtitulo: "Montevideo Mochilero · Uruguay Backpacker",
    precio: 680, fechaDesde: "2026-10-25", fechaHasta: "2026-10-30", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel en Ciudad Vieja",
    actividades: ["Cultura", "Vida Local", "Económico"],
    incluye: "Traslados, mercado del puerto, rambla montevideana",
    rating: 4.5, reviews: 19, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 72, destino: "Uruguay", subtitulo: "Colonia del Sacramento y Montevideo · Uruguay Clásico",
    precio: 1350, fechaDesde: "2026-03-22", fechaHasta: "2026-03-28", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Hotel boutique en Colonia",
    actividades: ["Cultura", "Historia", "Gastronomía"],
    incluye: "Traslados, ferry a Colonia, degustación de asado",
    rating: 4.7, reviews: 26, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1593436243794-e0e6eefcef57?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 73, destino: "Uruguay", subtitulo: "Punta del Este Exclusivo · Uruguay Premium",
    precio: 2950, fechaDesde: "2027-01-08", fechaHasta: "2027-01-14", dificultad: "Relax total",
    grupoMin: 4, grupoMax: 6, alojamiento: "Hotel 5★ frente a la playa Brava",
    actividades: ["Playa", "Lujo", "Vida Nocturna"],
    incluye: "Vuelos, cenas de autor, beach club privado",
    rating: 4.9, reviews: 12, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format"
  },

  // Venezuela
  {
    id: 74, destino: "Venezuela", subtitulo: "Mérida y Los Andes Mochilero · Venezuela Backpacker",
    precio: 640, fechaDesde: "2026-08-05", fechaHasta: "2026-08-11", dificultad: "Equilibrado",
    grupoMin: 12, grupoMax: 18, alojamiento: "Hostel de montaña en Mérida",
    actividades: ["Aventura", "Naturaleza", "Económico"],
    incluye: "Traslados, teleférico, caminata en Los Andes",
    rating: 4.5, reviews: 14, badge: "Económico",
    imagen: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 75, destino: "Venezuela", subtitulo: "Los Roques Clásico · Venezuela Caribe",
    precio: 1700, fechaDesde: "2026-07-08", fechaHasta: "2026-07-14", dificultad: "Relax total",
    grupoMin: 8, grupoMax: 14, alojamiento: "Posada frente al mar en Gran Roque",
    actividades: ["Playa", "Buceo", "Fotografía"],
    incluye: "Vuelos internos, excursión a cayos, snorkel",
    rating: 4.8, reviews: 20, badge: "Clásico",
    imagen: "https://images.unsplash.com/photo-1691849793899-ac59a3bdc08d?w=600&h=400&fit=crop&auto=format"
  },
  {
    id: 76, destino: "Venezuela", subtitulo: "Roraima y Gran Sabana Expedición Premium · Venezuela Exclusivo",
    precio: 2400, fechaDesde: "2027-01-25", fechaHasta: "2027-02-03", dificultad: "Full actividades",
    grupoMin: 6, grupoMax: 8, alojamiento: "Campamento expedición + hotel 4★",
    actividades: ["Aventura", "Naturaleza", "Lujo"],
    incluye: "Vuelos internos, guía pemón, equipo de trekking premium",
    rating: 4.9, reviews: 8, badge: "Exclusivo",
    imagen: "https://images.unsplash.com/photo-1500354960738-4c480ed785bc?w=600&h=400&fit=crop&auto=format"
  }
];
