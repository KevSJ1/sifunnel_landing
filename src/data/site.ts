/**
 * Datos del negocio.
 *
 * Regla de marca: nunca se inventan datos. Todo campo en `null` oculta el bloque
 * que lo usa. Cuando tengas el dato real, rellénalo aquí y la página lo muestra.
 */
import { SITE_URL } from './site-url.mjs';

export const site = {
  url: SITE_URL,
  name: 'SiFunnel',
  locale: 'es_CO',
  lang: 'es-CO',
  title: 'Agencia de crecimiento digital con IA para pymes en Colombia | SiFunnel',
  description:
    'Web que convierte, SEO, anuncios, contenido con IA, WhatsApp automatizado y software a la medida. Apps por suscripción: EcoQR y SiFunnel Clínicas.',

  /** Enlace general de WhatsApp (no admite texto prellenado). */
  whatsappLink: 'https://wa.link/mdwkei',
  /**
   * Número en formato internacional sin "+" ni espacios, p. ej. '573001234567'.
   * Si se define, cada botón abre WhatsApp con un mensaje distinto (sabes qué servicio interesa).
   */
  whatsappNumber: '573127170855' as string | null,

  /** Enlace a la demo del agente IA. Sin enlace, la tarjeta de demo no se muestra. */
  agentDemoUrl: null as string | null,

  city: null as string | null,
  instagram: null as string | null, // p. ej. 'sifunnel' (sin @)
  email: null as string | null,
  legalName: null as string | null, // nombre legal o NIT
  /** Tiempo de respuesta, p. ej. 'en menos de 2 horas, de lunes a sábado'. */
  responseTime: null as string | null,

  founder: {
    name: null as string | null,
    experience: null as string | null,
    /** Ruta a foto real dentro de src/assets, p. ej. 'founder.jpg'. */
    photo: null as string | null,
  },

  /** Beneficio para los primeros clientes, p. ej. '20 % de descuento los primeros 3 meses'. */
  founderBenefit: null as string | null,

  commitments: {
    /** true cuando confirmes que web, cuentas y datos quedan a nombre del cliente. */
    clientOwnsAssets: false,
    /** Garantía real, p. ej. 'Sin permanencia mínima.' */
    guarantee: null as string | null,
  },

  /** Precios de planes. Si todos son null se muestra "Te damos el precio exacto en el diagnóstico". */
  prices: {
    presencia: null as string | null,
    captacion: null as string | null,
    completo: null as string | null,
    individualFrom: null as string | null,
  },
  /** ¿El plan Captación incluye contenido con IA? null = "Según diagnóstico". */
  captacionIncludesContent: null as boolean | null,

  analytics: {
    ga4Id: null as string | null, // 'G-XXXXXXX'
    metaPixelId: null as string | null,
  },
  /** Código de verificación de Google Search Console (meta tag), si usas ese método. */
  googleSiteVerification: null as string | null,
};

/** Construye el enlace de WhatsApp con mensaje prellenado cuando hay número. */
export function wa(message = 'Hola, quiero mi DIAGNÓSTICO gratis'): string {
  if (!site.whatsappNumber) return site.whatsappLink;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type StageKey = 'atraer' | 'convencer' | 'convertir' | 'medir';

/** Las 4 etapas toman los 4 colores del logo. */
export const stages: Record<StageKey, { n: number; name: string; tagline: string; tools: string }> = {
  atraer: { n: 1, name: 'Atraer', tagline: 'que te encuentren', tools: 'SEO técnico y local, anuncios, contenido con IA.' },
  convencer: { n: 2, name: 'Convencer', tagline: 'que confíen', tools: 'Páginas web que convierten y presencia digital profesional.' },
  convertir: { n: 3, name: 'Convertir', tagline: 'que te escriban y compren', tools: 'Agente IA en WhatsApp, CRM y seguimiento.' },
  medir: { n: 4, name: 'Medir y mejorar', tagline: 'que cada mes funcione mejor', tools: 'Analítica, reportes y automatizaciones.' },
};

export const services = [
  {
    id: 'web',
    icon: 'web',
    stage: 'convencer' as StageKey,
    name: 'Páginas web que convierten',
    question: '¿Por qué la gente entra a mi web y no me escribe?',
    text: 'Diseñamos páginas pensadas para vender, no solo para verse bien: mensaje claro, confianza y un botón que lleva directo a WhatsApp.',
    bullets: ['Landing pages para campañas y sitios corporativos', 'Diseño móvil, rápido y optimizado para conversión', 'Conectada a WhatsApp, CRM y analítica'],
    msg: 'Hola, me interesa una WEB que convierta',
    wide: true,
  },
  {
    id: 'seo',
    icon: 'seo',
    stage: 'atraer' as StageKey,
    name: 'SEO técnico y local',
    question: '¿Por qué en Google aparece mi competencia y yo no?',
    text: 'Revisamos y corregimos lo que impide que Google te encuentre y te muestre, y optimizamos tu perfil para búsquedas en tu ciudad.',
    bullets: ['Auditoría técnica: velocidad, indexación, errores, estructura', 'SEO local y Google Business Profile', 'Optimización para buscadores con IA'],
    msg: 'Hola, me interesa SEO técnico y local',
  },
  {
    id: 'ads',
    icon: 'ads',
    stage: 'atraer' as StageKey,
    name: 'Estrategia de anuncios (Meta y Google Ads)',
    question: '¿Por qué pago anuncios y no veo ventas?',
    text: 'Planeamos campañas con un objetivo claro, las conectamos a una página o a WhatsApp y medimos cuántos clientes reales te dejan.',
    bullets: ['Estrategia, segmentación y estructura de campañas', 'Anuncios Click-to-WhatsApp y campañas de captación', 'Medición de conversiones y optimización'],
    msg: 'Hola, me interesa la estrategia de ANUNCIOS',
  },
  {
    id: 'contenido',
    icon: 'content',
    stage: 'atraer' as StageKey,
    name: 'Creación de contenido con IA',
    question: 'No tengo tiempo ni ideas para publicar.',
    text: 'Creamos contenido con estrategia y lo producimos más rápido con IA: cada publicación tiene un objetivo y lleva a una conversación.',
    bullets: ['Estrategia y calendario de contenidos', 'Posts, carruseles y guiones para Reels', 'Textos y piezas alineadas a tu marca'],
    msg: 'Hola, me interesa CONTENIDO con IA',
  },
  {
    id: 'presencia',
    icon: 'presence',
    stage: 'convencer' as StageKey,
    name: 'Mejora de presencia digital',
    question: 'Mi negocio se ve poco profesional en internet.',
    text: 'Ordenamos cómo te ve un cliente cuando te busca: Google, redes, web y WhatsApp con la misma imagen, información correcta y confianza.',
    bullets: ['Auditoría de presencia digital (Google, redes, web, WhatsApp)', 'Optimización de perfiles, bio, destacados y catálogo', 'Coherencia de marca en todos los canales'],
    msg: 'Hola, me interesa mejorar mi PRESENCIA digital',
  },
  {
    id: 'agente',
    icon: 'agent',
    stage: 'convertir' as StageKey,
    name: 'Agente IA en WhatsApp + CRM',
    question: 'Me escriben y no alcanzo a responder a todos.',
    text: 'Un agente de IA que responde en segundos, 24/7, agenda citas y hace seguimiento a quien no compró, con un CRM donde ves cada cliente.',
    bullets: ['Agente entrenado con tu negocio y tu tono', 'Agendamiento y recordatorios automáticos', 'CRM y seguimiento de ventas'],
    msg: 'Hola, me interesa el AGENTE IA en WhatsApp',
    wide: true,
  },
  {
    id: 'automatizacion',
    icon: 'analytics',
    stage: 'medir' as StageKey,
    name: 'Automatizaciones y analítica',
    question: 'Pierdo horas en tareas repetitivas y no sé qué está funcionando.',
    text: 'Automatizamos tareas como formularios, alertas y reportes, y te armamos un tablero con los números que importan.',
    bullets: ['Automatizaciones de procesos y alertas', 'Configuración de analítica y eventos de conversión', 'Reportes y tablero de ventas'],
    msg: 'Hola, me interesan AUTOMATIZACIONES y analítica',
  },
  {
    id: 'software',
    icon: 'code',
    stage: 'convertir' as StageKey,
    name: 'Creación de software a la medida',
    question: 'Mi negocio necesita algo que ninguna app resuelve.',
    text: 'Diseñamos y desarrollamos el sistema que tu operación necesita: agendas, paneles, portales, automatizaciones e integraciones, hechos para tu forma de trabajar.',
    bullets: ['Sistemas web y paneles de gestión a tu medida', 'Integración con WhatsApp, pagos y tus herramientas', 'Acompañamiento y soporte después de entregar'],
    msg: 'Hola, me interesa SOFTWARE A LA MEDIDA',
    wide: true,
    full: true,
  },
];

export const otherServices = ['Auditoría de seguridad web', 'Soporte y resolución de problemas técnicos'];

export const selector = [
  { problem: 'No me encuentran', start: 'SEO técnico y local + presencia digital', why: 'Primero hay que existir donde te buscan: Google y tu perfil en tu ciudad, con información correcta y profesional.', msg: 'Hola, mi problema es que NO ME ENCUENTRAN. Quiero el diagnóstico' },
  { problem: 'Me visitan pero no me escriben', start: 'Página web que convierte', why: 'El tráfico ya llega. Falta un mensaje claro, confianza y un camino directo a WhatsApp.', msg: 'Hola, me VISITAN pero NO ME ESCRIBEN. Quiero el diagnóstico' },
  { problem: 'Me escriben pero no compran / respondo tarde', start: 'Agente IA en WhatsApp + CRM', why: 'Responder en segundos y hacer seguimiento a quien no compró es donde se recuperan ventas.', msg: 'Hola, me escriben pero NO COMPRAN o respondo tarde. Quiero el diagnóstico' },
  { problem: 'Invierto en anuncios y no veo resultados', start: 'Estrategia de anuncios + landing', why: 'Campañas con un objetivo, una página que convierte y medición de cuántos clientes reales dejan.', msg: 'Hola, invierto en ANUNCIOS y no veo resultados. Quiero el diagnóstico' },
  { problem: 'No tengo tiempo para redes', start: 'Contenido con IA', why: 'Un calendario con objetivo, producido más rápido con IA y revisado por una persona.', msg: 'Hola, NO TENGO TIEMPO para redes. Quiero el diagnóstico' },
];

export const apps = [
  {
    id: 'ecoqr',
    icon: 'bolt',
    name: 'EcoQR',
    tagline: 'Confirma cada pago QR y anúncialo por voz en tu mostrador.',
    bullets: [
      'Lee los correos de pago y los anuncia en voz alta',
      'Portal de mostrador con tu QR, logo y mensaje',
      'Registro de ingresos, gastos y cierres diarios y mensuales',
      'Exporta a CSV o Excel; sin hardware ni integración bancaria',
    ],
    price: '$250.000 COP',
    period: '/mes por negocio',
    note: '14 días de prueba gratis · Sin comisión por transacción · Sin permanencia',
    msg: 'Hola, quiero suscribirme a ECOQR',
    url: 'https://ecoqr.sifunnel.live',
  },
  {
    id: 'clinicas',
    icon: 'people',
    name: 'SiFunnel Clínicas',
    tagline: 'Agenda, pacientes, profesionales y pagos en un solo sistema, sin papelitos ni Excel.',
    bullets: [
      'Menos citas perdidas: recordatorios y agente IA en WhatsApp que agenda y confirma',
      'Control del día: atenciones, ingresos y comisiones por profesional en tiempo real',
      'Portal del profesional con su agenda y pacientes, con tu marca',
    ],
    price: null as string | null,
    period: '',
    note: 'Suscripción mensual · Te damos el precio por WhatsApp',
    msg: 'Hola, quiero suscribirme a SIFUNNEL CLÍNICAS',
    url: null as string | null,
  },
];

export interface Faq { q: string; a: string }

export function getFaqs(): Faq[] {
  const faqs: (Faq | null)[] = [
    { q: '¿Cómo funcionan EcoQR y SiFunnel Clínicas?', a: 'Son apps por suscripción mensual: pagas mes a mes, sin comprar software. EcoQR tiene 14 días de prueba gratis; para Clínicas te damos el precio por WhatsApp.' },
    { q: '¿Tengo que contratar todos los servicios?', a: 'No. Puedes empezar por uno. En el diagnóstico te decimos cuál tiene más impacto para tu negocio hoy.' },
    {
      q: '¿Cuánto cuesta?',
      a: site.prices.individualFrom
        ? `Depende de lo que necesites. Los servicios individuales están desde ${site.prices.individualFrom}. El diagnóstico es gratis.`
        : 'Depende de lo que necesites. Te damos el precio exacto en el diagnóstico, que es gratis y sin compromiso.',
    },
    { q: '¿En cuánto tiempo veo resultados?', a: 'Depende del servicio. Una web nueva o un agente de WhatsApp se notan desde que se activan; el SEO es una inversión de mediano plazo. No prometemos posiciones ni cifras, pero sí medimos todo para que veas el avance.' },
    { q: '¿El contenido hecho con IA se ve genérico?', a: 'No, porque la IA es la herramienta, no la estrategia. Cada pieza parte de tu marca, tu público y un objetivo, y la revisa una persona antes de publicarse.' },
    { q: '¿Ya tengo página web, tienen que hacerla de nuevo?', a: 'No siempre. Primero la auditamos; si se puede mejorar, la mejoramos.' },
    { q: '¿Necesito saber de tecnología?', a: 'No. Nosotros hacemos toda la parte técnica.' },
    site.commitments.guarantee ? { q: '¿Hay permanencia mínima?', a: site.commitments.guarantee } : null,
    {
      q: '¿Qué pasa con mis datos y los de mis clientes?',
      a:
        'Se tratan conforme a la Ley 1581 de 2012 de protección de datos personales.' +
        (site.commitments.clientOwnsAssets ? ' Tus cuentas, tu web y tus datos son tuyos.' : ''),
    },
  ];
  return faqs.filter((f): f is Faq => f !== null);
}
