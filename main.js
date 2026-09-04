/* ================================================================
   TRIPMATCH — main.js
   ================================================================
   Clase 18: el JS va separado del HTML en su propio archivo. Este
   MISMO archivo se vincula con <script src="main.js"> en TODAS las
   páginas del sitio (index, login, perfil, buscar, comparar,
   guardados) — no tengo un JS distinto por página.

   ¿Cómo hace un solo archivo para comportarse distinto en cada
   página? Cada bloque de lógica está "guardado" (guard) por un
   if que pregunta si existe un elemento que SOLO está en esa
   página. Por ejemplo, el bloque del Quiz de perfil arranca con
   "if (document.querySelector('#quiz-chips'))" — ese elemento
   nada más existe en perfil.html, así que ese bloque de código
   nunca se ejecuta en las demás páginas. Esto sigue el mismo
   principio DRY (Clase 16) que ya veníamos usando: un solo lugar
   con el catálogo, el motor de matching y el armado de tarjetas,
   reutilizado desde cualquier página que lo necesite.

   ================================================================
   SUGERENCIA / INVESTIGACIÓN PROPIA + IA (no vista en clase)
   ================================================================
   Ahora que cada pantalla es una página HTML distinta (Clase 2:
   multi-página, en vez de un modal con JS), cada vez que el
   navegador carga una página nueva, TODAS las variables de JS de
   la página anterior se pierden — es un archivo nuevo, ejecutado
   de cero. Si quiero que el usuario siga "logueado" al pasar de
   login.html a perfil.html, o que sus favoritos sigan ahí al
   entrar a guardados.html, necesito guardar esos datos en algún
   lado que sobreviva al cambio de página. La única forma de hacer
   eso solo con JS del navegador (sin backend) es localStorage.
   No lo vimos en clase, así que separo estas funciones bien
   marcadas acá arriba, y las uso como una "caja negra" en el
   resto del archivo (guardarX / leerX), sin mezclar esto con la
   lógica de clase.
   ================================================================ */
function guardarUsuario(usuario) {
  localStorage.setItem("tripmatch_usuario", JSON.stringify(usuario));
}
function leerUsuario() {
  const guardado = localStorage.getItem("tripmatch_usuario");
  return guardado ? JSON.parse(guardado) : null;
}
function guardarPerfil(perfil) {
  localStorage.setItem("tripmatch_perfil", JSON.stringify(perfil));
}
function leerPerfil() {
  const guardado = localStorage.getItem("tripmatch_perfil");
  return guardado ? JSON.parse(guardado) : null;
}
function leerFavoritos() {
  const guardado = localStorage.getItem("tripmatch_favoritos");
  return guardado ? JSON.parse(guardado) : [];
}
function guardarFavoritos(listaIds) {
  localStorage.setItem("tripmatch_favoritos", JSON.stringify(listaIds));
}
function haySesion() {
  return leerUsuario() !== null;
}
function cerrarSesion() {
  localStorage.removeItem("tripmatch_usuario");
  // OJO: NO borro "tripmatch_perfil" a propósito. El Task Flow 1
  // (docx) pide expresamente que el perfil quede guardado para
  // "evitar la carga repetida cada vez que se buscan viajes,
  // siempre con posibilidad de editarlo". Cerrar sesión termina la
  // sesión, no borra el perfil armado — la próxima vez que ese
  // mismo usuario inicie sesión, cae directo en Inicio con sus
  // intereses intactos, sin repetir el quiz.
  // Los favoritos tampoco se borran, por la misma lógica.
  window.location.href = "index.html";
}


/* ================================================================
   1) CATÁLOGO DE VIAJES
   Se movió a datos/ofertas.js (carpeta propia para el banco de
   ofertas, que ya tiene 76 viajes). Sigue siendo un <script>
   clásico cargado ANTES que este archivo en cada página, así que
   "catalogoViajes" queda disponible ahí abajo igual que si
   estuviera en este mismo archivo (Clase 15: array de objetos).
   ================================================================ */

/* ================================================================
   INTERESES DEL QUIZ DE PERFIL — Clase 15 (array de objetos)
   ================================================================
   SUGERENCIA / INVESTIGACIÓN PROPIA + IA (no vista en clase, es
   contenido/UX, no una técnica de programación nueva): antes tenía
   15 intereses sueltos en una sola fila. Miré cómo categorizan el
   interés de viaje apps reales (Airbnb Experiences separa por
   "Aventura al aire libre / Comida / Arte y cultura / Deportes",
   TripAdvisor usa "Adventure / Culture / Food / Nightlife /
   Nature", Booking.com arma "tipos de viaje" como Playa / Ciudad /
   Naturaleza / Relax) y reorganicé la lista en 5 grupos con más
   variedad (26 opciones en total), para que el quiz se sienta
   menos "plano" y más fácil de escanear con la vista.

   Uso un array de OBJETOS (Clase 15), cada uno con su nombre de
   grupo + un array de opciones adentro (Clase 14: array dentro de
   un objeto), en vez de la lista suelta que tenía antes.

   Importante: la mayoría de los intereses que ya usaba el catálogo
   de viajes como "actividades" (Cultura, Gastronomía, Senderismo,
   Aventura, Naturaleza, Fotografía, Amigos) siguen estando acá, así
   el motor de matching no se rompe con los viajes que ya tenía
   cargados. El grupo "Descanso y bienestar" se reemplazó por
   "Alojamiento ideal" y "Ritmo de viaje" (más útiles para perfilar
   el estilo de viaje que "Playa/Bienestar/Lujo" sueltos).
   ================================================================ */
const gruposIntereses = [
  {
    grupo: "Aventura y naturaleza",
    opciones: ["Aventura", "Senderismo", "Naturaleza", "Fauna Silvestre", "Deportes Extremos", "Buceo", "Playa", "Bienestar"]
  },
  {
    grupo: "Cultura y ciudad",
    opciones: ["Cultura", "Historia", "Arte y Museos", "Arquitectura", "Vida Local", "Fotografía"]
  },
  {
    grupo: "Gastronomía y vida nocturna",
    opciones: ["Gastronomía", "Vida Nocturna", "Festivales"]
  },
  {
    grupo: "Alojamiento ideal",
    opciones: ["Hostel / vibe social", "Hotel boutique", "Airbnb / depto", "Camping / Glamping"]
  },
  {
    grupo: "Ritmo de viaje",
    opciones: ["Full actividades", "Equilibrado", "Relax total"]
  },
  {
    grupo: "Estilo de viaje",
    opciones: ["Solo", "Parejas", "Amigos", "Familia", "Idiomas", "Compras", "Económico", "Lujo"]
  }
];


/* ================================================================
   2) MOTOR DE MATCHING
   Clase 12 (if/else), Clase 13 (acumulador fuera del bucle),
   Clase 14 (includes() para comparar arrays)
   ================================================================ */
// Mapa de intensidad para comparar dificultades sin if/else en cadena
// (Clase 15: objeto usado como diccionario). Relax total y Full actividades quedan
// en los extremos, así la penalización crece con la distancia real
// entre lo que el viajero pidió y lo que el viaje exige.
const intensidadDificultad = { "Relax total": 1, "Equilibrado": 2, "Full actividades": 3 };

function calcularMatch(viaje, perfil) {
  let coincidencias = 0; // acumulador (Clase 13: fuera del bucle)

  for (let i = 0; i < viaje.actividades.length; i++) {
    if (perfil.intereses.includes(viaje.actividades[i])) {
      coincidencias = coincidencias + 1;
    }
  }

  const porcentajeIntereses = (coincidencias / viaje.actividades.length) * 100;

  let ajustePresupuesto = 0;
  if (viaje.precio <= perfil.presupuesto) {
    ajustePresupuesto = 10;
  } else if (viaje.precio <= perfil.presupuesto * 1.15) {
    ajustePresupuesto = -8;
  } else {
    ajustePresupuesto = -25;
  }

  // perfil.dificultadPreferida y perfil.tamanoGrupo son campos nuevos
  // del quiz (paso 2): antes el match solo miraba intereses y
  // presupuesto, así que dos viajes con las mismas actividades pero
  // ritmo o tamaño de grupo opuestos daban el mismo % — con este
  // ajuste dos ofertas ya no quedan pegadas en el mismo número.
  // El "|| " cubre perfiles viejos guardados antes de agregar estos
  // campos (Clase 12: valor por defecto con OR).
  const dificultadPreferida = perfil.dificultadPreferida || "Equilibrado";
  const distanciaDificultad = Math.abs(intensidadDificultad[viaje.dificultad] - intensidadDificultad[dificultadPreferida]);
  let ajusteDificultad = 10;
  if (distanciaDificultad === 1) ajusteDificultad = -4;
  if (distanciaDificultad === 2) ajusteDificultad = -14;

  const rangosGrupo = { "Chico": [0, 8], "Mediano": [9, 14], "Grande": [15, 999] };
  const rangoPreferido = rangosGrupo[perfil.tamanoGrupo || "Mediano"];
  const grupoSolapa = viaje.grupoMin <= rangoPreferido[1] && viaje.grupoMax >= rangoPreferido[0];
  const ajusteGrupo = grupoSolapa ? 6 : -6;

  let porcentajeFinal = Math.round(porcentajeIntereses + ajustePresupuesto + ajusteDificultad + ajusteGrupo);

  if (porcentajeFinal > 99) porcentajeFinal = 99;
  if (porcentajeFinal < 5) porcentajeFinal = 5;

  return porcentajeFinal;
}

function buscarViajePorId(id) {
  // find() (Clase 19-20): devuelve el primer objeto que cumple la condición
  return catalogoViajes.find(function (viaje) {
    return viaje.id === id;
  });
}

function formatearFecha(fechaISO) {
  const partes = fechaISO.split("-"); // Clase 11: String
  return partes[2] + "/" + partes[1];
}


/* ----------------------------------------------------------------
   RESEÑAS DE CADA VIAJE (desplegable en "Ver más" y en el balance
   detallado de comparar.html)
   No hay una base de reseñas real por viaje (sería un backend
   aparte, fuera del alcance del MVP), así que arman un pool de
   nombres/comentarios/fechas típicos de una reseña de viaje grupal,
   y generarResenasHTML() elige siempre las MISMAS 3 combinando el
   id del viaje (Clase 12: operador % para no salirse del array,
   mismo patrón que usa el resto del archivo) — así no cambian solas
   cada vez que se recarga la página. Va ACÁ (compartido, antes de
   cualquier página puntual) porque tanto detalle.html como
   comparar.html lo necesitan.
   ---------------------------------------------------------------- */
const resenasNombres = [
  "Martina G.", "Lucas F.", "Camila R.", "Tomás B.", "Sofía M.",
  "Nicolás P.", "Valentina D.", "Agustín C.", "Julieta S.", "Mateo L.",
  "Florencia V.", "Ignacio T."
];
const resenasComentarios = [
  { texto: "La verdad superó nuestras expectativas, la organización fue impecable de principio a fin.", estrellas: 5 },
  { texto: "El grupo fue justo del tamaño que esperábamos, se armó muy buena onda entre todos.", estrellas: 5 },
  { texto: "El alojamiento estuvo mejor de lo que pensé por el precio que pagamos.", estrellas: 4 },
  { texto: "La guía sabía muchísimo y siempre estuvo atenta a que no falte nada.", estrellas: 5 },
  { texto: "Volvería a elegir esta agencia sin dudarlo, todo salió como decía el itinerario.", estrellas: 5 },
  { texto: "Alguna actividad se sintió un poco apurada, pero en general la pasamos increíble.", estrellas: 4 },
  { texto: "Buena relación precio-calidad, aunque esperaba un poco más de tiempo libre.", estrellas: 3 },
  { texto: "Nos encantó el ritmo del viaje, ni muy relajado ni agotador.", estrellas: 5 },
  { texto: "La comida incluida fue un lindo extra que no esperábamos.", estrellas: 4 },
  { texto: "Coordinaron muy bien los traslados, cero complicaciones en todo el recorrido.", estrellas: 5 },
  { texto: "Fue mi segundo viaje con ellos y de nuevo no me decepcionaron.", estrellas: 5 },
  { texto: "Ideal si buscás algo bien organizado sin perder la esencia de viajar con onda propia.", estrellas: 4 }
];
const resenasFechas = ["hace 1 semana", "hace 2 semanas", "hace 1 mes", "hace 2 meses", "hace 3 meses", "hace 4 meses"];

/* ----------------------------------------------------------------
   QUÉ OFRECE CADA ACTIVIDAD (solo en detalle.html — "Ver más")
   Los tags de actividades ("Aventura", "Senderismo", etc.) son
   genéricos en el catálogo, pero al entrar a investigar UN viaje
   puntual tiene sentido poder tocarlos y ver qué incluye esa
   excursión en concreto. No hay un texto único por viaje (sería
   demasiado para 76 ofertas x hasta 4 actividades), así que cada
   tag tiene 2 variantes de descripción y obtenerDescripcionActividad()
   elige siempre la MISMA para ese viaje (Clase 12: operador %,
   mismo patrón que las reseñas), reemplazando "{destino}" por el
   destino real del viaje.
   ---------------------------------------------------------------- */
const descripcionesActividad = {
  "Aventura": [
    "Actividades al aire libre pensadas para subir la adrenalina, con todo el equipo de seguridad incluido.",
    "Salida de aventura con guía especializado, ideal para sumarle algo de acción al itinerario en {destino}."
  ],
  "Senderismo": [
    "Caminata guiada por senderos naturales, con paradas para descansar y sacar fotos.",
    "Trekking de dificultad acorde al grupo, a través de los paisajes de {destino}."
  ],
  "Naturaleza": [
    "Recorrido por reservas o parques naturales, con guía especializado en flora y fauna local.",
    "Contacto directo con paisajes naturales poco intervenidos, ideal para desconectar."
  ],
  "Fauna Silvestre": [
    "Avistamiento de fauna local con guía naturalista, respetando siempre la distancia con los animales.",
    "Recorrido pensado para ver de cerca la fauna silvestre típica de {destino}."
  ],
  "Deportes Extremos": [
    "Actividad de alto impacto con todo el equipo de seguridad y guías certificados.",
    "Descarga de adrenalina pura, pensada para quienes buscan algo más intenso."
  ],
  "Buceo": [
    "Salida de buceo o snorkel con equipo incluido, guiada por instructores certificados.",
    "Inmersión en aguas cristalinas para descubrir la vida marina de la zona."
  ],
  "Playa": [
    "Tiempo libre en la playa, con posibilidad de nadar, tomar sol o simplemente desconectar.",
    "Jornada de playa con parada en una costa poco explorada por el turismo masivo."
  ],
  "Bienestar": [
    "Espacio de relax con opciones de spa, masajes o simplemente tiempo libre para descansar.",
    "Actividades de bienestar pensadas para bajar el ritmo entre excursión y excursión."
  ],
  "Cultura": [
    "Recorrido guiado por los sitios históricos y culturales más representativos de {destino}.",
    "Visita con guía local a los puntos que cuentan la historia y las tradiciones de la zona."
  ],
  "Historia": [
    "Visita a sitios históricos con guía especializado en la historia local.",
    "Recorrido narrado por los hechos y personajes que marcaron {destino}."
  ],
  "Arte y Museos": [
    "Entrada y recorrido guiado por los museos y galerías más destacados de {destino}.",
    "Visita a espacios de arte local, con guía que contextualiza cada obra."
  ],
  "Arquitectura": [
    "Recorrido a pie por los edificios y construcciones más emblemáticas de {destino}.",
    "Visita guiada enfocada en la arquitectura y el diseño urbano de la zona."
  ],
  "Vida Local": [
    "Encuentro con la comunidad local para conocer cómo se vive el día a día en {destino}.",
    "Actividades pensadas para conectar con las costumbres y la gente del lugar."
  ],
  "Fotografía": [
    "Parada especial en los miradores y puntos panorámicos más fotogénicos del recorrido.",
    "Tiempo dedicado exclusivamente a capturar los mejores paisajes y momentos del viaje."
  ],
  "Gastronomía": [
    "Degustación de platos típicos de la cocina local, con maridaje incluido en algunos casos.",
    "Recorrido gastronómico por mercados y restaurantes elegidos por su cocina auténtica."
  ],
  "Vida Nocturna": [
    "Recorrido por bares y lugares con buena movida para vivir la noche de {destino}.",
    "Salida nocturna para conocer el lado más social y activo del destino."
  ],
  "Festivales": [
    "Participación en festividades o eventos locales, según la fecha del viaje.",
    "Actividad pensada para vivir una celebración típica de {destino} en primera persona."
  ],
  "Amigos": [
    "Dinámicas grupales pensadas para romper el hielo y armar buena onda entre el grupo.",
    "Actividades sociales ideales para viajar en grupo de amigos y compartir la experiencia."
  ],
  "Compras": [
    "Tiempo libre para recorrer mercados y tiendas locales en busca de artesanías.",
    "Parada en zonas comerciales típicas para llevarse un recuerdo de {destino}."
  ],
  "Económico": [
    "Actividades pensadas para cuidar el presupuesto sin resignar la experiencia.",
    "Opciones de bajo costo elegidas para que el viaje rinda más sin perder calidad."
  ],
  "Lujo": [
    "Experiencia exclusiva con atención personalizada y detalles premium en cada paso.",
    "Servicio de alta gama pensado para quienes buscan viajar sin resignar comodidad."
  ]
};

function obtenerDescripcionActividad(viaje, actividad, indice) {
  const plantillas = descripcionesActividad[actividad] || ["Actividad incluida en este viaje."];
  const plantilla = plantillas[(viaje.id + indice) % plantillas.length];
  return plantilla.split("{destino}").join(viaje.destino);
}

function generarResenasHTML(viaje) {
  let html = "";
  for (let i = 0; i < 3; i++) {
    const nombre = resenasNombres[(viaje.id + i * 5) % resenasNombres.length];
    const comentario = resenasComentarios[(viaje.id + i * 3) % resenasComentarios.length];
    const fecha = resenasFechas[(viaje.id + i * 2) % resenasFechas.length];

    let estrellasHTML = "";
    for (let e = 1; e <= 5; e++) {
      estrellasHTML += e <= comentario.estrellas
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
    }

    html +=
      '<div class="resena-item">' +
        '<div class="resena-item__cabecera">' +
          "<b>" + nombre + "</b>" +
          '<span class="resena-item__estrellas">' + estrellasHTML + "</span>" +
        "</div>" +
        '<p class="resena-item__texto">' + comentario.texto + "</p>" +
        '<span class="resena-item__fecha">' + fecha + "</span>" +
      "</div>";
  }
  return html;
}


/* ================================================================
   3) RENDER DE TARJETAS — Clase 18 (createElement + appendChild)
   Compartido por buscar.html, comparar.html y guardados.html.
   ================================================================ */
function crearTarjetaViaje(viaje, opciones) {
  const article = document.createElement("article");
  article.className = "tarjeta-viaje";
  article.style.position = "relative"; // ancla para el badge y el corazón (Clase 7)

  const perfilActual = leerPerfil();
  const favoritosActuales = leerFavoritos();
  const esFavorito = favoritosActuales.includes(viaje.id);

  // Badge de % de match: solo si hay SESIÓN ACTIVA (no alcanza con
  // que exista un perfil guardado de una sesión anterior) Y la
  // opción lo pide. Si no hay sesión, muestro un candado que lleva
  // a login.html — el login-gate real del Sitemap.
  let badgeMatchHTML = "";
  if (opciones.mostrarMatch) {
    if (haySesion() && perfilActual !== null) {
      const match = calcularMatch(viaje, perfilActual);
      badgeMatchHTML = '<span class="badge-match">' + match + "% match</span>";
    } else {
      badgeMatchHTML = '<a href="login.html" class="badge-match badge-match--bloqueado"><i class="fa-solid fa-lock"></i> Ver % match</a>';
    }
  }

  let favoritoHTML = "";
  if (opciones.mostrarFavorito) {
    favoritoHTML =
      '<span class="btn-favorito ' + (esFavorito ? "btn-favorito--activo" : "") + '" data-favorito="' + viaje.id + '">' +
      '<i class="fa-solid fa-heart"></i></span>';
  }

  let checkboxHTML = "";
  if (opciones.mostrarCheckbox) {
    checkboxHTML =
      '<label class="tarjeta-viaje__seleccionar">' +
      '<input type="checkbox" data-seleccionar="' + viaje.id + '">' +
      "Seleccionar para comparar</label>";
  }

  const tagsActividades = viaje.actividades
    .map(function (a) { return '<span class="tag-actividad">' + a + "</span>"; })
    .join("");

  article.innerHTML =
    '<div class="tarjeta-viaje__imagen-wrap">' +
      '<img src="' + viaje.imagen + '" alt="' + viaje.destino + '">' +
      badgeMatchHTML +
      favoritoHTML +
      '<span class="tarjeta-viaje__badge">' + viaje.badge + "</span>" +
      '<div class="tarjeta-viaje__pie-imagen"><p>' + viaje.destino + "</p><span>" + viaje.subtitulo + "</span></div>" +
    "</div>" +
    '<div class="tarjeta-viaje__cuerpo">' +
      '<div class="tarjeta-viaje__grilla-datos">' +
        '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Precio</p><p class="dato-chip__valor dato-chip__valor--verde">USD ' + viaje.precio.toLocaleString("es-AR") + "</p></div>" +
        '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Fechas</p><p class="dato-chip__valor">' + formatearFecha(viaje.fechaDesde) + " – " + formatearFecha(viaje.fechaHasta) + "</p></div>" +
        '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Estilo de viaje</p><p class="dato-chip__valor">' + viaje.dificultad + "</p></div>" +
        '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Grupo</p><p class="dato-chip__valor">' + viaje.grupoMin + "–" + viaje.grupoMax + " personas</p></div>" +
      "</div>" +
      '<div class="dato-chip dato-chip--ancho"><p class="dato-chip__label">Actividades</p><div class="fila-flex fila-flex--wrap" style="margin-top:6px;">' + tagsActividades + "</div></div>" +
      '<div class="dato-chip dato-chip--ancho"><p class="dato-chip__label">Incluye</p><p class="dato-chip__valor">' + viaje.incluye + "</p></div>" +
      '<div class="tarjeta-viaje__pie">' +
        '<div class="tarjeta-viaje__rating"><i class="fa-solid fa-star"></i> <b>' + viaje.rating + "</b> <span>(" + viaje.reviews + " reseñas)</span></div>" +
        '<a href="detalle.html?id=' + viaje.id + '" class="tarjeta-viaje__ver-mas">Ver más <i class="fa-solid fa-arrow-right"></i></a>' +
      "</div>" +
      checkboxHTML +
    "</div>";

  return article;
}


/* ================================================================
   4) NAVBAR — se ejecuta en TODAS las páginas
   Clase 18 (style.display) para mostrar el bloque de sesión activa
   o inactiva según haya un usuario guardado.
   ================================================================ */
function renderNavbar() {
  const navInactiva = document.querySelector("#navbar-sesion-inactiva");
  const navActiva = document.querySelector("#navbar-sesion-activa");
  const saludo = document.querySelector("#navbar-saludo");
  if (!navInactiva || !navActiva) return; // por si alguna página no tiene navbar completa

  const usuario = leerUsuario();
  if (usuario !== null) {
    navInactiva.style.display = "none";
    navActiva.style.display = "flex";
    saludo.textContent = "Hola, " + usuario.nombre;
  } else {
    navInactiva.style.display = "flex";
    navActiva.style.display = "none";
  }
}

const botonCerrarSesion = document.querySelector("#btn-cerrar-sesion");
if (botonCerrarSesion) {
  botonCerrarSesion.addEventListener("click", cerrarSesion);
}

renderNavbar();


/* ================================================================
   5) DELEGACIÓN DE EVENTOS COMPARTIDA (favoritos)
   Clase 18/19-20: escucho el click una sola vez en <main> en vez
   de poner un listener por cada corazón (que además se recrean
   con innerHTML todo el tiempo). Sirve para cualquier página que
   tenga tarjetas con corazón: buscar.html, comparar.html,
   guardados.html.
   ================================================================ */
let alTogglearFavorito = function () {}; // cada página puede pisar esto si necesita reaccionar

const mainDePagina = document.querySelector("main");
if (mainDePagina) {
  mainDePagina.addEventListener("click", function (evento) {
    const favorito = evento.target.closest("[data-favorito]");
    if (!favorito) return;

    const id = Number(favorito.dataset.favorito);
    const favoritos = leerFavoritos();
    const posicion = favoritos.indexOf(id); // Clase 14: indexOf

    if (posicion === -1) {
      favoritos.push(id);
      favorito.classList.add("btn-favorito--activo");
    } else {
      favoritos.splice(posicion, 1);
      favorito.classList.remove("btn-favorito--activo");
    }
    guardarFavoritos(favoritos);
    alTogglearFavorito();
  });
}


/* ================================================================
   6) SOLO EN login.html
   ================================================================ */
const formLogin = document.querySelector("#form-login");
if (formLogin) {
  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault(); // Clase 19-20: no recargar la página

    const nombre = document.querySelector("#login-nombre").value.trim();
    const email = document.querySelector("#login-email").value.trim();
    const errorEl = document.querySelector("#login-error");

    if (nombre === "") {
      errorEl.classList.add("quiz-error--visible");
      return;
    }
    errorEl.classList.remove("quiz-error--visible");

    guardarUsuario({ nombre: nombre, email: email });

    // Sitemap (docx sección 3): el login siempre redirige al quiz
    // de preferencias si todavía no hay perfil. Si YA hay perfil,
    // va a Inicio (Home personalizado post-login) — no de vuelta
    // a la landing pública ni derecho al buscador.
    if (leerPerfil() === null) {
      window.location.href = "perfil.html";
    } else {
      window.location.href = "inicio.html";
    }
  });

  /* --------------------------------------------------------------
     SUGERENCIA / INVESTIGACIÓN PROPIA + IA — Botón de Google
     Simulación de "Continuar con Google": no hay integración real
     con la API de Google (necesitaría backend + OAuth, fuera del
     alcance del proyecto). Simplemente completo un usuario de
     ejemplo y sigo el MISMO camino que el login manual: si no hay
     perfil, redirige al quiz (esto SÍ está en el docx: "Incluso
     con Gmail, redirige siempre al quiz de preferencias").
     -------------------------------------------------------------- */
  const btnGoogle = document.querySelector("#btn-login-google");
  if (btnGoogle) {
    btnGoogle.addEventListener("click", function () {
      guardarUsuario({ nombre: "Usuario de Google", email: "usuario@gmail.com" });
      if (leerPerfil() === null) {
        window.location.href = "perfil.html";
      } else {
        window.location.href = "inicio.html";
      }
    });
  }
}


/* ================================================================
   7) SOLO EN perfil.html — Quiz de perfil (Task Flow 1 completo)
   Clase 11 (let pasoActual), Clase 12 (switch/case + if/else)
   ================================================================ */
const contenedorChipsQuiz = document.querySelector("#quiz-chips");
if (contenedorChipsQuiz) {
  // Guard: si no hay sesión, no tiene sentido armar un perfil sin
  // saber de quién es. Redirijo a login.html.
  if (!haySesion()) {
    window.location.href = "login.html";
  } else {
    let pasoActual = 1;
    let interesesQuiz = [];

    const tarjetaSesion = document.querySelector("#tarjeta-sesion");
    const tarjetaQuiz = document.querySelector("#tarjeta-quiz");
    const btnAtras = document.querySelector("#btn-quiz-atras");
    const btnSiguiente = document.querySelector("#btn-quiz-siguiente");

    // Si ya existe un perfil, muestro el resumen en vez del quiz
    // (con opción de editar, que vuelve a mostrar el formulario).
    function mostrarResumenONuevoQuiz() {
      const perfilGuardado = leerPerfil();
      const usuario = leerUsuario();

      if (perfilGuardado !== null) {
        tarjetaQuiz.style.display = "none";
        tarjetaSesion.style.display = "block";
        tarjetaSesion.innerHTML =
          "<h3>¡Hola, " + usuario.nombre + "!</h3>" +
          "<p>Este es el perfil que generamos automáticamente con tus respuestas.</p>" +
          '<div class="resumen-perfil">' +
            '<div class="resumen-perfil__fila"><span>Edad</span><span>' + perfilGuardado.edad + "</span></div>" +
            '<div class="resumen-perfil__fila"><span>Presupuesto</span><span>USD ' + perfilGuardado.presupuesto.toLocaleString("es-AR") + "</span></div>" +
            '<div class="resumen-perfil__fila"><span>Experiencia</span><span>' + perfilGuardado.experiencia + "</span></div>" +
            '<div class="resumen-perfil__fila"><span>Ritmo preferido</span><span>' + (perfilGuardado.dificultadPreferida || "Equilibrado") + "</span></div>" +
            '<div class="resumen-perfil__fila"><span>Grupo ideal</span><span>' + (perfilGuardado.tamanoGrupo || "Mediano") + "</span></div>" +
            '<div class="resumen-perfil__fila"><span>Intereses</span><span>' + perfilGuardado.intereses.join(", ") + "</span></div>" +
          "</div>" +
          '<button id="btn-editar-perfil" class="btn-outline" style="margin-top:20px;">Editar perfil</button>' +
          '<a href="buscar.html" class="btn-cta" style="margin:20px auto 0;">Ir a buscar viajes</a>';

        document.querySelector("#btn-editar-perfil").addEventListener("click", function () {
          document.querySelector("#quiz-nombre").value = usuario.nombre;
          document.querySelector("#quiz-edad").value = perfilGuardado.edad;
          document.querySelector("#quiz-presupuesto").value = perfilGuardado.presupuesto;
          document.querySelector("#quiz-experiencia").value = perfilGuardado.experiencia;
          document.querySelector("#quiz-dificultad").value = perfilGuardado.dificultadPreferida || "Equilibrado";
          document.querySelector("#quiz-tamano-grupo").value = perfilGuardado.tamanoGrupo || "Mediano";
          document.querySelector("#quiz-comentario").value = perfilGuardado.comentario;
          interesesQuiz = perfilGuardado.intereses.slice(); // copio el array (Clase 14)
          renderChipsQuiz();
          irAlPaso(1);
          tarjetaSesion.style.display = "none";
          tarjetaQuiz.style.display = "block";
        });
      } else {
        tarjetaSesion.style.display = "none";
        tarjetaQuiz.style.display = "block";
        renderChipsQuiz();
      }
    }

    function irAlPaso(numeroPaso) {
      pasoActual = numeroPaso;

      document.querySelectorAll(".quiz-paso").forEach(function (paso) {
        paso.classList.remove("quiz-paso--activo");
      });
      document.querySelector('.quiz-paso[data-paso="' + numeroPaso + '"]').classList.add("quiz-paso--activo");

      document.querySelectorAll(".quiz-progreso__punto").forEach(function (punto) {
        const numeroPunto = Number(punto.dataset.punto);
        punto.classList.toggle("quiz-progreso__punto--activo", numeroPunto <= numeroPaso);
      });

      btnAtras.style.display = numeroPaso === 1 ? "none" : "inline-flex";
      btnSiguiente.textContent = numeroPaso === 4 ? "Generar mi perfil" : "Siguiente";
    }

    function renderChipsQuiz() {
      contenedorChipsQuiz.innerHTML = "";

      // forEach anidado (Clase 19-20): recorro cada GRUPO, y adentro
      // de cada grupo recorro sus OPCIONES. Es el mismo forEach que
      // ya usaba, solo que ahora tiene un nivel extra porque los
      // datos están agrupados (Clase 15: array de objetos, cada
      // objeto con un array adentro).
      gruposIntereses.forEach(function (grupo) {
        const titulo = document.createElement("p");
        titulo.className = "quiz-chips__grupo-titulo";
        titulo.textContent = grupo.grupo;
        contenedorChipsQuiz.appendChild(titulo);

        const filaChips = document.createElement("div");
        filaChips.className = "quiz-chips__fila";

        grupo.opciones.forEach(function (interes) {
          const chip = document.createElement("span");
          chip.className = "quiz-chip";
          chip.textContent = interes;
          if (interesesQuiz.includes(interes)) {
            chip.classList.add("quiz-chip--activo");
          }
          chip.addEventListener("click", function () {
            const posicion = interesesQuiz.indexOf(interes);
            if (posicion === -1) {
              interesesQuiz.push(interes);
            } else {
              interesesQuiz.splice(posicion, 1);
            }
            renderChipsQuiz();
          });
          filaChips.appendChild(chip);
        });

        contenedorChipsQuiz.appendChild(filaChips);
      });

      const contador = document.querySelector("#quiz-contador");
      contador.textContent = interesesQuiz.length + " de 3 mínimo seleccionados";
      contador.classList.toggle("quiz-contador--valido", interesesQuiz.length >= 3);
    }

    function validarPasoActual() {
      let esValido = true;
      switch (pasoActual) {
        case 1:
          esValido = document.querySelector("#quiz-nombre").value.trim() !== "" &&
                     document.querySelector("#quiz-edad").value.trim() !== "";
          document.querySelector("#quiz-error-1").classList.toggle("quiz-error--visible", !esValido);
          break;
        case 2:
          const presupuesto = parseInt(document.querySelector("#quiz-presupuesto").value, 10);
          esValido = !isNaN(presupuesto) && presupuesto > 0;
          document.querySelector("#quiz-error-2").classList.toggle("quiz-error--visible", !esValido);
          break;
        case 3:
          esValido = interesesQuiz.length >= 3;
          document.querySelector("#quiz-error-3").classList.toggle("quiz-error--visible", !esValido);
          break;
        default:
          esValido = true;
      }
      return esValido;
    }

    function generarPerfil() {
      const usuarioActual = leerUsuario();
      guardarUsuario({
        nombre: document.querySelector("#quiz-nombre").value.trim(),
        email: usuarioActual ? usuarioActual.email : ""
      });
      guardarPerfil({
        edad: document.querySelector("#quiz-edad").value.trim(),
        presupuesto: parseInt(document.querySelector("#quiz-presupuesto").value, 10),
        experiencia: document.querySelector("#quiz-experiencia").value,
        dificultadPreferida: document.querySelector("#quiz-dificultad").value,
        tamanoGrupo: document.querySelector("#quiz-tamano-grupo").value,
        intereses: interesesQuiz.slice(),
        comentario: document.querySelector("#quiz-comentario").value.trim()
      });
      // CLASE 2 — Acá está el cambio clave: antes esto mandaba a
      // buscar.html. Ahora que el perfil quedó generado, el usuario
      // sale por completo de la landing y cae en inicio.html (la
      // categoría "Inicio" del Card Sorting: Home personalizado,
      // no la landing pública ni el buscador directo).
      window.location.href = "inicio.html";
    }

    btnSiguiente.addEventListener("click", function () {
      if (!validarPasoActual()) return;
      if (pasoActual < 4) {
        irAlPaso(pasoActual + 1);
      } else {
        generarPerfil();
      }
    });
    btnAtras.addEventListener("click", function () {
      if (pasoActual > 1) irAlPaso(pasoActual - 1);
    });

    mostrarResumenONuevoQuiz();
  }
}


/* ================================================================
   8) SOLO EN buscar.html — Task Flow 2, inicio
   Clase 19-20 (filter, sort, submit, input, change, keydown)
   ================================================================ */
const formBusqueda = document.querySelector("#form-busqueda");
if (formBusqueda) {
  const inputDestino = document.querySelector("#input-destino");
  const listaAutocomplete = document.querySelector("#autocomplete-destino");
  const selectFiltro = document.querySelector("#select-filtro");
  const labelFiltro = document.querySelector("#label-filtro");
  const leyendaLogin = document.querySelector("#leyenda-login");
  const gridResultados = document.querySelector("#grid-resultados");
  const btnComparar = document.querySelector("#btn-comparar-seleccion");
  const contadorSeleccion = document.querySelector("#contador-seleccion");

  let seleccionComparar = []; // Clase 14: array — solo vive mientras estás en esta página

  /* --------------------------------------------------------------
     CLASE 12 — El título de la página también cambia según la
     sesión, mismo gate que el badge de % match (haySesion() Y
     perfil guardado): si no hay perfil, invita a loguearse; si ya
     hay perfil, ese mensaje no tiene sentido y se saca por completo
     en vez de mostrarlo igual.
     -------------------------------------------------------------- */
  const tituloBusqueda = document.querySelector("#titulo-busqueda");

  function configurarTituloBusqueda() {
    if (!tituloBusqueda) return;

    if (haySesion() && leerPerfil() !== null) {
      tituloBusqueda.innerHTML =
        "<h2>Encontrá tu match ideal</h2>" +
        "<p>Elegí tu destino, fechas y estilo de viaje, y descubrí las opciones que seleccionamos para vos.</p>" +
        "<p>Como ya tenés tu perfil cargado, vamos a tener en cuenta tus gustos y preferencias para mostrarte el % de compatibilidad de cada viaje y ayudarte a encontrar la opción perfecta para vos.</p>";
    }
    // Si no hay sesión (o hay sesión pero todavía no se completó el
    // quiz de perfil), dejo el HTML que ya está escrito en
    // buscar.html — el que invita a iniciar sesión.
  }

  /* --------------------------------------------------------------
     CLASE 12 — El campo cambia de identidad según la sesión.
     Sin perfil: "Preferencias" (categorías de interés + leyenda
     de enganche). Con perfil: "Ritmo" (el filtro real, ya no hace
     falta convencer a nadie de loguearse) — misma escala de 3
     niveles que ya se usa en el quiz de perfil (Relax total /
     Equilibrado / Full actividades), para no tener dos vocabularios
     distintos para lo mismo.
     -------------------------------------------------------------- */
  const opcionesPreferencia = ["Aventura", "Cultura", "Relax", "Playa", "Gastronomía"];
  const opcionesDificultad = ["Relax total", "Equilibrado", "Full actividades"];

  function configurarCampoFiltro() {
    selectFiltro.innerHTML = '<option value="">Todas</option>';

    if (!haySesion() || leerPerfil() === null) {
      // Modo "Preferencias": sin perfil todavía
      labelFiltro.textContent = "Preferencias";
      opcionesPreferencia.forEach(function (opcion) {
        // "Relax" es la etiqueta linda; internamente filtra por "Bienestar"
        // del catálogo (Clase 14: los valores no tienen que ser idénticos al texto)
        const valorReal = opcion === "Relax" ? "Bienestar" : opcion;
        const option = document.createElement("option");
        option.value = valorReal;
        option.textContent = opcion;
        selectFiltro.appendChild(option);
      });
      selectFiltro.dataset.modo = "preferencia";
      leyendaLogin.style.display = "flex";
    } else {
      // Modo "Ritmo": ya hay perfil, el filtro real vuelve
      labelFiltro.textContent = "Ritmo";
      opcionesDificultad.forEach(function (opcion) {
        const option = document.createElement("option");
        option.value = opcion;
        option.textContent = opcion;
        selectFiltro.appendChild(option);
      });
      selectFiltro.dataset.modo = "dificultad";
      leyendaLogin.style.display = "none";
    }
  }

  /* --------------------------------------------------------------
     CLASE 19-20 (input) + Clase 14 (filter, patrón de filtrado)
     Autocompletado: a partir de la primera letra, sugiere destinos
     únicos del catálogo que empiezan con lo que se está tipeando.
     -------------------------------------------------------------- */
  function destinosUnicos() {
    // Armo la lista de destinos sin repetidos (Clase 14: includes()
    // dentro de un if, patrón de filtrado manual con un array vacío
    // declarado ANTES del bucle).
    const unicos = [];
    for (let i = 0; i < catalogoViajes.length; i++) {
      const d = catalogoViajes[i].destino;
      if (!unicos.includes(d)) {
        unicos.push(d);
      }
    }
    return unicos;
  }

  function mostrarSugerencias() {
    const texto = inputDestino.value.trim().toLowerCase();
    listaAutocomplete.innerHTML = "";

    if (texto === "") {
      listaAutocomplete.classList.remove("autocomplete-lista--abierta");
      return;
    }

    // filter() (Clase 19-20): destinos que empiezan con lo tipeado
    const coincidencias = destinosUnicos().filter(function (destino) {
      return destino.toLowerCase().startsWith(texto);
    });

    if (coincidencias.length === 0) {
      listaAutocomplete.classList.remove("autocomplete-lista--abierta");
      return;
    }

    coincidencias.forEach(function (destino) {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + destino;
      item.addEventListener("click", function () {
        inputDestino.value = destino;
        listaAutocomplete.classList.remove("autocomplete-lista--abierta");
        buscarViajes();
      });
      listaAutocomplete.appendChild(item);
    });

    listaAutocomplete.classList.add("autocomplete-lista--abierta");
  }

  function buscarViajes() {
    // BUG (reportado): al escribir un destino nuevo, la grilla se
    // vuelve a armar de cero pero "seleccionComparar" seguía
    // teniendo los ids marcados de la búsqueda ANTERIOR (ej: tildabas
    // algo con la búsqueda vacía, después buscabas "Croacia", y el
    // botón "Comparar" armaba un link mezclando esos viajes viejos
    // con los nuevos de Croacia). La comparación tiene que ser
    // siempre "del mismo sitio que buscaste", así que cada búsqueda
    // nueva arranca la selección de cero.
    seleccionComparar = [];
    actualizarBarraComparar();

    const destinoBuscado = inputDestino.value.trim().toLowerCase();
    const filtroElegido = selectFiltro.value;
    const modoFiltro = selectFiltro.dataset.modo;

    // filter() (Clase 19-20)
    let resultado = catalogoViajes.filter(function (viaje) {
      const coincideDestino = destinoBuscado === "" || viaje.destino.toLowerCase().includes(destinoBuscado);

      let coincideFiltro = true;
      if (filtroElegido !== "") {
        if (modoFiltro === "dificultad") {
          coincideFiltro = viaje.dificultad === filtroElegido;
        } else {
          // modo "preferencia": el viaje tiene que incluir esa actividad
          coincideFiltro = viaje.actividades.includes(filtroElegido);
        }
      }
      return coincideDestino && coincideFiltro;
    });

    const perfilActual = leerPerfil();
    if (haySesion() && perfilActual !== null) {
      resultado = resultado.map(function (viaje) {
        viaje._match = calcularMatch(viaje, perfilActual);
        return viaje;
      });
      resultado.sort(function (a, b) { return b._match - a._match; }); // sort() (Clase 19-20)
    }

    resultado = resultado.slice(0, 5); // Miller's Law (docx): tope de 4-5 resultados

    gridResultados.innerHTML = "";
    if (resultado.length === 0) {
      gridResultados.innerHTML = '<p class="mensaje-vacio">No encontramos viajes con ese destino. Probá con otro término.</p>';
      return;
    }
    resultado.forEach(function (viaje) { // forEach (Clase 19-20)
      gridResultados.appendChild(crearTarjetaViaje(viaje, { mostrarMatch: true, mostrarFavorito: true, mostrarCheckbox: true }));
    });
  }

  function actualizarBarraComparar() {
    contadorSeleccion.textContent = seleccionComparar.length;
    if (seleccionComparar.length >= 2) {
      btnComparar.removeAttribute("aria-disabled");
      btnComparar.href = "comparar.html?ids=" + seleccionComparar.join(",");
    } else {
      btnComparar.setAttribute("aria-disabled", "true");
      btnComparar.href = "#";
    }
  }

  configurarTituloBusqueda();
  configurarCampoFiltro();

  formBusqueda.addEventListener("submit", function (evento) {
    evento.preventDefault(); // Clase 19-20: sin esto la página recarga
    listaAutocomplete.classList.remove("autocomplete-lista--abierta");
    buscarViajes();
  });
  inputDestino.addEventListener("input", function () {
    mostrarSugerencias();
    buscarViajes(); // buscador en vivo, sigue funcionando igual que antes
  });
  inputDestino.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      evento.preventDefault();
      listaAutocomplete.classList.remove("autocomplete-lista--abierta");
      buscarViajes();
    }
    if (evento.key === "Escape") {
      listaAutocomplete.classList.remove("autocomplete-lista--abierta");
    }
  });
  // Cierro el desplegable si el usuario clickea afuera (Clase 19-20: click)
  document.addEventListener("click", function (evento) {
    if (!evento.target.closest(".campo-form--autocomplete")) {
      listaAutocomplete.classList.remove("autocomplete-lista--abierta");
    }
  });
  selectFiltro.addEventListener("change", buscarViajes);

  btnComparar.addEventListener("click", function (evento) {
    if (seleccionComparar.length < 2) evento.preventDefault();
  });

  mainDePagina.addEventListener("change", function (evento) {
    if (!evento.target.matches("[data-seleccionar]")) return;
    const id = Number(evento.target.dataset.seleccionar);
    const posicion = seleccionComparar.indexOf(id);
    if (posicion === -1) {
      seleccionComparar.push(id);
    } else {
      seleccionComparar.splice(posicion, 1);
    }
    actualizarBarraComparar();
  });
}


/* ================================================================
   9) SOLO EN comparar.html — Task Flow 2, cierre
   Clase 11 (String: split) + Clase 14 (array): leo los ids
   seleccionados desde la URL en vez de un "estado" compartido,
   porque esta es una página nueva que arranca de cero.
   ================================================================ */
const gridComparacion = document.querySelector("#grid-comparacion");
if (gridComparacion) {
  function obtenerIdsDesdeURL() {
    const query = window.location.search; // ej: "?ids=3,7"
    if (query.indexOf("ids=") === -1) return [];
    const despuesDeIds = query.split("ids=")[1]; // Clase 11: split()
    const soloIds = despuesDeIds.split("&")[0]; // por si hay más parámetros después
    const textoIds = soloIds.split(","); // Clase 14: array
    const numeros = [];
    for (let i = 0; i < textoIds.length; i++) {
      numeros.push(parseInt(textoIds[i], 10)); // Clase 12: parseInt
    }
    return numeros;
  }

  /* --------------------------------------------------------------
     BALANCE DETALLADO — "¿Cuál elegís?" (solo con 2 viajes)
     La tarjeta rápida de arriba ya muestra precio/fechas/estilo de
     viaje/actividades, pero deja afuera datos que ayudan a decidir
     entre DOS opciones puntuales: cuánto sale por día, tipo de
     alojamiento y excursiones, la pensión (comidas incluidas), y —
     si hay perfil guardado — qué tanto cubre cada viaje lo que
     pediste en el quiz (intereses, ritmo, grupo, presupuesto).
     Cada fila numérica marca en verde quién gana y cuánta diferencia
     hay; las filas de perfil marcan ✓/✕ si ese viaje cumple lo que
     buscás (Clase 12: comparaciones con if/else).
     -------------------------------------------------------------- */
  function duracionEnDias(viaje) {
    const msPorDia = 1000 * 60 * 60 * 24;
    const desde = new Date(viaje.fechaDesde);
    const hasta = new Date(viaje.fechaHasta);
    return Math.round((hasta - desde) / msPorDia) + 1;
  }

  // La pensión no es un campo propio del catálogo: se infiere del
  // texto libre de "incluye" (Clase 14: indexOf sobre string) para
  // no tener que retocar los 76 viajes a mano.
  function inferirPension(viaje) {
    const texto = viaje.incluye.toLowerCase();
    if (texto.indexOf("todas las comidas") !== -1 || texto.indexOf("todo incluido") !== -1) {
      return "Pensión completa";
    }
    if (texto.indexOf("desayuno") !== -1) {
      return "Solo desayuno";
    }
    if (texto.indexOf("cena") !== -1 || texto.indexOf("almuerzo") !== -1) {
      return "Media pensión";
    }
    return "Sin comidas incluidas";
  }

  function bloqueResenasMini(viaje) {
    return (
      '<details class="comparacion-detallada__resenas-mini">' +
        "<summary>Ver reseñas (" + viaje.reviews + ")</summary>" +
        '<div class="detalle-viaje__resenas-lista">' + generarResenasHTML(viaje) + "</div>" +
      "</details>"
    );
  }

  // Arma UNA fila NUMÉRICA de la comparación (una para cada
  // columna). Si "direccion" es null, la métrica es solo
  // informativa y no se marca ningún ganador (ej: duración, ni
  // "más" ni "menos" es mejor por sí solo). extraA/extraB es HTML
  // opcional que se agrega abajo de todo en cada celda (lo usa la
  // fila de rating para colgar el desplegable de reseñas).
  function filaComparacionDetallada(etiqueta, valorA, valorB, formatear, direccion, extraA, extraB) {
    let ganaA = false;
    let ganaB = false;
    if (direccion === "mayor") {
      ganaA = valorA > valorB;
      ganaB = valorB > valorA;
    } else if (direccion === "menor") {
      ganaA = valorA < valorB;
      ganaB = valorB < valorA;
    }
    const diferencia = Math.abs(valorA - valorB);

    function celda(valor, esGanador, otroValor, extra) {
      let deltaHTML = "";
      if (esGanador && diferencia > 0) {
        const signo = direccion === "menor" ? "-" : "+";
        deltaHTML = '<span class="comparacion-detallada__delta">' + signo + formatear(diferencia) + "</span>";
      }
      return (
        '<div class="comparacion-detallada__metrica">' +
          '<p class="comparacion-detallada__label">' + etiqueta + "</p>" +
          '<p class="comparacion-detallada__valor' + (esGanador ? " comparacion-detallada__valor--gana" : "") + '">' +
            formatear(valor) + deltaHTML +
          "</p>" +
          '<p class="comparacion-detallada__vs">vs ' + formatear(otroValor) + "</p>" +
          (extra || "") +
        "</div>"
      );
    }

    return {
      colA: celda(valorA, ganaA, valorB, extraA),
      colB: celda(valorB, ganaB, valorA, extraB)
    };
  }

  // Arma UNA fila DE TEXTO (no numérica): tipo de excursiones,
  // alojamiento, pensión, y — si se pasa una insignia — si ese
  // viaje cumple o no con lo que pediste en el perfil.
  function filaComparacionInfo(etiqueta, valorA, valorB, insigniaA, insigniaB) {
    function celda(valor, insignia) {
      return (
        '<div class="comparacion-detallada__metrica">' +
          '<p class="comparacion-detallada__label">' + etiqueta + "</p>" +
          '<p class="comparacion-detallada__valor comparacion-detallada__valor--texto">' + valor + "</p>" +
          (insignia || "") +
        "</div>"
      );
    }
    return { colA: celda(valorA, insigniaA), colB: celda(valorB, insigniaB) };
  }

  function insigniaCumple(cumple, textoSi, textoNo) {
    return cumple
      ? '<p class="comparacion-detallada__insignia comparacion-detallada__insignia--ok"><i class="fa-solid fa-check"></i> ' + textoSi + "</p>"
      : '<p class="comparacion-detallada__insignia comparacion-detallada__insignia--no"><i class="fa-solid fa-xmark"></i> ' + textoNo + "</p>";
  }

  function renderComparacionDetallada(viajeA, viajeB) {
    const contenedorDetallada = document.querySelector("#comparacion-detallada");
    if (!contenedorDetallada) return;

    const perfilComparacion = leerPerfil();
    const hayMatch = haySesion() && perfilComparacion !== null;

    let colA = "";
    let colB = "";

    if (hayMatch) {
      const filaMatch = filaComparacionDetallada(
        "Compatibilidad con tu perfil",
        calcularMatch(viajeA, perfilComparacion),
        calcularMatch(viajeB, perfilComparacion),
        function (v) { return v + "%"; },
        "mayor"
      );
      colA += filaMatch.colA;
      colB += filaMatch.colB;
    }

    const filaPrecio = filaComparacionDetallada(
      "Precio total",
      viajeA.precio, viajeB.precio,
      function (v) { return "USD " + Math.round(v).toLocaleString("es-AR"); },
      "menor"
    );
    colA += filaPrecio.colA;
    colB += filaPrecio.colB;

    const filaPrecioDia = filaComparacionDetallada(
      "Precio por día",
      viajeA.precio / duracionEnDias(viajeA), viajeB.precio / duracionEnDias(viajeB),
      function (v) { return "USD " + Math.round(v).toLocaleString("es-AR"); },
      "menor"
    );
    colA += filaPrecioDia.colA;
    colB += filaPrecioDia.colB;

    const filaDuracion = filaComparacionDetallada(
      "Duración del viaje",
      duracionEnDias(viajeA), duracionEnDias(viajeB),
      function (v) { return v + (v === 1 ? " día" : " días"); },
      null
    );
    colA += filaDuracion.colA;
    colB += filaDuracion.colB;

    // Cantidad de reseñas ya NO es su propia fila: queda colgada
    // como "Ver reseñas (N)" adentro de la valoración.
    const filaRating = filaComparacionDetallada(
      "Valoración de viajeros",
      viajeA.rating, viajeB.rating,
      function (v) { return v.toFixed(1); },
      "mayor",
      bloqueResenasMini(viajeA),
      bloqueResenasMini(viajeB)
    );
    colA += filaRating.colA;
    colB += filaRating.colB;

    // --------------------------------------------------------------
    // Según tu perfil — mismos 4 campos que se piden en el quiz
    // (intereses, ritmo, grupo, presupuesto), para ver qué cubre
    // cada viaje y qué no. Solo con sesión + perfil guardado, mismo
    // login-gate que el resto del sitio.
    // --------------------------------------------------------------
    if (hayMatch) {
      colA += '<p class="comparacion-detallada__subtitulo">Según tu perfil</p>';
      colB += '<p class="comparacion-detallada__subtitulo">Según tu perfil</p>';

      const interesesA = perfilComparacion.intereses.filter(function (i) { return viajeA.actividades.includes(i); });
      const interesesB = perfilComparacion.intereses.filter(function (i) { return viajeB.actividades.includes(i); });
      const totalIntereses = perfilComparacion.intereses.length;
      const filaIntereses = filaComparacionDetallada(
        "Intereses que cubre",
        interesesA.length, interesesB.length,
        function (v) { return v + " de " + totalIntereses; },
        "mayor"
      );
      colA += filaIntereses.colA;
      colB += filaIntereses.colB;

      const ritmoPreferido = perfilComparacion.dificultadPreferida || "Equilibrado";
      const filaRitmo = filaComparacionInfo(
        "Ritmo",
        viajeA.dificultad, viajeB.dificultad,
        insigniaCumple(viajeA.dificultad === ritmoPreferido, "Es tu ritmo", "Distinto al tuyo"),
        insigniaCumple(viajeB.dificultad === ritmoPreferido, "Es tu ritmo", "Distinto al tuyo")
      );
      colA += filaRitmo.colA;
      colB += filaRitmo.colB;

      const rangosGrupoComparacion = { "Chico": [0, 8], "Mediano": [9, 14], "Grande": [15, 999] };
      const rangoGrupoPreferido = rangosGrupoComparacion[perfilComparacion.tamanoGrupo || "Mediano"];
      const grupoOkA = viajeA.grupoMin <= rangoGrupoPreferido[1] && viajeA.grupoMax >= rangoGrupoPreferido[0];
      const grupoOkB = viajeB.grupoMin <= rangoGrupoPreferido[1] && viajeB.grupoMax >= rangoGrupoPreferido[0];
      const filaGrupo = filaComparacionInfo(
        "Tamaño de grupo",
        viajeA.grupoMin + "–" + viajeA.grupoMax + " personas", viajeB.grupoMin + "–" + viajeB.grupoMax + " personas",
        insigniaCumple(grupoOkA, "Tu grupo ideal", "Fuera de tu rango"),
        insigniaCumple(grupoOkB, "Tu grupo ideal", "Fuera de tu rango")
      );
      colA += filaGrupo.colA;
      colB += filaGrupo.colB;

      const presupuestoOkA = viajeA.precio <= perfilComparacion.presupuesto;
      const presupuestoOkB = viajeB.precio <= perfilComparacion.presupuesto;
      const filaPresupuesto = filaComparacionInfo(
        "Presupuesto",
        "USD " + viajeA.precio.toLocaleString("es-AR"), "USD " + viajeB.precio.toLocaleString("es-AR"),
        insigniaCumple(presupuestoOkA, "Dentro de tu presupuesto", "Por encima de tu presupuesto"),
        insigniaCumple(presupuestoOkB, "Dentro de tu presupuesto", "Por encima de tu presupuesto")
      );
      colA += filaPresupuesto.colA;
      colB += filaPresupuesto.colB;
    }

    // --------------------------------------------------------------
    // Detalles del viaje — datos del catálogo, sin login-gate.
    // --------------------------------------------------------------
    colA += '<p class="comparacion-detallada__subtitulo">Detalles del viaje</p>';
    colB += '<p class="comparacion-detallada__subtitulo">Detalles del viaje</p>';

    const tagsExcursionesA = viajeA.actividades.map(function (a) { return '<span class="tag-actividad">' + a + "</span>"; }).join("");
    const tagsExcursionesB = viajeB.actividades.map(function (a) { return '<span class="tag-actividad">' + a + "</span>"; }).join("");
    const filaExcursiones = filaComparacionInfo("Tipo de excursiones", tagsExcursionesA, tagsExcursionesB);
    colA += filaExcursiones.colA;
    colB += filaExcursiones.colB;

    const filaAlojamiento = filaComparacionInfo("Tipo de alojamiento", viajeA.alojamiento, viajeB.alojamiento);
    colA += filaAlojamiento.colA;
    colB += filaAlojamiento.colB;

    const filaPension = filaComparacionInfo("Pensión (comidas incluidas)", inferirPension(viajeA), inferirPension(viajeB));
    colA += filaPension.colA;
    colB += filaPension.colB;

    contenedorDetallada.innerHTML =
      '<div class="comparacion-detallada">' +
        "<h3 class=\"comparacion-detallada__titulo\">¿Cuál elegís?</h3>" +
        '<div class="comparacion-detallada__grid">' +
          '<div class="comparacion-detallada__columna">' +
            '<p class="comparacion-detallada__encabezado">' + viajeA.destino + " — " + viajeA.subtitulo + "</p>" +
            colA +
          "</div>" +
          '<div class="comparacion-detallada__columna">' +
            '<p class="comparacion-detallada__encabezado">' + viajeB.destino + " — " + viajeB.subtitulo + "</p>" +
            colB +
          "</div>" +
        "</div>" +
      "</div>";
  }

  const ids = obtenerIdsDesdeURL();
  if (ids.length < 2) {
    gridComparacion.innerHTML = '<p class="mensaje-vacio">Elegí 2 o más viajes desde "Buscar y Match" y tocá "Comparar seleccionados".</p>';
  } else {
    gridComparacion.innerHTML = "";
    ids.forEach(function (id) { // forEach (Clase 19-20)
      const viaje = buscarViajePorId(id);
      if (viaje) {
        gridComparacion.appendChild(crearTarjetaViaje(viaje, { mostrarMatch: true, mostrarFavorito: true, mostrarCheckbox: false }));
      }
    });

    // El balance detallado ("¿Cuál elegís?") solo tiene sentido
    // cuando se está comparando UN viaje contra OTRO. Con 3 o más
    // seleccionados, se queda solo con la comparación rápida de
    // arriba (mismo criterio de "no perder claridad" del Task Flow 2).
    if (ids.length === 2) {
      const viajeA = buscarViajePorId(ids[0]);
      const viajeB = buscarViajePorId(ids[1]);
      if (viajeA && viajeB) {
        renderComparacionDetallada(viajeA, viajeB);
      }
    }
  }
}


/* ================================================================
   9-B) SOLO EN detalle.html — "Ver más" de cada tarjeta
   Misma idea que comparar.html (página propia, id por URL), pero
   para UN solo viaje con más desarrollo: galería de fotos de
   referencia + los mismos "dato-chip"/"tag-actividad" que ya usa
   la tarjeta rápida (Clase 18: reutilizar clases en vez de
   inventar un layout nuevo, así la info queda igual de
   estandarizada que en la búsqueda y la comparación).
   ================================================================ */
const contenedorDetalle = document.querySelector("#detalle-viaje");
if (contenedorDetalle) {
  // Pool de fotos ya usadas en el catálogo (Clase 14: array). No hay
  // una foto de referencia distinta por cada uno de los 76 viajes,
  // así que la galería arma "foto principal + 2 más del mismo pool"
  // en vez de dejar la página con una sola imagen chica.
  const poolImagenesDetalle = [
    "https://images.unsplash.com/photo-1672841828459-bc913fdcd995?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1715356758153-6d58ae44e8fe?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1638069790489-b5b7dbeef2b0?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1509883488717-779cd2d85976?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1465513527097-544020a68b06?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1725470169646-9b6d8e182b00?w=600&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1522547902298-51566e4fb383?w=600&h=400&fit=crop&auto=format"
  ];

  function obtenerIdDetalleDesdeURL() {
    const query = window.location.search; // ej: "?id=9"
    if (query.indexOf("id=") === -1) return null;
    const despuesDeId = query.split("id=")[1]; // Clase 11: split()
    const soloId = despuesDeId.split("&")[0];
    return parseInt(soloId, 10);
  }

  const idDetalle = obtenerIdDetalleDesdeURL();
  const viajeDetalle = idDetalle !== null ? buscarViajePorId(idDetalle) : null;

  if (!viajeDetalle) {
    contenedorDetalle.innerHTML = '<p class="mensaje-vacio">No encontramos ese viaje. <a href="buscar.html" style="color:white;text-decoration:underline;">Volver a buscar</a>.</p>';
  } else {
    document.title = viajeDetalle.destino + " — " + viajeDetalle.subtitulo + " · TripMatch";

    const perfilDetalle = leerPerfil();
    let matchDetalleHTML = "";
    if (haySesion() && perfilDetalle !== null) {
      const match = calcularMatch(viajeDetalle, perfilDetalle);
      matchDetalleHTML = '<span class="badge-match">' + match + "% match</span>";
    } else {
      matchDetalleHTML = '<a href="login.html" class="badge-match badge-match--bloqueado"><i class="fa-solid fa-lock"></i> Ver % match</a>';
    }

    const favoritosDetalle = leerFavoritos();
    const esFavoritoDetalle = favoritosDetalle.includes(viajeDetalle.id);

    // filter() (Clase 19-20) para no repetir la foto principal entre
    // las miniaturas
    const miniaturas = poolImagenesDetalle
      .filter(function (url) { return url !== viajeDetalle.imagen; })
      .slice(0, 2);

    // Cada actividad es un <details> individual (Clase 18: reutilizo
    // el mismo mecanismo nativo que ya uso para las reseñas) — al
    // tocarla se despliega qué ofrece ESA excursión en particular,
    // en vez de quedarse en el nombre genérico del tag.
    const tagsActividadesDetalle = viajeDetalle.actividades
      .map(function (a, indice) {
        return (
          '<details class="actividad-detalle">' +
            '<summary class="tag-actividad">' + a + "</summary>" +
            '<p class="actividad-detalle__texto">' + obtenerDescripcionActividad(viajeDetalle, a, indice) + "</p>" +
          "</details>"
        );
      })
      .join("");

    const resenasHTML = generarResenasHTML(viajeDetalle);

    contenedorDetalle.innerHTML =
      '<div class="detalle-viaje">' +
        '<div class="detalle-viaje__galeria">' +
          '<div class="detalle-viaje__imagen-principal">' +
            '<img src="' + viajeDetalle.imagen + '" alt="' + viajeDetalle.destino + '">' +
            matchDetalleHTML +
            '<span class="btn-favorito ' + (esFavoritoDetalle ? "btn-favorito--activo" : "") + '" data-favorito="' + viajeDetalle.id + '"><i class="fa-solid fa-heart"></i></span>' +
          "</div>" +
          '<div class="detalle-viaje__miniaturas">' +
            '<img src="' + miniaturas[0] + '" alt="' + viajeDetalle.destino + ' - foto de referencia 2">' +
            '<img src="' + miniaturas[1] + '" alt="' + viajeDetalle.destino + ' - foto de referencia 3">' +
          "</div>" +
        "</div>" +
        '<div class="detalle-viaje__info">' +
          '<span class="eyebrow eyebrow--naranja">' + viajeDetalle.badge + "</span>" +
          "<h2>" + viajeDetalle.destino + "</h2>" +
          '<p class="detalle-viaje__subtitulo">' + viajeDetalle.subtitulo + "</p>" +
          '<div class="tarjeta-viaje__rating" style="margin:10px 0 22px;"><i class="fa-solid fa-star"></i> <b>' + viajeDetalle.rating + "</b> <span>(" + viajeDetalle.reviews + " reseñas)</span></div>" +
          '<div class="tarjeta-viaje__grilla-datos">' +
            '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Precio</p><p class="dato-chip__valor dato-chip__valor--verde">USD ' + viajeDetalle.precio.toLocaleString("es-AR") + "</p></div>" +
            '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Fechas</p><p class="dato-chip__valor">' + formatearFecha(viajeDetalle.fechaDesde) + " – " + formatearFecha(viajeDetalle.fechaHasta) + "</p></div>" +
            '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Estilo de viaje</p><p class="dato-chip__valor">' + viajeDetalle.dificultad + "</p></div>" +
            '<div class="dato-chip dato-chip--grande"><p class="dato-chip__label">Grupo</p><p class="dato-chip__valor">' + viajeDetalle.grupoMin + "–" + viajeDetalle.grupoMax + " personas</p></div>" +
            '<div class="dato-chip dato-chip--ancho"><p class="dato-chip__label">Alojamiento</p><p class="dato-chip__valor">' + viajeDetalle.alojamiento + "</p></div>" +
          "</div>" +
          '<div class="dato-chip dato-chip--ancho"><p class="dato-chip__label">Actividades (tocá cada una para ver el detalle)</p><div class="fila-flex fila-flex--wrap" style="margin-top:6px;">' + tagsActividadesDetalle + "</div></div>" +
          '<div class="dato-chip dato-chip--ancho"><p class="dato-chip__label">Qué incluye</p><p class="dato-chip__valor">' + viajeDetalle.incluye + "</p></div>" +
        "</div>" +
      "</div>" +
      '<details class="detalle-viaje__resenas">' +
        "<summary>Ver las " + viajeDetalle.reviews + " reseñas de este viaje</summary>" +
        '<div class="detalle-viaje__resenas-lista">' + resenasHTML + "</div>" +
      "</details>";
  }
}


/* ================================================================
   10) SOLO EN guardados.html
   ================================================================ */
const gridGuardados = document.querySelector("#grid-guardados");
if (gridGuardados) {
  if (!haySesion()) {
    // No hay sesión: invito a loguearse en vez de mostrar la grilla
    // vacía (Clase 18: innerHTML sobre el contenedor completo).
    document.querySelector("#contenido-guardados").innerHTML =
      '<div class="aviso-login">' +
        "<h3>Iniciá sesión para ver tus guardados</h3>" +
        "<p>Los favoritos y reservados están atados a tu perfil.</p>" +
        '<a href="login.html" class="btn-cta">Iniciar sesión</a>' +
      "</div>";
  } else {
    let subTabActual = "favoritos";

    function renderGuardados() {
      gridGuardados.innerHTML = "";

      if (subTabActual === "reservados") {
        gridGuardados.innerHTML = '<p class="aviso-alcance">Todavía no hay viajes reservados. Reservar y pagar quedó explícitamente fuera del alcance de este MVP (ver docx, sección 2.2 y tabla MoSCoW).</p>';
        return;
      }

      const favoritos = leerFavoritos();
      if (favoritos.length === 0) {
        gridGuardados.innerHTML = '<p class="aviso-alcance">Todavía no guardaste ningún viaje como favorito. Andá a <a href="buscar.html" style="color:white;text-decoration:underline;">Buscar y Match</a> y tocá el corazón en cualquier tarjeta.</p>';
        return;
      }

      favoritos.forEach(function (id) { // forEach (Clase 19-20)
        const viaje = buscarViajePorId(id);
        if (viaje) {
          gridGuardados.appendChild(crearTarjetaViaje(viaje, { mostrarMatch: true, mostrarFavorito: true, mostrarCheckbox: false }));
        }
      });
    }

    document.querySelectorAll(".sub-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        subTabActual = tab.dataset.subtab;
        document.querySelectorAll(".sub-tab").forEach(function (t) {
          t.classList.toggle("sub-tab--activo", t === tab);
        });
        renderGuardados();
      });
    });

    // Si sacás un favorito desde ESTA página, la tarjeta tiene que
    // desaparecer al toque (no alcanza con solo apagar el corazón).
    alTogglearFavorito = renderGuardados;

    renderGuardados();
  }
}


/* ================================================================
   11) SOLO EN inicio.html — "Inicio" del Card Sorting
   (docx sección 1 y 3: Home personalizado post-login,
   "descubrimiento pasivo, recomendados")
   ================================================================ */
const gridRecomendados = document.querySelector("#grid-recomendados");
if (gridRecomendados) {
  // Guard: sin sesión no hay perfil, y sin perfil no hay nada que
  // "recomendar" — mismo patrón que perfil.html y guardados.html.
  if (!haySesion()) {
    window.location.href = "login.html";
  } else {
    const usuario = leerUsuario();
    const perfil = leerPerfil();

    document.querySelector("#saludo-inicio").textContent = "¡Hola, " + usuario.nombre + "!";

    if (perfil === null) {
      // Se logueó pero todavía no completó el quiz (caso raro, pero
      // cubierto): lo mando a terminarlo antes de recomendarle nada.
      window.location.href = "perfil.html";
    } else {
      // map() + sort() (Clase 19-20): calculo el % de cada viaje del
      // catálogo y me quedo con los 4 mejores para "Recomendados".
      const recomendados = catalogoViajes
        .map(function (viaje) {
          viaje._match = calcularMatch(viaje, perfil);
          return viaje;
        })
        .sort(function (a, b) { return b._match - a._match; })
        .slice(0, 4);

      recomendados.forEach(function (viaje) { // forEach (Clase 19-20)
        gridRecomendados.appendChild(crearTarjetaViaje(viaje, {
          mostrarMatch: true,
          mostrarFavorito: true,
          mostrarCheckbox: false
        }));
      });
    }
  }
}


/* ================================================================
   PRÓXIMOS PASOS — SUGERENCIAS (no vistas en clase todavía)
   ================================================================
   1) Esta versión ya usa localStorage (ver bloque 0, arriba del
      todo) porque pasar a multi-página lo hizo indispensable — sin
      eso, cada página "olvidaría" quién sos. Lo separé bien
      comentado y aparte de la lógica de clase.

   2) fetch() + un archivo JSON separado: en vez de tener el
      "catalogoViajes" escrito a mano acá arriba, se podría traer
      desde un archivo catalogo.json con fetch().

   3) Historial de búsquedas (MoSCoW ítem 10, "Could"): guardaría
      cada búsqueda en localStorage y la mostraría en perfil.html.

   4) Git/GitHub (Clase 10): el proyecto ya está en condiciones de
      subirse con git init / git add . / git commit -m "..." y
      publicarse gratis con GitHub Pages.
   ================================================================ */
