// =====================
// 📊 DATOS
// =====================
const datos = {
  "Amacuzac": { alcalde: "Noé Reynoso Nava", poblacion: "17,438", conocido: "Balnearios y aguas termales" },
  "Atlatlahucan": { alcalde: "Agustín Toledano Amaro", poblacion: "18,556", conocido: "Ex convento de Santo Domingo" },
  "Axochiapan": { alcalde: "Marco Antonio Cuate Romero", poblacion: "36,524", conocido: "Zona arqueológica de Chalcatzingo" },
  "Ayala": { alcalde: "Nayeli Guadalupe Mares Mérida", poblacion: "79,333", conocido: "Ingenio azucarero y caña de azúcar" },
  "Coatlán del Río": { alcalde: "Luis Armando Jaime Maldonado", poblacion: "9,430", conocido: "Río Coatlán y paisaje natural" },
  "Cuernavaca": { alcalde: "José Luis Urióstegui Salgado", poblacion: "366,321", conocido: "Palacio de Cortés y Jardín Borda" },
  "Cuautla": { alcalde: "Jesús Damián Corona Damián", poblacion: "175,207", conocido: "Museo Casa de Morelos y aguas termales" },
  "Emiliano Zapata": { alcalde: "Santos Tavares García", poblacion: "73,873", conocido: "Hacienda de Temixco" },
  "Huitzilac": { alcalde: "César Dávila Díaz", poblacion: "19,572", conocido: "Lagunas de Zempoala" },
  "Hueyapan": { alcalde: "Concejo municipal", poblacion: "9,855", conocido: "Faldas del volcán Popocatépetl" },
  "Jantetelco": { alcalde: "Ángel Augusto Domínguez Sánchez", poblacion: "17,624", conocido: "Acceso a Chalcatzingo" },
  "Jiutepec": { alcalde: "Éder Rodríguez Casillas", poblacion: "196,953", conocido: "Ciudad Industrial" },
  "Jojutla": { alcalde: "Alan Martínez García", poblacion: "53,613", conocido: "Isla de Jiquilpan" },
  "Jonacatepec de Leandro Valle": { alcalde: "Israel Andrade Zavala", poblacion: "17,912", conocido: "Ex convento de San Mateo" },
  "Mazatepec": { alcalde: "Gilberto Orihuela Bustos", poblacion: "13,563", conocido: "Cerro de Mazatepec" },
  "Miacatlán": { alcalde: "Francisco León y Vélez Rivera", poblacion: "27,851", conocido: "Ex hacienda de Miacatlán" },
  "Ocuituco": { alcalde: "René Jacobo Reynoso", poblacion: "16,734", conocido: "Ex convento de Santiago Apóstol" },
  "Puente de Ixtla": { alcalde: "Claudia Mazari Torres", poblacion: "66,569", conocido: "Balneario Los Arcos" },
  "Temixco": { alcalde: "Israel Piña Labra", poblacion: "109,064", conocido: "Parque acuático" },
  "Temoac": { alcalde: "Valentín Lavín Romero", poblacion: "13,187", conocido: "Vista al Popocatépetl" },
  "Tepalcingo": { alcalde: "Pendiente", poblacion: "22,148", conocido: "Santuario del Señor de Tepalcingo" },
  "Tepoztlán": { alcalde: "Perseo Quiroz Rendón", poblacion: "44,883", conocido: "Pirámide en un cerro (Tepozteco)" },
  "Tetecala": { alcalde: "Rosbelia Benítez Bello", poblacion: "8,165", conocido: "Pueblo mágico colonial" },
  "Tetela del Volcán": { alcalde: "Esaud Mendoza Vázquez", poblacion: "18,617", conocido: "Vistas al Popocatépetl" },
  "Tlalnepantla": { alcalde: "Jorge Genaro Rubio", poblacion: "6,272", conocido: "Zona de grutas" },
  "Tlaltizapán": { alcalde: "Nancy Gómez Flores", poblacion: "47,606", conocido: "Hacienda histórica" },
  "Tlaquiltenango": { alcalde: "Enrique Alonso Plascencia", poblacion: "31,111", conocido: "Reserva Sierra de Huautla" },
  "Tlayacapan": { alcalde: "Pedro Antonio Montenegro", poblacion: "18,768", conocido: "Pueblo mágico y ex convento" },
  "Totolapan": { alcalde: "Alejandro Alfaro González", poblacion: "12,278", conocido: "Ex convento" },
  "Xochitepec": { alcalde: "Gonzalo Flores Zúñiga", poblacion: "80,029", conocido: "Parque ecológico El Texcal" },
  "Yautepec": { alcalde: "Agustín Alonso Mendoza", poblacion: "100,161", conocido: "Casa de Emiliano Zapata" },
  "Yecapixtla": { alcalde: "Heladio Rafael Sánchez Zavala", poblacion: "37,893", conocido: "Ex convento" },
  "Zacatepec": { alcalde: "José Luis Maya Torres", poblacion: "37,519", conocido: "Ingenio azucarero" },
  "Zacualpan de Amilpas": { alcalde: "Marino Santibáñez Alonso", poblacion: "9,168", conocido: "Ex convento dominico" },
  "Coatetelco": { alcalde: "Norberto Zamorano Ortega", poblacion: "9,672", conocido: "Laguna de Coatetelco" },
  "Xoxocotla": { alcalde: "José Carlos Jiménez Ponciano", poblacion: "21,074", conocido: "Cultura indígena náhuatl" }
};

// =====================
// 🎯 VARIABLES
// =====================
let preguntas = [];
let preguntaActual = 0;
let aciertos = 0;
let totalPreguntas = 10;
let juegoTerminado = false;

// =====================
// 💬 TOOLTIP
// =====================
const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
document.body.appendChild(tooltip);

// =====================
// 📐 SVG
// =====================
const contenedor = document.getElementById('map-container');
const svg = d3.select('#mapa-svg');

const ancho = contenedor.clientWidth - 48;
const alto = contenedor.clientHeight - 48;

svg.attr('viewBox', `0 0 ${ancho} ${alto}`);

// =====================
// 🌎 CARGAR MAPA
// =====================
d3.json('17mun.json').then(geojson => {

  generarPreguntas();
  nuevoReto();

  const proyeccion = d3.geoIdentity().reflectY(true).fitSize([ancho, alto], geojson);
  const trazador = d3.geoPath().projection(proyeccion);

  svg.selectAll('path')
    .data(geojson.features)
    .join('path')
    .attr('class', 'municipio')
    .attr('d', trazador)

    .on('mousemove', (event, d) => {
      tooltip.textContent = getNombre(d);
      tooltip.style.opacity = '1';
      tooltip.style.left = event.clientX + 'px';
      tooltip.style.top = event.clientY + 'px';
    })

    .on('mouseleave', () => tooltip.style.opacity = '0')

    .on('click', (event, d) => {
      alHacerClic(getNombre(d));
    });
});

// =====================
// 🧠 FUNCIONES
// =====================
function getNombre(feature) {
  return feature.properties.NOM_MUN || feature.properties.NOMGEO;
}

// GENERAR PREGUNTAS
function generarPreguntas() {
  const keys = Object.keys(datos);

  while (preguntas.length < totalPreguntas) {
    const random = keys[Math.floor(Math.random() * keys.length)];
    if (!preguntas.find(p => p.nombre === random)) {
      preguntas.push({ nombre: random, pista: datos[random].conocido });
    }
  }
}

// MOSTRAR PREGUNTA
function nuevoReto() {
  if (preguntaActual >= totalPreguntas) {
    terminarJuego();
    return;
  }

  const p = preguntas[preguntaActual];
  document.getElementById("reto").innerText =
    `❓ ¿Qué municipio es conocido por: ${p.pista}?`;
}

// CLICK
function alHacerClic(nombre) {

  if (juegoTerminado) return;

  const p = preguntas[preguntaActual];

  if (nombre === p.nombre) {
    aciertos++;
    document.getElementById("reto").innerText = "✅ Correcto!";
  } else {
    document.getElementById("reto").innerText = `❌ Era: ${p.nombre}`;
  }

  preguntaActual++;

  setTimeout(nuevoReto, 1200);

  mostrarInfo(nombre);
}

// RESULTADO FINAL
function terminarJuego() {
  juegoTerminado = true;

  document.getElementById("reto").innerText =
    `📊 Terminaste\nAciertos: ${aciertos} de ${totalPreguntas}`;
}

// INFO
function mostrarInfo(nombre) {
  const d = datos[nombre];
  const panel = document.getElementById('info-panel');

  if (d) {
    panel.innerHTML = `
      <div class="muni-titulo">${nombre}</div>
      <div class="dato"><b>👤 Presidente:</b> ${d.alcalde}</div>
      <div class="dato"><b>👥 Habitantes:</b> ${d.poblacion}</div>
    `;
  }
}