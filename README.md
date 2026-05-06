# GRIP Climbing Club

Sitio web oficial de **GRIP Climbing Club** — Muro de Escalada en Calarcá, Quindío.

🌐 **Sitio en vivo:** https://droko1982.github.io/grip-climbing-club/
📷 **Instagram:** [@murodeescaladagrip](https://www.instagram.com/murodeescaladagrip)
📍 **Ubicación:** [Google Maps](https://maps.app.goo.gl/XomwvZX1Xtsj72qs8)

---

## Sobre el sitio

Sitio web one-page optimizado para SEO local en todo el departamento del Quindío (Armenia, Calarcá, Montenegro, Quimbaya, Circasia, La Tebaida, Salento, Filandia, Pijao, Génova, Buenavista y Córdoba).

### Secciones

- **Inicio (Hero)** — Identidad de marca, CTAs y stats animados
- **Sobre Nosotros** — Filosofía y propuesta de valor con tarjetas animadas
- **Servicios** — 6 tipos: Escalada Libre, Clases, Entrenamiento, Salidas a Roca, Eventos, Programas
- **¿Por qué GRIP?** — 4 diferenciadores con numeración grande
- **Precios** — 3 planes (Pase de Día, Mensualidad destacada, Clases) con nota para consultar
- **Tu Primera Vez** — Onboarding paso a paso para nuevos escaladores
- **Horarios** — Tabla detallada por día con destacado de sábado
- **Ubicación** — Google Maps embed + distancias desde cada municipio + listado completo
- **FAQ** — 8 preguntas comunes con accordion (también en JSON-LD)
- **CTA Final** — Contacto vía Instagram y Google Maps
- **Footer** — 4 columnas con enlaces, horarios, contacto y redes
- **Floating CTA** — Botón sticky de Instagram en mobile/scroll

### Optimizaciones SEO

- HTML semántico con landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, etc.)
- Meta tags completos (description, keywords, geo, canonical)
- JSON-LD `SportsActivityLocation` con `areaServed` para todo el Quindío
- JSON-LD `FAQPage` para rich snippets en Google
- Open Graph + Twitter Cards con imagen 1200x630 SVG
- `sitemap.xml` y `robots.txt`
- Geo-tags (`geo.region=CO-QUI`, coordenadas `4.5239,-75.6447`)
- Manifest.json para instalación PWA-lite

### Accesibilidad

- Skip-link para navegación por teclado
- ARIA labels y landmarks
- Estados `:focus-visible` con outline naranja
- Soporte `prefers-reduced-motion`
- Contraste alto en todos los textos
- HTML semántico (h1 → h6 jerárquicos, `<details>` para FAQ)

### Performance

- Sin frameworks, sin dependencias JS
- Fuentes precargadas con `preconnect` y `preload`
- DNS prefetch para Google Maps e Instagram
- `loading="lazy"` en iframe del mapa
- `defer` en script.js
- IntersectionObserver para reveal-on-scroll (no bloquea)

### Animaciones

- Ticker superior con info clave
- Hero con glows pulsantes y muro animado con presas y silueta de escalador
- Counter animado en stats del hero
- Reveal-on-scroll para todas las secciones
- Hover effects refinados en cards
- Parallax sutil en glows del hero
- FAQ con accordion exclusivo

## Stack

HTML5 + CSS3 + JavaScript vanilla. Sin frameworks ni dependencias.
Tipografía: Bebas Neue (display) + Montserrat (body).

## Estructura

```
grip-climbing-club/
├── index.html             # Single page completa
├── styles.css             # ~1100 líneas, responsive completo
├── script.js              # Interacciones (mobile menu, scroll, counter, FAQ)
├── 404.html               # Página de error personalizada
├── robots.txt
├── sitemap.xml
├── site.webmanifest       # PWA manifest
├── README.md
├── .gitignore
└── assets/
    ├── favicon.svg
    ├── logo.svg
    └── og-image.svg       # 1200x630 para social sharing
```

## Despliegue

Publicado automáticamente con **GitHub Pages** desde la rama `main` (root).

## Pendientes para el cliente

- [ ] Precios reales (mensualidad, pase de día, clases)
- [ ] Dirección exacta del muro en Calarcá
- [ ] Teléfono / WhatsApp de contacto
- [ ] Fotos reales del muro (hero, gallery)
- [ ] Edad mínima exacta (asumido 6+, confirmar)
- [ ] Confirmar tiempos de distancia desde municipios

## Licencia

© GRIP Climbing Club · Calarcá, Quindío. Todos los derechos reservados.
