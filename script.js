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

  /* ---------- Quién soy: carnet 3D + terminal ----------
     Los datos personales están aquí arriba. Son de EJEMPLO: cámbialos por los reales. */
  const QS = {
    nacimiento: new Date(1997, 2, 14),      // EJEMPLO: 14/03/1997
    zona: 'Europe/Madrid',
    ciudad: 'Barcelona',
    idiomas: 'Castellano · Català · English',
    stack: ['HTML · CSS · JS', 'WordPress · Elementor', 'Photoshop · Lightroom · Premiere', 'LearnWorlds · Instagram'],
    proyectos: ['CENEMA · Port de Mataró · Olimfit', 'Eurofitness · Eurofitness EDU'],
    estado: 'Abierto a nuevas ofertas',
    email: 'tu@email.com'
  };

  const qsCard = document.getElementById('qsCard');
  if (qsCard) {
    const qsScene = document.getElementById('qsScene');
    const qsOut = document.getElementById('qsOut');
    const qsForm = document.getElementById('qsForm');
    const qsCmd = document.getElementById('qsCmd');
    const fields = [...document.querySelectorAll('.qs-fld')];

    const edad = () => {
      const n = new Date();
      let a = n.getFullYear() - QS.nacimiento.getFullYear();
      const m = n.getMonth() - QS.nacimiento.getMonth();
      if (m < 0 || (m === 0 && n.getDate() < QS.nacimiento.getDate())) a--;
      return a;
    };
    const dias = () => Math.floor((Date.now() - QS.nacimiento) / 864e5).toLocaleString('es-ES');
    const hora = () => {
      try {
        return new Intl.DateTimeFormat('es-ES', { timeZone: QS.zona, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
      } catch (e) { return new Date().toLocaleTimeString(); }
    };

    // Respuestas de la terminal: [clase, texto]
    const CMDS = {
      whoami:     () => [['b', 'Genís Bernabé.'], ['', 'Creativo digital en Barcelona. Diseño web, contenido y redes sociales.']],
      edad:       () => [['', `${edad()} años. Llevo ${dias()} días en el mundo.`]],
      donde:      () => [['', `Vivo en ${QS.ciudad}, España.`], ['d', `Allí son las ${hora()}.`]],
      idiomas:    () => [['', QS.idiomas]],
      stack:      () => QS.stack.map(t => ['', t]),
      proyectos:  () => QS.proyectos.map(t => ['', t]),
      disponible: () => [['ok', `● ${QS.estado}.`]],
      contacto:   () => [['', QS.email]]
    };
    const NAMES = [...Object.keys(CMDS), 'help', 'clear'];

    // Resumen que se ve en cada fila del carnet
    const PREVIEW = {
      edad: () => `${edad()} años`, donde: () => QS.ciudad, idiomas: () => 'ES · CA · EN',
      stack: () => 'HTML · WP · Adobe', proyectos: () => '5 casos', disponible: () => 'Abierto', contacto: () => QS.email
    };
    document.querySelectorAll('[data-v]').forEach(el => { el.textContent = PREVIEW[el.dataset.v](); });

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
