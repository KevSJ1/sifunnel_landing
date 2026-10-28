# SiFunnel · Landing (Astro)

## Comandos
- `npm run dev`: servidor local en http://localhost:4321
- `npm run build`: genera el sitio estático en `dist/`
- `npm run preview`: sirve `dist/` para probar
- `npm run images`: regenera `og-image.png` e iconos (requiere `pip install fonttools brotli`)

## Antes de publicar
1. **Dominio:** cambia `SITE_URL` en `src/data/site-url.mjs`. Ahí se toman el canonical, el sitemap, robots.txt y los datos estructurados.
2. **Datos reales:** completa `src/data/site.ts`. Si un campo está en `null`, su bloque se oculta (regla de marca: no inventar datos).
   - `whatsappNumber` → cada botón abre WhatsApp con un mensaje distinto
   - `agentDemoUrl`, `founder`, `prices`, `instagram`, `email`, `city`, `commitments`, `analytics`, etc.
   - La foto del fundador va en `src/assets/` y su nombre de archivo en `founder.photo`.
3. **Google Search Console:** verifica el dominio (DNS o `googleSiteVerification`) y envía `https://TU-DOMINIO/sitemap-index.xml`.
4. **Google Business Profile:** créalo o reclámalo; es la base del SEO local.

## SEO incluido
- `sitemap-index.xml` y `sitemap-0.xml` (@astrojs/sitemap), `robots.txt` y `llms.txt` (para buscadores con IA)
- Title, description, canonical, Open Graph, Twitter Card, `og-image.png` de 1200×630
- JSON-LD: ProfessionalService con catálogo de servicios, WebSite, WebPage y FAQPage
- HTML semántico, un solo H1, `lang="es-CO"`, accesibilidad (skip link, foco visible, `prefers-reduced-motion`)
- Rendimiento: CSS en línea, ~2 kB de JS, fuentes con precarga y sin peticiones a terceros

## Medición
Evento `clic_whatsapp` con `servicio` y `seccion` hacia GA4, Meta Pixel y dataLayer, si están configurados.
