// home.js: trae los juegos de la FreeToGame API y arma las cards

const URL_API = 'https://www.freetogame.com/api/games';
const CARDS_POR_TANDA = 6;

// Elementos del DOM
const contenedorCards = document.getElementById('cards');
const estadoCargando = document.getElementById('estado-cargando');
const estadoError = document.getElementById('estado-error');
const mensajeError = document.getElementById('mensaje-error');
const botonReintentar = document.getElementById('boton-reintentar');
const botonMas = document.getElementById('boton-mas');
const contador = document.getElementById('contador');
const filtros = document.getElementById('filtros');
const selectGenero = document.getElementById('filtro-genero');

let juegos = [];          // todos los juegos de la API
let juegosFiltrados = []; // los del género elegido
let mostrados = 0;        // cuántas cards hay en pantalla

// Loading: spinner y cards vacías mientras carga
function mostrarCargando() {
  estadoError.hidden = true;
  estadoCargando.hidden = false;
  botonMas.hidden = true;
  contador.hidden = true;
  filtros.hidden = true;
  contenedorCards.innerHTML = '';

  for (let i = 0; i < CARDS_POR_TANDA; i++) {
    const esqueleto = document.createElement('div');
    esqueleto.className = 'esqueleto';
    esqueleto.setAttribute('aria-hidden', 'true');
    contenedorCards.appendChild(esqueleto);
  }
}

// Error: mensaje y botón para reintentar
function mostrarError(detalle) {
  estadoCargando.hidden = true;
  contenedorCards.innerHTML = '';
  mensajeError.textContent = 'Revisá tu conexión e intentá de nuevo. (Detalle: ' + detalle + ')';
  estadoError.hidden = false;
}

// Success: arma el filtro y muestra las primeras cards
function mostrarExito() {
  estadoCargando.hidden = true;
  crearOpcionesGenero();
  filtros.hidden = false;
  aplicarFiltro();
}

// Algunos géneros vienen con espacios de más (" MMORPG")
function normalizarGenero(genero) {
  return (genero || 'Sin género').trim();
}

// Llena el select con los géneros y la cantidad de juegos de cada uno
function crearOpcionesGenero() {
  const conteo = {};
  juegos.forEach(function (juego) {
    const genero = normalizarGenero(juego.genre);
    conteo[genero] = (conteo[genero] || 0) + 1;
  });

  const generos = Object.keys(conteo).sort(function (a, b) {
    return conteo[b] - conteo[a] || a.localeCompare(b);
  });

  const elegido = selectGenero.value;

  selectGenero.innerHTML = '';
  selectGenero.appendChild(new Option('Todos (' + juegos.length + ')', 'todos'));
  generos.forEach(function (genero) {
    selectGenero.appendChild(new Option(genero + ' (' + conteo[genero] + ')', genero));
  });

  selectGenero.value = conteo[elegido] ? elegido : 'todos';
}

// Filtra por el género elegido y vuelve a dibujar las cards
function aplicarFiltro() {
  const genero = selectGenero.value;

  juegosFiltrados = genero === 'todos'
    ? juegos
    : juegos.filter(function (juego) {
      return normalizarGenero(juego.genre) === genero;
    });

  contenedorCards.innerHTML = '';
  mostrados = 0;
  renderSiguienteTanda();
}

// Pasa un juego de la API a los datos que usa la card
function mapearJuego(juego) {
  return {
    imagen: juego.thumbnail,
    titulo: juego.title,
    genero: normalizarGenero(juego.genre),
    plataforma: juego.platform,
    descripcion: juego.short_description,
    publisher: juego.publisher,
    anio: juego.release_date ? juego.release_date.slice(0, 4) : 's/f',
    url: juego.game_url
  };
}

// Crea una card
function crearCard(datos) {
  const card = document.createElement('article');
  card.className = 'card';

  const cajaImagen = document.createElement('div');
  cajaImagen.className = 'card__imagen-caja';

  const imagen = document.createElement('img');
  imagen.className = 'card__imagen';
  imagen.src = datos.imagen;
  imagen.alt = 'Captura del juego ' + datos.titulo;
  imagen.loading = 'lazy';
  imagen.width = 365;
  imagen.height = 206;

  const genero = document.createElement('span');
  genero.className = 'card__genero';
  genero.textContent = datos.genero;

  cajaImagen.append(imagen, genero);

  const cuerpo = document.createElement('div');
  cuerpo.className = 'card__cuerpo';

  const titulo = document.createElement('h3');
  titulo.className = 'card__titulo';
  titulo.textContent = datos.titulo;

  const plataforma = document.createElement('p');
  plataforma.className = 'card__plataforma';
  plataforma.textContent = '🕹️ ' + datos.plataforma;

  const descripcion = document.createElement('p');
  descripcion.className = 'card__descripcion';
  descripcion.textContent = datos.descripcion;

  const pie = document.createElement('div');
  pie.className = 'card__pie';

  const info = document.createElement('span');
  info.textContent = datos.publisher + ' · ' + datos.anio;

  const link = document.createElement('a');
  link.className = 'card__link';
  link.href = datos.url;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Jugar gratis →';
  link.setAttribute('aria-label', 'Jugar gratis a ' + datos.titulo + ' (se abre en otra pestaña)');

  pie.append(info, link);
  cuerpo.append(titulo, plataforma, descripcion, pie);
  card.append(cajaImagen, cuerpo);
  return card;
}

// Agrega las próximas 6 cards y actualiza el contador
function renderSiguienteTanda() {
  const tanda = juegosFiltrados.slice(mostrados, mostrados + CARDS_POR_TANDA);
  const fragmento = document.createDocumentFragment();

  tanda.map(mapearJuego).forEach(function (datos) {
    fragmento.appendChild(crearCard(datos));
  });

  contenedorCards.appendChild(fragmento);
  mostrados += tanda.length;

  const genero = selectGenero.value;
  const palabra = juegosFiltrados.length === 1 ? 'juego' : 'juegos';
  const sufijo = genero === 'todos' ? palabra + ' gratuitos' : palabra + ' de ' + genero;
  contador.textContent = 'Mostrando ' + mostrados + ' de ' + juegosFiltrados.length + ' ' + sufijo;
  contador.hidden = false;
  botonMas.hidden = mostrados >= juegosFiltrados.length;
}

// Pide los juegos a la API
async function cargarJuegos() {
  mostrarCargando();

  try {
    const respuesta = await fetch(URL_API);

    if (!respuesta.ok) {
      throw new Error('HTTP ' + respuesta.status);
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos) || datos.length === 0) {
      throw new Error('la API no devolvió juegos');
    }

    juegos = datos;
    mostrarExito();
  } catch (error) {
    console.error('Error al consumir la FreeToGame API:', error);
    mostrarError(error.message);
  }
}

// Eventos
botonReintentar.addEventListener('click', cargarJuegos);
botonMas.addEventListener('click', renderSiguienteTanda);
selectGenero.addEventListener('change', aplicarFiltro);

cargarJuegos();
