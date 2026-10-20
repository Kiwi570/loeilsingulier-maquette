/* Dorure à chaud et frappe typographique en WebGL (OGL).
   Le texte reste dans la page (sélectionnable, lu par les lecteurs d'écran) ; le canevas le redessine
   lettre par lettre aux positions exactes du DOM, en or froissé pour les mots dorés et en encre gaufrée pour les autres. */
import { Renderer, Program, Mesh, Texture, Triangle } from './vendor/ogl.min.mjs';

const DPR = Math.min(window.devicePixelRatio || 1, 2);

const vertex = /* glsl */`
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

const fragment = /* glsl */`
precision highp float;
uniform sampler2D tMask;
uniform sampler2D tHeight;
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uTime;
uniform float uReveal;
varying vec2 vUv;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
void main() {
  vec2 uv = vUv;
  vec4 m = texture2D(tMask, uv);
  float cov = m.a;
  float goldW = cov * clamp(m.r / max(m.r + m.g, 0.001), 0.0, 1.0);
  float inkW = cov - goldW;
  vec2 px = 1.0 / uRes;
  float hL = texture2D(tHeight, uv - vec2(px.x * 1.5, 0.0)).a;
  float hR = texture2D(tHeight, uv + vec2(px.x * 1.5, 0.0)).a;
  float hD = texture2D(tHeight, uv - vec2(0.0, px.y * 1.5)).a;
  float hU = texture2D(tHeight, uv + vec2(0.0, px.y * 1.5)).a;
  vec3 n = normalize(vec3((hL - hR) * 3.2, (hD - hU) * 3.2, 1.0));
  vec2 q = uv * uRes / 24.0;
  vec3 nf = normalize(n + vec3(fbm(q) - 0.5, fbm(q + 7.3) - 0.5, 0.0) * 0.95);
  vec3 L = normalize(vec3((uLight - uv) * vec2(uRes.x / uRes.y, 1.0), 0.55));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float diff = max(dot(nf, L), 0.0);
  float spec = pow(max(dot(nf, H), 0.0), 26.0);
  float sheen = sin((uv.x * 1.6 + uv.y * 0.6) * 3.14159 - uTime * 0.35) * 0.5 + 0.5;
  vec3 gold = mix(vec3(0.40, 0.29, 0.13), vec3(0.88, 0.74, 0.46), diff) + vec3(1.0, 0.93, 0.74) * spec * 1.3 + vec3(0.22, 0.17, 0.08) * sheen * 0.3;
  float dn = max(dot(n, L), 0.0);
  vec3 ink = vec3(0.078, 0.13, 0.227) * (0.72 + 0.55 * dn) + vec3(0.62, 0.64, 0.72) * pow(max(dot(n, H), 0.0), 40.0) * 0.16;
  float thr = uv.x * 0.75 + fbm(uv * vec2(6.0, 3.0)) * 0.25;
  float r = uReveal * 1.1;
  float vis = smoothstep(thr - 0.06, thr, r);
  float flash = smoothstep(thr - 0.14, thr - 0.03, r) * (1.0 - smoothstep(thr - 0.03, thr + 0.02, r - 0.1));
  vec3 col = gold * goldW * (1.0 + flash * 0.6) + ink * inkW;
  float a = cov * vis;
  float hs = texture2D(tHeight, uv + vec2(-px.x * 2.0, px.y * 2.5)).a;
  float sh = clamp(hs - cov, 0.0, 1.0) * 0.2 * vis;
  vec3 outc = col * vis + vec3(0.08, 0.10, 0.16) * sh * (1.0 - a);
  gl_FragColor = vec4(outc, a + sh * (1.0 - a));
}`;

class Foil {
  constructor(el, calm) {
    this.el = el; this.calm = calm; this.pad = innerWidth < 700 ? 14 : 30; this.ok = false; this.visible = true;
    this.revealV = calm ? 1 : 0; this.revealed = calm;
    this.light = [0.35, 0.8]; this.target = [0.35, 0.8]; this.lastMove = 0;
    const c = document.createElement('canvas'); c.className = 'foil-gl'; c.setAttribute('aria-hidden', 'true');
    try { this.renderer = new Renderer({ canvas: c, dpr: DPR, alpha: true, premultipliedAlpha: true, antialias: false, depth: false }); } catch (e) { return; }
    const gl = this.gl = this.renderer.gl; if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    this.mask = document.createElement('canvas'); this.height = document.createElement('canvas'); this.small = document.createElement('canvas');
    const texOpts = { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR, premultiplyAlpha: false, flipY: true };
    this.tMask = new Texture(gl, texOpts); this.tHeight = new Texture(gl, texOpts);
    this.program = new Program(gl, { vertex, fragment, transparent: true, depthTest: false, uniforms: {
      tMask: { value: this.tMask }, tHeight: { value: this.tHeight }, uRes: { value: [1, 1] }, uLight: { value: this.light }, uTime: { value: 0 }, uReveal: { value: this.revealV } } });
    this.mesh = new Mesh(gl, { geometry: new Triangle(gl), program: this.program });
    el.appendChild(c); this.canvas = c; this.ok = true;
    this.ready = this.redraw().then(() => { el.classList.add('is-gl'); this.render(); });
    window.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      this.target = [Math.max(-0.4, Math.min(1.4, (e.clientX - r.left) / r.width)), Math.max(-0.4, Math.min(1.4, 1 - (e.clientY - r.top) / r.height))];
      this.lastMove = performance.now();
    }, { passive: true });
    new IntersectionObserver(es => { this.visible = es[0].isIntersecting; }).observe(el);
    if (!calm) { const loop = now => { if (this.visible) this.frame(now); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  }
  async redraw() {
    try { await Promise.all([document.fonts.load('400 80px "OS Bodoni Display"'), document.fonts.load('italic 400 80px "OS Bodoni Display"')]); } catch (e) {}
    const el = this.el, r = el.getBoundingClientRect(), pad = this.pad;
    const W = Math.ceil(r.width + pad * 2), H = Math.ceil(r.height + pad * 2);
    if (W < 4 || H < 4) return;
    Object.assign(this.canvas.style, { left: -pad + 'px', top: -pad + 'px' });
    this.renderer.setSize(W, H);
    const mw = Math.round(W * DPR), mh = Math.round(H * DPR);
    const m = this.mask; m.width = mw; m.height = mh;
    const ctx = m.getContext('2d'); ctx.clearRect(0, 0, mw, mh); ctx.textBaseline = 'alphabetic';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const range = document.createRange();
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement; if (!parent || !parent.getClientRects().length) continue;
      const cs = getComputedStyle(parent); const fs = parseFloat(cs.fontSize) * DPR;
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      ctx.fillStyle = parent.closest('.foil-txt') ? '#ff0000' : '#00ff00';
      const mt = ctx.measureText('Hg');
      const asc = mt.fontBoundingBoxAscent || fs * 0.92, desc = mt.fontBoundingBoxDescent || fs * 0.24;
      const txt = node.textContent;
      for (let i = 0; i < txt.length; i++) {
        const ch = txt[i]; if (/\s/.test(ch)) continue;
        range.setStart(node, i); range.setEnd(node, i + 1);
        const rects = range.getClientRects(); if (!rects.length) continue; const cr = rects[0];
        const x = (cr.left - r.left + pad) * DPR; const boxH = cr.height * DPR;
        const y = (cr.top - r.top + pad) * DPR + (boxH - (asc + desc)) / 2 + asc;
        ctx.fillText(ch, x, y);
      }
    }
    const s = this.small; s.width = Math.max(1, Math.round(mw / 4)); s.height = Math.max(1, Math.round(mh / 4));
    const sc = s.getContext('2d'); sc.imageSmoothingEnabled = true; sc.clearRect(0, 0, s.width, s.height); sc.drawImage(m, 0, 0, s.width, s.height);
    const h = this.height; h.width = mw; h.height = mh; const hc = h.getContext('2d'); hc.imageSmoothingEnabled = true; hc.imageSmoothingQuality = 'high'; hc.clearRect(0, 0, mw, mh); hc.drawImage(s, 0, 0, mw, mh);
    this.tMask.image = m; this.tMask.needsUpdate = true; this.tHeight.image = h; this.tHeight.needsUpdate = true;
    this.program.uniforms.uRes.value = [mw, mh];
    this.render();
  }
  frame(now) {
    const t = now / 1000;
    if (now - this.lastMove > 2500) this.target = [0.5 + 0.55 * Math.cos(t * 0.35), 0.62 + 0.4 * Math.sin(t * 0.47)];
    this.light[0] += (this.target[0] - this.light[0]) * 0.06; this.light[1] += (this.target[1] - this.light[1]) * 0.06;
    this.program.uniforms.uTime.value = t;
    this.render();
  }
  render() {
    if (!this.ok) return;
    this.program.uniforms.uLight.value = this.light;
    this.program.uniforms.uReveal.value = this.revealV;
    this.renderer.render({ scene: this.mesh });
  }
  reveal(instant) {
    if (this.revealed && !instant) return; this.revealed = true;
    if (instant || this.calm) { this.revealV = 1; this.render(); return; }
    const G = window.gsap;
    if (G) G.to(this, { revealV: 1, duration: 1.5, ease: 'power2.inOut', onUpdate: () => this.calm && this.render() });
    else this.revealV = 1;
  }
  revealOnView() {
    if (this.revealed) return;
    const io = new IntersectionObserver(es => { if (es[0].intersectionRatio > 0.3) { io.disconnect(); this.reveal(); } }, { threshold: [0, 0.3, 0.6] });
    io.observe(this.el);
  }
}

export function init(els, { calm }) {
  const probe = document.createElement('canvas');
  const ok = !!(probe.getContext('webgl') || probe.getContext('experimental-webgl'));
  if (!ok) return null;
  const inst = els.map(el => new Foil(el, calm)).filter(f => f.ok);
  if (!inst.length) return null;
  document.addEventListener('os:lang', () => inst.forEach(f => f.redraw()));
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => inst.forEach(f => f.redraw()), 220); });
  return Promise.all(inst.map(f => f.ready)).then(() => ({
    byId: id => inst.find(f => f.el.id === id) || null,
    revealOthers: () => inst.forEach(f => { if (f.el.id !== 'hero-t') f.revealOnView(); })
  }));
}
