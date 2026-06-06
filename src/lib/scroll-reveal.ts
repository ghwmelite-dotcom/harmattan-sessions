// Scroll-reveal engine. Reveals [data-reveal] / [data-reveal-group] once as they enter view.
// All hidden states live in motion.css behind prefers-reduced-motion + html.reveal-ready.

const SELECTOR = '[data-reveal], [data-reveal-group]';
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer: IntersectionObserver | null = null;

function ensureObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  return observer;
}

function reveal(): void {
  if (reduce()) return; // motion.css leaves everything visible
  document.documentElement.classList.add('reveal-ready');
  const obs = ensureObserver();
  document.querySelectorAll(SELECTOR).forEach((el) => {
    if (!el.classList.contains('in')) obs.observe(el);
  });
}

// Set the no-FOUC flag on the INCOMING document before it paints (client navigations).
document.addEventListener('astro:before-swap', (e) => {
  if (!reduce()) {
    (e as unknown as { newDocument: Document }).newDocument.documentElement.classList.add('reveal-ready');
  }
});

// Runs on first load and after every view-transition navigation.
document.addEventListener('astro:page-load', reveal);
