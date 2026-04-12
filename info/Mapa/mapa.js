// =====================
// 📊 DATOS
// =====================
const datos = {
  "Amacuzac": { alcalde: "Noé Reynoso Nava", poblacion: "17,438" },
  "Atlatlahucan": { alcalde: "Agustín Toledano Amaro", poblacion: "18,556" },
  "Axochiapan": { alcalde: "Marco Antonio Cuate Romero", poblacion: "36,524" },
  "Ayala": { alcalde: "Nayeli Guadalupe Mares Mérida", poblacion: "79,333" },
  "Coatlán del Río": { alcalde: "Luis Armando Jaime Maldonado", poblacion: "9,430" },
  "Cuernavaca": { alcalde: "José Luis Urióstegui Salgado", poblacion: "366,321" },
  "Cuautla": { alcalde: "Jesús Damián Corona Damián", poblacion: "175,207" },
  "Emiliano Zapata": { alcalde: "Santos Tavares García", poblacion: "73,873" },
  "Huitzilac": { alcalde: "César Dávila Díaz", poblacion: "19,572" },
  "Hueyapan": { alcalde: "Concejo municipal", poblacion: "9,855" },
  "Jantetelco": { alcalde: "Ángel Augusto Domínguez Sánchez", poblacion: "17,624" },
  "Jiutepec": { alcalde: "Éder Rodríguez Casillas", poblacion: "196,953" },
  "Jojutla": { alcalde: "Alan Martínez García", poblacion: "53,613" },
  "Jonacatepec de Leandro Valle": { alcalde: "Israel Andrade Zavala", poblacion: "17,912" },
  "Mazatepec": { alcalde: "Gilberto Orihuela Bustos", poblacion: "13,563" },
  "Miacatlán": { alcalde: "Francisco León y Vélez Rivera", poblacion: "27,851" },
  "Ocuituco": { alcalde: "René Jacobo Reynoso", poblacion: "16,734" },
  "Puente de Ixtla": { alcalde: "Claudia Mazari Torres", poblacion: "66,569" },
  "Temixco": { alcalde: "Israel Piña Labra", poblacion: "109,064" },
  "Temoac": { alcalde: "Valentín Lavín Romero", poblacion: "13,187" },
  "Tepalcingo": { alcalde: "Pendiente", poblacion: "22,148" },
  "Tepoztlán": { alcalde: "Perseo Quiroz Rendón", poblacion: "44,883" },
  "Tetecala": { alcalde: "Rosbelia Benítez Bello", poblacion: "8,165" },
  "Tetela del Volcán": { alcalde: "Esaud Mendoza Vázquez", poblacion: "18,617" },
  "Tlalnepantla": { alcalde: "Jorge Genaro Rubio", poblacion: "6,272" },
  "Tlaltizapán": { alcalde: "Nancy Gómez Flores", poblacion: "47,606" },
  "Tlaquiltenango": { alcalde: "Enrique Alonso Plascencia", poblacion: "31,111" },
  "Tlayacapan": { alcalde: "Pedro Antonio Montenegro", poblacion: "18,768" },
  "Totolapan": { alcalde: "Alejandro Alfaro González", poblacion: "12,278" },
  "Xochitepec": { alcalde: "Gonzalo Flores Zúñiga", poblacion: "80,029" },
  "Yautepec": { alcalde: "Agustín Alonso Mendoza", poblacion: "100,161" },
  "Yecapixtla": { alcalde: "Heladio Rafael Sánchez Zavala", poblacion: "37,893" },
  "Zacatepec": { alcalde: "José Luis Maya Torres", poblacion: "37,519" },
  "Zacualpan de Amilpas": { alcalde: "Marino Santibáñez Alonso", poblacion: "9,168" },
  "Coatetelco": { alcalde: "Norberto Zamorano Ortega", poblacion: "9,672" },
  "Xoxocotla": { alcalde: "José Carlos Jiménez Ponciano", poblacion: "21,074" },
  "Tlaltizapán de Zapata": { alcalde: "Gabriel Moreno Bruno", poblacion: "10,779" },
};

// =====================
// 🎯 VARIABLES
// =====================
let visitados = new Set();
let score = 0;
let seleccionado = null;

// 🎮 JUEGO
let municipios = [];
let municipioObjetivo = null;

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

svg.attr('viewBox', `0 0 ${ancho} ${alto}`)
   .attr('preserveAspectRatio', 'xMidYMid meet');

// =====================
// 🌎 CARGAR MAPA
// =====================
d3.json('17mun.json').then(geojson => {

  municipios = geojson.features; // 👈 para el juego
  nuevoReto(); // 👈 iniciar juego

  const proyeccion = d3.geoIdentity()
                       .reflectY(true)
                       .fitSize([ancho, alto], geojson);

  const trazador = d3.geoPath().projection(proyeccion);

  svg.selectAll('path.municipio')
    .data(geojson.features)
    .join('path')
    .attr('class', 'municipio')
    .attr('d', trazador)

    .on('mousemove', (event, d) => {
      tooltip.textContent = getNombre(d);
      tooltip.style.opacity = '1';
      tooltip.style.left = (event.clientX + 10) + 'px';
      tooltip.style.top  = (event.clientY - 20) + 'px';
    })

    .on('mouseleave', () => {
      tooltip.style.opacity = '0';
    })

    .on('click', (event, d) => {
      const nombre = getNombre(d);
      alHacerClic(nombre);
    });

  svg.selectAll('text.muni-label')
    .data(geojson.features)
    .join('text')
    .attr('class', 'muni-label')
    .attr('x', d => trazador.centroid(d)[0])
    .attr('y', d => trazador.centroid(d)[1])
    .text(d => getNombre(d));
});

// =====================
// 🧠 FUNCIONES
// =====================
function getNombre(feature) {
  return feature.properties.NOM_MUN
      || feature.properties.NOMGEO
      || feature.properties.NAME
      || feature.properties.name
      || 'Municipio';
}

// 🎮 NUEVO RETO
function nuevoReto() {
  if (municipios.length === 0) return;

  const random = Math.floor(Math.random() * municipios.length);
  municipioObjetivo = municipios[random];

  document.getElementById("reto").innerText =
    "🎯 Encuentra: " + getNombre(municipioObjetivo);
}

// 🖱️ CLICK
function alHacerClic(nombre) {

  // 🎮 VALIDAR JUEGO
  if (municipioObjetivo) {
    if (nombre === getNombre(municipioObjetivo)) {
      document.getElementById("reto").innerText = "✅ Correcto!";
    } else {
      document.getElementById("reto").innerText =
        "❌ Era: " + getNombre(municipioObjetivo);
    }

    setTimeout(nuevoReto, 1500);
  }

  // SELECCIÓN VISUAL
  if (seleccionado) {
    d3.selectAll('path.municipio')
      .filter(d => getNombre(d) === seleccionado)
      .classed('seleccionado', false);
  }

  seleccionado = nombre;

  d3.selectAll('path.municipio')
    .filter(d => getNombre(d) === nombre)
    .classed('seleccionado', true)
    .classed('visitado', true);

  // SCORE
  if (!visitados.has(nombre)) {
    visitados.add(nombre);
    score++;
    document.getElementById('score').textContent = score;
    agregarVisitado(nombre);
  }

  mostrarInfo(nombre);
}

// 📋 INFO
function mostrarInfo(nombre) {
  const d = datos[nombre];
  const panel = document.getElementById('info-panel');

  if (d) {
    panel.innerHTML = `
      <div class="muni-titulo">${nombre}</div>

      <div class="dato">
        <span class="dato-label">👤 Presidente municipal</span>
        <span class="dato-valor">${d.alcalde}</span>
      </div>

      <div class="dato">
        <span class="dato-label">👥 Habitantes</span>
        <span class="dato-valor">${d.poblacion}</span>
      </div>
    `;
  } else {
    panel.innerHTML = `
      <div class="muni-titulo">${nombre}</div>
      <p>Sin datos registrados</p>
    `;
  }
}

// 📌 LISTA
function agregarVisitado(nombre) {
  const lista = document.getElementById('visitados-lista');
  const vacio = lista.querySelector('.vacio-msg');
  if (vacio) vacio.remove();

  const item = document.createElement('div');
  item.className = 'visitado-item';
  item.textContent = nombre;
  lista.appendChild(item);
}