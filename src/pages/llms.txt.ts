import type { APIRoute } from 'astro';
import { wa, site, services, apps, getFaqs, stages } from '../data/site';

/** llms.txt: resumen en texto plano para buscadores y asistentes con IA. */
export const GET: APIRoute = () => {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    'SiFunnel es una agencia de crecimiento digital con IA para pymes en Colombia. No vende piezas sueltas: construye el embudo completo del negocio (que te encuentren, que confíen, que te escriban, que compren y que vuelvan) y lo mide cada mes.',
    '',
    '## Etapas del embudo',
    ...Object.values(stages).map((s) => `- ${s.name}: ${s.tagline}. ${s.tools}`),
    '',
    '## Servicios',
    ...services.map((s) => `- [${s.name}](${site.url}/#servicio-${s.id}): ${s.text}`),
    '',
    '## Apps por suscripción',
    ...apps.map((a) => `- [${a.name}](${site.url}/#app-${a.id}): ${a.tagline}${a.price ? ` ${a.price}${a.period}.` : ''}`),
    '',
    '## Cómo empezar',
    `- Diagnóstico gratuito por WhatsApp: ${wa()}`,
    '',
    '## Preguntas frecuentes',
    ...getFaqs().flatMap((f) => [`### ${f.q}`, f.a, '']),
    '## Páginas',
    `- [Inicio](${site.url}/)`,
    `- [Política de privacidad](${site.url}/privacidad/)`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
