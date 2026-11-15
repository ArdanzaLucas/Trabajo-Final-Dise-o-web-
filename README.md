# 🎮 Free Arcade · TP Final Diseño Web 2026

Sitio web de 3 páginas que consume la **FreeToGame API** y muestra un catálogo de videojuegos gratuitos en cards responsive, con un formulario de contacto validado con JavaScript.

**ISFT N° 194 · Tecnicatura Superior en Desarrollo de Software · 2.º año**
Prof. Mauro Gonzalo Triaca · Entrega: 16/11/2026

---

## 👥 Integrantes y roles

| Integrante | Rol | Responsabilidades |
|---|---|---|
| Lucas Ardanza | Maquetación HTML y CSS | Estructura semántica de las 3 páginas, paleta, tipografía y grid responsive |
| Leandro Medina | Consumo de la API | Fetch, estados loading/success/error y render dinámico de cards |
| Florencia Gómez | Formulario y documentación | Validación del formulario, README y control del repositorio |

🔗 Repositorio: https://github.com/ArdanzaLucas/Trabajo-Final-Dise-o-web-

---

## 📁 Estructura del proyecto

```
tp-final-freetogame/
├── index.html          → Home: cards con los juegos de la API
├── contacto.html       → Formulario validado con JavaScript
├── about.html          → Equipo, temática, API y decisiones técnicas
├── css/
│   └── styles.css      → Variables, reset, mobile, tablet (768px+), desktop (1024px+)
├── js/
│   ├── home.js         → Fetch a la API y creación de cards
│   └── contacto.js     → Validación del formulario
├── img/
│   ├── logo.svg
│   ├── contacto-arcade.svg   → Imagen temática del formulario
│   └── equipo/               → Fotos de los integrantes (JPG 400×400, livianas y sin metadatos)
└── README.md
```

## ▶️ Cómo verlo

Abrí `index.html` con **Live Server** (VS Code) o con doble clic. Hace falta conexión a internet para traer los datos de la API.

---

## 🌐 API utilizada: FreeToGame

| | |
|---|---|
| **Documentación** | https://www.freetogame.com/api-doc |
| **Endpoint** | `GET https://www.freetogame.com/api/games` |
| **Autenticación** | No requiere registro ni API key |
| **Formato** | JSON. La respuesta **es directamente un array** de juegos |
| **Cantidad** | Catálogo grande (más de 300 juegos). Se muestran de a 6 |
| **CORS** | Habilitado (`Access-Control-Allow-Origin: *`), se puede consumir desde el navegador |

Filtros opcionales que acepta el endpoint: `?platform=pc|browser|all`, `?category=shooter|mmorpg|...`, `?sort-by=release-date|popularity|alphabetical|relevance`.

### Estructura de cada objeto

```json
{
  "id": 540,
  "title": "Overwatch",
  "thumbnail": "https://www.freetogame.com/g/540/thumbnail.jpg",
  "short_description": "A hero-focused first-person team shooter from Blizzard Entertainment.",
  "game_url": "https://www.freetogame.com/open/overwatch",
  "genre": "Shooter",
  "platform": "PC (Windows)",
  "publisher": "Activision Blizzard",
  "developer": "Blizzard Entertainment",
  "release_date": "2022-10-04",
  "freetogame_profile_url": "https://www.freetogame.com/overwatch"
}
```

### Campos que usamos en cada card

| Parte de la card | Campo de la API |
|---|---|
| Imagen (formato foto 16:9) | `thumbnail` |
| Campo principal | `title` |
| Etiqueta sobre la imagen | `genre` |
| Campo secundario | `platform` |
| Descripción | `short_description` |
| Pie de la card | `publisher` + año de `release_date` |
| Link "Jugar gratis" | `game_url` |

### Cómo se consume (`js/home.js`)

```js
async function cargarJuegos() {
  mostrarCargando();                       // 1) estado loading
  try {
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
    const datos = await respuesta.json();  // el JSON ya es el array
    juegos = datos;
    mostrarExito();                        // 2) estado success: 6 cards
  } catch (error) {
    mostrarError(error.message);           // 3) estado error + botón Reintentar
  }
}
```

- **Loading:** spinner + 6 cards "esqueleto" animadas.
- **Success:** se dibujan 6 cards; el botón **"Cargar 6 juegos más"** agrega más sin volver a pedir datos.
- **Error:** mensaje claro con el detalle y un botón **Reintentar**. Nunca queda la página vacía.

### Filtro por género

Arriba del grid hay un `<select>` para ver solo los juegos de un género. Por defecto está en **"Todos"**.

- Las opciones **no están escritas a mano**: se arman con JavaScript a partir de los datos de la API, con la cantidad de juegos de cada género (ej: `MMORPG (158)`), ordenadas de mayor a menor. Si la API suma un género nuevo, aparece solo.
- Filtra con `Array.filter()` sobre la lista que ya se descargó: **no hace otro fetch**.
- Al cambiar de género el grid se vuelve a dibujar desde la primera tanda, y el contador y el botón "Cargar más" funcionan sobre la lista filtrada.
- La API trae algunos géneros con espacios de más (`" MMORPG"`), así que se normalizan con `trim()` para que no aparezcan repetidos.

```js
juegosFiltrados = genero === 'todos'
  ? juegos
  : juegos.filter(juego => normalizarGenero(juego.genre) === genero);
```

---

## 🎨 Decisiones de diseño

- **Temática "sala de arcade":** fondo oscuro con luces de neón, como las máquinas de fichines.
- **Paleta:**

| Uso | Color |
|---|---|
| Fondo | `#0d0b1e` |
| Cards | `#1a1633` |
| Acento principal (cian neón) | `#00e5ff` |
| Acento secundario (magenta) | `#ff2e93` |
| Detalles / links de las cards | `#ffd23f` |

- **Tipografía:** *Orbitron* (títulos, estética retro-futurista) + *Inter* (texto, muy legible en mobile).
- **Cards:** bordes redondeados, etiqueta de género en magenta, imagen 16:9 sin deformar (`object-fit: cover`) y hover que eleva la card, agranda la imagen y enciende un brillo cian.
- **Accesibilidad:** contraste alto, foco visible en amarillo, `alt` en todas las imágenes, `aria-current` en el link de la página activa y estados anunciados con `role="status"` / `role="alert"`.

## ⚙️ Detalles técnicos

- **HTML5 semántico:** `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.
- **CSS mobile first** con variables en `:root` y el orden pedido: variables → reset/base → mobile (320px+) → tablet (768px+) → desktop (1024px+).
- **Grid responsive:** 1 columna en mobile, 2 desde 768px y 3 desde 1024px.
- **JavaScript modular y comentado:** un archivo por página, funciones chicas (`mostrarCargando`, `mostrarError`, `mapearJuego`, `crearCard`, `renderSiguienteTanda`…).
- **Cards creadas con el DOM** (`createElement` + `textContent`), sin `innerHTML` con datos externos.
- **Formulario (`js/contacto.js`):** 7 campos (texto, email, teléfono, número, select, radios, checkboxes, textarea y checkbox de aceptación). Se valida en el evento `submit` con `preventDefault()`, un `alert` específico para cada error y `reset()` después de un envío exitoso.

### Reglas de validación

| Campo | Regla |
|---|---|
| Nombre | Obligatorio, mínimo 3 letras, sin números |
| Email | Obligatorio, formato válido |
| Edad | Obligatoria, entero entre 13 y 99 |
| Motivo (select, 4 opciones) | Obligatorio |
| Preferencia de respuesta (radio) | Obligatoria |
| Teléfono | Obligatorio solo si se elige respuesta por teléfono; formato numérico |
| Plataformas (checkbox) | Opcional |
| Mensaje | Obligatorio, mínimo 20 caracteres |
| Aceptación de datos | Obligatoria |
