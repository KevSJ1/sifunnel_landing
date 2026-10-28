// Rasteriza la imagen Open Graph y los iconos PNG a partir de los SVG.
// Uso: node scripts/generate-images.mjs
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const og = await readFile(new URL('./og.svg', import.meta.url));
const icon = await readFile(new URL('../public/favicon.svg', import.meta.url));
const pub = (f) => new URL(`../public/${f}`, import.meta.url).pathname;

await sharp(og, { density: 144 }).resize(1200, 630).png({ compressionLevel: 9, palette: false }).toFile(pub('og-image.png'));

for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const pad = file === 'apple-touch-icon.png' ? Math.round(size * 0.1) : 0;
  await sharp(icon, { density: 600 })
    .resize(size - pad * 2, size - pad * 2)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: '#0c1321' })
    .flatten({ background: '#0c1321' })
    .png()
    .toFile(pub(file));
}

// Maskable: icono dentro de la zona segura (80 %)
const inner = await sharp(icon, { density: 600 }).resize(360, 360).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0c1321' } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(pub('icon-512-maskable.png'));

console.log('Imágenes generadas en /public');
