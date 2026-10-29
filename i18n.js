/* ==========================================================
   Idiomas: castellano (por defecto, es el texto que hay escrito en el HTML) y catalán.

   Cómo funciona
   - El HTML y script.js están escritos en castellano. Aquí está el diccionario CA: clave = texto en
     castellano tal cual aparece en la web, valor = su traducción al catalán.
   - Al cargar (y al cambiar de idioma) se recorren los textos, los alt, aria-label, placeholder y title,
     y se sustituyen por su traducción. Al volver a castellano se restauran los originales.
   - Idioma inicial: ?lang=ca|es en la URL → el que eligió antes el visitante → el del navegador.
   - Los textos que dibuja script.js (cartas, línea de tiempo, visor) usan I18N.t('texto en castellano').

   CADA VEZ QUE SE AÑADA O CAMBIE UN TEXTO DE LA WEB: añadir o actualizar su entrada en CA (abajo).
   En la consola, I18N.audit() lista los textos que siguen en castellano estando en catalán.
   ========================================================== */
(function () {
  'use strict';

  const CA = {
    /* ---------- Meta / navegación ---------- */
    'SHOUIT — Estudio creativo en Barcelona': 'SHOUIT — Estudi creatiu a Barcelona',
    'SHOUIT es un estudio creativo en Barcelona: diseño web, fotografía y contenido, y gestión de redes sociales para negocios locales.': 'SHOUIT és un estudi creatiu a Barcelona: disseny web, fotografia i contingut, i gestió de xarxes socials per a negocis locals.',
    'Quién soy': 'Qui sóc',
    'Portfolio': 'Portfolio',
    'Sobre mí': 'Sobre mi',
    'Hablemos': 'Parlem',
    'Hablemos →': 'Parlem →',
    'Abrir menú': 'Obrir el menú',
    'Idioma': 'Idioma',

    /* ---------- Hero y marquesina ---------- */
    'ESTUDIO CREATIVO — BARCELONA': 'ESTUDI CREATIU — BARCELONA',
    'Diseño web, fotografía / contenido y gestión de redes sociales': 'Disseny web, fotografia / contingut i gestió de xarxes socials',
    'para negocios que quieren hacerse notar en Barcelona.': 'per a negocis que volen fer-se notar a Barcelona.',
    'DISEÑO WEB': 'DISSENY WEB',
    'FOTOGRAFÍA': 'FOTOGRAFIA',
    'CONTENIDO': 'CONTINGUT',
    'REDES SOCIALES': 'XARXES SOCIALS',

    /* ---------- Quién soy (cartas) ---------- */
    'Desliza el carnet': 'Llisca el carnet',
    'Datos de Genís Bernabé. En móvil, usa las flechas del teclado para cambiar de carta.': 'Dades de Genís Bernabé. En mòbil, fes servir les fletxes del teclat per canviar de carta.',
    'Carta anterior': 'Carta anterior',
    'Carta siguiente': 'Carta següent',
    'Carnet': 'Carnet',
    'Creativo digital': 'Creatiu digital',
    'Desliza': 'Llisca',
    'Tu foto aquí': 'La teva foto aquí',
    'Edad': 'Edat',
    'años': 'anys',
    '{n} años': '{n} anys',
    'Vivo en': 'Visc a',
    'Vivo en {ciudad}, {provincia}.': 'Visc a {ciudad}, {provincia}.',
    'Allí son las {h}.': 'Allà són les {h}.',
    'Silueta de Catalunya con Barcelona y {ciudad} señaladas': 'Silueta de Catalunya amb Barcelona i {ciudad} assenyalades',
    'Idiomas': 'Idiomes',
    'Catalán': 'Català',
    'Castellano': 'Castellà',
    'Inglés': 'Anglès',
    'nativo': 'natiu',
    'First Certificate': 'First Certificate',
    'Stack': 'Stack',
    'Organización y gestión de podcast': 'Organització i gestió de pòdcast',
    'Proyectos': 'Projectes',
    'proyectos': 'projectes',
    'Estado': 'Estat',
    'Abierto a nuevas ofertas': 'Obert a noves ofertes',
    'ABIERTO': 'OBERT',
    'a nuevas ofertas': 'a noves ofertes',
    'Contacto': 'Contacte',
    'Escríbeme': 'Escriu-me',
    'Copiar email': 'Copiar correu',
    'Copiado': 'Copiat',

    /* ---------- Portfolio (home) ---------- */
    'Trabajo': 'Feina',
    'reales.': 'reals.',
    'Web + Contenido + Redes': 'Web + Contingut + Xarxes',
    'Contenido + Redes': 'Contingut + Xarxes',
    'Ver proyecto →': 'Veure projecte →',
    '¿El siguiente?': 'El següent?',
    'Tu proyecto': 'El teu projecte',
    'aquí': 'aquí',

    /* ---------- Sobre mí (línea de tiempo) ---------- */
    'Quién hay detrás': 'Qui hi ha al darrere',
    'Año de mi trayectoria': 'Any de la meva trajectòria',
    'ARRASTRA': 'ARROSSEGA',
    'Hoy': 'Avui',
    'Pulsa la pastilla verde y arrástrala, o pulsa un año': 'Prem la pastilla verda i arrossega-la, o prem un any',
    'Etapa 01': 'Etapa 01', 'Etapa 02': 'Etapa 02', 'Etapa 03': 'Etapa 03', 'Etapa 04': 'Etapa 04', 'Etapa 05': 'Etapa 05',
    'Empiezo marketing y publicidad': 'Començo màrqueting i publicitat',
    "Grado superior de Marketing y Publicidad en el Centre d'Estudis Polytechnics, en Barcelona. Aquí empieza todo: comunicación, publicidad y mis primeros proyectos.": "Grau superior de Màrqueting i Publicitat al Centre d'Estudis Polytechnics, a Barcelona. Aquí comença tot: comunicació, publicitat i els meus primers projectes.",
    'Marketing': 'Màrqueting',
    'Publicidad': 'Publicitat',
    'Polytechnics': 'Polytechnics',
    'Mis primeras prácticas, en un club': 'Les meves primeres pràctiques, en un club',
    'Prácticas en el Club Natació Sant Andreu, donde me encargo de la comunicación interna y externa. Mi primer contacto con el mundo laboral.': "Pràctiques al Club Natació Sant Andreu, on m'encarrego de la comunicació interna i externa. El meu primer contacte amb el món laboral.",
    'Comunicación': 'Comunicació',
    'Club deportivo': 'Club esportiu',
    'Mi primer trabajo en el sector': 'La meva primera feina al sector',
    'Community manager en Gestioncar, una cadena de concesionarios de compraventa. Llevo la comunicación, el diseño de la web, Instagram y los mailings hasta 2023.': "Community manager a Gestioncar, una cadena de concessionaris de compravenda. Porto la comunicació, el disseny de la web, Instagram i els mailings fins al 2023.",
    'Web': 'Web',
    'Instagram': 'Instagram',
    'Mailing': 'Mailing',
    'Máster y prácticas en Modula TV': 'Màster i pràctiques a Modula TV',
    'Máster en marketing digital en Net Digital School: web, redes y audiovisual. A la vez, prácticas en Modula TV, agencia de comunicación y marketing y productora audiovisual: contenido, materiales gráficos, webs de clientes, redes y plataformas de formación como Eurofitness EDU.': "Màster en màrqueting digital a Net Digital School: web, xarxes i audiovisual. Alhora, pràctiques a Modula TV, agència de comunicació i màrqueting i productora audiovisual: contingut, materials gràfics, webs de clients, xarxes i plataformes de formació com Eurofitness EDU.",
    'Net Digital School': 'Net Digital School',
    'Contenido': 'Contingut',
    'Diseño web': 'Disseny web',
    'Redes': 'Xarxes',
    'Eurofitness EDU': 'Eurofitness EDU',
    'Contratado en Modula TV': 'Contractat a Modula TV',
    'Acabo el máster y paso a contrato en la misma empresa. Llevo clientes yo solo y tareas más complejas, y he subido de horas y de responsabilidad.': "Acabo el màster i passo a contracte a la mateixa empresa. Porto clients jo sol i tasques més complexes, i he pujat d'hores i de responsabilitat.",
    'Gestión de clientes': 'Gestió de clients',
    'Sigo creciendo en Modula TV, pero busco un equipo donde sumar web, contenido y criterio visual. Esta web es la prueba.': "Segueixo creixent a Modula TV, però busco un equip on sumar web, contingut i criteri visual. Aquesta web n'és la prova.",
    'Disponible': 'Disponible',
    'Barcelona': 'Barcelona',

    /* ---------- Contacto y pie ---------- */
    'Hagamos': 'Fem',
    'ruido juntos.': 'soroll junts.',
    'Nombre': 'Nom',
    '¿Cómo te llamas?': 'Com et dius?',
    'Email': 'Correu electrònic',
    'Tipo de negocio': 'Tipus de negoci',
    'Restaurante, barbería, estudio...': 'Restaurant, barberia, estudi...',
    'Cuéntame': "Explica'm",
    '¿Qué necesitas?': 'Què necessites?',
    'Enviar mensaje': 'Enviar missatge',
    'Barcelona, España': 'Barcelona, Espanya',
    'SHOUIT. Todos los derechos reservados.': 'SHOUIT. Tots els drets reservats.',

    /* ---------- Páginas de proyecto (comunes) ---------- */
    '← Portfolio': '← Portfolio',
    'Cliente': 'Client',
    'Sector': 'Sector',
    'Servicios': 'Serveis',
    'El proyecto': 'El projecte',
    'Qué hice': 'Què vaig fer',
    'Ver en Instagram ↗': 'Veure a Instagram ↗',
    'Siguiente proyecto': 'Projecte següent',
    'Ver caso': 'Veure cas',
    'Redes sociales': 'Xarxes socials',
    'Fotografía y vídeo': 'Fotografia i vídeo',
    'Gestión de redes': 'Gestió de xarxes',
    'Creación de contenido': 'Creació de contingut',
    'Imagen ampliada': 'Imatge ampliada',
    'Imagen anterior': 'Imatge anterior',
    'Imagen siguiente': 'Imatge següent',
    'Cerrar': 'Tancar',
    'Ampliar: {alt}': 'Ampliar: {alt}',

    /* ---------- CENEMA ---------- */
    'Coworking · Barcelona': 'Coworking · Barcelona',
    'Diseño web completo, fotografía y vídeo, y gestión de redes sociales para CENEMA: un espacio de coworking en Barcelona pensado para autónomos, startups y equipos que buscan flexibilidad y comunidad.': "Disseny web complet, fotografia i vídeo, i gestió de xarxes socials per a CENEMA: un espai de coworking a Barcelona pensat per a autònoms, startups i equips que busquen flexibilitat i comunitat.",
    'Diseño web, fotografía y gestión de redes sociales para CENEMA, un espacio de coworking en Barcelona.': "Disseny web, fotografia i gestió de xarxes socials per a CENEMA, un espai de coworking a Barcelona.",
    'Web completa del coworking.': 'Web completa del coworking.',
    'Imágenes de los espacios.': 'Imatges dels espais.',
    'Gestión de las redes.': 'Gestió de les xarxes.',
    'CENEMA — coworking en Barcelona para profesionales': 'CENEMA — coworking a Barcelona per a professionals',
    'Portada de la web': 'Portada de la web',
    'CENEMA — alquiler de salas por horas': 'CENEMA — lloguer de sales per hores',
    'Alquiler de salas por horas': 'Lloguer de sales per hores',
    'CENEMA — zona chillout exterior': 'CENEMA — zona chillout exterior',
    'Zona chillout exterior': 'Zona chillout exterior',
    'La web de CENEMA': 'La web de CENEMA',
    'Diseño de la web del coworking: portada, alquiler de salas por horas y zonas del espacio.': "Disseny de la web del coworking: portada, lloguer de sales per hores i zones de l'espai.",
    'CENEMA — recepción con el logotipo luminoso': 'CENEMA — recepció amb el logotip lluminós',
    'CENEMA — terraza con mesas y zona de descanso': 'CENEMA — terrassa amb taules i zona de descans',
    'CENEMA — puestos de coworking': 'CENEMA — llocs de coworking',
    'CENEMA — terraza con zona chillout': 'CENEMA — terrassa amb zona chillout',
    'CENEMA — zona de office y barra': "CENEMA — zona d'office i barra",
    'CENEMA — terraza con pérgola': 'CENEMA — terrassa amb pèrgola',
    'Los espacios, en imagen': 'Els espais, en imatge',
    'Fotografía de los espacios de CENEMA: recepción, puestos de coworking, office y terraza.': "Fotografia dels espais de CENEMA: recepció, llocs de coworking, office i terrassa.",
    'CENEMA — publicación de Instagram: ¿Guardar o tirar? 5 cosas que quizá no necesitas en casa': 'CENEMA — publicació d\'Instagram: Guardar o llençar? 5 coses que potser no necessites a casa',
    'CENEMA — publicación de Instagram: Las reuniones también sirven para comunicarse': "CENEMA — publicació d'Instagram: Les reunions també serveixen per comunicar-se",
    'CENEMA — publicación de Instagram: 5 señales de que necesitas un trastero': "CENEMA — publicació d'Instagram: 5 senyals que necessites un traster",
    'CENEMA — publicación de Instagram: ¿Por qué tu casa se llena en verano?': "CENEMA — publicació d'Instagram: Per què la teva casa s'omple a l'estiu?",
    'Presencia en redes': 'Presència a les xarxes',
    'Publicaciones para las redes de CENEMA sobre trasteros, coworking y orden en casa.': 'Publicacions per a les xarxes de CENEMA sobre trasters, coworking i ordre a casa.',

    /* ---------- Eurofitness EDU ---------- */
    'Creación de contenido y gestión de redes sociales para Eurofitness EDU, la escuela de ciclos formativos deportivos del grupo Eurofitness en Barcelona.': "Creació de contingut i gestió de xarxes socials per a Eurofitness EDU, l'escola de cicles formatius esportius del grup Eurofitness a Barcelona.",
    'Formación deportiva · Barcelona': 'Formació esportiva · Barcelona',
    'Creación de contenido y gestión de redes sociales para Eurofitness EDU, la escuela de ciclos formativos deportivos del grupo Eurofitness en Barcelona. Ofrece grados medios y superiores en fitness, socorrismo, fútbol o guía en el medio natural, con aulas integradas en instalaciones deportivas reales y más de 25 años formando profesionales.': "Creació de contingut i gestió de xarxes socials per a Eurofitness EDU, l'escola de cicles formatius esportius del grup Eurofitness a Barcelona. Ofereix graus mitjans i superiors en fitness, socorrisme, futbol o guia en el medi natural, amb aules integrades en instal·lacions esportives reals i més de 25 anys formant professionals.",
    'Contenido para la escuela.': "Contingut per a l'escola.",
    'Plataforma de formación online': 'Plataforma de formació en línia',
    'Gestión de LearnWorlds.': 'Gestió de LearnWorlds.',
    'Contenido para la escuela': "Contingut per a l'escola",
    'Creación de contenido para Eurofitness EDU y sus ciclos formativos.': 'Creació de contingut per a Eurofitness EDU i els seus cicles formatius.',
    'Gestión de las redes sociales de Eurofitness EDU.': "Gestió de les xarxes socials d'Eurofitness EDU.",
    'La plataforma e-learning': "La plataforma d'e-learning",
    'Gestión de LearnWorlds como plataforma de formación online de la escuela: cursos, inscripciones y automatizaciones.': "Gestió de LearnWorlds com a plataforma de formació en línia de l'escola: cursos, inscripcions i automatitzacions.",
    'Ver el detalle más abajo ↓': 'Veure el detall més avall ↓',
    'Plataforma e-learning': "Plataforma d'e-learning",
    'Gestión y desarrollo de Eurofitness EDU con LearnWorlds': "Gestió i desenvolupament d'Eurofitness EDU amb LearnWorlds",
    'Gestión y optimización de LearnWorlds como plataforma e-learning de Eurofitness EDU, trabajando tanto la parte técnica y operativa como la experiencia del alumnado. El proyecto incluye la gestión de los cursos, la automatización de procesos y la mejora continua del entorno digital, con el objetivo de ofrecer una experiencia formativa más ágil, coherente y funcional.': "Gestió i optimització de LearnWorlds com a plataforma d'e-learning d'Eurofitness EDU, treballant tant la part tècnica i operativa com l'experiència de l'alumnat. El projecte inclou la gestió dels cursos, l'automatització de processos i la millora contínua de l'entorn digital, amb l'objectiu d'oferir una experiència formativa més àgil, coherent i funcional.",
    'Gestión, configuración y mantenimiento de la plataforma e-learning LearnWorlds.': "Gestió, configuració i manteniment de la plataforma d'e-learning LearnWorlds.",
    'Creación, duplicación y actualización de cursos, contenidos y recursos formativos.': 'Creació, duplicació i actualització de cursos, continguts i recursos formatius.',
    'Configuración de inscripciones, accesos, certificaciones y automatizaciones de comunicación.': "Configuració d'inscripcions, accessos, certificacions i automatitzacions de comunicació.",
    'Optimización de la experiencia de usuario y del recorrido del alumno dentro de la plataforma.': "Optimització de l'experiència d'usuari i del recorregut de l'alumne dins de la plataforma.",
    'Resolución de incidencias técnicas e implementación de mejoras continuas en LearnWorlds.': "Resolució d'incidències tècniques i implementació de millores contínues a LearnWorlds.",
    'Alcance': 'Abast',
    'Estas tareas las realicé a través de LearnWorlds en algunos de los cursos de Eurofitness EDU.': "Aquestes tasques les vaig fer a través de LearnWorlds en alguns dels cursos d'Eurofitness EDU.",

    /* ---------- Eurofitness ---------- */
    'Creación de contenido y gestión de redes sociales para Eurofitness, una cadena de clubs deportivos en Barcelona, el Maresme y el Vallès.': 'Creació de contingut i gestió de xarxes socials per a Eurofitness, una cadena de clubs esportius a Barcelona, el Maresme i el Vallès.',
    'Fitness · Cadena de clubs deportivos': 'Fitness · Cadena de clubs esportius',
    'Creación de contenido y gestión de redes sociales para Eurofitness, una cadena de clubs deportivos con centros en Barcelona, el Maresme, el Vallès y más allá. Instalaciones amplias de fitness, piscina y wellness, con actividades dirigidas, entrenamiento personal y programas como Posture Pilates o Longevital.': 'Creació de contingut i gestió de xarxes socials per a Eurofitness, una cadena de clubs esportius amb centres a Barcelona, el Maresme, el Vallès i més enllà. Instal·lacions àmplies de fitness, piscina i wellness, amb activitats dirigides, entrenament personal i programes com Posture Pilates o Longevital.',
    'Contenido para los clubs.': 'Contingut per als clubs.',
    'Contenido para los clubs': 'Contingut per als clubs',
    'Creación de contenido para Eurofitness y las actividades de sus clubs.': 'Creació de contingut per a Eurofitness i les activitats dels seus clubs.',
    'Gestión de las redes sociales de Eurofitness.': "Gestió de les xarxes socials d'Eurofitness.",

    /* ---------- Port de Mataró ---------- */
    'Rediseño web, fotografía y gestión de redes sociales para el Port de Mataró.': 'Redisseny web, fotografia i gestió de xarxes socials per al Port de Mataró.',
    'Puerto · Mataró': 'Port · Mataró',
    'Rediseño web completo, fotografía y vídeo, y gestión activa de redes sociales para el Port de Mataró: náutica, gastronomía y sostenibilidad en un mismo espacio frente al mar.': 'Redisseny web complet, fotografia i vídeo, i gestió activa de xarxes socials per al Port de Mataró: nàutica, gastronomia i sostenibilitat en un mateix espai davant del mar.',
    'Rediseño web': 'Redisseny web',
    'Nueva web del puerto.': 'Nova web del port.',
    'Imágenes del puerto.': 'Imatges del port.',
    'Gestión activa.': 'Gestió activa.',
    'Port de Mataró — servicios del puerto': 'Port de Mataró — serveis del port',
    'Servicios del puerto': 'Serveis del port',
    'Una web para el puerto': 'Una web per al port',
    'Rediseño completo de la web del Port de Mataró: náutica, gastronomía y sostenibilidad en un mismo espacio frente al mar.': 'Redisseny complet de la web del Port de Mataró: nàutica, gastronomia i sostenibilitat en un mateix espai davant del mar.',
    'El puerto, en imagen': 'El port, en imatge',
    'Fotografía y vídeo del Port de Mataró y de su actividad.': 'Fotografia i vídeo del Port de Mataró i de la seva activitat.',
    'Gestión activa de redes': 'Gestió activa de xarxes',
    'Gestión activa de las redes sociales del Port de Mataró.': 'Gestió activa de les xarxes socials del Port de Mataró.',

    /* ---------- Olimfit ---------- */
    'Creación de contenido y gestión de redes sociales para Olimfit.': 'Creació de contingut i gestió de xarxes socials per a Olimfit.',
    'Creación de contenido · Redes sociales': 'Creació de contingut · Xarxes socials',
    'Creación de contenido y gestión de redes sociales para Olimfit: publicaciones con identidad propia que mantienen el perfil activo y coherente.': 'Creació de contingut i gestió de xarxes socials per a Olimfit: publicacions amb identitat pròpia que mantenen el perfil actiu i coherent.',
    'Publicaciones con identidad.': 'Publicacions amb identitat.',
    'Un perfil activo.': 'Un perfil actiu.',
    'Publicaciones con identidad propia': 'Publicacions amb identitat pròpia',
    'Piezas para el perfil de Olimfit, con una línea visual propia y coherente.': "Peces per al perfil d'Olimfit, amb una línia visual pròpia i coherent.",
    'Un perfil activo y coherente': 'Un perfil actiu i coherent',
    'Gestión de las redes de Olimfit para mantener el perfil al día.': "Gestió de les xarxes d'Olimfit per mantenir el perfil al dia."
  };

  /* Patrones para textos con partes variables (alt de logos, publicaciones numeradas…) */
  const RULES = [
    [/^Logotipo del (.+)$/, 'Logotip del $1'],
    [/^Logotipo de (.+)$/, 'Logotip de $1'],
    [/^Logo de (.+)$/, 'Logotip de $1'],
    [/^(.+) — publicación de Instagram (\d+)$/, "$1 — publicació d'Instagram $2"],
    [/^Visitar (.+) ↗$/, 'Visitar $1 ↗'],
    [/^(.+) →$/, null]   // «Nombre de proyecto →» (siguiente proyecto): se queda igual
  ];

  const STORE = 'gb-lang';
  const ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];
  const SKIP = 'script,style,svg,[data-i18n-skip],.lb,#qdDeck,#qdCount,.tl__txt,.nav__lang';
  const norm = s => s.replace(/\s+/g, ' ').trim();

  /* ---- idioma inicial ---- */
  const valid = l => (l === 'ca' || l === 'es') ? l : null;
  const readStore = () => { try { return valid(localStorage.getItem(STORE)); } catch (e) { return null; } };
  const writeStore = l => { try { localStorage.setItem(STORE, l); } catch (e) { /* sin almacenamiento: no pasa nada */ } };
  let lang = 'es';
  (function init() {
    let q = null;
    try { q = valid(new URLSearchParams(location.search).get('lang')); } catch (e) { /* */ }
    if (q) { lang = q; writeStore(q); return; }
    const s = readStore();
    if (s) { lang = s; return; }
    const nav = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es']);
    for (const l of nav) { const c = String(l).toLowerCase().slice(0, 2); if (c === 'ca') { lang = 'ca'; return; } if (c === 'es') return; }
  })();

  /* ---- traducción de una cadena ---- */
  const fmt = (s, v) => v ? s.replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m)) : s;
  const lookup = key => {
    if (CA[key] !== undefined) return CA[key];
    for (const [re, rep] of RULES) { if (re.test(key)) return rep === null ? key : key.replace(re, rep); }
    return undefined;
  };
  const t = (es, vars) => {
    if (lang !== 'ca') return fmt(es, vars);
    const r = lookup(norm(es));
    return fmt(r !== undefined ? r : es, vars);
  };
  const trRaw = raw => {
    const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m[2]) return raw;
    const r = lookup(norm(m[2]));
    return r === undefined ? raw : m[1] + r + m[3];
  };

  /* ---- aplicar al documento ---- */
  const nodeOrig = new WeakMap(), attrOrig = new WeakMap();
  const skipped = el => el.closest && el.closest(SKIP);

  const applyText = n => {
    const had = nodeOrig.has(n), raw = had ? nodeOrig.get(n) : n.nodeValue;
    const out = lang === 'ca' ? trRaw(raw) : raw;
    if (!had && out === raw) return;
    if (!had) nodeOrig.set(n, raw);
    if (n.nodeValue !== out) n.nodeValue = out;
  };
  const applyAttrs = el => {
    ATTRS.forEach(a => {
      if (!el.hasAttribute(a)) return;
      let rec = attrOrig.get(el); const had = rec && a in rec;
      const raw = had ? rec[a] : el.getAttribute(a);
      const out = lang === 'ca' ? (lookupAttr(raw)) : raw;
      if (!had && out === raw) return;
      if (!rec) { rec = {}; attrOrig.set(el, rec); }
      if (!had) rec[a] = raw;
      if (el.getAttribute(a) !== out) el.setAttribute(a, out);
    });
  };
  const lookupAttr = raw => { const r = lookup(norm(raw)); return r === undefined ? raw : r; };

  let metaDesc = null, titleEl = null, titleOrig = '', descOrig = '';
  const applyHead = () => {
    titleEl = titleEl || document.querySelector('title');
    metaDesc = metaDesc || document.querySelector('meta[name="description"]');
    if (titleEl) { if (!titleOrig) titleOrig = titleEl.textContent; document.title = lang === 'ca' ? lookupAttr(titleOrig) : titleOrig; }
    if (metaDesc) { if (!descOrig) descOrig = metaDesc.getAttribute('content') || ''; metaDesc.setAttribute('content', lang === 'ca' ? lookupAttr(descOrig) : descOrig); }
  };

  const apply = (root) => {
    root = root || document.body;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: n => (n.nodeType === 1 ? (n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP) : NodeFilter.FILTER_ACCEPT)
    });
    const texts = []; while (w.nextNode()) texts.push(w.currentNode);
    texts.forEach(applyText);
    root.querySelectorAll('[alt],[aria-label],[placeholder],[title]').forEach(el => { if (!skipped(el)) applyAttrs(el); });
    document.documentElement.lang = lang;
    applyHead();
  };

  /* ---- selector ES | CA en el menú ---- */
  const listeners = [];
  let langBtns = [];
  const paintSwitch = () => langBtns.forEach(b => {
    const on = b.dataset.lang === lang;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.classList.toggle('is-on', on);
  });
  const set = l => {
    l = valid(l); if (!l || l === lang) return;
    lang = l; writeStore(l);
    apply(); paintSwitch();
    const g = document.querySelector('.nav__lang'); if (g) g.setAttribute('aria-label', t('Idioma'));
    listeners.forEach(fn => { try { fn(lang); } catch (e) { console.error(e); } });
  };
  const buildSwitch = () => {
    const host = document.querySelector('.nav__links');
    if (!host || host.querySelector('.nav__lang')) return;
    const g = document.createElement('div');
    g.className = 'nav__lang'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', t('Idioma'));
    [['es', 'ES', 'Castellano'], ['ca', 'CA', 'Català']].forEach(([code, label, name], i) => {
      if (i) { const s = document.createElement('i'); s.setAttribute('aria-hidden', 'true'); s.textContent = '/'; g.appendChild(s); }
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.lang = code; b.textContent = label; b.lang = code; b.title = name; b.setAttribute('aria-label', name);
      b.addEventListener('click', () => set(code));
      g.appendChild(b);
    });
    host.appendChild(g);
    langBtns = [...g.querySelectorAll('button')];
    paintSwitch();
  };

  /* ---- revisión: textos que siguen en castellano con la web en catalán ---- */
  const audit = () => {
    const out = new Set();
    const letters = /[A-Za-zÀ-ÿ]{3,}/;
    // Nombres propios, dominios, correos y herramientas: no se traducen
    const NEUTRAL = /^(GENÍS BERNABÉ|Genís|Bernabé|Genís Bernabé|SHOUIT|BCN|SHOW|YOUR|POTENTIAL|SHOW YOUR POTENTIAL|Scroll|BARCELONA|CENEMA|Port de Mataró|Olimfit|Fitness|Eurofitness( EDU)?|HTML|CSS|JS|WordPress|Elementor|Photoshop|Lightroom|Premiere|LearnWorlds|Google (Analytics|Ads)|Meta Ads|Instagram|Portada de la web del Port de Mataró — Viu el batec del Port)$|^[\w.\-]+@[\w.\-]+$|^[\w.\-]+\.(com|es|org)$|— Genís Bernabé$|^Ampliar: /;
    const chk = (s) => { const k = norm(s); if (k && letters.test(k) && !NEUTRAL.test(k) && lookup(k) === undefined) out.add(k); };
    // Se comprueba contra el diccionario, no contra el DOM, para no depender de lo que esté ya traducido.
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: n => (n.nodeType === 1 ? (n.matches('script,style,svg,.lb,.nav__lang,#qdDeck,#qdCount,.tl__txt') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP) : NodeFilter.FILTER_ACCEPT)
    });
    while (w.nextNode()) { const n = w.currentNode; chk(nodeOrig.has(n) ? nodeOrig.get(n) : n.nodeValue); }
    document.querySelectorAll('[alt],[aria-label],[placeholder],[title]').forEach(el => {
      if (el.closest('.lb,.nav__lang,#qdDeck,#qdCount,.tl__txt')) return;
      ATTRS.forEach(a => { if (el.hasAttribute(a)) { const rec = attrOrig.get(el); chk(rec && a in rec ? rec[a] : el.getAttribute(a)); } });
    });
    chk(titleOrig); chk(descOrig);
    return [...out];
  };

  window.I18N = {
    t,
    get lang() { return lang; },
    set,
    onChange: fn => { listeners.push(fn); },
    audit,
    dict: CA
  };

  buildSwitch();
  if (lang === 'ca') apply(); else { document.documentElement.lang = 'es'; applyHead(); }
})();
