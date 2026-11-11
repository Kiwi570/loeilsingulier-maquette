/* l’œil singulier — maquette : langue, mouvement, enveloppe, carte, horloges, visionneuse, carton-réponse */
(() => {
  'use strict';
  window.__os = true;
  const d = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  const safe = (name, fn) => { try { fn(); } catch (e) { console.warn('[os] ' + name, e); } };
  const calm = d.dataset.calm === '1';
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desk = matchMedia('(min-width: 761px)').matches;
  const G = window.gsap, ST = window.ScrollTrigger;
  const hasG = !!(G && ST);
  if (hasG) { G.registerPlugin(ST); if (window.SplitText) G.registerPlugin(window.SplitText); }
  const page = ($('[data-page]') || {}).dataset?.page || '';
  const lang = () => (d.dataset.lang === 'en' ? 'en' : 'fr');
  const L = (fr, en) => (lang() === 'en' ? en : fr);
  const emit = (n, detail) => document.dispatchEvent(new CustomEvent(n, { detail }));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Message bref ---------- */
  let toastT;
  const toast = msg => { const el = $('.toast'); if (!el) return; el.textContent = msg; el.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('is-on'), 2600); };

  /* ---------- Langue : même page, même état, sans rechargement ---------- */
  const titleFr = document.title, titleEn = ($('meta[name="title-en"]') || {}).content || titleFr;
  const swapAttr = (sel, attrName, key) => $$(sel).forEach(el => {
    const fk = key + 'Fr';
    if (el.dataset[fk] === undefined) el.dataset[fk] = el.getAttribute(attrName) || '';
    el.setAttribute(attrName, lang() === 'en' ? el.dataset[key + 'En'] : el.dataset[fk]);
  });
  function applyLang() {
    const l = lang(); d.lang = l;
    swapAttr('[data-alt-en]', 'alt', 'alt');
    swapAttr('[data-aria-en]', 'aria-label', 'aria');
    swapAttr('[data-ph-en]', 'placeholder', 'ph');
    swapAttr('[data-title-en]', 'title', 'title');
    swapAttr('meta[data-en]', 'content', 'en');
    $$('[data-desc-en]').forEach(el => { if (el.dataset.descFr === undefined) el.dataset.descFr = el.textContent; el.textContent = l === 'en' ? el.dataset.descEn : el.dataset.descFr; });
    document.title = l === 'en' ? titleEn : titleFr;
    $$('meta[property="og:locale"]').forEach(m => m.setAttribute('content', l === 'en' ? 'en_GB' : 'fr_FR'));
  }
  // les métadonnées portent leur valeur anglaise dans data-en
  $$('meta[data-en]').forEach(m => { m.dataset.enEn = m.dataset.en; });
  safe('lang', () => {
    applyLang();
    $$('.js-lang').forEach(b => b.addEventListener('click', () => {
      d.dataset.lang = lang() === 'en' ? 'fr' : 'en';
      store.set('os-lang', d.dataset.lang); applyLang(); emit('os:lang', d.dataset.lang);
      toast(L('Version française', 'English version'));
      if (hasG) requestAnimationFrame(() => ST.refresh());
    }));
  });

  /* ---------- Mode calme ---------- */
  safe('calm', () => {
    $$('.js-calm').forEach(b => {
      b.setAttribute('aria-pressed', String(calm));
      b.addEventListener('click', () => { store.set('os-calm', calm ? '0' : '1'); store.sset('os-scroll', String(window.scrollY)); location.reload(); });
    });
    const y = store.sget('os-scroll');
    if (y) { try { sessionStorage.removeItem('os-scroll'); } catch (e) {} requestAnimationFrame(() => window.scrollTo(0, +y)); }
  });

  /* ---------- Copier ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    const val = b.dataset.copy;
    const fallback = () => toast(L('Copie impossible : sélectionnez le texte à la main', 'Could not copy: please select the text manually'));
    try { navigator.clipboard.writeText(val).then(() => toast(L('Copié : ', 'Copied: ') + val), fallback); } catch (err) { fallback(); }
  });

  /* ---------- Défilement fluide ---------- */
  let lenis = null;
  safe('lenis', () => {
    if (calm || !hasG || !window.Lenis || !fine) return;
    lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true, anchors: { offset: -90 } });
    lenis.on('scroll', ST.update);
    G.ticker.add(t => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  });
  const scrollTo = y => (lenis ? lenis.scrollTo(y) : window.scrollTo({ top: typeof y === 'number' ? y : y.getBoundingClientRect().top + scrollY - 90, behavior: calm ? 'auto' : 'smooth' }));

  /* ---------- En-tête et menu ---------- */
  let menuOpen = false;
  safe('header', () => {
    const hdr = $('#hdr'); if (!hdr) return;
    let last = 0;
    const on = y => { hdr.classList.toggle('is-solid', y > 30); if (!menuOpen) hdr.classList.toggle('is-hidden', y > last + 2 && y > 300); else hdr.classList.remove('is-hidden'); if (Math.abs(y - last) > 2) last = y; };
    if (lenis) lenis.on('scroll', e => on(e.scroll)); else window.addEventListener('scroll', () => on(window.scrollY), { passive: true });
    on(window.scrollY);
    hdr.addEventListener('focusin', () => hdr.classList.remove('is-hidden'));
    const burger = $('.js-burger'), menu = $('#menu');
    if (!burger || !menu) return;
    menu.setAttribute('data-lenis-prevent', '');
    const set = open => {
      $$('body > main, body > footer, body > .skip, body > .mbar').forEach(x => { x.inert = open; });
      menu.inert = !open;
      menuOpen = open; menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', String(!open)); burger.setAttribute('aria-expanded', String(open));
      d.classList.toggle('menu-open', open); burger.setAttribute('aria-label', open ? L('Fermer le menu', 'Close menu') : 'Menu');
      if (lenis) open ? lenis.stop() : lenis.start(); else document.body.style.overflow = open ? 'hidden' : '';
      if (open) { const a = menu.querySelector('a'); a && setTimeout(() => a.focus(), 250); } else burger.focus();
    };
    burger.addEventListener('click', () => set(!menuOpen));
    document.addEventListener('keydown', e => {
      if (!menuOpen) return;
      if (e.key === 'Escape') { set(false); return; }
      if (e.key !== 'Tab') return;
      const f = [...$$('.hdr a[href], .hdr button'), ...$$('a[href], button', menu)].filter(x => x.offsetParent !== null);
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    window.addEventListener('pageshow', e => { if (e.persisted && menuOpen) set(false); });
  });

  /* ---------- Son : ambiance composée en direct (page Le son uniquement, jamais automatique) ---------- */
  const Sound = (() => {
    let ctx = null, master, bus, timer, chimeTimer, on = false, ci = 0;
    const chords = [[146.83, 185.0, 220.0, 277.18, 329.63], [123.47, 146.83, 185.0, 220.0, 277.18], [98.0, 123.47, 146.83, 185.0, 220.0], [110.0, 146.83, 196.0, 246.94, 329.63]];
    const pent = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];
    function build() {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3;
      master.connect(comp); comp.connect(ctx.destination);
      const conv = ctx.createConvolver(); const len = Math.floor(ctx.sampleRate * 3); const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
      conv.buffer = ir;
      const wet = ctx.createGain(); wet.gain.value = 0.5; const dry = ctx.createGain(); dry.gain.value = 0.62;
      conv.connect(wet); wet.connect(master); dry.connect(master);
      bus = ctx.createGain(); bus.connect(dry); bus.connect(conv);
      return true;
    }
    function tone(f, t, vol, mul, dur) {
      const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
      car.frequency.value = f; mod.frequency.value = f * mul;
      mg.gain.setValueAtTime(f * 1.2, t); mg.gain.exponentialRampToValueAtTime(f * 0.03, t + 1.2);
      mod.connect(mg); mg.connect(car.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0003, t + dur);
      car.connect(g); g.connect(bus); car.start(t); mod.start(t); car.stop(t + dur + 0.2); mod.stop(t + dur + 0.2);
    }
    function chord() {
      const now = ctx.currentTime; const notes = chords[ci++ % chords.length];
      notes.forEach((f, i) => {
        const g = ctx.createGain(); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.05 - i * 0.006, now + 2.6); g.gain.setTargetAtTime(0, now + 7.2, 1.5);
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 850 + i * 110;
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(lp); o.start(now); o.stop(now + 14);
        lp.connect(g); g.connect(bus);
      });
      tone(notes[2] * 2, now + 0.25, 0.05, 1, 3.4); tone(notes[3] * 2, now + 1.35, 0.034, 1, 3.4);
    }
    const loop = () => { chord(); timer = setTimeout(loop, 8000); };
    const chimes = () => { if (Math.random() < 0.7) tone(pent[Math.floor(Math.random() * pent.length)], ctx.currentTime, 0.02, 3.5, 2.4); chimeTimer = setTimeout(chimes, 1800 + Math.random() * 3400); };
    const ui = () => $$('.js-sound').forEach(b => b.setAttribute('aria-pressed', String(on)));
    function start() {
      if (!ctx && !build()) { toast(L('Votre navigateur ne permet pas le son.', 'Your browser cannot play sound.')); return; }
      ctx.resume(); master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.9);
      on = true; loop(); chimeTimer = setTimeout(chimes, 2600); ui();
    }
    function stop() {
      if (ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0, ctx.currentTime, 0.3); }
      on = false; clearTimeout(timer); clearTimeout(chimeTimer); ui();
      setTimeout(() => { if (!on && ctx) ctx.suspend(); }, 1600);
    }
    return { toggle() { on ? stop() : start(); }, stop, get on() { return on; } };
  })();
  safe('sound', () => {
    $$('.js-sound').forEach(b => b.addEventListener('click', () => Sound.toggle()));
    // une seule source sonore : on coupe en quittant la page, ou en suivant un lien d'écoute
    window.addEventListener('pagehide', () => Sound.on && Sound.stop());
    document.addEventListener('click', e => { if (e.target.closest('[data-listen] a') && Sound.on) Sound.stop(); });
  });

  /* ---------- Point rouge, loupe et boutons magnétiques ---------- */
  safe('cursor', () => {
    if (!fine || calm || !hasG) return;
    const c = $('.dot-cursor'); if (!c) return;
    let x = -100, y = -100, rx = x, ry = y, loupe = null, mode = '';
    const Z = 2.4, SIZE = 180;
    window.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (!d.classList.contains('has-dot')) { d.classList.add('has-dot'); rx = x; ry = y; } if (loupe) loupeAt(e); }, { passive: true });
    document.addEventListener('pointerleave', () => d.classList.remove('has-dot'));
    G.ticker.add(() => { const k = mode === 'loupe' ? 1 : 0.22; rx += (x - rx) * k; ry += (y - ry) * k; c.style.transform = `translate3d(${rx}px,${ry}px,0)`; });
    function loupeAt(e) {
      const im = loupe, r = im.getBoundingClientRect();
      c.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`;
      c.style.backgroundPosition = `${-((e.clientX - r.left) * Z - SIZE / 2)}px ${-((e.clientY - r.top) * Z - SIZE / 2)}px`;
    }
    window.__osCursorReset = () => setMode('');
    function setMode(m, el) {
      if (m === mode && (m !== 'loupe' || el === loupe)) return;
      mode = m; c.className = 'dot-cursor' + (m ? ' is-' + m : '');
      if (m === 'loupe') { loupe = el; c.style.backgroundImage = `url("${el.currentSrc || el.src}")`; } else { loupe = null; c.style.backgroundImage = ''; }
    }
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const lp = t.closest('[data-cursor="loupe"]');
      if (lp) { const im = lp.querySelector('img'); if (im) return setMode('loupe', im); }
      if (t.closest('a, button, [role="tab"], label, summary')) return setMode('link');
      setMode('');
    });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); G.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.28, duration: 0.5, ease: 'power3.out' }); });
      el.addEventListener('pointerleave', () => G.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, .4)' }));
    });
  });

  /* ---------- L'œil du premier écran suit le regard ---------- */
  safe('eye', () => {
    if (calm || !fine) return;
    $$('[data-eye]').forEach(box => {
      const svg = $('svg', box), iris = $('.eye__iris', svg), dot = $('.eye__dot', svg);
      window.addEventListener('pointermove', e => {
        const r = svg.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const a = Math.atan2(e.clientY - cy, e.clientX - cx), dist = Math.min(1, Math.hypot(e.clientX - cx, e.clientY - cy) / 600);
        const dx = Math.cos(a) * 28 * dist, dy = Math.sin(a) * 12 * dist;
        iris.setAttribute('transform', `translate(${dx * .6} ${dy * .6})`); dot.setAttribute('transform', `translate(${dx} ${dy})`);
      }, { passive: true });
    });
  });

  /* ---------- Transitions de page : un rabat d'encre ---------- */
  safe('transitions', () => {
    const veil = $('.veil'); if (!veil || !hasG || calm) return;
    const flap = $('.veil__flap', veil), dot = $('.veil__dot', veil);
    if (store.sget('os-trans') === '1') {
      store.sset('os-trans', '0');
      veil.classList.add('is-on'); G.set(flap, { yPercent: 0 }); G.set(dot, { opacity: 1 });
      G.timeline({ delay: 0.05, onComplete: () => veil.classList.remove('is-on') })
        .to(dot, { opacity: 0, scale: 0.4, duration: 0.25 })
        .to(flap, { yPercent: -101, duration: 0.7, ease: 'power3.inOut' }, '<0.05');
    }
    window.addEventListener('pageshow', e => { if (e.persisted) { veil.classList.remove('is-on'); G.set(flap, { yPercent: -101 }); } });
    document.addEventListener('click', e => {
      const a = e.target.closest('a'); if (!a || e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || /^(mailto|tel|sms|javascript):/i.test(href)) return;
      let url; try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      const norm = p => p.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
      if (norm(url.pathname) === norm(location.pathname)) {
        if (url.hash) { e.preventDefault(); history.replaceState(null, '', url.hash); const t = document.getElementById(decodeURIComponent(url.hash.slice(1))); if (t) scrollTo(t); }
        return;
      }
      e.preventDefault();
      store.sset('os-trans', '1'); veil.classList.add('is-on');
      G.timeline({ onComplete: () => { location.href = url.href; } })
        .fromTo(flap, { yPercent: -101 }, { yPercent: 0, duration: 0.55, ease: 'power3.inOut' })
        .fromTo(dot, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.15');
    });
  });

  /* ---------- Ouverture : le cachet rouge se brise, l'enveloppe s'ouvre ---------- */
  function runLoader(done) {
    const el = $('.loader');
    if (!el) return done();
    if (calm || !hasG) { el.remove(); return done(); }
    const short = store.sget('os-seen') === '1'; store.sset('os-seen', '1');
    const seal = $('.seal', el), l = $('.seal__l', el), r = $('.seal__r', el), crack = $('.seal__crack', el), flap = $('.loader__flap', el), word = $('.loader__word', el), pkg = $('.loader__pkg', el);
    const tl = G.timeline({ onComplete: () => el.remove() });
    const skip = () => { if (tl.progress() < 1) tl.timeScale(3); };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => window.addEventListener(ev, skip, { once: true, passive: true }));
    if (short) {
      tl.from(seal, { scale: 1.2, opacity: 0, duration: 0.3, ease: 'power2.out' })
        .to([seal, word], { opacity: 0, duration: 0.2 }, '+=0.1')
        .to(pkg, { yPercent: 100, duration: 0.7, ease: 'power3.inOut' }, '-=0.05')
        .add(done, '-=0.5');
      return;
    }
    tl.from(word, { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 0.1)
      .from(seal, { scale: 1.5, opacity: 0, rotation: -14, duration: 0.6, ease: 'back.out(1.6)' }, 0.1)
      .fromTo(crack, { strokeDasharray: 120, strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 0.28, ease: 'power2.in' }, 0.74)
      .to(crack, { attr: { 'stroke-opacity': 1 }, duration: 0.12 }, 0.78)
      .set($('.seal__whole', el), { opacity: 0 }, 0.8)
      .to(crack, { opacity: 0, duration: 0.15 }, 1.0)
      .to(l, { rotation: -38, x: -46, y: 460, svgOrigin: '0 40', duration: 0.8, ease: 'power2.in' }, 1.0)
      .to(r, { rotation: 34, x: 40, y: 480, svgOrigin: '0 40', duration: 0.84, ease: 'power2.in' }, 1.03)
      .to(word, { opacity: 0, y: -8, duration: 0.35 }, 1.0)
      .to(flap, { scaleY: -1, transformOrigin: '50% 0%', duration: 0.8, ease: 'power3.inOut' }, 1.05)
      .to(flap, { '--shade': 0.5, duration: 0.4, ease: 'power1.in' }, 1.05)
      .to(flap, { '--shade': 0, duration: 0.4, ease: 'power1.out' }, 1.45)
      .set(flap, { autoAlpha: 0 }, 1.86)
      .to(pkg, { yPercent: 100, duration: 1, ease: 'power3.inOut' }, 1.8)
      .add(done, 1.95);
  }

  /* ---------- Révélations ---------- */
  function reveals() {
    const figs = $$('[data-reveal]');
    if (calm || !('IntersectionObserver' in window)) figs.forEach(f => f.classList.add('is-in'));
    else {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
      figs.forEach(f => (f.closest('[data-hs]') ? f.classList.add('is-in') : io.observe(f)));
    }
    if (calm || !hasG) return;
    $$('[data-press]').forEach(h => safe('press', () => {
      if (!window.SplitText) return;
      const parts = $$('.l-fr, .l-en', h); const els = parts.length ? parts : [h];
      const sp = new window.SplitText(els, { type: 'words', wordsClass: 'wd', aria: 'none' });
      G.from(sp.words, { scrollTrigger: { trigger: h, start: 'top 90%', once: true }, opacity: 0, yPercent: 40, duration: 1, ease: 'expo.out', stagger: 0.045 });
    }));
    $$('[data-rise]').forEach(el => {
      const kids = el.dataset.rise === 'stagger' ? Array.from(el.children) : [el];
      G.from(kids, { scrollTrigger: { trigger: el, start: 'top 90%', once: true }, y: 32, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 });
    });
  }

  /* ---------- Accueil ---------- */
  function heroIn() {
    const hero = $('.hero'); if (!hero || calm || !hasG) return;
    const lines = $$('.hero h1 .ln').filter(x => x.offsetParent);
    G.timeline()
      .from(lines, { yPercent: 60, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.14 }, 0.05)
      .from('.hero .label, .hero__sub, .hero__cta', { y: 20, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.35)
      .from('.hero__ph', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut' }, 0)
      .from('.hero__eye', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power2.out' }, 0.8);
    G.to('.hero__ph img', { yPercent: 8, scale: 1.06, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
  function hscroll() {
    $$('[data-hs]').forEach(hs => {
      const track = $('.hs__track', hs), sec = hs.closest('.hs-sec') || hs;
      if (calm || !hasG || !desk) { hs.classList.add('is-native'); hs.tabIndex = 0; hs.setAttribute('role', 'region'); hs.setAttribute('aria-label', L('Galerie, défilement horizontal', 'Gallery, horizontal scroll')); return; }
      sec.classList.add('is-pin');
      sec.style.setProperty('--hs-head', ($('.hs__head', sec)?.offsetHeight || 160) + 140 + 'px');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      G.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
    });
  }

  /* ---------- Barre d'actions (téléphone) ---------- */
  function mbar() {
    const bar = $('[data-mbar]'); if (!bar) return;
    const mesure = () => d.style.setProperty('--barres-h', getComputedStyle(bar).display === 'none' ? '0px' : bar.offsetHeight + 'px');
    mesure(); window.addEventListener('resize', mesure);
    if (!window.IntersectionObserver) return;
    const first = $('main > section'); const hide = $$('form, .rsvp, .ftr');
    const vus = new Set(); let heroVu = true;
    const maj = () => { const on = !heroVu && !vus.size; bar.classList.toggle('is-on', on); bar.inert = !on; };
    if (first) new IntersectionObserver(es => es.forEach(e => { heroVu = e.isIntersecting; maj(); })).observe(first);
    const io = new IntersectionObserver(es => es.forEach(e => { e.isIntersecting ? vus.add(e.target) : vus.delete(e.target); maj(); }));
    hide.forEach(c => io.observe(c)); maj();
  }

  /* ---------- Carte : Paris et Londres, et six villes d'événements ---------- */
  safe('map', () => {
    const maps = $$('[data-map]'); if (!maps.length) return;
    const cities = [
      { id: 'paris', fr: 'Paris', en: 'Paris', sub: ['Passage Rauch', 'Passage Rauch'], lat: 48.8536, lon: 2.3787, main: true, dx: 16, dy: 20, anchor: 'start' },
      { id: 'london', fr: 'Londres', en: 'London', sub: ['Gloucester Terrace', 'Gloucester Terrace'], lat: 51.5166, lon: -0.1849, main: true, dx: 16, dy: -12, anchor: 'start' },
      { id: 'cannes', fr: 'Cannes', en: 'Cannes', lat: 43.5528, lon: 7.0174, dx: -10, dy: 16, anchor: 'end' },
      { id: 'monaco', fr: 'Monaco', en: 'Monaco', lat: 43.7384, lon: 7.4246, dx: 10, dy: 4, anchor: 'start' },
      { id: 'toulouse', fr: 'Toulouse', en: 'Toulouse', lat: 43.6047, lon: 1.4442, dx: -10, dy: 5, anchor: 'end' },
      { id: 'milan', fr: 'Milan', en: 'Milan', lat: 45.4642, lon: 9.19, dx: 10, dy: 5, anchor: 'start' },
      { id: 'rome', fr: 'Rome', en: 'Rome', lat: 41.9028, lon: 12.4964, dx: 10, dy: 5, anchor: 'start' },
      { id: 'munich', fr: 'Munich', en: 'Munich', lat: 48.1372, lon: 11.5755, dx: 10, dy: 5, anchor: 'start' }
    ];
    const W = 600, H = 560, lon0 = -3.2, lon1 = 14.6, lat0 = 40.6, lat1 = 53.4, k = Math.cos(47 * Math.PI / 180);
    const s = Math.min((W - 60) / ((lon1 - lon0) * k), (H - 60) / (lat1 - lat0));
    const ox = (W - (lon1 - lon0) * k * s) / 2, oy = (H - (lat1 - lat0) * s) / 2;
    const P = (lat, lon) => [ox + (lon - lon0) * k * s, oy + (lat1 - lat) * s];
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, a, parent) => { const e = document.createElementNS(NS, tag); for (const n in a) e.setAttribute(n, a[n]); parent && parent.appendChild(e); return e; };
    const hav = (a, b) => { const R = 6371, t = x => x * Math.PI / 180; const dl = t(b.lat - a.lat), dn = t(b.lon - a.lon); const h = Math.sin(dl / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
    const km = Math.round(hav(cities[0], cities[1]));
    const offset = tz => { const p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date()).find(x => x.type === 'timeZoneName'); const m = /GMT([+-]\d+)?/.exec(p ? p.value : ''); return m && m[1] ? +m[1] : 0; };
    const setDist = () => { const h = offset('Europe/Paris') - offset('Europe/London'); $$('[data-distance]').forEach(el => { el.textContent = L(`Paris ⇄ Londres : ${km} km à vol d’oiseau, ${h === 1 ? 'une heure' : h + ' h'} de décalage.`, `Paris ⇄ London: ${km} km as the crow flies, ${h === 1 ? 'one hour' : h + ' hours'} apart.`); }); };
    setDist();
    maps.forEach(map => {
      const layer = $('[data-map-layer]', map); if (!layer) return;
      const g1 = mk('g', {}, layer);
      for (let lo = -2; lo <= 14; lo += 2) { const [x1, y1] = P(lat1, lo), [, y2] = P(lat0, lo); mk('line', { class: 'grat', x1, y1, x2: x1, y2 }, g1); }
      for (let la = 42; la <= 53; la += 2) { const [x1, y] = P(la, lon0), [x2] = P(la, lon1); mk('line', { class: 'grat', x1, y1: y, x2, y2: y }, g1); }
      const arcs = mk('g', {}, layer); const pa = P(cities[0].lat, cities[0].lon);
      const paths = cities.slice(1).map(c => {
        const pb = P(c.lat, c.lon); const mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2; const dx = pb[0] - pa[0], dy = pb[1] - pa[1];
        return mk('path', { class: 'arc' + (c.id === 'london' ? ' arc--main' : ''), d: `M${pa[0]},${pa[1]} Q${mx - dy * 0.22},${my + dx * 0.22} ${pb[0]},${pb[1]}` }, arcs);
      });
      const cg = mk('g', {}, layer); const labels = [];
      cities.forEach(c => {
        const [x, y] = P(c.lat, c.lon); const g = mk('g', { class: 'city' + (c.main ? ' is-main' : '') }, cg);
        if (c.main) mk('circle', { class: 'h', cx: x, cy: y, r: 12 }, g);
        mk('circle', { class: 'c', cx: x, cy: y, r: c.main ? 6 : 3.5 }, g);
        const tx = mk('text', { x: x + c.dx, y: y + c.dy, 'text-anchor': c.anchor }, g); labels.push([tx, c]);
        if (c.sub) mk('text', { class: 'sub', x: x + c.dx, y: y + c.dy + 16, 'text-anchor': c.anchor }, g).textContent = c.sub[0];
      });
      const name = () => labels.forEach(([tx, c]) => { tx.textContent = c[lang()]; });
      name(); document.addEventListener('os:lang', name);
      if (hasG && !calm) {
        paths.forEach(p => { const len = p.getTotalLength(); G.set(p, { strokeDasharray: p.classList.contains('arc--main') ? len : '3 5', strokeDashoffset: p.classList.contains('arc--main') ? len : 0, opacity: p.classList.contains('arc--main') ? 1 : 0 }); });
        G.timeline({ scrollTrigger: { trigger: map, start: 'top 78%', once: true } })
          .from($$('.city', cg), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', stagger: 0.08, duration: 0.6, ease: 'back.out(2)' })
          .to(paths.filter(p => p.classList.contains('arc--main')), { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.2)
          .to(paths.filter(p => !p.classList.contains('arc--main')), { opacity: 1, duration: 0.8, stagger: 0.1 }, 0.6);
        $$('.city .h', cg).forEach((h, i) => G.to(h, { attr: { r: 22 }, opacity: 0, duration: 2.2, repeat: -1, ease: 'power1.out', delay: i * 0.6 }));
      }
    });
    document.addEventListener('os:lang', setDist);
  });
  safe('clocks', () => {
    const els = $$('[data-clock]'); if (!els.length) return;
    const tick = () => els.forEach(el => { try { el.textContent = new Intl.DateTimeFormat(lang() === 'en' ? 'en-GB' : 'fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: el.dataset.clock }).format(new Date()); el.setAttribute('datetime', new Date().toISOString()); } catch (e) { el.textContent = ''; } });
    tick(); setInterval(tick, 15000); document.addEventListener('os:lang', tick);
  });

  /* ---------- Visionneuse ---------- */
  const LB = (() => {
    let el, imgEl, capEl, cntEl, noteEl, items = [], i = 0, opener = null, zoomable = false;
    function build() {
      el = document.createElement('div'); el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
      el.innerHTML = '<div class="lb__bar"><span class="lb__cnt num"></span><button type="button" class="lb__close"></button></div><div class="lb__stage"><button type="button" class="lb__nav lb__prev">←</button><img alt=""><button type="button" class="lb__nav lb__next">→</button></div><div class="lb__cap"><b></b><span class="lb__note"></span></div>';
      document.body.appendChild(el);
      imgEl = $('img', el); capEl = $('.lb__cap b', el); cntEl = $('.lb__cnt', el); noteEl = $('.lb__note', el);
      $('.lb__close', el).addEventListener('click', close);
      $('.lb__prev', el).addEventListener('click', () => show(i - 1));
      $('.lb__next', el).addEventListener('click', () => show(i + 1));
      const stage = $('.lb__stage', el);
      const origin = e => { if (!stage.classList.contains('is-zoom')) return; const r = imgEl.getBoundingClientRect(); imgEl.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`; };
      imgEl.addEventListener('click', e => { if (!zoomable) return; stage.classList.toggle('is-zoom'); origin(e); });
      stage.addEventListener('pointermove', origin);
      let sx = null; stage.addEventListener('pointerdown', e => { sx = e.clientX; }); stage.addEventListener('pointerup', e => { if (sx === null || stage.classList.contains('is-zoom')) return; const dx = e.clientX - sx; if (Math.abs(dx) > 60) show(i + (dx < 0 ? 1 : -1)); sx = null; });
      el.addEventListener('keydown', e => {
        if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1);
        else if (e.key === 'Tab') { const f = $$('button', el).filter(b => b.offsetParent); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
      });
    }
    function labels() {
      el.setAttribute('aria-label', L('Visionneuse', 'Viewer'));
      $('.lb__close', el).textContent = L('Fermer ✕', 'Close ✕');
      $('.lb__prev', el).setAttribute('aria-label', L('Précédente', 'Previous'));
      $('.lb__next', el).setAttribute('aria-label', L('Suivante', 'Next'));
    }
    function show(n) {
      i = (n + items.length) % items.length; const it = items[i];
      $('.lb__stage', el).classList.remove('is-zoom'); imgEl.style.transformOrigin = '';
      imgEl.src = it.dataset.full; imgEl.width = +it.dataset.w; imgEl.height = +it.dataset.h;
      imgEl.style.maxWidth = `min(100%, ${it.dataset.w}px)`; // jamais agrandie au-delà de sa définition
      const cap = L(it.dataset.capFr, it.dataset.capEn); imgEl.alt = cap; capEl.textContent = cap;
      zoomable = it.hasAttribute('data-zoom') && +it.dataset.w > 900;
      noteEl.textContent = zoomable ? L('Cliquez sur l’image pour zoomer', 'Click the image to zoom') : '';
      cntEl.textContent = `${i + 1} / ${items.length}`;
      if (hasG && !calm) G.fromTo(imgEl, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    }
    function open(trigger) {
      if (!el) build(); labels();
      opener = trigger; items = $$(`[data-lb="${trigger.dataset.lb}"]`).filter(x => !x.closest('[hidden]'));
      el.classList.add('is-open'); lenis && lenis.stop(); document.body.style.overflow = 'hidden'; window.__osCursorReset && window.__osCursorReset();
      $$('body > main, body > header, body > footer').forEach(x => { x.inert = true; });
      show(items.indexOf(trigger)); setTimeout(() => $('.lb__close', el).focus(), 30);
    }
    function close() {
      el.classList.remove('is-open'); lenis && lenis.start(); document.body.style.overflow = '';
      $$('body > main, body > header, body > footer').forEach(x => { x.inert = false; });
      opener && opener.focus({ preventScroll: true });
    }
    return { open };
  })();
  document.addEventListener('click', e => { const tr = e.target.closest('[data-lb]'); if (tr) { e.preventDefault(); LB.open(tr); } });

  /* ---------- Filtres de la galerie ---------- */
  safe('filters', () => {
    $$('[data-filters]').forEach(group => {
      const grid = $(`[data-filter-grid="${group.dataset.filters}"]`); if (!grid) return;
      const items = Array.from(grid.children), status = $('[data-filter-status]');
      group.addEventListener('click', e => {
        const b = e.target.closest('[data-filter]'); if (!b) return;
        const k = b.dataset.filter;
        $$('[data-filter]', group).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        const show = items.filter(it => k === 'tout' || it.dataset.cat === k);
        items.forEach(it => { it.hidden = !show.includes(it); });
        show.forEach(it => { const f = it.querySelector('[data-reveal]'); f && f.classList.add('is-in'); });
        if (status) status.textContent = L(`${show.length} photographies affichées`, `${show.length} photographs shown`);
        if (hasG && !calm) G.fromTo(show.slice(0, 16), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.03, clearProps: 'transform,opacity' });
        if (hasG) ST.refresh();
      });
    });
  });

  /* ---------- Onglets des références ---------- */
  safe('tabs', () => {
    const tl = $('[data-tabs]'); if (!tl) return;
    const tabs = $$('[role="tab"]', tl);
    const select = (t, focus) => {
      tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) t.focus();
      if (hasG && !calm) G.from($$('[data-ink]', document.getElementById(t.getAttribute('aria-controls'))), { opacity: 0, x: -12, duration: 0.5, stagger: 0.02, clearProps: 'all' });
      if (hasG) ST.refresh();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => { let n = null; if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length]; if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length]; if (e.key === 'Home') n = tabs[0]; if (e.key === 'End') n = tabs[tabs.length - 1]; if (n) { e.preventDefault(); select(n, true); } });
    });
  });

  /* ---------- Six temps : l'étape lue s'allume, la photo suit ---------- */
  safe('steps', () => {
    const list = $('[data-steps-list]'); if (!list || !('IntersectionObserver' in window)) return;
    const steps = $$('[data-step-i]', list), imgs = $$('[data-step-img]');
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const k = +e.target.dataset.stepI;
      steps.forEach((s, j) => s.classList.toggle('is-on', j <= k));
      imgs.forEach((im, j) => im.classList.toggle('is-on', j === k));
    }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => io.observe(s));
  });

  /* ---------- Invitation en découpe laser : trois images, animation contrôlée ---------- */
  safe('flipbook', () => {
    const fb = $('[data-flipbook]'); if (!fb) return;
    const frames = $$('[data-flipbook-f]', fb), dots = $$('[data-flipbook-go]'), play = $('[data-flipbook-play]');
    let k = 0, timer = null;
    const go = n => { k = (n + frames.length) % frames.length; frames.forEach((f, j) => f.classList.toggle('is-on', j === k)); dots.forEach((b, j) => b.setAttribute('aria-pressed', String(j === k))); };
    const stop = () => { clearInterval(timer); timer = null; play && play.setAttribute('aria-pressed', 'false'); };
    dots.forEach((b, j) => b.addEventListener('click', () => { stop(); go(j); }));
    if (play) {
      if (calm) play.hidden = true; // alternative statique : les trois étapes restent accessibles par les boutons
      play.addEventListener('click', () => { if (timer) return stop(); play.setAttribute('aria-pressed', 'true'); timer = setInterval(() => go(k + 1), 1100); });
    }
  });

  /* ---------- Écoute : lien provisoire seulement hors du domaine définitif ---------- */
  safe('listen', () => {
    if (!/(^|\.)loeilsingulier\.com$/i.test(location.hostname)) return;
    $$('[data-preview-only]').forEach(x => { x.hidden = true; });
    $$('[data-prod-only]').forEach(x => { x.hidden = false; });
  });

  /* ---------- Filet de progression et retour en haut ---------- */
  safe('progress', () => {
    const bar = $('.hdr__progress');
    const upd = y => { if (!bar) return; const h = d.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`; };
    if (lenis) lenis.on('scroll', e => upd(e.scroll)); else window.addEventListener('scroll', () => upd(window.scrollY), { passive: true });
    document.addEventListener('click', e => { const a = e.target.closest('[data-top]'); if (!a) return; e.preventDefault(); scrollTo(0); const t = $('#contenu'); t && t.setAttribute('tabindex', '-1'); t && t.focus({ preventScroll: true }); });
  });

  /* ---------- Contact : le carton-réponse ---------- */
  safe('brief', () => {
    const f = $('[data-brief]'); if (!f) return;
    const steps = $$('[data-step]', f), bars = $$('.progress i', f), lab = $('[data-step-label]', f);
    const prev = $('[data-prev]', f), next = $('[data-next]', f), sub = $('[data-submit]', f), sent = $('[data-sent]', f);
    const N = steps.length; let cur = 1, data = null;
    const range = $('#b-guests', f), out = $('#b-guests-out', f);
    const syncRange = () => { out.textContent = range.value === range.max ? range.value + '+' : range.value; };
    range.addEventListener('input', syncRange); syncRange();
    // Budget : saisie libre + devise, ou « À définir »
    const budget = $('#b-budget', f), devise = $('#b-devise', f), tbd = $('#b-budget-tbd', f), bwrap = $('[data-budget]', f);
    const syncTbd = () => { budget.disabled = devise.disabled = tbd.checked; bwrap.classList.toggle('is-tbd', tbd.checked); };
    tbd.addEventListener('change', syncTbd);
    const other = $('[data-city-other]', f);
    f.addEventListener('change', e => {
      if (e.target.name === 'objectif') err(1, '');
      if (e.target.name === 'ville') { err(3, ''); other.hidden = e.target.value !== 'ailleurs'; }
    });
    const err = (n, msg) => { const e = $(`[data-err="${n}"]`, f); if (e) e.textContent = msg || ''; };
    const valid = n => {
      if (n === 1 && !f.querySelector('input[name="objectif"]:checked')) { err(1, L('Choisissez un objectif pour continuer.', 'Choose a purpose to continue.')); return false; }
      if (n === 3 && !f.querySelector('input[name="ville"]:checked')) { err(3, L('Indiquez une ville, même approximative.', 'Pick a city, even roughly.')); return false; }
      if (n === 4) {
        const miss = ['#b-prenom', '#b-nom'].filter(s => !$(s, f).value.trim());
        if (miss.length) { err(4, L('Indiquez votre prénom et votre nom.', 'Please enter your first and last name.')); $(miss[0], f).focus(); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#b-mail', f).value.trim())) { err(4, L('Vérifiez l’adresse e-mail : il manque sans doute le @ ou le domaine.', 'Check the email address: the @ or the domain is probably missing.')); $('#b-mail', f).focus(); return false; }
        if (!$('#b-ok', f).checked) { err(4, L('Cochez la case d’accord pour continuer.', 'Tick the consent box to continue.')); return false; }
      }
      err(n, ''); return true;
    };
    const stepLabel = () => { lab.textContent = L(`Étape ${cur} sur ${N}`, `Step ${cur} of ${N}`); };
    const go = (n, focus = true) => {
      cur = Math.max(1, Math.min(N, n));
      steps.forEach(s => { s.hidden = +s.dataset.step !== cur; });
      bars.forEach((b, i) => b.classList.toggle('on', i < cur));
      stepLabel();
      prev.hidden = cur === 1; next.hidden = cur === N; sub.hidden = cur !== N;
      const st = steps[cur - 1];
      if (hasG && !calm && focus) G.from(st, { x: 24, opacity: 0, duration: 0.5, ease: 'expo.out' });
      const legend = $('legend', st); if (legend) { legend.setAttribute('tabindex', '-1'); if (focus) legend.focus({ preventScroll: true }); }
    };
    next.addEventListener('click', () => { if (valid(cur)) go(cur + 1); });
    prev.addEventListener('click', () => go(cur - 1));
    // liens profonds : #relations, #clients, #equipes, #etape, #autre, anciens #affaires, #contrat, #anniversaire, et #graphisme
    const h = decodeURIComponent((location.hash || '').slice(1));
    if (h) {
      const r = $$('input[name="objectif"]', f).find(x => x.value === h || x.dataset.alias === h); if (r) r.checked = true;
      if (h === 'graphisme') $('#b-graph', f).checked = true;
    }
    go(1, false);
    document.addEventListener('os:lang', () => { stepLabel(); if (data) render(); });
    const label = inp => L(inp.dataset.labelFr, inp.dataset.labelEn);
    // données du carton : conservées entre les étapes et réutilisées pour le récapitulatif et l'e-mail
    const collect = () => {
      const fd = new FormData(f);
      const obj = f.querySelector('input[name="objectif"]:checked'), city = f.querySelector('input[name="ville"]:checked');
      return {
        objectif: obj, formats: $$('input[name="format"]:checked', f), ville: city, villeAutre: (fd.get('ville_autre') || '').trim(),
        date: fd.get('date') || '', invites: out.textContent,
        budget: tbd.checked ? null : (budget.value || '').trim(), devise: devise.value, graphisme: !!fd.get('graphisme'),
        prenom: (fd.get('prenom') || '').trim(), nom: (fd.get('nom') || '').trim(), societe: (fd.get('societe') || '').trim(), telephone: (fd.get('telephone') || '').trim(), email: (fd.get('email') || '').trim(), message: (fd.get('message') || '').trim()
      };
    };
    const budgetText = v => v.budget ? `${v.budget} ${v.devise === 'GBP' ? '£ (GBP)' : '€ (EUR)'}` : L('À définir', 'To be defined');
    const rows = v => [
      [L('Objectif', 'Purpose'), v.objectif ? label(v.objectif) : ''],
      [L('Format', 'Format'), v.formats.map(label).join(', ') || L('À définir ensemble', 'To be decided together')],
      [L('Ville', 'City'), v.ville ? (v.ville.value === 'ailleurs' && v.villeAutre ? v.villeAutre : label(v.ville)) : ''],
      [L('Période', 'Date'), v.date || L('À définir', 'To be defined')],
      [L('Invités', 'Guests'), v.invites],
      [L('Budget', 'Budget'), budgetText(v)],
      [L('Supports graphiques', 'Graphic materials'), v.graphisme ? L('Oui', 'Yes') : L('Non', 'No')],
      [L('Contact', 'Contact'), `${v.prenom} ${v.nom}${v.societe ? ' · ' + v.societe : ''}${v.telephone ? ' · ' + v.telephone : ''}`],
      ['E-mail', v.email],
      ...(v.message ? [[L('Message', 'Message'), v.message]] : [])
    ];
    const mailto = v => {
      const body = rows(v).map(([k, val]) => `${k} : ${val}`).join('\n');
      return `mailto:elena.deliot@loeilsingulier.com?subject=${encodeURIComponent(L('R.S.V.P. · Projet d’événement', 'R.S.V.P. · Event enquiry'))}&body=${encodeURIComponent(body)}`;
    };
    window.__osBrief = () => collect(); // aide aux tests : lit les valeurs sans rien envoyer
    function render() {
      sent.innerHTML = `<div class="env-anim" aria-hidden="true"><svg viewBox="0 0 320 200" width="100%"><rect x="10" y="40" width="300" height="150" fill="#1D1A1C"/><path class="ea-card" d="M40 60h240v110H40z" fill="#FBF8F2"/><path d="M10 190L160 100 310 190" fill="#262124"/><path class="ea-flap" d="M10 40L160 130 310 40z" fill="#2A2628"/><g class="ea-seal" transform="translate(160 128)"><circle r="20" fill="#9E0D1A"/><text y="7" text-anchor="middle" font-family="OS Bodoni Display, Didot, serif" font-style="italic" font-size="20" fill="#F3ECE0">œ</text></g></svg></div>
<h2 class="h3">${L('Votre carton-réponse est prêt', 'Your reply card is ready')}</h2>
<p class="small"><b class="demo-tag">${L('Démonstration', 'Demo')}</b> ${L('Rien n’a été envoyé. Pour transmettre votre demande à Eléna Déliot, ouvrez l’e-mail prérempli ci-dessous dans votre messagerie, ou appelez le +33 (0)6 15 79 76 57.', 'Nothing has been sent. To pass your request on to Eléna Déliot, open the pre-filled email below in your mail app, or call +33 (0)6 15 79 76 57.')}</p>
<dl class="recap">${rows(data).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
<div class="btn-row"><a class="btn btn--red" href="${esc(mailto(data))}" data-mailto>${L('Ouvrir l’e-mail prérempli', 'Open the pre-filled email')}</a><button class="btn btn--ghost" type="button" data-edit>${L('Modifier', 'Edit')}</button><button class="btn btn--ghost" type="button" data-again>${L('Nouveau carton', 'New card')}</button></div>`;
      $('[data-again]', sent).addEventListener('click', () => { f.reset(); syncRange(); syncTbd(); other.hidden = true; data = null; toggle(false); go(1); });
      $('[data-edit]', sent).addEventListener('click', () => { data = null; toggle(false); go(N); });
    }
    const toggle = done => { $('[data-steps]', f).hidden = done; $('.reply__nav', f).hidden = done; $('.reply__top .progress', f).style.visibility = done ? 'hidden' : ''; lab.hidden = done; sent.hidden = !done; };
    f.addEventListener('submit', e => {
      e.preventDefault(); if (!valid(N)) return;
      data = collect(); render(); toggle(true); sent.focus({ preventScroll: true }); scrollTo(f);
      if (hasG && !calm) G.timeline().from('.ea-card', { y: -90, duration: 0.8, ease: 'power3.out' }).from('.ea-flap', { scaleY: -1, transformOrigin: '50% 0%', duration: 0.6, ease: 'power2.inOut' }, '+=0.05').from('.ea-seal', { scale: 2.4, opacity: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2)' });
    });
  });

  /* ---------- Démarrage ---------- */
  function boot() {
    safe('reveals', reveals);
    safe('hscroll', hscroll);
    safe('mbar', mbar);
    if (hasG) { ST.refresh(); window.addEventListener('load', () => ST.refresh()); if (document.fonts) document.fonts.ready.then(() => ST.refresh()); }
  }
  boot();
  safe('loader', () => runLoader(() => safe('hero', heroIn)));
})();
