document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Entrada de la portada ----------
     Todo en una sola pieza: las manchas del fondo se encienden (CSS),
     "GENÍS" sube desde una línea invisible y un instante después "BERNABÉ",
     el punto verde se posa al final y, cuando aterriza, aparece el resto
     del hero y el menú. */
  const brand = document.getElementById('heroBrand');
  const name = 'GENÍS BERNABÉ';
  const NAME_START = 0.3;  // s — cuándo empieza a subir la primera palabra
  const WORD_GAP = 0.12;   // s — retraso de la segunda palabra
  const RISE = 0.6;        // s — momento en que el nombre ya está prácticamente arriba
  const t = (s) => (reduceMotion ? '0s' : `${s.toFixed(2)}s`);

  if (brand) {
    const words = name.split(' ');
    words.forEach((part, wi) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'hero__word';
      [...part].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'l';
        span.textContent = ch;
        span.style.animationDelay = t(NAME_START + wi * WORD_GAP);
        wordEl.appendChild(span);
      });
      if (wi === words.length - 1) {
        const dot = document.createElement('span');
        dot.className = 'hero__dot';
        dot.setAttribute('aria-hidden', 'true');
        dot.style.setProperty('--d', t(NAME_START + wi * WORD_GAP + RISE));
        wordEl.appendChild(dot);
      }
      brand.appendChild(wordEl);
    });

    // El resto entra justo cuando el punto está aterrizando.
    const rest = NAME_START + (words.length - 1) * WORD_GAP + RISE + 0.4;
    const eyebrow = document.querySelector('.hero__eyebrow');
    const sub = document.querySelector('.hero__sub');
    const scrollCue = document.querySelector('.hero__scroll');
    if (eyebrow) eyebrow.style.setProperty('--d', t(rest));
    document.querySelectorAll('.hero__prompt .w').forEach((w, k) => {
      w.style.animationDelay = t(rest + 0.15 + k * 0.12);
    });
    if (sub) sub.style.setProperty('--d', t(rest + 0.6));
    if (scrollCue) scrollCue.style.setProperty('--d', t(rest + 0.8));
    document.documentElement.style.setProperty('--nav-d', t(rest + 0.1));
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  if (!('ontouchstart' in window)) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
  }

  /* ---------- Nav burger ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', false);
    });
  });

  /* ---------- Accordion ---------- */
  const items = document.querySelectorAll('[data-item]');

  const setItemState = (item, open) => {
    const body = item.querySelector('[data-body]');
    item.classList.toggle('is-open', open);
    body.style.maxHeight = open ? `${body.scrollHeight}px` : '0px';
  };

  items.forEach(item => {
    const trigger = item.querySelector('[data-trigger]');
    if (item.classList.contains('is-open')) setItemState(item, true);

    trigger.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach(i => setItemState(i, false));
      if (willOpen) setItemState(item, true);
    });
  });

  window.addEventListener('resize', () => {
    items.forEach(item => {
      if (item.classList.contains('is-open')) setItemState(item, true);
    });
  });

  /* ---------- Portfolio: galería horizontal que avanza con el scroll ----------
     La sección .pf es tan alta como el recorrido horizontal + una pantalla.
     Mientras su contenido está fijo (sticky), el scroll vertical se traduce
     en desplazamiento horizontal del carril, suavizado en cada frame. */
  const pf = document.getElementById('pf');
  if (pf) {
    const track = document.getElementById('pfTrack');
    const pfPanels = [...track.querySelectorAll('.pf__panel')];
    const pfMedia = pfPanels.map(p => p.querySelector('.pf__shot, .pf__feed'));
    const pfCount = document.getElementById('pfCount');
    const pfBar = document.getElementById('pfBar');
    const total = String(pfPanels.length).padStart(2, '0');

    let distance = 0, target = 0, current = 0, last = performance.now();

    const read = () => {
      const top = pf.getBoundingClientRect().top;
      const p = distance ? Math.min(1, Math.max(0, -top / distance)) : 0;
      target = p * distance;
    };

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      pf.style.height = `${window.innerHeight + distance}px`;
      read();
      current = target;
    };

    const render = (now) => {
      const dt = Math.min(64, now - last); last = now;
      const k = reduceMotion ? 1 : 1 - Math.pow(1 - 0.085, dt / 16.67);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.05) current = target;

      track.style.transform = `translate3d(${(-current).toFixed(2)}px,0,0)`;

      const vw = window.innerWidth;
      let active = 0, best = Infinity;
      pfPanels.forEach((panel, i) => {
        const r = panel.getBoundingClientRect();
        const off = (r.left + r.width / 2 - vw / 2) / vw;
        if (!reduceMotion && pfMedia[i]) pfMedia[i].style.transform = `translate3d(${(off * -5).toFixed(3)}%,0,0)`;
        if (Math.abs(off) < best) { best = Math.abs(off); active = i; }
      });

      pfCount.textContent = `${String(active + 1).padStart(2, '0')} / ${total}`;
      pfBar.style.transform = `scaleX(${(distance ? current / distance : 0).toFixed(4)})`;

      requestAnimationFrame(render);
    };

    // Teclado: al tabular a un panel fuera de pantalla, la página se desplaza hasta él.
    pfPanels.forEach(panel => {
      panel.addEventListener('focus', () => {
        const pfTop = pf.getBoundingClientRect().top + window.scrollY;
        const x = Math.min(distance, Math.max(0, panel.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)));
        window.scrollTo({ top: pfTop + x, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    measure();
    requestAnimationFrame(render);
  }

});
