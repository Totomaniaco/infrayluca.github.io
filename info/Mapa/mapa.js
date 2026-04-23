// ================= DATOS =================
const datos = {
  "Tepoztlán": { 
    alcalde: "Perseo Quiroz", 
    poblacion: "44,883", 
    pregunta: "Pirámide en un cerro", 
    conocido: "Tepozteco" 
  },

  "Coatetelco": { 
    alcalde: "Norberto Zamorano", 
    poblacion: "9,672", 
    pregunta: "Municipio con una laguna famosa", 
    conocido: "Laguna de Coatetelco" 
  },

  "Cuernavaca": { 
    alcalde: "José Urióstegui", 
    poblacion: "366,321", 
    pregunta: "La eterna primavera", 
    conocido: "Palacio de Cortés" 
  },

  "Jiutepec": { 
    alcalde: "Éder Rodríguez", 
    poblacion: "196,953", 
    pregunta: "Zona industrial importante", 
    conocido: "CIVAC" 
  },

  "Temixco": { 
    alcalde: "Israel Piña", 
    poblacion: "109,064", 
    pregunta: "Municipio con parque acuático", 
    conocido: "Parque acuático Ex Hacienda de Temixco" 
  },

  "Yautepec": { 
    alcalde: "Agustín Alonso", 
    poblacion: "100,161", 
    pregunta: "Lugar donde nació Emiliano Zapata", 
    conocido: "Anenecuilco" 
  },

  "Xochitepec": { 
    alcalde: "Gonzalo Flores", 
    poblacion: "80,029", 
    pregunta: "Municipio con parque ecológico", 
    conocido: "El Texcal" 
  },

  "Jojutla": { 
    alcalde: "Alan Martínez", 
    poblacion: "53,613", 
    pregunta: "Municipio con isla turística", 
    conocido: "Isla de Jiquilpan" 
  },

  "Tlayacapan": { 
    alcalde: "Pedro Montenegro", 
    poblacion: "18,768", 
    pregunta: "Pueblo mágico con convento", 
    conocido: "Ex convento agustino" 
  },

  "Yecapixtla": { 
    alcalde: "Heladio Sánchez", 
    poblacion: "37,893", 
    pregunta: "Municipio famoso por su convento", 
    conocido: "San Juan Bautista" 
  }
};

// Al crear el SVG o al cargarlo, agrega/verifica estos atributos:
mapaSVG.setAttribute('viewBox', '0 0 800 600');  // o el tamaño de tu mapa
mapaSVG.setAttribute('preserveAspectRatio', 'xMidYMid meet');
mapaSVG.style.width = '100%';
mapaSVG.style.height = '100%';

// ================= VARIABLES =================
let preguntas = [];
let preguntaActual = 0;
let aciertos = 0;
let totalPreguntas = 10;
let juegoTerminado = false;

const svg = d3.select("#mapa-svg");

// ================= MAPA =================
d3.json("17mun.json").then(data => {

  const projection = d3.geoIdentity().reflectY(true).fitSize([800, 600], data);
  const path = d3.geoPath().projection(projection);

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", "municipio")
    .attr("d", path)
    .on("click", (event, d) => {
      alHacerClic(getNombre(d));
    });

  // NOMBRES
  svg.selectAll("text")
    .data(data.features)
    .enter()
    .append("text")
    .attr("class", "muni-label")
    .attr("x", d => path.centroid(d)[0])
    .attr("y", d => path.centroid(d)[1])
    .text(d => getNombre(d));

  reiniciarJuego();
});

// ================= FUNCIONES =================
function getNombre(d) {
  return d.properties.NOM_MUN || d.properties.NOMGEO;
}

// GENERAR PREGUNTAS
function generarPreguntas() {
  preguntas = [];
  const keys = Object.keys(datos);

  while (preguntas.length < totalPreguntas) {
    const r = keys[Math.floor(Math.random() * keys.length)];
    if (!preguntas.includes(r)) preguntas.push(r);
  }
}

// NUEVO RETO (PREGUNTA + PISTA)
function nuevoReto() {

  if (preguntaActual >= totalPreguntas) {
    terminarJuego();
    return;
  }

  const nombre = preguntas[preguntaActual];

  document.getElementById("reto").innerHTML =
    `❓ ¿Qué municipio es conocido por: ${datos[nombre].pregunta}?<br>
     💡 Pista: ${datos[nombre].conocido}`;
}

// CLICK
function alHacerClic(nombre) {

  if (juegoTerminado) return;

  const correcto = preguntas[preguntaActual];

  if (nombre === correcto) {

    aciertos++;

    document.getElementById("reto").innerText = "✅ Correcto";

    d3.selectAll("path")
      .filter(d => getNombre(d) === nombre)
      .classed("correcto", true);

  } else {

    document.getElementById("reto").innerText =
      `❌ Era: ${correcto}`;
  }

  preguntaActual++;

  setTimeout(nuevoReto, 1200);

  mostrarInfo(nombre);
}

// RESULTADO
function terminarJuego() {
  juegoTerminado = true;

  document.getElementById("reto").innerText =
    `📊 Terminaste\nAciertos: ${aciertos} de ${totalPreguntas}`;
}

// REINICIAR
function reiniciarJuego() {
  preguntaActual = 0;
  aciertos = 0;
  juegoTerminado = false;

  d3.selectAll("path").classed("correcto", false);

  generarPreguntas();
  nuevoReto();
}

// INFO
function mostrarInfo(nombre) {
  const d = datos[nombre];
  const panel = document.getElementById("info-panel");

  if (d) {
    panel.innerHTML = `
      <h3>${nombre}</h3>
      <p>👤 ${d.alcalde}</p>
      <p>👥 ${d.poblacion}</p>
    `;
  }
}