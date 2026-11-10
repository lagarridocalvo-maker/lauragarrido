# lauragarrido.com

Web de Laura Garrido · Marketing digital para pymes en Palencia y Valladolid.

Hecha con [Astro](https://astro.build) y publicada en Vercel.

## Dónde está cada cosa

- `src/contenido/*.json`: el contenido de cada página (sale del lienzo de diseño).
- `src/pages/`: las rutas de la web.
- `src/layouts/Base.astro`: cabecera HTML común, SEO y aviso de cookies.
- `src/scripts/site.js`: botones, luces, formularios y cookies.
- `src/styles/global.css`: estilos comunes y versión móvil.
- `src/config.mjs`: **ajustes**: indexar en Google (sí/no), ID de Google Analytics y píxel de Meta.
- `public/`: imágenes, vídeo, `robots.txt`, `sitemap.xml`, `llms.txt`.

## Formularios

Envían a Google Sheets a través de Apps Script. Sin la casilla de privacidad marcada no se guarda nada.

## Antes de abrir la web al público

1. Conectar el dominio lauragarrido.com en Vercel.
2. En `src/config.mjs`, poner `INDEXAR = true` y los IDs de Analytics y Meta.
3. Cambiar el email provisional por el profesional.
