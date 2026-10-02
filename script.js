document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Hero word-by-word timing ----------
     Starts after the intro overlay has faded out (~3.2s, matching the
     curtain-wipe + dot loading animation). */
  const HERO_START = reduceMotion ? 0 : 3.2;
  const words = document.querySelectorAll('.hero__prompt .w');
  words.forEach((w, i) => { w.style.animationDelay = `${HERO_START + i * 0.18}s`; });
  const wordsEnd = HERO_START + words.length * 0.18 + 0.6; // last word finishes

  /* ---------- Name letter explosion ----------
     Each word goes in its own group so the name can wrap onto two lines
     on narrow screens without splitting a word. */
  const brand = document.getElementById('heroBrand');
  const name = 'GENÍS BERNABÉ';

  if (brand) {
    let i = 0;
    name.split(' ').forEach(part => {
      const wordEl = document.createElement('span');
      wordEl.className = 'hero__word';
      [...part].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'l';
        span.textContent = ch;
        const randomRot = (Math.random() * 40 - 20).toFixed(1);
        span.style.setProperty('--r', `${randomRot}deg`);
        span.style.animationDelay = reduceMotion ? '0s' : `${wordsEnd + i * 0.07}s`;
        wordEl.appendChild(span);
        i++;
      });
      brand.appendChild(wordEl);
    });
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
