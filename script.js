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

  /* ---------- Quién soy: carnet 3D + terminal ----------
     Datos personales: edítalos aquí. */
  const QS = {
    zona: 'Europe/Madrid',
    edad: '24 años',
    ciudad: 'Arenys de Mar, Barcelona',
    idiomas: ['Catalán y castellano: nivel nativo.', 'Inglés: nivel First Certificate.'],
    stack: ['HTML · CSS · JS', 'WordPress · Elementor', 'Photoshop · Lightroom · Premiere', 'LearnWorlds · Instagram'],
    proyectos: ['CENEMA · Port de Mataró · Olimfit', 'Eurofitness · Eurofitness EDU'],
    estado: 'Abierto a nuevas ofertas',
    email: 'genisbernstan@gmail.com'
  };

  const qsCard = document.getElementById('qsCard');
  if (qsCard) {
    const qsScene = document.getElementById('qsScene');
    const qsOut = document.getElementById('qsOut');
    const qsForm = document.getElementById('qsForm');
    const qsCmd = document.getElementById('qsCmd');
    const fields = [...document.querySelectorAll('.qs-fld')];

    const hora = () => {
      try {
        return new Intl.DateTimeFormat('es-ES', { timeZone: QS.zona, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
      } catch (e) { return new Date().toLocaleTimeString(); }
    };

    // Respuestas de la terminal: [clase, texto]
    const CMDS = {
      whoami:     () => [['b', 'Genís Bernabé.'], ['', 'Creativo digital en Barcelona. Diseño web, contenido y redes sociales.']],
      edad:       () => [['', `${QS.edad}.`]],
      donde:      () => [['', `Vivo en ${QS.ciudad}.`], ['d', `Allí son las ${hora()}.`]],
      idiomas:    () => QS.idiomas.map(t => ['', t]),
      stack:      () => QS.stack.map(t => ['', t]),
      proyectos:  () => QS.proyectos.map(t => ['', t]),
      disponible: () => [['ok', `● ${QS.estado}.`]],
      contacto:   () => [['', QS.email]]
    };
    const NAMES = [...Object.keys(CMDS), 'help', 'clear'];

    /* --- terminal --- */
    let busy = false, interacted = false;
    const hist = []; let hi = 0;

    const line = (cls, text, instant) => {
      const d = document.createElement('div');
      if (cls) d.className = cls;
      qsOut.appendChild(d);
      if (instant || reduceMotion) { d.textContent = text; qsOut.scrollTop = qsOut.scrollHeight; return Promise.resolve(); }
      return new Promise(res => {
        let i = 0;
        const step = Math.max(1, Math.ceil(text.length / 36));
        (function go() {
          i = Math.min(text.length, i + step);
          d.textContent = text.slice(0, i);
          qsOut.scrollTop = qsOut.scrollHeight;
          if (i < text.length) setTimeout(go, 16); else res();
        })();
      });
    };

    const run = async (raw, instant) => {
      const c = raw.trim().toLowerCase();
      if (!c || busy) return;
      busy = true;
      if (!instant) { hist.push(c); hi = hist.length; }
      await line('c', c, true);
      if (c === 'clear') qsOut.textContent = '';
      else if (c === 'help') await line('d', `Prueba: ${NAMES.join(' · ')}`, instant);
      else if (CMDS[c]) { for (const [cls, t] of CMDS[c]()) await line(cls, t, instant); }
      else await line('d', `No conozco "${c}". Escribe help.`, instant);
      busy = false;
    };

    const intro = document.createElement('div');
    intro.className = 'd';
    intro.textContent = 'Pulsa cualquier dato del carnet y te cuento más.';
    qsOut.appendChild(intro);
    run('whoami', true);

    fields.forEach(f => {
      f.addEventListener('click', () => {
        interacted = true;
        fields.forEach(x => x.classList.remove('is-hint', 'is-on'));
        f.classList.add('is-on');
        run(f.dataset.cmd);
        // En móvil la terminal queda debajo del carnet: la traemos a la vista.
        if (window.matchMedia('(max-width:820px)').matches) {
          qsOut.closest('.qs-term').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        }
      });
    });

    qsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      interacted = true;
      const v = qsCmd.value; qsCmd.value = '';
      fields.forEach(x => x.classList.remove('is-hint', 'is-on'));
      run(v);
    });
    qsCmd.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' && hist.length) { hi = Math.max(0, hi - 1); qsCmd.value = hist[hi]; e.preventDefault(); }
      if (e.key === 'ArrowDown' && hist.length) { hi = Math.min(hist.length, hi + 1); qsCmd.value = hist[hi] || ''; e.preventDefault(); }
    });

    // Demostración: si nadie toca nada, la terminal responde sola al entrar en pantalla.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        setTimeout(() => { if (!interacted) run('donde'); }, 1600);
      }, { threshold: 0.5 });
      io.observe(qsCard);
    }

    /* --- inclinación 3D + brillo --- */
    if (!reduceMotion) {
      qsScene.addEventListener('pointermove', (e) => {
        const r = qsScene.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        qsCard.classList.remove('is-rest'); qsCard.classList.add('is-live');
        qsCard.style.setProperty('--rx', `${((0.5 - y) * 16).toFixed(2)}deg`);
        qsCard.style.setProperty('--ry', `${((x - 0.5) * 20).toFixed(2)}deg`);
        qsCard.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
        qsCard.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      });
      qsScene.addEventListener('pointerleave', () => {
        qsCard.classList.remove('is-live'); qsCard.classList.add('is-rest');
        qsCard.style.setProperty('--rx', '0deg'); qsCard.style.setProperty('--ry', '0deg');
      });
    }
  }

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
  // TODO: años y etapas provisionales; sustituir por los reales.
  const tlTrackEl = document.getElementById('tlTrack');
  if (tlTrackEl) {
    const TL = [
      { y: 2019, k: 'Etapa 01', h: 'Empiezo a hacer cosas con una cámara', p: 'Fotografía y diseño por curiosidad, y las primeras webs que nadie me pidió.', c: ['Fotografía', 'Diseño'] },
      { y: 2022, k: 'Etapa 02', h: 'Primeros clientes y estudio propio', p: 'Nace SHOUIT. Webs a medida, contenido y redes para negocios de aquí.', c: ['SHOUIT', 'Webs', 'Contenido'] },
      { y: 2024, k: 'Etapa 03', h: 'Agencia de comunicación en Barcelona', p: 'Creación de contenido y gestión de redes y de plataformas de formación, como Eurofitness EDU.', c: ['Eurofitness EDU', 'LearnWorlds', 'Redes'] },
      { y: 2026, k: 'Hoy', h: 'Abierto a nuevas ofertas', p: 'Busco un equipo donde sumar web, contenido y criterio visual. Esta web es la prueba.', c: ['Disponible', 'Barcelona'] }
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

    let curStop = -1;
    const setTl = v => {
      const digits = String(Math.floor(v + 0.0001));
      cols.forEach((el, i) => { el.style.transform = `translateY(-${digits[i]}em)`; });
      let idx = 0;
      TL.forEach((st, i) => { if (v >= st.y - 0.0001) idx = i; });
      tickBtns.forEach((b, i) => b.classList.toggle('is-on', i === idx));
      if (idx === curStop) return;
      curStop = idx;
      const d = TL[idx];
      kick.textContent = d.k; title.textContent = d.h; text.textContent = d.p;
      chips.innerHTML = '';
      d.c.forEach(c => { const li = document.createElement('li'); li.textContent = c; chips.appendChild(li); });
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

});
