
const datos = {
  "Amacuzac":             { alcalde: "Noé Reynoso Nava", poblacion: "17,438",  conocido: "Balnearios y aguas termales" },
  "Atlatlahucan":         { alcalde: "Agustín Toledano Amaro", poblacion: "18,556",  conocido: "Ex convento de Santo Domingo" },
  "Axochiapan":           { alcalde: "Marco Antonio Cuate Romero", poblacion: "36,524",  conocido: "Zona arqueológica de Chalcatzingo" },
  "Ayala":                { alcalde: "Nayeli Guadalupe Mares Mérida", poblacion: "79,333",  conocido: "Ingenio azucarero y caña de azúcar" },
  "Coatlán del Río":      { alcalde: "Luis Armando Jaime Maldonado", poblacion: "9,430",   conocido: "Río Coatlán y paisaje natural" },
  "Cuernavaca":           { alcalde: "José Luis Urióstegui Salgado", poblacion: "366,321", conocido: "Palacio de Cortés y Jardín Borda" },
  "Cuautla":              { alcalde: "Jesús Damián Corona Damián", poblacion: "175,207", conocido: "Museo Casa de Morelos y aguas termales" },
  "Emiliano Zapata":      { alcalde: "Santos Tavares García", poblacion: "73,873",  conocido: "Hacienda de Temixco" },
  "Huitzilac":            { alcalde: "César Dávila Díaz", poblacion: "19,572",  conocido: "Lagunas de Zempoala" },
  "Hueyapan":            { alcalde: "Concejo municipal", poblacion: "9,855",  conocido: "Está en las faldas del volcán Popocatépetl" },
  "Jantetelco":           { alcalde: "Ángel Augusto Domínguez Sánchez", poblacion: "17,624",  conocido: "Zona arqueológica de Chalcatzingo (acceso)" },
  "Jiutepec":             { alcalde: "Éder Rodríguez Casillas", poblacion: "196,953", conocido: "Ciudad Industrial y Acuario Michin" },
  "Jojutla":              { alcalde: "Alan Martínez García", poblacion: "53,613",  conocido: "Isla de Jiquilpan y balnearios" },
  "Jonacatepec de Leandro Valle":          { alcalde: "Israel Andrade Zavala", poblacion: "17,912",  conocido: "Ex convento de San Mateo" },
  "Mazatepec":            { alcalde: "Gilberto Orihuela Bustos", poblacion: "13,563",  conocido: "Cerro de Mazatepec y fauna silvestre" },
  "Miacatlán":            { alcalde: "Francisco León y Vélez Rivera", poblacion: "27,851",  conocido: "Ex hacienda de Miacatlán" },
  "Ocuituco":             { alcalde: "René Jacobo Reynoso", poblacion: "16,734",  conocido: "Ex convento de Santiago Apóstol" },
  "Puente de Ixtla":      { alcalde: "Claudia Mazari Torres", poblacion: "66,569",  conocido: "Balneario Los Arcos y río Amacuzac" },
  "Temixco":              { alcalde: "Israel Piña Labra", poblacion: "109,064", conocido: "Parque acuático Temixco" },
  "Temoac":               { alcalde: "Valentín Lavín Romero", poblacion: "13,187",  conocido: "Volcán Popocatépetl (vista)" },
  "Tepalcingo":           { alcalde: "Pendiente / elección anulada", poblacion: "22,148",  conocido: "Santuario del Señor de Tepalcingo" },
  "Tepoztlán":            { alcalde: "Perseo Quiroz Rendón", poblacion: "44,883",  conocido: "Pirámide de Tepozteco" },
  "Tetecala":             { alcalde: "Rosbelia Benítez Bello", poblacion: "8,165",   conocido: "Pueblo Mágico y arquitectura colonial" },
  "Tetela del Volcán":    { alcalde: "Esaud Mendoza Vázquez", poblacion: "18,617",  conocido: "Ex convento y vistas al Popocatépetl" },
  "Tlalnepantla":         { alcalde: "Jorge Genaro Rubio", poblacion: "6,272",   conocido: "Grutas de Cacahuamilpa (zona)" },
  "Tlaltizapán":          { alcalde: "Nancy Gómez Flores", poblacion: "47,606",  conocido: "Hacienda de Vista Hermosa" },
  "Tlaquiltenango":       { alcalde: "Enrique Alonso Plascencia", poblacion: "31,111",  conocido: "Reserva de la Biosfera Sierra de Huautla" },
  "Tlayacapan":           { alcalde: "Pedro Antonio Montenegro", poblacion: "18,768",  conocido: "Pueblo Mágico y ex convento agustino" },
  "Totolapan":            { alcalde: "Alejandro Alfaro González", poblacion: "12,278",  conocido: "Ex convento de San Guillermo" },
  "Xochitepec":           { alcalde: "Gonzalo Flores Zúñiga", poblacion: "80,029",  conocido: "Parque Ecológico El Texcal" },
  "Yautepec":             { alcalde: "Agustín Alonso Mendoza", poblacion: "100,161", conocido: "Casa natal de Emiliano Zapata (Anenecuilco)" },
  "Yecapixtla":           { alcalde: "Heladio Rafael Sánchez Zavala", poblacion: "37,893",  conocido: "Ex convento de San Juan Bautista" },
  "Zacatepec":            { alcalde: "José Luis Maya Torres", poblacion: "37,519",  conocido: "Ingenio azucarero e historia obrera" },
  "Zacualpan de Amilpas": { alcalde: "Marino Santibáñez Alonso", poblacion: "9,168",   conocido: "Ex convento dominico del siglo XVI" },
  "Coatetelco": { alcalde: "Norberto Zamorano Ortega", poblacion: "9,672",   conocido: "Laguna de Coatetelco/Zona arqueológica de Coatetelco" },
  "Xoxocotla": { alcalde: "José Carlos Jiménez Ponciano", poblacion: "21,074",   conocido: "Cercanía a la Laguna de Tequesquitengo/Fuerte cultura indígena náhuatl" },
  "Tlaltizapán de Zapata": { alcalde: "Gabriel Moreno Bruno", poblacion: "10,779",   conocido: "Relación histórica con Emiliano Zapata/Fue sede del cuartel zapatista durante la Revolución" },
};


let visitados   = new Set();
let score       = 0;
let seleccionado = null;


const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
document.body.appendChild(tooltip);


const contenedor = document.getElementById('map-container');
const svg = d3.select('#mapa-svg');

const ancho  = contenedor.clientWidth  - 48;
const alto   = contenedor.clientHeight - 48;

svg.attr('viewBox', `0 0 ${ancho} ${alto}`)
   .attr('preserveAspectRatio', 'xMidYMid meet');


d3.json('17mun.json')
  .then(geojson => {

    
    const proyeccion = d3.geoIdentity()
                         .reflectY(true)
                         .fitSize([ancho, alto], geojson);
    const trazador   = d3.geoPath().projection(proyeccion);

   
    svg.selectAll('path.municipio')
      .data(geojson.features)
      .join('path')
      .attr('class', 'municipio')
      .attr('d', trazador)
      .on('mousemove', (event, d) => {
        const nombre = getNombre(d);
        tooltip.textContent = nombre;
        tooltip.style.opacity = '1';
        tooltip.style.left = (event.clientX + 14) + 'px';
        tooltip.style.top  = (event.clientY - 28) + 'px';
      })
      .on('mouseleave', () => {
        tooltip.style.opacity = '0';
      })
      .on('click', (event, d) => {
        const nombre = getNombre(d);
        alHacerClic(nombre, d);
      });

    
    svg.selectAll('text.muni-label')
      .data(geojson.features)
      .join('text')
      .attr('class', 'muni-label')
      .attr('x', d => trazador.centroid(d)[0])
      .attr('y', d => trazador.centroid(d)[1])
      .text(d => getNombre(d));

  })

function getNombre(feature) {
  return feature.properties.NOM_MUN
      || feature.properties.NOMGEO
      || feature.properties.NAME
      || feature.properties.name
      || 'Municipio';
}

function alHacerClic(nombre, featureData) {

  if (seleccionado) {
    d3.selectAll('path.municipio')
      .filter(d => getNombre(d) === seleccionado)
      .classed('seleccionado', false);

    // Restaura color de la etiqueta anterior
    d3.selectAll('text.muni-label')
      .filter(d => getNombre(d) === seleccionado)
      .style('fill', '#ffffff');
  }

  seleccionado = nombre;


  d3.selectAll('path.municipio')
    .filter(d => getNombre(d) === nombre)
    .classed('seleccionado', true)
    .classed('visitado', true);


  d3.selectAll('text.muni-label')
    .filter(d => getNombre(d) === nombre)
    .style('fill', '#ffffff');

  if (!visitados.has(nombre)) {
    visitados.add(nombre);
    score++;
    document.getElementById('score').textContent = score;
    agregarVisitado(nombre);
  }

  mostrarInfo(nombre);
}

function mostrarInfo(nombre) {
  const d     = datos[nombre];
  const panel = document.getElementById('info-panel');
  panel.className = 'info-panel';

  if (d) {
    panel.innerHTML = `
      <div class="muni-titulo">${nombre}</div>
      <div class="dato">
        <span class="dato-label">Alcalde / Presidenta municipal</span>
        <span class="dato-valor">${d.alcalde}</span>
      </div>
      <div class="dato">
        <span class="dato-label">Población</span>
        <span class="dato-valor">${d.poblacion} habitantes</span>
      </div>
      <div class="dato">
        <span class="dato-label">Lugar / Monumento destacado</span>
        <span class="dato-valor">${d.conocido}</span>
      </div>`;
  } else {
    panel.innerHTML = `
      <div class="muni-titulo">${nombre}</div>
      <p style="font-size:13px;color:var(--texto-muted);margin-top:8px;">
        Sin datos registrados.<br>
        Agrégalo en el objeto <code>datos</code> de <code>mapa.js</code>.
      </p>`;
  }
}

function agregarVisitado(nombre) {
  const lista = document.getElementById('visitados-lista');
  const vacio = lista.querySelector('.vacio-msg');
  if (vacio) vacio.remove();

  const item = document.createElement('div');
  item.className = 'visitado-item';
  item.textContent = nombre;
  lista.appendChild(item);
}