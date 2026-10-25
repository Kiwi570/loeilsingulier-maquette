/* L'Œil Singulier — maquette : mouvement, son, curseur, visionneuse, carton-réponse */
(() => {
  'use strict';
  window.__os = true;
  const d = document.documentElement;
  const SCRIPT = document.currentScript ? document.currentScript.src : '';
  const BASE = SCRIPT ? SCRIPT.replace(/[^/]*$/, '') : 'assets/js/';
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
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const hasG = !!(G && ST);
  if (hasG) { G.registerPlugin(ST); if (window.SplitText) G.registerPlugin(window.SplitText); }
  const pageEl = $('[data-page]');
  const page = pageEl ? pageEl.dataset.page : '';
  const lang = () => (d.dataset.lang === 'en' ? 'en' : 'fr');
  const L = (fr, en) => (lang() === 'en' ? en : fr);
  const emit = (n, detail) => document.dispatchEvent(new CustomEvent(n, { detail }));

  /* ---------- Message bref ---------- */
  let toastT;
  function toast(msg) {
    const el = $('.toast'); if (!el) return;
    el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('is-on'), 2400);
  }

  /* ---------- Langue ---------- */
  const titleFr = document.title;
  const titleEn = ($('meta[name="title-en"]') || {}).content || titleFr;
  function applyLang(l) {
    d.dataset.lang = l; d.lang = l;
    $$('[data-alt-en]').forEach(el => { if (el.dataset.altFr === undefined) el.dataset.altFr = el.getAttribute('alt') || ''; el.setAttribute('alt', l === 'en' ? el.dataset.altEn : el.dataset.altFr); });
    $$('[data-aria-en]').forEach(el => { if (el.dataset.ariaFr === undefined) el.dataset.ariaFr = el.getAttribute('aria-label') || ''; el.setAttribute('aria-label', l === 'en' ? el.dataset.ariaEn : el.dataset.ariaFr); });
    $$('[data-ph-en]').forEach(el => { if (el.dataset.phFr === undefined) el.dataset.phFr = el.getAttribute('placeholder') || ''; el.setAttribute('placeholder', l === 'en' ? el.dataset.phEn : el.dataset.phFr); });
    document.title = l === 'en' ? titleEn : titleFr;
    $$('.js-lang').forEach(b => { b.innerHTML = l === 'en' ? '<span>FR</span>/<b>EN</b>' : '<b>FR</b>/<span>EN</span>'; b.setAttribute('aria-label', l === 'en' ? 'FR/EN, passer en français' : 'FR/EN, switch to English'); });
  }
  safe('lang', () => {
    applyLang(lang());
    $$('.js-lang').forEach(b => b.addEventListener('click', () => {
      const l = lang() === 'en' ? 'fr' : 'en';
      store.set('os-lang', l); applyLang(l); emit('os:lang', l);
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
    const sel = () => { const s = b.parentElement && b.parentElement.querySelector('.sel'); if (s) { const r = document.createRange(); r.selectNodeContents(s); const w = getSelection(); w.removeAllRanges(); w.addRange(r); } toast(L('Texte sélectionné : copiez-le avec ⌘C ou Ctrl+C', 'Text selected: copy it with ⌘C or Ctrl+C')); };
    try { navigator.clipboard.writeText(val).then(() => toast(L('Copié : ', 'Copied: ') + val), sel); } catch (err) { sel(); }
  });

  /* ---------- Défilement fluide ---------- */
  let lenis = null;
  safe('lenis', () => {
    if (calm || !hasG || !window.Lenis) return;
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -90 } });
    lenis.on('scroll', ST.update);
    G.ticker.add(t => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  });

  /* ---------- En-tête et menu ---------- */
  let menuOpen = false;
  safe('header', () => {
    const hdr = $('#hdr'); if (!hdr) return;
    let last = 0;
    const on = y => { hdr.classList.toggle('is-solid', y > 30); if (!menuOpen) hdr.classList.toggle('is-hidden', y > last + 2 && y > 260); else hdr.classList.remove('is-hidden'); if (Math.abs(y - last) > 2) last = y; };
    if (lenis) lenis.on('scroll', e => on(e.scroll)); else window.addEventListener('scroll', () => on(window.scrollY), { passive: true });
    on(window.scrollY);
    hdr.addEventListener('focusin', () => hdr.classList.remove('is-hidden'));
    const burger = $('.js-burger'), menu = $('#menu');
    if (!burger || !menu) return;
    menu.setAttribute('data-lenis-prevent', '');
    const set = open => {
      $$('body > main, body > footer, body > .skip').forEach(x => { x.inert = open; });
      menuOpen = open; menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', String(!open)); burger.setAttribute('aria-expanded', String(open));
      d.classList.toggle('menu-open', open); burger.setAttribute('aria-label', open ? L('Fermer le menu', 'Close menu') : 'Menu');
      if (lenis) open ? lenis.stop() : lenis.start(); else document.body.style.overflow = open ? 'hidden' : '';
      if (open) { const a = menu.querySelector('a'); a && setTimeout(() => a.focus(), 300); } else burger.focus();
    };
    burger.addEventListener('click', () => set(!menuOpen));
    document.addEventListener('keydown', e => {
      if (!menuOpen) return;
      if (e.key === 'Escape') { set(false); return; }
      if (e.key !== 'Tab') return;
      const f = [burger, ...$$('a[href], button:not([disabled])', menu)];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
    window.addEventListener('pageshow', e => { if (e.persisted && menuOpen) set(false); });
  });

  /* ---------- Son : ambiance composée en direct ---------- */
  const Sound = (() => {
    let ctx = null, master, bus, analyser, timer, chimeTimer, on = false, pending = false, ci = 0;
    const chords = [[146.83, 185.0, 220.0, 277.18, 329.63], [123.47, 146.83, 185.0, 220.0, 277.18], [98.0, 123.47, 146.83, 185.0, 220.0], [110.0, 146.83, 196.0, 246.94, 329.63]];
    const pent = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];
    function build() {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3;
      analyser = ctx.createAnalyser(); analyser.fftSize = 512;
      master.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
      const conv = ctx.createConvolver(); const len = Math.floor(ctx.sampleRate * 3.2); const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8); }
      conv.buffer = ir;
      const wet = ctx.createGain(); wet.gain.value = 0.5; const dry = ctx.createGain(); dry.gain.value = 0.62;
      conv.connect(wet); wet.connect(master); dry.connect(master);
      bus = ctx.createGain(); bus.connect(dry); bus.connect(conv);
      const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const nd = nb.getChannelData(0); let lastv = 0;
      for (let i = 0; i < nd.length; i++) { const w = Math.random() * 2 - 1; lastv = (lastv + 0.02 * w) / 1.02; nd[i] = lastv * 3.5; }
      const ns = ctx.createBufferSource(); ns.buffer = nb; ns.loop = true; const nf = ctx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 300; const ng = ctx.createGain(); ng.gain.value = 0.045;
      ns.connect(nf); nf.connect(ng); ng.connect(bus); ns.start();
      return true;
    }
    function keys(f, t, vol) {
      const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
      car.frequency.value = f; mod.frequency.value = f;
      mg.gain.setValueAtTime(f * 1.1, t); mg.gain.exponentialRampToValueAtTime(f * 0.04, t + 1.4);
      mod.connect(mg); mg.connect(car.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0004, t + 3.4);
      car.connect(g); g.connect(bus); car.start(t); mod.start(t); car.stop(t + 3.6); mod.stop(t + 3.6);
    }
    function bell(f, vol = 0.03, t = ctx.currentTime) {
      const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
      car.frequency.value = f; mod.frequency.value = f * 3.5;
      mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(f * 0.02, t + 0.9);
      mod.connect(mg); mg.connect(car.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0003, t + 2.4);
      car.connect(g); g.connect(bus); car.start(t); mod.start(t); car.stop(t + 2.6); mod.stop(t + 2.6);
    }
    function chord() {
      const now = ctx.currentTime; const notes = chords[ci % chords.length]; ci++;
      notes.forEach((f, i) => {
        const g = ctx.createGain(); g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.055 - i * 0.006, now + 2.6); g.gain.setTargetAtTime(0, now + 7.2, 1.5);
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 850 + i * 110; lp.Q.value = 0.4;
        [[0, 'sine', 0.7], [-6, 'triangle', 0.16], [7, 'triangle', 0.16]].forEach(([det, type, lv]) => {
          const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det;
          const og = ctx.createGain(); og.gain.value = lv; o.connect(og); og.connect(lp); o.start(now); o.stop(now + 14);
        });
        lp.connect(g); g.connect(bus);
      });
      keys(notes[2] * 2, now + 0.25, 0.05); keys(notes[3] * 2, now + 1.35, 0.034); keys(notes[4] * 2, now + 3.1, 0.026);
    }
    const loop = () => { chord(); timer = setTimeout(loop, 8000); };
    const chimes = () => { if (Math.random() < 0.7) bell(pent[Math.floor(Math.random() * pent.length)], 0.02 + Math.random() * 0.018); chimeTimer = setTimeout(chimes, 1800 + Math.random() * 3400); };
    function ui() {
      const pressed = on || pending;
      $$('.js-sound').forEach(b => {
        b.setAttribute('aria-pressed', String(pressed));
        if (b.classList.contains('tool')) b.setAttribute('aria-label', pressed ? L('Son, couper l’ambiance sonore', 'Sound, turn off the ambient sound') : L('Son, activer l’ambiance sonore', 'Sound, turn on the ambient sound'));
        const ip = b.querySelector('.i-play'), ipa = b.querySelector('.i-pause'), off = b.querySelector('.ps-off'), onl = b.querySelector('.ps-on');
        if (ip) { ip.style.display = pressed ? 'none' : ''; ipa.style.display = pressed ? '' : 'none'; off.style.display = pressed ? 'none' : ''; onl.style.display = pressed ? '' : 'none'; }
      });
    }
    function start() {
      pending = false;
      if (!ctx && !build()) { toast(L('Votre navigateur ne permet pas le son.', 'Your browser cannot play sound.')); return; }
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.9);
      if (!on) { on = true; loop(); clearTimeout(chimeTimer); chimeTimer = setTimeout(chimes, 2600); }
      store.sset('os-sound', '1'); ui();
    }
    function stop() {
      pending = false; store.sset('os-sound', '0');
      if (ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0, ctx.currentTime, 0.3); }
      on = false; clearTimeout(timer); clearTimeout(chimeTimer); ui();
      setTimeout(() => { if (!on && ctx) ctx.suspend(); }, 1600);
    }
    function level() {
      if (!analyser || !on) return 0;
      const a = new Uint8Array(analyser.fftSize); analyser.getByteTimeDomainData(a);
      let s = 0; for (let i = 0; i < a.length; i++) { const v = (a[i] - 128) / 128; s += v * v; }
      return Math.sqrt(s / a.length);
    }
    return {
      toggle() { if (pending) { pending = false; store.sset('os-sound', '0'); ui(); return; } on ? stop() : start(); },
      tink() { if (on && ctx) bell(pent[Math.floor(Math.random() * pent.length)] * 2, 0.014); },
      arm() { pending = true; ui(); const go = () => { if (pending) start(); window.removeEventListener('pointerdown', go, true); window.removeEventListener('keydown', go, true); }; window.addEventListener('pointerdown', go, true); window.addEventListener('keydown', go, true); },
      level, ui, get on() { return on; }
    };
  })();
  safe('sound', () => {
    document.addEventListener('click', e => { const b = e.target.closest('.js-sound'); if (b) { e.preventDefault(); e.stopPropagation(); Sound.toggle(); } }, true);
    if (store.sget('os-sound') === '1') Sound.arm(); else Sound.ui();
    document.addEventListener('os:lang', () => Sound.ui());
    let lastT = null;
    document.addEventListener('pointerover', e => { const el = e.target.closest('[data-tink]'); if (el && el !== lastT) { lastT = el; Sound.tink(); } else if (!el) lastT = null; });
  });

  /* ---------- Curseur « œil », loupe et boutons magnétiques ---------- */
  safe('cursor', () => {
    if (!fine || calm || !hasG) return;
    const c = $('.cursor'); if (!c) return;
    d.classList.add('has-cursor');
    const ring = $('.cursor__ring', c), dot = $('.cursor__dot', c), txt = $('.cursor__txt', c);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, loupe = null, mode = '', seen = false;
    c.style.opacity = '0';
    const Z = 2.6, SIZE = 190;
    function loupeAt(e) {
      const im = loupe; const r = im.getBoundingClientRect();
      const nw = im.naturalWidth || r.width, nh = im.naturalHeight || r.height; const fit = getComputedStyle(im).objectFit;
      let cw = r.width, ch = r.height, ox = 0, oy = 0; const ir = nw / nh, er = r.width / r.height;
      if (fit === 'contain') { if (ir > er) { ch = r.width / ir; oy = (r.height - ch) / 2; } else { cw = r.height * ir; ox = (r.width - cw) / 2; } }
      else if (fit === 'cover') { if (ir > er) { cw = r.height * ir; ox = (r.width - cw) / 2; } else { ch = r.width / ir; oy = (r.height - ch) / 2; } }
      const px = e.clientX - r.left - ox, py = e.clientY - r.top - oy;
      ring.style.backgroundSize = `${cw * Z}px ${ch * Z}px`;
      ring.style.backgroundPosition = `${-(px * Z - SIZE / 2)}px ${-(py * Z - SIZE / 2)}px`;
    }
    window.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (!seen) { seen = true; rx = x; ry = y; c.style.opacity = '1'; } if (loupe) loupeAt(e); }, { passive: true });
    G.ticker.add(() => {
      const k = mode === 'loupe' ? 1 : 0.2;
      rx += (x - rx) * k; ry += (y - ry) * k;
      c.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      dot.style.transform = `translate3d(${x - rx}px,${y - ry}px,0)`;
    });
    window.__osCursorReset = () => setMode('');
    function setMode(m, el) {
      if (m === mode && (m !== 'loupe' || (el && el === loupe))) return;
      mode = m; c.className = 'cursor' + (m ? ' is-' + m : '');
      if (m === 'loupe') { loupe = el; ring.style.backgroundImage = `url("${el.dataset.big || el.currentSrc || el.src}")`; }
      else { loupe = null; ring.style.backgroundImage = ''; }
      txt.textContent = m === 'view' ? L('Voir', 'View') : '';
    }
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const lp = t.closest('[data-cursor="loupe"]');
      if (lp) { const im = lp.tagName === 'IMG' ? lp : lp.querySelector('img'); if (im) { setMode('loupe', im); return; } }
      if (t.closest('[data-cursor="view"]')) return setMode('view');
      if (t.closest('a, button, [role="tab"], label, summary, input[type="range"]')) return setMode('link');
      setMode('');
    });
    document.addEventListener('pointerleave', () => { c.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { if (seen) c.style.opacity = '1'; });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); G.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.32, duration: 0.5, ease: 'power3.out' }); });
      el.addEventListener('pointerleave', () => G.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, .4)' }));
    });
  });

  /* ---------- Transitions de page : le rabat de l'enveloppe ---------- */
  safe('transitions', () => {
    const veil = $('.veil'); if (!veil || !hasG) return;
    const flap = $('.veil__flap', veil), mark = $('.veil__mark', veil);
    if (store.sget('os-trans') === '1' && !calm) {
      store.sset('os-trans', '0');
      veil.classList.add('is-on'); G.set(flap, { yPercent: 0 }); G.set(mark, { opacity: 1 });
      G.timeline({ delay: 0.05, onComplete: () => veil.classList.remove('is-on') })
        .to(mark, { opacity: 0, scale: 0.9, duration: 0.25 })
        .to(flap, { yPercent: -101, duration: 0.75, ease: 'power3.inOut' }, '<0.05');
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
      if (norm(url.pathname) === norm(location.pathname) && url.search === location.search) {
        if (url.hash) { if (url.pathname !== location.pathname) { e.preventDefault(); history.replaceState(null, '', url.hash); const t = document.getElementById(decodeURIComponent(url.hash.slice(1))); if (t) (lenis ? lenis.scrollTo(t) : t.scrollIntoView()); } return; }
        e.preventDefault(); lenis ? lenis.scrollTo(0) : window.scrollTo(0, 0); return;
      }
      if (calm) return;
      e.preventDefault();
      store.sset('os-trans', '1');
      veil.classList.add('is-on');
      G.timeline({ onComplete: () => { location.href = url.href; } })
        .fromTo(flap, { yPercent: -101 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' })
        .fromTo(mark, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.15');
    });
  });

  /* ---------- Ouverture : le cachet se brise, l'enveloppe s'ouvre ---------- */
  function runLoader(done) {
    window.__osLoader = true;
    const el = $('.loader');
    if (!el) return done();
    if (calm || !hasG) { el.remove(); return done(); }
    const short = store.sget('os-seen') === '1'; store.sset('os-seen', '1');
    const seal = $('.seal', el), l = $('.seal__l', el), r = $('.seal__r', el), crack = $('.seal__crack', el), flap = $('.loader__flap', el), word = $('.loader__word', el);
    const pkg = $('.loader__pkg', el);
    const tl = G.timeline({ onComplete: () => el.remove() });
    const skip = () => { if (tl.progress() < 1) tl.timeScale(3); };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => window.addEventListener(ev, skip, { once: true, passive: true }));
    if (short) {
      tl.from(seal, { scale: 1.2, opacity: 0, duration: 0.35, ease: 'power2.out' })
        .to(seal, { scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in' }, '+=0.1')
        .to(pkg, { yPercent: 100, duration: 0.75, ease: 'power3.inOut' }, '-=0.05')
        .add(done, '-=0.5');
      return;
    }
    // 1. l'invitation apparaît, le cachet se pose
    tl.from(word, { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 0.1)
      .from(seal, { scale: 1.5, opacity: 0, rotation: -14, duration: 0.6, ease: 'back.out(1.6)' }, 0.1)
    // 2. le cachet se fend puis ses deux moitiés tombent
      .fromTo(crack, { strokeDasharray: 120, strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 0.28, ease: 'power2.in' }, 0.74)
      .to(crack, { attr: { 'stroke-opacity': 1 }, duration: 0.12 }, 0.78)
      .set($('.seal__whole', el), { opacity: 0 }, 0.8)
      .to(crack, { opacity: 0, duration: 0.15 }, 1.0)
      .to(l, { rotation: -38, x: -46, y: 460, svgOrigin: '0 40', duration: 0.8, ease: 'power2.in' }, 1.0)
      .to(r, { rotation: 34, x: 40, y: 480, svgOrigin: '0 40', duration: 0.84, ease: 'power2.in' }, 1.03)
      .to(word, { opacity: 0, y: -8, duration: 0.35 }, 1.0)
    // 3. le rabat se replie vers le haut, à plat (sans effet de loupe), et révèle la doublure bleu nuit
      .to(flap, { scaleY: -1, transformOrigin: '50% 0%', duration: 0.8, ease: 'power3.inOut' }, 1.05)
      .to(flap, { '--shade': 1, duration: 0.4, ease: 'power1.in' }, 1.05)
      .to(flap, { '--shade': 0, duration: 0.4, ease: 'power1.out' }, 1.45)
      .set(flap, { autoAlpha: 0 }, 1.86)
    // 4. l'enveloppe entière glisse d'un seul bloc et laisse le carton (la page)
      .to(pkg, { yPercent: 100, duration: 1, ease: 'power3.inOut' }, 1.8)
      .add(done, 1.95);
  }

  /* ---------- Révélations au défilement ---------- */
  function splitPress(h) {
    if (!window.SplitText) return null;
    const parts = $$('.l-fr, .l-en', h); const els = parts.length ? parts : [h];
    return new window.SplitText(els, { type: 'words', wordsClass: 'wd', aria: 'none' }); // découpage en mots : le texte reste lu tel quel
  }
  function reveals() {
    const prints = $$('.print[data-dev]');
    if (calm || !hasG) { prints.forEach(p => p.classList.add('is-dev')); $$('[data-letter]').forEach(l => l.classList.add('is-out')); return; }

    // tirages : le bain révélateur
    const hsPrints = new Set($$('[data-hs] .print[data-dev]'));
    const develop = el => { if (el.classList.contains('is-dev')) return; el.classList.add('is-dev'); const im = el.querySelector('img'); if (im && !im.dataset.par) G.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'expo.out' }); };
    ST.batch(prints.filter(p => !hsPrints.has(p)), { start: 'top 97%', once: true, onEnter: els => els.forEach((el, i) => setTimeout(() => develop(el), i * 110)) });
    hsPrints.forEach(p => p._develop = () => develop(p));

    // titres : la frappe typographique
    $$('[data-press]').forEach(h => safe('press', () => {
      const sp = splitPress(h); if (!sp) return;
      G.from(sp.words, { scrollTrigger: { trigger: h, start: 'top 88%', once: true }, opacity: 0, yPercent: -30, scale: 1.1, rotationX: -55, transformOrigin: '50% 100%', transformPerspective: 600, duration: 1.15, ease: 'expo.out', stagger: { each: 0.06, from: 'start' } });
    }));

    // blocs qui montent
    $$('[data-rise]').forEach(el => {
      const kids = el.dataset.rise === 'stagger' ? Array.from(el.children) : [el];
      G.from(kids, { scrollTrigger: { trigger: el, start: 'top 90%', once: true }, y: 36, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 });
    });

    // tracés qui se dessinent
    $$('[data-draw]').forEach(p => safe('draw', () => {
      if (p.closest('[data-table-plan]')) return;
      const len = p.getTotalLength ? p.getTotalLength() : 60;
      G.set(p, { strokeDasharray: len, strokeDashoffset: len });
      G.to(p, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: p.closest('li, article, section') || p, start: 'top 88%', once: true }, delay: 0.2 });
    }));

    // parallaxe
    $$('[data-par]').forEach(el => {
      const v = Math.max(-9, Math.min(9, parseFloat(el.dataset.par) || 0));
      if (el.tagName === 'IMG') el.classList.add('has-par');
      G.fromTo(el, { yPercent: -v }, { yPercent: v, ease: 'none', scrollTrigger: { trigger: el.closest('.print') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // numéroteur
    $$('[data-count]').forEach(el => safe('count', () => {
      const n = el.dataset.count; const digits = n.split('');
      el.textContent = '';
      const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = n; el.appendChild(sr);
      const wheels = digits.map(ch => {
        const w = document.createElement('span'); w.className = 'wheel'; w.setAttribute('aria-hidden', 'true');
        const inn = document.createElement('span'); inn.className = 'wheel__in';
        for (let k = 0; k < 20; k++) { const s = document.createElement('span'); s.textContent = k % 10; inn.appendChild(s); }
        const fin = document.createElement('span'); fin.textContent = ch; inn.appendChild(fin);
        w.appendChild(inn); el.appendChild(w); return inn;
      });
      G.to(wheels, { yPercent: -100 * 20 / 21, duration: 2.2, ease: 'power4.out', stagger: { each: 0.18, from: 'end' }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    }));

    // lettres qui sortent de l'enveloppe
    ST.batch('[data-letter]', { start: 'top 82%', once: true, onEnter: els => els.forEach((el, i) => setTimeout(() => el.classList.add('is-out'), i * 160)) });
  }

  /* ---------- Accueil ---------- */
  function heroIn(foilApi) {
    const hero = $('.hero'); if (!hero) return;
    if (calm || !hasG) { foilApi && foilApi.reveal(true); return; }
    const tl = G.timeline();
    tl.from('[data-hero]', { y: 28, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 }, 0.15)
      .from('.hero .lead', { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.3)
      .from('[data-print]', { y: 140, rotation: '+=9', opacity: 0, duration: 1.5, ease: 'expo.out', stagger: 0.12 }, 0.1)
      .from('.scroll-hint', { opacity: 0, duration: 0.8 }, 1.1);
    if (foilApi) foilApi.reveal(); else G.fromTo('#hero-t', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'expo.inOut', delay: 0.2 });
    const prints = $$('[data-print]');
    const sheet = $('.card-sheet');
    if (fine && sheet) sheet.addEventListener('pointermove', e => {
      const r = sheet.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      prints.forEach((p, i) => G.to(p, { x: px * (14 + i * 10), y: py * (12 + i * 8), rotationY: px * 6, rotationX: -py * 6, transformPerspective: 1200, duration: 1, ease: 'power3.out' }));
    });
    G.to('.hero__prints', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  function homeScenes() {
    if (calm || !hasG) return;
    const cart = $('[data-cartouche] .print');
    if (cart) G.fromTo(cart, { clipPath: 'ellipse(0% 0% at 50% 50%)' }, { clipPath: 'ellipse(75% 75% at 50% 50%)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: cart, start: 'top 85%', once: true } });

    const cards = $$('[data-menu-card]');
    if (cards.length === 3 && desk) {
      const deck = cards[0].parentElement;
      const off = i => () => { const c = cards[1].offsetLeft, r = cards[i].offsetLeft; return c - r; };
      const tl = G.timeline({ scrollTrigger: { trigger: deck, start: 'top 88%', end: 'top 28%', scrub: 1, invalidateOnRefresh: true } });
      cards.forEach((el, i) => tl.fromTo(el, { x: off(i), y: i === 1 ? 0 : 40, rotation: [-8, 0, 8][i] }, { x: 0, y: 0, rotation: 0, ease: 'none' }, 0));
      if (fine) cards.forEach(el => {
        el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); G.to(el, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 10, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 10, transformPerspective: 900, duration: 0.6, ease: 'power3.out' }); });
        el.addEventListener('pointerleave', () => G.to(el, { rotationY: 0, rotationX: 0, duration: 0.9, ease: 'power3.out' }));
      });
    }

    const tp = $('[data-table-plan]');
    const tpSvg = tp && $('svg', tp);
    if (tp && tpSvg && tpSvg.getClientRects().length) {
      const els = $$('ellipse[data-draw]', tp);
      els.forEach(p => { const len = p.getTotalLength ? p.getTotalLength() : 2200; G.set(p, { strokeDasharray: len, strokeDashoffset: len }); });
      const tl = G.timeline({ scrollTrigger: { trigger: tp, start: 'top 78%', end: 'center 52%', scrub: 1 } });
      const cloth = $('.tp-cloth', tp);
      if (cloth) tl.fromTo(cloth, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', duration: 0.8 }, 0.1);
      tl.to(els, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
        .from($$('.chair', tp), { scale: 0, transformOrigin: '50% 50%', stagger: 0.04, duration: 0.3 }, 0.2)
        .from($$('text', tp), { opacity: 0, y: 10, duration: 0.4 }, 0.5)
        ;
    }
    if (tp) G.from($$('.place__card', tp), { y: -50, rotation: (i) => [-6, 5, 4, -5][i % 4] * (desk ? 1 : 0.4), opacity: 0, duration: 1.1, ease: 'back.out(1.4)', stagger: 0.14, scrollTrigger: { trigger: tp, start: 'top 75%', once: true } });

    const sw = $('[data-stack-wrap]');
    if (sw) {
      const items = $$('[data-stack]', sw); const mid = (items.length - 1) / 2;
      const spread = () => Math.max(20, (sw.clientWidth - items[0].offsetWidth) / (2 * mid) * (desk ? 0.92 : 0.72));
      items.forEach((el, i) => G.set(el, { rotation: [-5, 4, -2, 6, -3][i % 5], zIndex: 10 - Math.abs(i - mid) }));
      const tl = G.timeline({ scrollTrigger: { trigger: sw, start: 'top 80%', end: 'bottom 35%', scrub: 1, invalidateOnRefresh: true } });
      items.forEach((el, i) => tl.to(el, { x: () => (i - mid) * spread(), y: () => Math.abs(i - mid) * 22, rotation: (i - mid) * 7, ease: 'none' }, 0));
    }

    const rc = $('[data-rsvp-card]');
    if (rc) G.fromTo(rc, { rotation: -9, y: 90 }, { rotation: -1.5, y: 0, ease: 'none', scrollTrigger: { trigger: rc, start: 'top bottom', end: 'center 60%', scrub: 1 } });
  }

  /* ---------- Galeries horizontales épinglées ---------- */
  function hscroll() {
    $$('[data-hs]').forEach(hs => {
      const track = $('.hs__track', hs);
      if (calm || !hasG || !desk) { hs.classList.add('is-native'); if (!hs.querySelector('a, button')) { hs.tabIndex = 0; hs.setAttribute('role', 'region'); const h2 = hs.closest('section')?.querySelector('h2'); if (h2) { h2.id = h2.id || 'hs-titre-' + Math.random().toString(36).slice(2, 7); hs.setAttribute('aria-labelledby', h2.id); } } const sec = hs.closest('.hs-sec'); sec && sec.classList.add('is-native-sec'); $$('.print[data-dev]', hs).forEach(p => p.classList.add('is-dev')); return; }
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tween = G.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: hs.closest('.hs-sec') || hs, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      const hp = $$('.print[data-dev]', hs);
      ST.create({ trigger: hs, start: 'top 85%', once: true, onEnter: () => hp.forEach((p, k) => setTimeout(() => (p._develop ? p._develop() : p.classList.add('is-dev')), k * 140)) });
      $$('.hs__item', hs).forEach((it, i) => G.fromTo(it, { y: i % 2 ? 40 : -20 }, { y: i % 2 ? -40 : 20, ease: 'none', scrollTrigger: { trigger: it, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }));
    });
  }

  /* ---------- Témoignage recto verso ---------- */
  safe('bcard', () => {
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-flip]'); if (!b) return;
      const card = b.closest('[data-bcard]'); const flipped = !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped', flipped);
      const front = $('.bcard__front', card), back = $('.bcard__back', card);
      front.setAttribute('aria-hidden', String(flipped)); back.setAttribute('aria-hidden', String(!flipped));
      $('[data-flip]', front).tabIndex = flipped ? -1 : 0; $('[data-flip]', back).tabIndex = flipped ? 0 : -1;
      setTimeout(() => (flipped ? $('[data-flip]', back) : $('[data-flip]', front)).focus({ preventScroll: true }), 50);
    });
  });

  /* ---------- Carte Paris ⇄ Londres et horloges ---------- */
  safe('map', () => {
    const maps = $$('[data-map]'); if (!maps.length) return;
    const cities = [
      { id: 'paris', name: 'Paris', sub: 'Passage Rauch', lat: 48.8545, lon: 2.3797, main: true },
      { id: 'london', name: 'London', sub: 'Gloucester Terrace', lat: 51.5172, lon: -0.1866, main: true },
      { id: 'munich', name: 'München', sub: '', lat: 48.1372, lon: 11.5755 },
      { id: 'barcelona', name: 'Barcelona', sub: '', lat: 41.3874, lon: 2.1686 }
    ];
    const W = 600, H = 545, lon0 = -4.6, lon1 = 14.6, lat0 = 40.2, lat1 = 53.6, k = Math.cos(47 * Math.PI / 180);
    const sx = (W - 60) / ((lon1 - lon0) * k), sy = (H - 60) / (lat1 - lat0); const s = Math.min(sx, sy);
    const ox = (W - (lon1 - lon0) * k * s) / 2, oy = (H - (lat1 - lat0) * s) / 2;
    const P = (lat, lon) => [ox + (lon - lon0) * k * s, oy + (lat1 - lat) * s];
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, a, parent) => { const e = document.createElementNS(NS, tag); for (const n in a) e.setAttribute(n, a[n]); parent && parent.appendChild(e); return e; };
    const hav = (a, b) => { const R = 6371, t = x => x * Math.PI / 180; const dl = t(b.lat - a.lat), dn = t(b.lon - a.lon); const h = Math.sin(dl / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
    const km = Math.round(hav(cities[0], cities[1]));
    const setDist = () => $$('[data-distance]').forEach(el => { el.textContent = L(`Paris ⇄ Londres : ${km} km à vol d’oiseau, une heure de décalage. Méridiens de Greenwich et de Paris tracés en or.`, `Paris ⇄ London: ${km} km as the crow flies, one hour apart. The Greenwich and Paris meridians are drawn in gold.`); });
    setDist(); document.addEventListener('os:lang', setDist);
    maps.forEach(map => {
      const layer = $('[data-map-layer]', map); if (!layer) return;
      const g1 = mk('g', {}, layer);
      for (let lo = -4; lo <= 14; lo += 2) { const [x1, y1] = P(lat1, lo), [, y2] = P(lat0, lo); mk('line', { class: 'grat', x1, y1, x2: x1, y2 }, g1); mk('text', { class: 'grat-t', x: x1 + 3, y: H - 18 }, g1).textContent = `${Math.abs(lo)}°${lo < 0 ? 'O' : lo > 0 ? 'E' : ''}`; }
      for (let la = 42; la <= 53; la += 2) { const [x1, y] = P(la, lon0), [x2] = P(la, lon1); mk('line', { class: 'grat', x1, y1: y, x2, y2: y }, g1); mk('text', { class: 'grat-t', x: 16, y: y - 3 }, g1).textContent = `${la}°N`; }
      const meridian = (lo, label) => { const [x1, y1] = P(lat1, lo), [, y2] = P(lat0, lo); mk('line', { x1, y1, x2: x1, y2, stroke: '#A8874B', 'stroke-width': 1, 'stroke-dasharray': '2 5', 'stroke-opacity': 0.8 }, g1); const tx = mk('text', { class: 'grat-t', x: x1 + 4, y: y1 + 24, fill: '#775C2B' }, g1); tx.textContent = label; };
      meridian(0, 'Greenwich 0°'); meridian(2.3372, 'Paris 2°20′14″ E');
      const arcs = mk('g', {}, layer);
      const pa = P(cities[0].lat, cities[0].lon);
      const paths = cities.slice(1).map(c => {
        const pb = P(c.lat, c.lon); const mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2; const dx = pb[0] - pa[0], dy = pb[1] - pa[1]; const n = Math.hypot(dx, dy);
        const cx = mx - dy / n * n * 0.28, cy = my + dx / n * n * 0.28;
        return mk('path', { class: 'arc' + (c.id === 'london' ? ' arc--main' : ''), d: `M${pa[0]},${pa[1]} Q${cx},${cy} ${pb[0]},${pb[1]}` }, arcs);
      });
      const cg = mk('g', {}, layer);
      cities.forEach(c => {
        const [x, y] = P(c.lat, c.lon); const g = mk('g', { class: 'city' }, cg);
        if (c.main) mk('circle', { class: 'h', cx: x, cy: y, r: 14 }, g);
        mk('circle', { class: 'c', cx: x, cy: y, r: c.main ? 5 : 3.5 }, g);
        const right = c.id !== 'munich';
        const tx = mk('text', { x: x + (right ? 18 : -14), y: y + (c.id === 'london' ? -12 : 5), 'text-anchor': right ? 'start' : 'end' }, g); tx.textContent = c.name;
        if (c.sub) { const st = mk('text', { class: 'sub', x: x + 18, y: y + (c.id === 'london' ? 4 : 21) }, g); st.textContent = c.sub; }
      });
      if (hasG && !calm) {
        paths.forEach(p => { const len = p.getTotalLength(); G.set(p, { strokeDasharray: len, strokeDashoffset: len }); });
        G.timeline({ scrollTrigger: { trigger: map, start: 'top 75%', once: true } })
          .from($$('.city', cg), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', stagger: 0.12, duration: 0.6, ease: 'back.out(2)' })
          .to(paths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.25 }, 0.2);
        $$('.city .h', cg).forEach((h, i) => G.to(h, { attr: { r: 22 }, opacity: 0, duration: 2.2, repeat: -1, ease: 'power1.out', delay: i * 0.6 }));
      }
    });
  });
  safe('clocks', () => {
    const els = $$('[data-clock]'); if (!els.length) return;
    const tick = () => els.forEach(el => { try { el.textContent = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.clock }).format(new Date()); } catch (e) { el.textContent = ''; } });
    tick(); setInterval(tick, 10000);
  });

  /* ---------- Visionneuse ---------- */
  const LB = (() => {
    let el, imgEl, capEl, cntEl, items = [], i = 0, opener = null, zoomable = false;
    function build() {
      el = document.createElement('div'); el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', L('Visionneuse', 'Viewer'));
      el.innerHTML = `<div class="lb__bar"><span class="lb__cnt num"></span><button type="button" class="lb__close">${L('Fermer', 'Close')} ✕</button></div>
<div class="lb__stage"><button type="button" class="lb__nav lb__prev" aria-label="${L('Précédente', 'Previous')}">←</button><img alt=""><button type="button" class="lb__nav lb__next" aria-label="${L('Suivante', 'Next')}">→</button></div>
<div class="lb__cap"><b></b><span class="lb__note"></span></div>`;
      document.body.appendChild(el);
      imgEl = $('img', el); capEl = $('.lb__cap b', el); cntEl = $('.lb__cnt', el);
      $('.lb__close', el).addEventListener('click', close);
      $('.lb__prev', el).addEventListener('click', () => show(i - 1));
      $('.lb__next', el).addEventListener('click', () => show(i + 1));
      const stage = $('.lb__stage', el);
      imgEl.addEventListener('click', e => { if (!zoomable) return; stage.classList.toggle('is-zoom'); origin(e); });
      stage.addEventListener('pointermove', origin);
      function origin(e) { if (!stage.classList.contains('is-zoom')) return; const r = imgEl.getBoundingClientRect(); imgEl.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`; }
      let sx = null; stage.addEventListener('pointerdown', e => { sx = e.clientX; }); stage.addEventListener('pointerup', e => { if (sx === null || stage.classList.contains('is-zoom')) return; const dx = e.clientX - sx; if (Math.abs(dx) > 60) show(i + (dx < 0 ? 1 : -1)); sx = null; });
      el.addEventListener('keydown', e => {
        if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1);
        else if (e.key === 'Tab') { const f = $$('button', el); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
      });
    }
    function show(n) {
      i = (n + items.length) % items.length; const it = items[i];
      $('.lb__stage', el).classList.remove('is-zoom'); imgEl.style.transformOrigin = '';
      imgEl.src = it.dataset.full; imgEl.width = +it.dataset.w; imgEl.height = +it.dataset.h;
      const cap = L(it.dataset.capFr, it.dataset.capEn); imgEl.alt = cap; capEl.textContent = cap;
      $('.lb__note', el).textContent = it.dataset.lb === 'gal' ? L('Événement, lieu et date à compléter', 'Event, venue and date to be added') : L('Légende lue sur le visuel, à confirmer · cliquez sur l’image pour zoomer', 'Caption read from the piece, to be confirmed · click the image to zoom');
      cntEl.textContent = `${i + 1} / ${items.length}`;
      zoomable = it.hasAttribute('data-zoom');
      if (hasG && !calm) G.fromTo(imgEl, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
    }
    function open(trigger) {
      if (!el) build();
      opener = trigger; items = $$(`[data-lb="${trigger.dataset.lb}"]`).filter(x => !x.closest('[hidden]'));
      el.classList.add('is-open'); lenis && lenis.stop(); document.body.style.overflow = 'hidden'; window.__osCursorReset && window.__osCursorReset();
      show(items.indexOf(trigger)); setTimeout(() => $('.lb__close', el).focus(), 30);
    }
    function close() { el.classList.remove('is-open'); lenis && lenis.start(); document.body.style.overflow = ''; opener && opener.focus({ preventScroll: true }); }
    return { open };
  })();
  document.addEventListener('click', e => { const t = e.target.closest('[data-lb]'); if (t) { e.preventDefault(); LB.open(t); } });

  /* ---------- Filtres de la galerie et des réalisations ---------- */
  safe('filters', () => {
    $$('[data-filters]').forEach(group => {
      const grid = $(`[data-filter-grid="${group.dataset.filters}"]`); if (!grid) return;
      const items = Array.from(grid.children);
      group.addEventListener('click', e => {
        const b = e.target.closest('[data-filter]'); if (!b) return;
        const k = b.dataset.filter;
        $$('[data-filter]', group).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        const show = items.filter(it => k === 'tout' || it.dataset.cat === k);
        items.forEach(it => { it.hidden = !show.includes(it); });
        show.forEach(it => { const p = it.querySelector('.print[data-dev]'); p && p.classList.add('is-dev'); });
        if (hasG && !calm) G.fromTo(show.slice(0, 16), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.035, clearProps: 'transform,opacity' });
        if (hasG) ST.refresh();
        const top = group.getBoundingClientRect().top;
        if (top < 0) { const y = top + window.scrollY - 110; lenis ? lenis.scrollTo(y) : window.scrollTo({ top: y }); }
      });
    });
  });

  /* ---------- Filet de progression et retour en haut ---------- */
  safe('progress', () => {
    const bar = $('.hdr__progress'); if (!bar) return;
    const upd = y => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`; };
    if (lenis) lenis.on('scroll', e => upd(e.scroll)); else window.addEventListener('scroll', () => upd(window.scrollY), { passive: true });
    document.addEventListener('click', e => { const a = e.target.closest('[data-top]'); if (!a) return; e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); const skip = $('#contenu'); });
  });

  /* ---------- Design graphique ---------- */
  function designScenes() {
    const comp = $('[data-compose]');
    if (comp && hasG && !calm) G.from($$('.w i', comp), { yPercent: 115, rotation: 5, duration: 1.3, ease: 'expo.out', stagger: 0.08, delay: 0.25 });
    const fp = $('.float-prev'), sup = $('[data-supports]');
    if (fp && sup && fine && !calm) {
      const im = $('img', fp); let on = false, x = 0, y = 0;
      sup.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; fp.style.left = x + 'px'; fp.style.top = y + 'px'; });
      $$('a', sup).forEach(a => { a.addEventListener('pointerenter', () => { im.src = a.dataset.prev; fp.classList.add('is-on'); on = true; }); a.addEventListener('pointerleave', () => { fp.classList.remove('is-on'); on = false; }); });
    }
  }

  /* ---------- Événementiel ---------- */
  function eventScenes() {
    if (calm || !hasG) return;
    const fold = $('[data-fold]');
    if (fold && desk) {
      const tl = G.timeline({ scrollTrigger: { trigger: fold, start: 'top 85%', end: 'top 35%', scrub: 1 } });
      tl.fromTo('.fold__l', { rotationY: 38, transformPerspective: 2400, opacity: .4 }, { rotationY: 0, opacity: 1, ease: 'none' }, 0).fromTo('.fold__r', { rotationY: -38, transformPerspective: 2400, opacity: .4 }, { rotationY: 0, opacity: 1, ease: 'none' }, 0);
    }
    $$('[data-trades]').forEach(tr => G.from($$('.trade', tr), { y: 40, rotation: (i) => [-3, 2, -2, 3][i % 4], opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: tr, start: 'top 88%', once: true } }));
  }

  /* ---------- Agence ---------- */
  function agencyScenes() {
    const medal = $('[data-medal] .print');
    if (medal && hasG && !calm) G.fromTo(medal, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.8, ease: 'expo.inOut', delay: 0.3 });
    const th = $('[data-thread]'); if (!th) return;
    const svg = $('.thread__svg', th), path = $('path', svg);
    const shape = () => {
      const w = svg.getBoundingClientRect().width, h = th.offsetHeight; svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('height', h);
      const cx = w / 2, amp = w * 0.32; let dstr = `M${cx},0`; const seg = 170;
      for (let y = 0, k = 0; y < h; y += seg, k++) { const y2 = Math.min(h, y + seg); const s = k % 2 ? -1 : 1; dstr += ` C${cx + amp * s},${y + seg * 0.33} ${cx - amp * s},${y + seg * 0.66} ${cx},${y2}`; }
      path.setAttribute('d', dstr); return path.getTotalLength();
    };
    let len = shape();
    if (!hasG || calm) return;
    G.set(path, { strokeDasharray: len, strokeDashoffset: len });
    G.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: th, start: 'top 70%', end: 'bottom 70%', scrub: 1, invalidateOnRefresh: true, onRefresh: () => { len = shape(); G.set(path, { strokeDasharray: len }); } } });
  }

  /* ---------- Références : onglets et liste des invités ---------- */
  safe('tabs', () => {
    const tl = $('[data-tabs]'); if (!tl) return;
    const tabs = $$('[role="tab"]', tl);
    const ink = panel => { if (hasG && !calm) G.fromTo($$('[data-ink]', panel), { clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)', duration: 0.9, ease: 'power2.out', stagger: 0.04, clearProps: 'clipPath' }); };
    const select = (t, focus) => {
      tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) t.focus(); ink(document.getElementById(t.getAttribute('aria-controls'))); if (hasG) ST.refresh();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => { let n = null; if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length]; if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length]; if (e.key === 'Home') n = tabs[0]; if (e.key === 'End') n = tabs[tabs.length - 1]; if (n) { e.preventDefault(); select(n, true); } });
    });
    if (hasG && !calm) ST.create({ trigger: tl, start: 'top 80%', once: true, onEnter: () => ink(document.getElementById(tabs[0].getAttribute('aria-controls'))) });
  });

  /* ---------- Le Son : rosace guillochée ---------- */
  safe('guilloche', () => {
    const cv = $('[data-guilloche]'); if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, dpr = 1, vis = true, lvl = 0;
    const N = desk ? 18 : 12, STEPS = desk ? 220 : 160;
    let last = 0;
    const size = () => { dpr = Math.min(window.devicePixelRatio || 1, 1.25); const r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); };
    size(); window.addEventListener('resize', size);
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(cv);
    const draw = now => {
      const t = now / 1000; lvl += (Math.min(1, Sound.level() * 5) - lvl) * 0.08;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.translate(w / 2, h / 2);
      const R = Math.min(w, h) * 0.42;
      for (let k = 0; k < N; k++) {
        const ph = k * 0.24 + t * 0.06; const amp = (0.045 + lvl * 0.09) * R;
        ctx.beginPath();
        for (let s = 0; s <= STEPS; s++) {
          const th = s / STEPS * Math.PI * 2;
          const r = R * (0.58 + 0.16 * k / N) + amp * Math.sin(12 * th + ph) + R * 0.04 * Math.sin(5 * th - ph * 1.3);
          const x = r * Math.cos(th), y = r * Math.sin(th); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = `rgba(230, 210, 159, ${0.16 + 0.24 * (k / N) + lvl * 0.2})`; ctx.lineWidth = 0.9; ctx.stroke();
      }
    };
    if (calm) { draw(0); return; }
    const loop = now => { if (vis && !document.hidden && now - last > 33) { last = now; draw(now); } requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });

  /* ---------- Contact : le carton-réponse ---------- */
  safe('brief', () => {
    const f = $('[data-brief]'); if (!f) return;
    const steps = $$('[data-step]', f), bars = $$('.progress i', f), lab = $('[data-step-label]', f);
    const prev = $('[data-prev]', f), next = $('[data-next]', f), sub = $('[data-submit]', f), sent = $('[data-sent]', f);
    let cur = 1;
    const range = $('#b-guests'), out = $('#b-guests-out');
    const syncRange = () => { out.textContent = range.value === range.max ? range.value + '+' : range.value; range.style.setProperty('--p', ((range.value - range.min) / (range.max - range.min) * 100) + '%'); };
    range.addEventListener('input', syncRange); syncRange();
    const err = (n, msg) => { const e = $(`[data-err="${n}"]`, f); if (e) e.textContent = msg || ''; };
    const valid = n => {
      if (n === 1 && !f.querySelector('input[name="objectif"]:checked')) { err(1, L('Choisissez une intention pour continuer.', 'Choose a purpose to continue.')); return false; }
      if (n === 3 && !f.querySelector('input[name="ville"]:checked')) { err(3, L('Indiquez une ville, même approximative.', 'Pick a city, even roughly.')); return false; }
      if (n === 4) {
        const miss = ['#b-prenom', '#b-nom'].filter(s => !$(s, f).value.trim());
        const mail = $('#b-mail', f).value.trim();
        if (miss.length) { err(4, L('Indiquez votre prénom et votre nom.', 'Please enter your first and last name.')); $(miss[0], f).focus(); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { err(4, L('Vérifiez l’adresse e-mail : il manque sans doute le @ ou le domaine.', 'Check the email address: the @ or the domain is probably missing.')); $('#b-mail', f).focus(); return false; }
        if (!$('#b-ok', f).checked) { err(4, L('Cochez la case d’accord pour envoyer votre demande.', 'Tick the consent box to send your request.')); return false; }
      }
      err(n, ''); return true;
    };
    const go = n => {
      cur = Math.max(1, Math.min(4, n));
      steps.forEach(s => { s.hidden = +s.dataset.step !== cur; });
      bars.forEach((b, i) => b.classList.toggle('on', i < cur));
      lab.innerHTML = `<span class="l-fr" lang="fr">Étape ${cur} sur 4</span><span class="l-en" lang="en">Step ${cur} of 4</span>`;
      prev.hidden = cur === 1; next.hidden = cur === 4; sub.hidden = cur !== 4;
      const st = steps[cur - 1];
      if (hasG && !calm) G.from(st, { x: 30, opacity: 0, duration: 0.6, ease: 'expo.out' });
      const legend = $('legend', st); legend && legend.setAttribute('tabindex', '-1');
      if (n !== 1 || f.dataset.started) legend && legend.focus({ preventScroll: true });
      f.dataset.started = '1';
    };
    next.addEventListener('click', () => { if (valid(cur)) go(cur + 1); });
    prev.addEventListener('click', () => go(cur - 1));
    f.addEventListener('change', e => { if (e.target.name === 'objectif') err(1, ''); if (e.target.name === 'ville') err(3, ''); });
    const h = (location.hash || '').slice(1);
    if (h) { const r = $$('input[name="objectif"]', f).find(x => x.value === h); if (r) r.checked = true; if (h === 'graphisme') $('#b-graph', f).checked = true; }
    go(1);
    const label = inp => L(inp.dataset.labelFr, inp.dataset.labelEn);
    f.addEventListener('submit', e => {
      e.preventDefault(); if (!valid(4)) return;
      const fd = new FormData(f);
      const obj = f.querySelector('input[name="objectif"]:checked'), city = f.querySelector('input[name="ville"]:checked');
      const fmts = $$('input[name="format"]:checked', f).map(label).join(', ');
      const rows = [
        [L('Intention', 'Purpose'), obj ? label(obj) : ''], [L('Format', 'Format'), fmts || L('À définir ensemble', 'To be decided together')],
        [L('Ville', 'City'), city ? label(city) : ''], [L('Période', 'Date'), fd.get('date') || L('À définir', 'To be decided')],
        [L('Invités', 'Guests'), out.textContent], [L('Supports graphiques', 'Printed materials'), fd.get('graphisme') ? L('Oui', 'Yes') : L('Non', 'No')],
        [L('Contact', 'Contact'), `${fd.get('prenom')} ${fd.get('nom')}${fd.get('societe') ? ' · ' + fd.get('societe') : ''}`], ['E-mail', fd.get('email')]
      ];
      const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      sent.innerHTML = `<div class="env-anim" aria-hidden="true"><svg viewBox="0 0 320 200" width="100%"><rect x="10" y="40" width="300" height="150" fill="#E5DCCA" stroke="#A8874B" stroke-width="1"/><path class="ea-card" d="M40 60h240v110H40z" fill="#F8F3E9" stroke="#A8874B" stroke-opacity=".5"/><path d="M10 190L160 100 310 190" fill="#DDD3BF" stroke="#A8874B" stroke-width="1"/><path class="ea-flap" d="M10 40L160 130 310 40z" fill="#E9E0CF" stroke="#A8874B" stroke-width="1"/><g class="ea-seal" transform="translate(160 128)"><circle r="20" fill="#1D2D54"/><circle r="15" fill="none" stroke="#E6D29F" stroke-width="1"/><text y="7" text-anchor="middle" font-family="OS Bodoni Display, Didot, serif" font-style="italic" font-size="20" fill="#E6D29F">Œ</text></g></svg></div>
<h2 class="h3">${L('Votre carton-réponse est prêt', 'Your reply card is ready')}</h2>
<p class="small" style="margin:0;max-width:44ch">${L('Dans le site final, il serait transmis à Elena Deliot, qui vous rappelle pour en parler. Ici, rien n’a été envoyé : c’est une maquette.', 'On the final site, it would be sent to Elena Deliot, who would call you back. Here nothing has been sent: this is a mock-up.')}</p>
<dl class="recap">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
<button class="btn btn--ghost" type="button" data-again>${L('Remplir un nouveau carton', 'Fill in a new card')}</button>`;
      $('[data-steps]', f).hidden = true; $('.reply__nav', f).hidden = true; $('.reply__top .progress', f).style.visibility = 'hidden'; lab.textContent = '';
      sent.hidden = false; sent.focus({ preventScroll: true });
      if (hasG && !calm) {
        G.timeline()
          .from('.ea-card', { y: -90, duration: 0.8, ease: 'power3.out' })
          .from('.ea-flap', { scaleY: -1, transformOrigin: '50% 0%', duration: 0.6, ease: 'power2.inOut' }, '+=0.05')
          .from('.ea-seal', { scale: 2.4, opacity: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2)' })
          .from($$('.recap div', sent), { opacity: 0, y: 10, stagger: 0.05, duration: 0.4 }, '-=0.2');
      }
      $('[data-again]', sent).addEventListener('click', () => { f.reset(); syncRange(); sent.hidden = true; $('[data-steps]', f).hidden = false; $('.reply__nav', f).hidden = false; $('.reply__top .progress', f).style.visibility = ''; go(1); });
    });
  });

  /* ---------- Titres dorés en WebGL ---------- */
  function loadFoil() {
    const els = $$('[data-foil]'); if (!els.length) return Promise.resolve(null);
    els.forEach(el => el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--fx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); }));
    return import(BASE + 'foil.mjs?v=3').then(m => m.init(els, { calm, lang })).catch(err => { console.warn('[os] foil', err); return null; });
  }

  /* ---------- Démarrage ---------- */
  function boot() {
    safe('reveals', reveals);
    safe('hscroll', hscroll);
    if (page === 'index') safe('home', homeScenes);
    if (page === 'design-graphique') safe('design', designScenes);
    if (page === 'evenementiel' || page === 'agence') safe('events', eventScenes);
    if (page === 'agence') safe('agency', agencyScenes);
    if (hasG) { ST.refresh(); window.addEventListener('load', () => ST.refresh()); if (document.fonts) document.fonts.ready.then(() => ST.refresh()); }
  }
  const foilP = loadFoil();
  let loaded = false;
  const afterLoader = () => { if (loaded) return; loaded = true; Promise.race([foilP, new Promise(r => setTimeout(() => r(null), 900))]).then(api => {
    const heroApi = api && api.byId ? api.byId('hero-t') : null;
    safe('hero', () => heroIn(heroApi));
    if (api) api.revealOthers && api.revealOthers();
  }); };
  boot();
  safe('loader', () => runLoader(afterLoader));
  if (!$('.loader') && !loaded) afterLoader();
})();
