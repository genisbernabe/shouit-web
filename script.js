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
        const inner = document.createElement('span'); // capa interior: recibe el efecto del cursor sin chocar con la animación de entrada
        inner.className = 'lf';
        inner.textContent = ch;
        span.appendChild(inner);
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

    /* ---------- Nombre elástico (solo al pasar el cursor) ----------
       Cada letra se alza un poco, se inclina y se tiñe de verde según lo cerca que esté
       el cursor, y vuelve a su sitio con un muelle. Sin cursor encima no se mueve nada.
       Solo con ratón: en pantallas táctiles no hay "pasar por encima". */
    const heroEl = document.getElementById('hero');
    if (heroEl && !reduceMotion && window.matchMedia('(hover:hover)').matches) {
      const marks = [...brand.querySelectorAll('.lf')].map(el => ({ el, k: 0, sk: 0, sy: 1 }));
      const enableAt = performance.now() + (rest + 0.3) * 1000;
      let mx = 0, my = 0, over = false, running = false;

      const step = () => {
        const fs = parseFloat(getComputedStyle(brand).fontSize) || 80;
        const R = Math.max(60, fs * 1.05);
        let peak = 0;
        marks.forEach(m => {
          const r = m.el.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = mx - cx, dy = my - cy;
          const k = over ? Math.exp(-((dx * dx + dy * dy) / (R * R)) * 2.2) : 0;
          const tsk = -Math.max(-1, Math.min(1, dx / R)) * k * 7;
          const tsy = 1 + 0.1 * k;
          m.k += (k - m.k) * 0.14;
          m.sk += (tsk - m.sk) * 0.14;
          m.sy += (tsy - m.sy) * 0.14;
          peak = Math.max(peak, m.k, Math.abs(m.sy - 1), Math.abs(m.sk) / 7);
          m.el.style.transform = `scale(${(1 - 0.02 * m.k).toFixed(3)}, ${m.sy.toFixed(3)}) skewX(${m.sk.toFixed(2)}deg)`;
          m.el.style.color = `color-mix(in srgb, var(--green) ${Math.round(m.k * 40)}%, var(--white))`;
        });
        if (peak < 0.004) {
          marks.forEach(m => { m.el.style.transform = ''; m.el.style.color = ''; m.k = 0; m.sk = 0; m.sy = 1; });
          running = false;
          return;
        }
        requestAnimationFrame(step);
      };
      const wake = () => { if (!running) { running = true; requestAnimationFrame(step); } };

      heroEl.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch' || performance.now() < enableAt) return;
        mx = e.clientX; my = e.clientY; over = true; wake();
      });
      heroEl.addEventListener('pointerleave', () => { over = false; wake(); });
    }
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

  /* ---------- Quién soy: datos de las cartas ----------
     Datos personales: edítalos aquí; las cartas se construyen solas más abajo. */
  const QS = {
    zona: 'Europe/Madrid',
    edad: 24,
    ciudad: 'Arenys de Mar',
    provincia: 'Barcelona',
    // v = nivel de 1 a 6 (6 = nativo, 4 = B2 / First Certificate)
    idiomas: [
      { n: 'Catalán', l: 'nativo', v: 6 },
      { n: 'Castellano', l: 'nativo', v: 6 },
      { n: 'Inglés', l: 'First Certificate', v: 4 }
    ],
    // g = web (verde) · c = contenido y producción (naranja) · m = marketing y redes (blanco) · f = relleno
    stack: [
      ['HTML', 'g', 1], ['CSS', 'g', 1], ['JS', 'g', 1], ['WordPress', 'g'], ['Elementor', 'g'],
      ['Photoshop', 'c'], ['Lightroom', 'c'], ['Premiere', 'c'], ['Organización y gestión de podcast', 'c'],
      ['LearnWorlds', 'm'], ['Instagram', 'm'], ['Google Analytics', 'm'], ['Meta Ads', 'm'], ['Google Ads', 'm']
    ],
    proyectos: [
      ['CENEMA', '/proyectos/cenema.html'], ['Port de Mataró', '/proyectos/mataro.html'], ['Olimfit', '/proyectos/olimfit.html'],
      ['Eurofitness', '/proyectos/eurofitness.html'], ['Eurofitness EDU', '/proyectos/eurofitness-edu.html']
    ],
    estado: 'Abierto a nuevas ofertas',
    email: 'genisbernstan@gmail.com'
  };

  /* ---------- Portfolio: galería horizontal ----------
     Escritorio: la sección .pf es tan alta como el recorrido horizontal + una pantalla.
     Mientras su contenido está fijo (sticky), el scroll vertical se traduce
     en desplazamiento horizontal del carril, suavizado en cada frame.
     Móvil: sin sticky; el carril es una tira que se desliza a mano hacia los lados. */
  const pf = document.getElementById('pf');
  if (pf) {
    const track = document.getElementById('pfTrack');
    const pfPanels = [...track.querySelectorAll('.pf__panel')];
    const pfMedia = pfPanels.map(p => p.querySelector('.pf__shot, .pf__feed'));
    const pfCount = document.getElementById('pfCount');
    const pfBar = document.getElementById('pfBar');
    const total = String(pfPanels.length).padStart(2, '0');
    const mobileMq = window.matchMedia('(max-width:700px)');

    let mobile = mobileMq.matches;
    let distance = 0, target = 0, current = 0, last = performance.now(), running = false;

    const setCount = (active) => { pfCount.textContent = `${String(active + 1).padStart(2, '0')} / ${total}`; };

    // Móvil: contador y barra siguen el deslizamiento manual
    const updateManual = () => {
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      pfBar.style.transform = `scaleX(${(max ? track.scrollLeft / max : 0).toFixed(4)})`;
      const left = track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft);
      let active = 0, best = Infinity;
      pfPanels.forEach((panel, i) => {
        const d = Math.abs(panel.getBoundingClientRect().left - left);
        if (d < best) { best = d; active = i; }
      });
      setCount(active);
    };

    const read = () => {
      if (mobile) return;
      const top = pf.getBoundingClientRect().top;
      const p = distance ? Math.min(1, Math.max(0, -top / distance)) : 0;
      target = p * distance;
    };

    const measure = () => {
      if (mobile) {
        pf.style.height = '';
        track.style.transform = '';
        pfMedia.forEach(m => { if (m) m.style.transform = ''; });
        updateManual();
        return;
      }
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      pf.style.height = `${window.innerHeight + distance}px`;
      read();
      current = target;
    };

    const render = (now) => {
      if (mobile) { running = false; return; }
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

      setCount(active);
      pfBar.style.transform = `scaleX(${(distance ? current / distance : 0).toFixed(4)})`;

      requestAnimationFrame(render);
    };

    const start = () => {
      if (!mobile && !running) { running = true; last = performance.now(); requestAnimationFrame(render); }
    };

    // Teclado (escritorio): al tabular a un panel fuera de pantalla, la página se desplaza hasta él.
    pfPanels.forEach(panel => {
      panel.addEventListener('focus', () => {
        if (mobile) return;
        const pfTop = pf.getBoundingClientRect().top + window.scrollY;
        const x = Math.min(distance, Math.max(0, panel.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)));
        window.scrollTo({ top: pfTop + x, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    track.addEventListener('scroll', () => { if (mobile) updateManual(); }, { passive: true });
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    mobileMq.addEventListener('change', () => { mobile = mobileMq.matches; measure(); start(); });
    measure();
    start();
  }

  /* ---------- Sobre mí: línea de tiempo ---------- */
  // Etapas reales (y = año de inicio; ic = icono sobre la barra). Para añadir o cambiar una etapa:
  // editar este array y los botones de #tlTicks en index.html (data-y y --p = (año − 2020) / 6).
  const TL_ICONS = {
    cap: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.8v4.2c0 1.2 2.5 2.5 5.5 2.5s5.5-1.3 5.5-2.5v-4.2M21.5 9.5v5"/>',
    megaphone: '<path d="M4 10v4l10 4V6L4 10z"/><path d="M14 9.5c2 .4 3.5 1.2 3.5 2.5s-1.5 2.1-3.5 2.5M6.5 15l1 4h2.5l-.9-3.5"/>',
    window: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M3 9h18M6.5 6.8h.01M9.2 6.8h.01"/>',
    book: '<path d="M4 5.5c0-.6.4-1 1-1h6v14H5a1 1 0 00-1 1zM20 5.5c0-.6-.4-1-1-1h-6v14h6a1 1 0 011 1z"/>',
    briefcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="1.5"/><path d="M9 7.5V5.5a1 1 0 011-1h4a1 1 0 011 1v2M3.5 13h17"/>',
    check: '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.3l2.7 2.7 5-5.4"/>'
  };
  const tlIcon = n => `<svg class="tl__ico" viewBox="0 0 24 24" aria-hidden="true">${TL_ICONS[n]}</svg>`;
  const tlTrackEl = document.getElementById('tlTrack');
  if (tlTrackEl) {
    const TL = [
      { y: 2020, ic: 'cap', k: 'Etapa 01', h: 'Empiezo marketing y publicidad', p: 'Grado superior de Marketing y Publicidad en el Centre d\'Estudis Polytechnics, en Barcelona. Aquí empieza todo: comunicación, publicidad y mis primeros proyectos.', c: ['Marketing', 'Publicidad', 'Polytechnics'] },
      { y: 2021, ic: 'megaphone', k: 'Etapa 02', h: 'Mis primeras prácticas, en un club', p: 'Prácticas en el Club Natació Sant Andreu, donde me encargo de la comunicación interna y externa. Mi primer contacto con el mundo laboral.', c: ['Comunicación', 'Club deportivo'] },
      { y: 2022, ic: 'window', k: 'Etapa 03', h: 'Mi primer trabajo en el sector', p: 'Community manager en Gestioncar, una cadena de concesionarios de compraventa. Llevo la comunicación, el diseño de la web, Instagram y los mailings hasta 2023.', c: ['Web', 'Instagram', 'Mailing'] },
      { y: 2024, ic: 'book', k: 'Etapa 04', h: 'Máster y prácticas en Modula TV', p: 'Máster en marketing digital en Net Digital School: web, redes y audiovisual. A la vez, prácticas en Modula TV, agencia de comunicación y marketing y productora audiovisual: contenido, materiales gráficos, webs de clientes, redes y plataformas de formación como Eurofitness EDU.', c: ['Net Digital School', 'Contenido', 'Diseño web', 'Redes', 'Eurofitness EDU'] },
      { y: 2025, ic: 'briefcase', k: 'Etapa 05', h: 'Contratado en Modula TV', p: 'Acabo el máster y paso a contrato en la misma empresa. Llevo clientes yo solo y tareas más complejas, y he subido de horas y de responsabilidad.', c: ['Gestión de clientes', 'Web', 'Redes'] },
      { y: 2026, ic: 'check', k: 'Hoy', h: 'Abierto a nuevas ofertas', p: 'Sigo creciendo en Modula TV, pero busco un equipo donde sumar web, contenido y criterio visual. Esta web es la prueba.', c: ['Disponible', 'Barcelona'] }
    ];
    const yearEl = document.getElementById('tlYear');
    const kick = document.getElementById('tlKick'), title = document.getElementById('tlTitle');
    const text = document.getElementById('tlText'), chips = document.getElementById('tlChips');
    const tickBtns = [...document.querySelectorAll('#tlTicks button')];
    const reduceTl = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cols = [];
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('span'); d.className = 'tl__d';
      const s = document.createElement('span');
      for (let n = 0; n < 10; n++) { const q = document.createElement('i'); q.textContent = n; s.appendChild(q); }
      d.appendChild(s); yearEl.appendChild(d); cols.push(s);
    }

    // Iconos sobre la barra: uno por etapa, se rellenan en verde al pasar la pastilla.
    const trackLine = tlTrackEl.querySelector('.tl__line');
    const nodes = TL.map(st => {
      const n = document.createElement('span'); n.className = 'tl__node'; n.setAttribute('aria-hidden', 'true');
      n.style.setProperty('--p', (st.y - TL[0].y) / (TL[TL.length - 1].y - TL[0].y));
      n.innerHTML = tlIcon(st.ic);
      trackLine.parentNode.insertBefore(n, trackLine.nextSibling);
      return n;
    });

    let curStop = -1;
    const showStage = idx => {
      const d = TL[idx];
      kick.innerHTML = tlIcon(d.ic) + `<span>${d.k}</span>`; title.textContent = d.h; text.textContent = d.p;
      chips.innerHTML = '';
      d.c.forEach(c => { const li = document.createElement('li'); li.textContent = c; chips.appendChild(li); });
    };
    // La caja de texto mide siempre lo que la etapa más larga: así la barra de arrastre no se mueve al cambiar de año.
    const txtBox = document.querySelector('.tl__txt');
    const lockHeight = () => {
      if (!txtBox) return;
      txtBox.style.minHeight = '';
      let max = 0;
      TL.forEach((_, i) => { showStage(i); max = Math.max(max, txtBox.offsetHeight); });
      showStage(Math.max(0, curStop));
      txtBox.style.minHeight = `${max}px`;
    };
    let lockT;
    window.addEventListener('resize', () => { clearTimeout(lockT); lockT = setTimeout(lockHeight, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockHeight);
    window.addEventListener('load', lockHeight);
    const setTl = v => {
      const digits = String(Math.floor(v + 0.0001));
      cols.forEach((el, i) => { el.style.transform = `translateY(-${digits[i]}em)`; });
      let idx = 0;
      TL.forEach((st, i) => { if (v >= st.y - 0.0001) idx = i; });
      tickBtns.forEach((b, i) => b.classList.toggle('is-on', i === idx));
      nodes.forEach((n, i) => { n.classList.toggle('is-past', i <= idx); n.classList.toggle('is-now', i === idx); });
      if (idx === curStop) return;
      curStop = idx;
      showStage(idx);
    };

    let tlRaf, tlVal = TL[0].y, tlDrag = false;
    const Y0 = TL[0].y, Y1 = TL[TL.length - 1].y;
    const track = document.getElementById('tlTrack'), pill = document.getElementById('tlPill');
    const fill = document.getElementById('tlFill'), line = track.querySelector('.tl__line');
    const clampTl = v => Math.max(Y0, Math.min(Y1, v));

    const paint = v => {
      tlVal = clampTl(v);
      const p = (tlVal - Y0) / (Y1 - Y0) * 100;
      pill.style.left = p + '%'; fill.style.width = p + '%';
      pill.setAttribute('aria-valuenow', Math.floor(tlVal));
      setTl(tlVal);
    };
    const markUsed = () => { pill.classList.remove('is-hint'); pill.classList.add('is-used'); };
    const animTl = (to, dur = 550, done) => {
      cancelAnimationFrame(tlRaf);
      if (reduceTl) { paint(to); if (done) done(); return; }
      const from = tlVal, t0 = performance.now();
      const f = t => {
        const k = Math.min(1, (t - t0) / dur), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        paint(from + (to - from) * e);
        if (k < 1) tlRaf = requestAnimationFrame(f); else if (done) done();
      };
      tlRaf = requestAnimationFrame(f);
    };
    const fromX = e => {
      const r = line.getBoundingClientRect();
      return Y0 + (Y1 - Y0) * Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    };

    track.addEventListener('pointerdown', e => {
      tlDrag = true; track.setPointerCapture(e.pointerId);
      cancelAnimationFrame(tlRaf); markUsed(); paint(fromX(e));
    });
    track.addEventListener('pointermove', e => { if (tlDrag) paint(fromX(e)); });
    const endDrag = () => { tlDrag = false; };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    pill.addEventListener('keydown', e => {
      const n = e.key === 'ArrowRight' ? .25 : e.key === 'ArrowLeft' ? -.25 : 0;
      if (n) { e.preventDefault(); cancelAnimationFrame(tlRaf); markUsed(); paint(tlVal + n); }
    });
    tickBtns.forEach(b => b.addEventListener('click', () => { markUsed(); animTl(+b.dataset.y); }));

    paint(Y0);
    lockHeight();

    // Al llegar a la sección, la pastilla se mueve sola hacia 2021 y vuelve, para enseñar el gesto.
    if (!reduceTl && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        setTimeout(() => {
          if (tlDrag || pill.classList.contains('is-used')) return;
          animTl(2021.3, 700, () => setTimeout(() => {
            if (!tlDrag && !pill.classList.contains('is-used')) animTl(Y0, 700);
          }, 250));
        }, 500);
      }, { threshold: .55 });
      io.observe(document.getElementById('sobre-mi'));
    }
  }

  /* ---------- Páginas de proyecto: "Qué hice", los servicios cambian la vista ---------- */
  const svcTabs = [...document.querySelectorAll('.svcs .svc')];
  if (svcTabs.length) {
    const panels = svcTabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    const selectSvc = (i, focus) => {
      svcTabs.forEach((t, j) => {
        const on = j === i;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) svcTabs[i].focus();
    };
    svcTabs.forEach((t, i) => {
      t.addEventListener('click', () => selectSvc(i));
      t.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') selectSvc(i); });
      t.addEventListener('keydown', e => {
        const n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!n) return;
        e.preventDefault();
        selectSvc((i + n + svcTabs.length) % svcTabs.length, true);
      });
    });
    selectSvc(Math.max(0, svcTabs.findIndex(t => t.getAttribute('aria-selected') === 'true')));

    // Miniaturas: cambian la captura visible dentro del mismo servicio
    document.querySelectorAll('.svc-view').forEach(view => {
      const shots = [...view.querySelectorAll('.svc-stage .proyecto-shot')];
      const thumbs = [...view.querySelectorAll('.svc-thumbs button')];
      thumbs.forEach((b, i) => b.addEventListener('click', () => {
        shots.forEach((s, j) => { s.hidden = j !== i; });
        thumbs.forEach((t, j) => t.setAttribute('aria-pressed', j === i));
      }));
    });
  }


  /* ---------- Quién soy · cartas ----------
     Móvil (≤820px): baraja que se desliza. Escritorio: todas las tarjetas a la vista en rejilla. */
  const qdDeck = document.getElementById('qdDeck');
  if (qdDeck) {
    const horaQd = () => {
      try {
        return new Intl.DateTimeFormat('es-ES', { timeZone: QS.zona, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
      } catch (e) { return new Date().toLocaleTimeString().slice(0, 5); }
    };
    const pad = (x) => String(x).padStart(2, '0');
    const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
    const COL = { g: '#00ff87', c: '#e0805f', m: '#f0ede8' };

    /* --- dibujos de cada carta (HTML/SVG propio, sin datos externos) --- */
    const visEdad = () => {
      const tens = Math.floor(QS.edad / 10), ones = QS.edad % 10;
      const strip = (n) => Array.from({ length: n }, (_, i) => `<i>${i % 10}</i>`).join('');
      let ticks = '';
      for (let i = 0; i <= 30; i++) {
        const x = 6 + i * 9.6, big = i % 5 === 0, cls = i <= QS.edad ? 'on' : 'off';
        ticks += `<line class="${cls}" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${big ? 2 : 8}" y2="14"/>`;
        if (big) ticks += `<text x="${x.toFixed(1)}" y="26">${i}</text>`;
      }
      const mx = (QS.edad * 9.6).toFixed(1);
      return `<div class="qd-age"><div class="qd-odo" role="img" aria-label="${QS.edad} años">` +
        `<span class="qd-odo__d" style="--v:${tens}"><span>${strip(10)}</span></span>` +
        `<span class="qd-odo__d" style="--v:${10 + ones}"><span>${strip(20)}</span></span></div>` +
        `<div class="qd-age__u">años</div>` +
        `<svg class="qd-ruler" viewBox="0 0 300 30" aria-hidden="true">${ticks}<g class="mk" style="--mx:${mx}px"><line x1="6" x2="6" y1="0" y2="14"/><path d="M6,14 l-4.5,7 h9z"/></g></svg></div>`;
    };
    const visMapa = () =>
      `<svg class="qd-map" viewBox="0 0 330 240" role="img" aria-label="Silueta de Catalunya con Barcelona y ${QS.ciudad} señaladas">` +
      `<path class="qd-map__land" d="M26,240 L20,237 L20,234 L17,231 L8,229 L7,226 L9,223 L7,221 L5,222 L4,218 L0,218 L0,216 L4,215 L8,209 L5,203 L9,195 L7,189 L8,189 L2,182 L2,178 L3,177 L6,178 L6,176 L10,174 L12,168 L15,168 L16,162 L14,157 L16,155 L11,150 L14,145 L13,141 L17,141 L21,135 L20,129 L14,129 L14,126 L12,123 L12,121 L16,115 L17,116 L18,113 L23,112 L24,109 L26,107 L28,107 L30,103 L31,104 L33,102 L32,100 L33,96 L30,95 L32,91 L33,92 L35,89 L38,87 L37,86 L40,78 L40,73 L42,72 L40,71 L42,65 L45,55 L44,54 L46,52 L42,51 L44,49 L40,38 L43,37 L42,36 L46,26 L40,24 L40,21 L37,18 L39,16 L37,10 L38,6 L37,2 L39,1 L41,0 L53,4 L58,7 L60,6 L62,8 L69,8 L72,9 L76,16 L81,14 L83,15 L91,15 L90,16 L93,18 L97,27 L96,29 L98,30 L95,33 L98,33 L99,36 L96,39 L97,40 L98,44 L106,44 L106,42 L114,40 L114,38 L117,38 L119,37 L119,38 L128,39 L131,42 L135,42 L138,50 L141,53 L147,51 L150,46 L153,45 L156,46 L160,43 L173,48 L177,54 L182,54 L183,52 L192,53 L190,49 L192,49 L192,47 L198,45 L199,46 L203,43 L204,41 L206,42 L207,40 L210,42 L213,39 L214,41 L220,40 L223,45 L226,43 L229,44 L229,51 L232,54 L234,52 L236,55 L237,54 L240,55 L238,62 L234,63 L233,64 L230,61 L227,63 L225,67 L226,75 L230,77 L233,81 L232,86 L234,93 L230,102 L225,104 L220,111 L215,113 L212,118 L203,120 L199,125 L176,135 L169,140 L161,144 L153,153 L151,160 L115,171 L105,172 L94,178 L86,178 L81,182 L80,180 L79,181 L77,185 L73,183 L62,187 L40,211 L43,215 L45,215 L47,214 L43,212 L46,212 L50,218 L54,219 L53,222 L45,228 L39,236 L35,237 L32,234 L34,234 L37,235 L37,233 L41,233 L44,228 L33,230 L28,235Z"/>` +
      `<path class="qd-map__lead" d="M153,151 L176,172 M182,131 L202,112"/>` +
      `<circle class="qd-map__ring" cx="182" cy="131" r="7"/>` +
      `<circle class="qd-map__pin" cx="153" cy="151" r="5"/><circle class="qd-map__pin" cx="182" cy="131" r="5"/>` +
      `<text x="180" y="184">Barcelona</text><text x="206" y="109">${QS.ciudad}</text></svg>`;
    const visIdiomas = () => '<div class="qd-lang">' + QS.idiomas.map(l => {
      let s = ''; for (let i = 0; i < 6; i++) s += `<i class="${i < l.v ? 'on' : ''}" style="--n:${i}"></i>`;
      return `<div><b>${l.n}<span>${l.l}</span></b><div class="qd-seg">${s}</div></div>`;
    }).join('') + '</div>';
    const visStack = () => '<div class="qd-tags">' + QS.stack.map((t, i) =>
      `<span class="${t[2] ? 'f' : ''}" style="--tc:${COL[t[1]]};--n:${i}">${t[0]}</span>`).join('') + '</div>';
    const visProyectos = () => '<div class="qd-list">' + QS.proyectos.map((p, i) =>
      `<a href="${p[1]}" draggable="false" style="--n:${i}"><em>${pad(i + 1)}</em>${p[0]}<b aria-hidden="true">→</b></a>`).join('') + '</div>';
    const visEstado = () =>
      `<div class="qd-sign-wrap"><div class="qd-sign" role="img" aria-label="${QS.estado}"><b>ABIERTO</b><small>a nuevas ofertas</small></div></div>`;
    const visArroba = () => '<div class="qd-at" aria-hidden="true">@</div>';

    const CARDS = [
      { id: true },
      { k: 'Edad', c: 'var(--green)', vis: visEdad },
      { k: 'Vivo en', c: 'var(--accent)', head: [QS.ciudad, '2rem'], vis: visMapa, lines: [['', `Vivo en ${QS.ciudad}, ${QS.provincia}.`], ['d clock', '']] },
      { k: 'Idiomas', c: 'var(--white)', head: ['CA · ES · EN', '2rem'], vis: visIdiomas },
      { k: 'Stack', c: 'var(--green)', vis: visStack },
      { k: 'Proyectos', c: 'var(--accent)', head: [String(QS.proyectos.length), '3rem', 'proyectos'], vis: visProyectos },
      { k: 'Estado', c: 'var(--green)', vis: visEstado, lines: [['ok', `● ${QS.estado}.`]] },
      { k: 'Contacto', c: 'var(--white)', head: ['Escríbeme', '2.1rem'], vis: visArroba, lines: [['', QS.email]], copy: true }
    ];
    const n = CARDS.length;

    const els = CARDS.map((c, i) => {
      const card = mk('div', 'qd-card');
      const stripe = mk('div', 'qd-card__stripe');
      const body = mk('div', 'qd-card__body');
      if (c.id) {
        stripe.append(mk('span', '', 'Carnet'), mk('span', '', 'BCN'));
        // TODO: sustituir por tu foto (formato 4:5)
        const name = mk('div', 'qd-card__name'); name.append('Genís', document.createElement('br'), 'Bernabé', mk('i'));
        const go = mk('div', 'qd-card__go'); go.append(mk('span', '', 'Creativo digital'));
        const sw = mk('span', '', 'Desliza '); sw.append(mk('b', '', '→')); go.append(sw);
        body.append(mk('div', 'qd-card__pic', 'Tu foto aquí'), name, go);
      } else {
        card.style.setProperty('--c', c.c);
        stripe.append(mk('span', '', c.k), mk('span', '', `${pad(i + 1)} / ${pad(n)}`));
        if (c.head) {
          const h = mk('div', 'qd-head', c.head[0]); h.style.setProperty('--fs', c.head[1]);
          if (c.head[2]) h.append(mk('small', '', c.head[2]));
          body.append(h);
        }
        const vis = mk('div', 'qd-vis'); vis.innerHTML = c.vis(); body.append(vis);
        if (c.lines || c.copy) {
          const lines = mk('div', 'qd-lines');
          (c.lines || []).forEach(([cls, t]) => { const l = mk('div', cls.replace('clock', '').trim(), t); if (cls.includes('clock')) l.dataset.clock = ''; lines.append(l); });
          if (c.copy) {
            const b = mk('button', 'qd-copy', 'Copiar email'); b.type = 'button';
            b.addEventListener('click', (e) => {
              e.stopPropagation();
              const ok = () => { b.classList.add('is-ok'); b.textContent = 'Copiado'; setTimeout(() => { b.classList.remove('is-ok'); b.textContent = 'Copiar email'; }, 1600); };
              if (navigator.clipboard) navigator.clipboard.writeText(QS.email).then(ok, () => {});
            });
            lines.append(b);
          }
          body.append(lines);
        }
      }
      card.append(stripe, body, mk('div', 'qd-card__glare'));
      qdDeck.append(card);
      return card;
    });
    const paintClock = () => qdDeck.querySelectorAll('[data-clock]').forEach(x => { x.textContent = `Allí son las ${horaQd()}.`; });
    paintClock(); setInterval(paintClock, 20000);

    // El cursor personalizado también reacciona a los enlaces y botones de las cartas
    qdDeck.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });

    const dotsEl = document.getElementById('qdDots');
    CARDS.forEach(() => dotsEl.append(document.createElement('i')));
    const countEl = document.getElementById('qdCount');
    const hintEl = document.querySelector('.qd__hint');
    const ROT = [0, -2.4, 2.2];
    const mq = window.matchMedia('(max-width:820px)');
    let mobile = mq.matches, cur = 0, busy = false, drag = null, suppress = false, io = null;

    /* ---- Móvil: baraja ---- */
    const place = (el, i) => {
      const d = (i - cur + n) % n;
      el.style.zIndex = n - d;
      el.classList.toggle('is-top', d === 0);
      el.classList.toggle('is-in', d === 0);   // los dibujos se animan cuando la carta llega al frente
      el.inert = d !== 0;
      if (d < 3) { el.style.opacity = 1; el.style.transform = `translateY(${d * 15}px) scale(${1 - d * 0.055}) rotate(${ROT[d]}deg)`; }
      else { el.style.opacity = 0; el.style.transform = 'translateY(36px) scale(.84)'; }
    };
    const render = () => {
      els.forEach(place);
      dotsEl.querySelectorAll('i').forEach((x, i) => x.classList.toggle('on', i === cur));
      countEl.textContent = `${pad(cur + 1)} / ${pad(n)} · ${cur === 0 ? 'Carnet' : CARDS[cur].k}`;
    };
    const seen = () => { if (hintEl) hintEl.classList.add('is-seen'); };
    const fling = (dir) => {
      if (busy) return; busy = true;
      const el = els[cur];
      el.classList.remove('is-drag');
      el.style.transition = reduceMotion ? 'none' : 'transform .38s cubic-bezier(.4,0,.8,.5), opacity .38s';
      el.style.transform = `translate(${dir * 135}%,-6%) rotate(${dir * 20}deg)`; el.style.opacity = 0;
      setTimeout(() => {
        el.style.transition = 'none'; cur = (cur + 1) % n; render(); void el.offsetWidth; el.style.transition = ''; busy = false;
      }, reduceMotion ? 0 : 380);
    };
    const back = () => {
      if (busy) return; busy = true;
      const i = (cur - 1 + n) % n, el = els[i];
      el.style.transition = 'none'; el.style.zIndex = n + 1; el.style.opacity = 0;
      el.style.transform = 'translate(-135%,-6%) rotate(-20deg)';
      void el.offsetWidth; el.style.transition = '';
      cur = i; render();
      setTimeout(() => { busy = false; }, reduceMotion ? 0 : 400);
    };

    qdDeck.addEventListener('pointerdown', (e) => {
      if (!mobile || busy || !els[cur].contains(e.target) || e.target.closest('button')) return;
      drag = { x: e.clientX, y: e.clientY, dx: 0, t: Date.now(), moved: false, id: e.pointerId, link: !!e.target.closest('a') };
    });
    qdDeck.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { drag = null; return; }  // scroll vertical: no lo bloqueamos
        if (Math.abs(dx) < 6) return;
        drag.moved = true; els[cur].classList.add('is-drag');
        try { qdDeck.setPointerCapture(e.pointerId); } catch (_) {}
      }
      drag.dx = dx;
      els[cur].style.transform = `translate(${dx}px,${Math.abs(dx) * 0.06}px) rotate(${dx / 16}deg)`;
    });
    qdDeck.addEventListener('pointerup', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null;
      els[cur].classList.remove('is-drag');
      if (!d.moved) { if (!d.link) { seen(); fling(1); } return; }  // un toque pasa de carta; un enlace se abre
      suppress = true; setTimeout(() => { suppress = false; }, 60);  // al deslizar sobre un enlace, no lo abrimos
      const v = Math.abs(d.dx) / Math.max(1, Date.now() - d.t);
      if (Math.abs(d.dx) > 90 || v > 0.5) { seen(); fling(d.dx > 0 ? 1 : -1); } else place(els[cur], cur);
    });
    qdDeck.addEventListener('click', (e) => { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);
    qdDeck.addEventListener('pointercancel', () => {
      if (!drag) return; drag = null; els[cur].classList.remove('is-drag'); place(els[cur], cur);
    });
    qdDeck.addEventListener('keydown', (e) => {
      if (!mobile) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); seen(); fling(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); seen(); back(); }
    });
    document.getElementById('qdNext').addEventListener('click', () => { seen(); fling(1); });
    document.getElementById('qdPrev').addEventListener('click', () => { seen(); back(); });

    /* ---- Escritorio: rejilla; cada tarjeta entra (y anima su dibujo) al verse ---- */
    const setMode = () => {
      mobile = mq.matches;
      if (io) { io.disconnect(); io = null; }
      els.forEach(el => {
        el.style.transform = ''; el.style.opacity = ''; el.style.zIndex = ''; el.style.transition = '';
        el.inert = false; el.classList.remove('is-top', 'is-in', 'is-drag');
      });
      if (mobile) {
        qdDeck.tabIndex = 0;
        render();
      } else {
        qdDeck.removeAttribute('tabindex');
        els.forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 0.09}s`));
        if ('IntersectionObserver' in window) {
          io = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
          }, { threshold: 0.2 });
          els.forEach(el => io.observe(el));
        } else els.forEach(el => el.classList.add('is-in'));
      }
    };
    mq.addEventListener('change', setMode);
    setMode();
  }


  /* ---------- Visor de imágenes (páginas de detalle) ----------
     Cada imagen de "Qué hice" se amplía al pulsarla; dentro del visor se pasa con flechas, teclado o deslizando. */
  const lbImgs = [...document.querySelectorAll('.svc-view .proyecto-shot img, .svc-view .proyecto-posts img, .svc-view .proyecto-photos img')];
  if (lbImgs.length) {
    const lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Imagen ampliada');
    lb.innerHTML = '<div class="lb__stage"><img class="lb__img" alt="" draggable="false">' +
      '<button type="button" class="lb__btn lb__prev" aria-label="Imagen anterior">←</button>' +
      '<button type="button" class="lb__btn lb__next" aria-label="Imagen siguiente">→</button>' +
      '<button type="button" class="lb__btn lb__close" aria-label="Cerrar">✕</button></div>' +
      '<div class="lb__bar"><span class="lb__cap"></span><span class="lb__count"></span></div>';
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('.lb__img'), lbCap = lb.querySelector('.lb__cap'), lbCount = lb.querySelector('.lb__count');
    const lbPrev = lb.querySelector('.lb__prev'), lbNext = lb.querySelector('.lb__next'), lbClose = lb.querySelector('.lb__close');
    let lbSet = [], lbI = 0, lbFrom = null;

    // El cursor personalizado también reacciona a los botones del visor y a las imágenes
    [lbPrev, lbNext, lbClose, ...lbImgs].forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });

    const pad2 = n => String(n).padStart(2, '0');
    const lbShow = (i, instant) => {
      lbI = (i + lbSet.length) % lbSet.length;
      const src = lbSet[lbI];
      const apply = () => {
        lbImg.src = src.currentSrc || src.src; lbImg.alt = src.alt;
        lbCap.textContent = src.alt; lbCount.textContent = `${pad2(lbI + 1)} / ${pad2(lbSet.length)}`;
        lbImg.classList.remove('is-swap');
      };
      if (instant || reduceMotion) apply();
      else { lbImg.classList.add('is-swap'); setTimeout(apply, 160); }
      // precarga de las vecinas
      [lbI - 1, lbI + 1].forEach(j => { const s = lbSet[(j + lbSet.length) % lbSet.length]; if (s) new Image().src = s.src; });
    };
    const lbOpen = (img) => {
      const view = img.closest('.svc-view');
      lbSet = lbImgs.filter(x => x.closest('.svc-view') === view);
      lbFrom = img;
      lb.toggleAttribute('data-single', lbSet.length < 2);
      lbShow(lbSet.indexOf(img), true);
      lb.classList.add('is-open');
      document.documentElement.style.overflow = 'hidden';
      lbClose.focus({ preventScroll: true });
    };
    const lbHide = () => {
      lb.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      if (lbFrom) lbFrom.focus({ preventScroll: true });
    };

    lbImgs.forEach(img => {
      img.classList.add('is-zoomable'); img.tabIndex = 0; img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Ampliar: ${img.alt}`);
      img.addEventListener('click', () => lbOpen(img));
      img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(img); } });
    });
    lbPrev.addEventListener('click', () => lbShow(lbI - 1));
    lbNext.addEventListener('click', () => lbShow(lbI + 1));
    lbClose.addEventListener('click', lbHide);
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb__stage')) lbHide(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') lbHide();
      else if (e.key === 'ArrowRight') { e.preventDefault(); lbShow(lbI + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); lbShow(lbI - 1); }
      else if (e.key === 'Tab') {  // el foco se queda dentro del visor
        const f = [lbClose, lbPrev, lbNext].filter(b => b.offsetParent !== null);
        const i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    // Deslizar con el dedo (o arrastrar con el ratón) para pasar de imagen
    let sx = null, sy = 0;
    lb.addEventListener('pointerdown', e => { if (e.target.closest('.lb__btn')) return; sx = e.clientX; sy = e.clientY; });
    lb.addEventListener('pointerup', e => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) lbShow(lbI + (dx < 0 ? 1 : -1));
    });
    lb.addEventListener('pointercancel', () => { sx = null; });
  }

});
