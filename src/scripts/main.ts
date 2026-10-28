const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Aparición al hacer scroll ---------- */
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      revealIO.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
);
document.querySelectorAll('.reveal, .stagger, [data-observe]').forEach((el) => revealIO.observe(el));

/* ---------- Contadores ---------- */
const countIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      countIO.unobserve(el);
      const target = Number(el.dataset.count);
      if (reduceMotion) {
        el.textContent = String(target);
        continue;
      }
      const duration = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  },
  { threshold: 0.6 },
);
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => countIO.observe(el));

/* ---------- Spotlight en tarjetas ---------- */
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.spotlight');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
    { passive: true },
  );
}

/* ---------- Cabecera ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');

let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Medición: evento clic_whatsapp con servicio y sección ---------- */
type Win = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; dataLayer?: unknown[] };
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-wa]');
  if (!link) return;
  const w = window as Win;
  const servicio = link.dataset.service || 'diagnostico';
  const seccion = link.closest<HTMLElement>('[data-section]')?.dataset.section || 'desconocida';
  const params = { servicio, seccion };
  w.gtag?.('event', 'clic_whatsapp', params);
  w.fbq?.('track', 'Contact', params);
  w.dataLayer?.push({ event: 'clic_whatsapp', ...params });
});
