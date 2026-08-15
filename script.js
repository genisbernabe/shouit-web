document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Hero word-by-word timing ----------
     Starts after the intro overlay has faded out (~2.2s). */
  const HERO_START = reduceMotion ? 0 : 2.3;
  const words = document.querySelectorAll('.hero__prompt .w');
  words.forEach((w, i) => { w.style.animationDelay = `${HERO_START + i * 0.18}s`; });
  const wordsEnd = HERO_START + words.length * 0.18 + 0.6; // last word finishes

  /* ---------- SHOUIT letter explosion ---------- */
  const brand = document.getElementById('heroBrand');
  const word = 'SHOUIT';
  const colors = ['var(--white)', 'var(--green)'];

  [...word].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'l';
    span.textContent = ch;
    span.style.color = colors[i % 2];
    const randomRot = (Math.random() * 40 - 20).toFixed(1);
    span.style.setProperty('--r', `${randomRot}deg`);
    span.style.animationDelay = reduceMotion ? '0s' : `${wordsEnd + i * 0.07}s`;
    brand.appendChild(span);
  });

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

  /* ---------- Portfolio modal ---------- */
  const layer = document.getElementById('modalLayer');
  const openers = document.querySelectorAll('[data-modal]');
  const panels = document.querySelectorAll('[data-modal-panel]');

  const openModal = (key) => {
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.modalPanel === key));
    layer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    layer.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openers.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal));
  });
  layer.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));
  layer.addEventListener('click', (e) => { if (e.target === layer) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

});
