// Gabarit partagé du site : en-tête, menu, pied de page, aides bilingues et images.
// Tout le contenu est servi en français ET en anglais ; la langue affichée est choisie
// côté navigateur (bouton FR/EN), sans changer d'URL : la page et l'état du formulaire sont conservés.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = p => fileURLToPath(new URL(p, import.meta.url));
const json = p => JSON.parse(readFileSync(here(p), 'utf8'));
const DATA = json('./data/photos.json');
const GEN = json('./data/media.generated.json');
export const LOGO = readFileSync(here('./partials/logo.svg'), 'utf8').trim();
export const VERSION = '20261105';
export const SITE_URL = 'https://loeilsingulier-maquette.vercel.app';
export const BRAND = 'l’œil singulier';

/* ---------- Aides bilingues ---------- */
export const esc = s => String(s).replace(/&(?![a-z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const attr = s => String(s).replace(/&(?![a-z]+;|#\d+;)/g, '&amp;').replace(/"/g, '&quot;');
/** texte en ligne : <span lang=fr>…</span><span lang=en>…</span> */
export const t = (fr, en = fr) => fr === en ? fr : `<span class="l-fr" lang="fr">${fr}</span><span class="l-en" lang="en">${en}</span>`;
/** bloc : un élément par langue (p, h2…) */
export const tb = (tag, fr, en, cls = '', extra = '') => `<${tag} class="l-fr${cls ? ' ' + cls : ''}" lang="fr"${extra}>${fr}</${tag}><${tag} class="l-en${cls ? ' ' + cls : ''}" lang="en"${extra}>${en}</${tag}>`;
/** plusieurs paragraphes */
export const paras = (fr, en, cls = '') => `<div class="l-fr${cls ? ' ' + cls : ''}" lang="fr">${fr.map(p => `<p>${p}</p>`).join('')}</div><div class="l-en${cls ? ' ' + cls : ''}" lang="en">${en.map(p => `<p>${p}</p>`).join('')}</div>`;
export const label = (fr, en, cls = '') => `<span class="label${cls ? ' ' + cls : ''}">${t(fr, en)}</span>`;
export const arrow = '<svg class="arr" viewBox="0 0 22 10" aria-hidden="true" focusable="false"><path d="M0 5h20M16 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
export const btn = (href, fr, en, cls = '') => `<a class="btn${cls ? ' ' + cls : ''}" href="${href}" data-magnetic>${t(fr, en)} ${arrow}</a>`;
/** l'œil, réinterprété : une amande dessinée d'un trait, la pupille est le point rouge */
export const eye = (cls = '') => `<svg class="eye${cls ? ' ' + cls : ''}" viewBox="0 0 200 100" aria-hidden="true" focusable="false"><path class="eye__lid" d="M4 50C40 6 160 6 196 50C160 94 40 94 4 50Z"/><circle class="eye__iris" cx="100" cy="50" r="27"/><circle class="eye__dot" cx="100" cy="50" r="9"/></svg>`;

/* ---------- Images ---------- */
const byId = {};
for (const g of ['photos', 'design', 'son']) for (const it of DATA[g] || []) byId[it.id] = { ...it, group: g, gen: it.gen || GEN[g][it.id] };
export const photo = id => { const p = byId[id]; if (!p) throw new Error('image inconnue : ' + id); return p; };
export const photosBy = (group = 'photos') => DATA[group].map(p => photo(p.id));
const srcset = (p, ext, frame) => p.gen.widths.map(w => `/img/${p.group}/${p.id}${frame ? '-' + frame : ''}-${w}.${ext} ${w}w`).join(', ');
const largest = (p, frame) => `/img/${p.group}/${p.id}${frame ? '-' + frame : ''}-${p.gen.widths[p.gen.widths.length - 1]}.webp`;
/**
 * <picture> AVIF + WebP, dimensions explicites, point focal, chargement différé hors premier écran.
 * o.sizes, o.eager, o.cls (sur <img>), o.alt:false (décoratif), o.frame (images d'une animation), o.focal
 */
export function pic(id, o = {}) {
  const p = photo(id); const g = p.gen;
  const mid = p.gen.widths.find(w => w >= 960) || p.gen.widths[p.gen.widths.length - 1];
  const alt = o.alt === false ? ' alt=""' : ` alt="${attr(p.fr)}" data-alt-en="${attr(p.en)}"`;
  const focal = o.focal || p.focal;
  const style = focal && focal !== '50% 50%' ? ` style="object-position:${focal}"` : '';
  const load = o.eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"';
  return `<picture><source type="image/avif" srcset="${srcset(p, 'avif', o.frame)}" sizes="${o.sizes || '100vw'}"><img src="/img/${p.group}/${p.id}${o.frame ? '-' + o.frame : ''}-${mid}.webp" srcset="${srcset(p, 'webp', o.frame)}" sizes="${o.sizes || '100vw'}" width="${g.w}" height="${g.h}"${alt}${style}${load}${o.cls ? ` class="${o.cls}"` : ''}></picture>`;
}
/** figure photo ; o.ratio force un cadrage (sinon proportions d'origine) */
export function fig(id, o = {}) {
  const p = photo(id);
  const ratio = o.ratio || `${p.gen.w} / ${p.gen.h}`;
  return `<figure class="ph${o.cls ? ' ' + o.cls : ''}"${o.reveal === false ? '' : ' data-reveal'} style="aspect-ratio:${ratio}">${pic(id, o)}${o.cap ? `<figcaption>${o.cap}</figcaption>` : ''}</figure>`;
}
/** attributs pour la visionneuse */
export const lbAttrs = (id, group) => { const p = photo(id); return `data-lb="${group}" data-full="${largest(p)}" data-w="${p.gen.w}" data-h="${p.gen.h}" data-cap-fr="${attr(p.fr)}" data-cap-en="${attr(p.en)}"`; };
export const frameSrc = (id, k) => { const p = photo(id); return { webp: srcset(p, 'webp', k), avif: srcset(p, 'avif', k), src: largest(p, k), w: p.gen.w, h: p.gen.h, n: p.gen.frames }; };

/* ---------- Navigation ---------- */
export const NAV = [
  { slug: 'evenementiel', fr: 'Événementiel', en: 'Events' },
  { slug: 'design-graphique', fr: 'Design graphique', en: 'Graphic design' },
  { slug: 'galerie', fr: 'Galerie', en: 'Gallery' },
  { slug: 'agence', fr: 'L’agence', en: 'The agency' },
  { slug: 'references', fr: 'Références', en: 'Clients' },
  { slug: 'son', fr: 'Le son', en: 'Sound' },
  { slug: 'journal', fr: 'Journal', en: 'Journal' },
  { slug: 'contact', fr: 'Contact', en: 'Contact' }
];
const href = s => s === 'index' ? '/' : '/' + s;
const navLinks = (cur, home = false) => (home ? [{ slug: 'index', fr: 'Accueil', en: 'Home' }, ...NAV] : NAV)
  .map(n => `<a href="${href(n.slug)}"${n.slug === cur || (cur && cur.startsWith(n.slug + '/')) ? ' aria-current="page"' : ''}>${t(n.fr, n.en)}</a>`).join('');

export const CONTACT = {
  tel: '+33615797657', telLabel: '+33 (0)6 15 79 76 57', mail: 'elena.deliot@loeilsingulier.com',
  paris: '1 passage Rauch, 75011 Paris', london: '264 Gloucester Terrace, London W2 6HU'
};

/* ---------- Bloc R.S.V.P. (appel à l'action de fin de page) ---------- */
export const rsvpBand = () => `
<section class="sec s-red rsvp" aria-labelledby="rsvp-t"><div class="wrap rsvp__grid">
<div class="rsvp__txt">
${label('Contact · R.S.V.P.', 'Contact · R.S.V.P.')}
<h2 class="h2" id="rsvp-t" data-press>${t('Un événement en tête ? <em>Parlons-en.</em>', 'An event in mind? <em>Let’s talk.</em>')}</h2>
${tb('p', 'Un cocktail, un dîner, une réception ou une idée encore à inventer ? Racontez-nous ce que vous imaginez. Nous serons ravis d’en discuter.', 'A reception, a dinner, a celebration or an idea still taking shape? Tell us what you have in mind. We’d love to hear about it.', 'lead')}
<div class="btn-row">${btn('/contact', 'Confier un projet', 'Tell us about your event', 'btn--cream')}</div>
</div>
<div class="rsvp__card" data-rsvp-card>
<span class="rsvp__rs" aria-hidden="true">R.S.V.P.</span>
<div class="rsvp__line"><span class="k">${t('Avec', 'With')}</span>Eléna Déliot</div>
<div class="rsvp__line"><span class="k">${t('Où', 'Where')}</span>Paris · London</div>
<div class="copy-row"><a class="sel num" href="tel:${CONTACT.tel}">${CONTACT.telLabel}</a><button class="copy" type="button" data-copy="${CONTACT.tel}">${t('Copier', 'Copy')}</button></div>
<div class="copy-row"><a class="sel" href="mailto:${CONTACT.mail}">${CONTACT.mail}</a><button class="copy" type="button" data-copy="${CONTACT.mail}">${t('Copier', 'Copy')}</button></div>
</div>
</div></section>`;

/* ---------- Carte Paris ⇄ Londres (rubrique 10) ---------- */
export const mapSection = (id = 'map-t') => `
<section class="sec s-ink map-sec" aria-labelledby="${id}"><div class="wrap map-grid">
<div class="map-txt">
${label('Paris ⇄ Londres', 'Paris ⇄ London')}
<h2 class="h2" id="${id}" data-press>${t('Deux villes, deux cultures, <em>une même idée</em> du service et de l’élégance.', 'Two cities, two cultures, <em>one shared appreciation</em> of thoughtful service and effortless elegance.')}</h2>
${tb('p', 'De part et d’autre de la Manche, nous imaginons des événements avec la même curiosité, la même exigence et le même plaisir de recevoir.', 'On both sides of the Channel, we create events with the same curiosity, attention to detail and love of hospitality.', 'lead')}
<div class="clocks">
<div class="clock"><span class="clock__c">Paris</span><span class="clock__t num" data-clock="Europe/Paris">--:--</span><span class="clock__a">1 passage Rauch, 75011 Paris</span></div>
<div class="clock"><span class="clock__c">${t('Londres', 'London')}</span><span class="clock__t num" data-clock="Europe/London">--:--</span><span class="clock__a">264 Gloucester Terrace, London W2 6HU</span></div>
</div>
<p class="small map-note" data-distance></p>
</div>
<div class="map" data-map>
<svg viewBox="0 0 600 560" role="img" aria-labelledby="${id}-d">
<desc id="${id}-d" data-desc-en="Map: Paris and London, our two bases, and the cities where we also create events: Cannes, Toulouse, Milan, Rome, Munich and Monaco.">Carte : Paris et Londres, nos deux implantations, et les villes où nous imaginons aussi des événements : Cannes, Toulouse, Milan, Rome, Munich et Monaco.</desc>
<g data-map-layer></g>
</svg>
<ul class="map-legend">
<li><i class="dot dot--main" aria-hidden="true"></i>${t('Implantations : Paris, Londres', 'Bases: Paris, London')}</li>
<li><i class="dot" aria-hidden="true"></i>${t('Événements : Cannes, Toulouse, Milan, Rome, Munich, Monaco', 'Events: Cannes, Toulouse, Milan, Rome, Munich, Monaco')}</li>
</ul>
</div>
</div></section>`;

/* ---------- Page suivante ---------- */
export const nextPage = (slug, fr, en, img) => `
<nav class="next" aria-label="Page suivante" data-aria-en="Next page"><a class="next__a" href="${href(slug)}">
<div class="wrap next__in"><span class="label">${t('Page suivante', 'Next page')}</span>
<span class="next__t">${t(fr, en)}<svg class="next__arr" viewBox="0 0 60 18" aria-hidden="true" focusable="false"><path d="M0 9h56M48 1l8 8-8 8" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></span></div>
${img ? `<div class="next__img" aria-hidden="true">${pic(img, { sizes: '40vw', alt: false })}</div>` : ''}</a></nav>`;

/* ---------- Gabarit complet ---------- */
export function layout(pg) {
  const title = { fr: pg.title.fr, en: pg.title.en };
  const desc = pg.desc;
  const canon = SITE_URL + (pg.path || href(pg.slug));
  const ogImg = SITE_URL + '/img/partage.jpg';
  return `<!doctype html>
<html lang="fr" data-lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title.fr)}</title>
<meta name="description" content="${attr(desc.fr)}" data-en="${attr(desc.en)}">
<meta name="robots" content="${pg.robots || 'noindex, nofollow'}">
<meta name="title-en" content="${attr(title.en)}">
<link rel="canonical" href="${canon}">
<meta property="og:title" content="${attr(title.fr)}" data-en="${attr(title.en)}">
<meta property="og:description" content="${attr(desc.fr)}" data-en="${attr(desc.en)}">
<meta property="og:type" content="${pg.ogType || 'website'}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:locale" content="fr_FR">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#121012">
<link rel="icon" type="image/png" sizes="32x32" href="/img/brand/favicon-32.png">
<link rel="apple-touch-icon" href="/img/brand/favicon-180.png">
<link rel="preload" href="/assets/fonts/bodoni-display-v2.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/hanken-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${VERSION}">
<script>(function(){var d=document.documentElement;d.classList.add('js');var rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}var l=null,c=null,q=null;try{q=new URLSearchParams(location.search).get('lang')}catch(e){}try{l=localStorage.getItem('os-lang');c=localStorage.getItem('os-calm')}catch(e){}if(q==='en'||q==='fr'){l=q;try{localStorage.setItem('os-lang',q)}catch(e){}}d.setAttribute('data-lang',l==='en'?'en':'fr');if(l==='en')d.lang='en';d.setAttribute('data-calm',rm?'1':(c===null?'0':c));setTimeout(function(){if(!window.__os)d.classList.add('no-js-run')},3500);})();</script>
${pg.head || ''}
</head>
<body class="${pg.bodyClass || ''}">
${pg.loader ? loaderMarkup() : ''}
<div class="veil" aria-hidden="true"><div class="veil__flap"></div><i class="veil__dot"></i></div>
<i class="dot-cursor" aria-hidden="true"></i>
<div class="toast" role="status" aria-live="polite"></div>
<a class="skip" href="#contenu">${t('Aller au contenu', 'Skip to content')}</a>
<header class="hdr" id="hdr"><div class="wrap hdr__in">
<a class="hdr__logo" href="/" aria-label="${BRAND}, accueil" data-aria-en="${BRAND}, home">${LOGO}</a>
<nav class="nav" aria-label="Navigation principale" data-aria-en="Main navigation">${navLinks(pg.slug)}</nav>
<div class="hdr__tools">
<button class="tool lang-sw js-lang" type="button" aria-label="Langue : français. Passer en anglais" data-aria-en="Language: English. Switch to French"><b class="l-fr">FR</b><span class="l-en">FR</span><i aria-hidden="true">/</i><span class="l-fr">EN</span><b class="l-en">EN</b></button>
<button class="tool js-calm" type="button" aria-pressed="false" title="Réduire les animations" data-title-en="Reduce motion"><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2 8c2-3 4-3 6 0s4 3 6 0" fill="none" stroke="currentColor" stroke-width="1.3"/></svg><span class="t-txt">${t('Calme', 'Calm')}</span></button>
<a class="btn btn--sm hdr__cta" href="/contact">${t('Confier un projet', 'Tell us about your event')}</a>
<button class="tool burger js-burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><svg class="b-l" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2 5h12M2 11h12" stroke="currentColor" stroke-width="1.3"/></svg><svg class="b-x" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.3"/></svg></button>
</div></div><div class="hdr__progress" aria-hidden="true"></div></header>
<div class="menu" id="menu" aria-hidden="true" inert><nav aria-label="Menu">${navLinks(pg.slug, true)}</nav>
<div class="menu__foot"><a href="tel:${CONTACT.tel}">${CONTACT.telLabel}</a><a href="mailto:${CONTACT.mail}">${CONTACT.mail}</a><span>Paris · London</span></div>${eye('menu__eye')}</div>
<main id="contenu" data-page="${pg.slug}">
${pg.body}
</main>
<nav class="mbar" aria-label="Actions rapides" data-aria-en="Quick actions" data-mbar><a class="btn btn--sm" href="/contact">${t('Confier un projet', 'Tell us about your event')}</a><a class="mbar__tel" href="tel:${CONTACT.tel}">${t('Appeler', 'Call')}</a></nav>
<footer class="ftr s-ink"><div class="wrap">
<div class="ftr__top"><a class="ftr__logo" href="/" aria-label="${BRAND}, accueil" data-aria-en="${BRAND}, home">${LOGO}</a>
<p class="ftr__tag">${t('L’art de recevoir, notre métier.', 'The art of hosting is our craft.')}</p></div>
<div class="ftr__grid">
<div><h2 class="ftr__h">Paris</h2><address>1 passage Rauch<br>75011 Paris<br>France</address></div>
<div><h2 class="ftr__h">${t('Londres', 'London')}</h2><address>264 Gloucester Terrace<br>London W2 6HU<br>${t('Royaume-Uni', 'United Kingdom')}</address></div>
<div><h2 class="ftr__h">Contact</h2><ul>
<li class="copy-row"><a class="sel num" href="tel:${CONTACT.tel}">${CONTACT.telLabel}</a></li>
<li class="copy-row"><a class="sel" href="mailto:${CONTACT.mail}">${CONTACT.mail}</a><button class="copy" type="button" data-copy="${CONTACT.mail}">${t('Copier', 'Copy')}</button></li>
<li><a href="https://www.instagram.com/loeilsingulier/" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.facebook.com/LOeilSingulier" target="_blank" rel="noopener">Facebook</a> · <a href="https://www.linkedin.com/in/elenadeliot/" target="_blank" rel="noopener">LinkedIn</a></li>
</ul></div>
<div><h2 class="ftr__h">${t('Le site', 'The site')}</h2><ul class="ftr__nav">${NAV.map(n => `<li><a href="${href(n.slug)}">${t(n.fr, n.en)}</a></li>`).join('')}</ul></div>
</div>
<div class="ftr__base">
<span>© ${BRAND} · ${t('Événementiel & design graphique', 'Events & graphic design')} · SIRET 537 593 352 00017</span>
<span><a href="/mentions-legales">${t('Mentions légales et confidentialité', 'Legal notice & privacy')}</a> · <a href="#contenu" data-top>${t('Retour en haut', 'Back to top')} ↑</a></span>
<span>${t('Maquette de travail, novembre 2026', 'Working mock-up, November 2026')}</span>
</div>
</div></footer>
<script src="/assets/js/vendor/gsap.min.js" defer></script>
<script src="/assets/js/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/js/vendor/SplitText.min.js" defer></script>
<script src="/assets/js/vendor/lenis.min.js" defer></script>
<script src="/assets/js/main.js?v=${VERSION}" defer></script>
</body>
</html>
`;
}

/* ---------- Ouverture : l'enveloppe noire, le cachet rouge ---------- */
function loaderMarkup() {
  return `<div class="loader" aria-hidden="true"><div class="loader__pkg"><div class="loader__env"></div><div class="loader__side"></div><div class="loader__flap"></div>
<div class="seal"><svg viewBox="-60 -60 120 120" aria-hidden="true" focusable="false"><defs>
<clipPath id="sL"><path d="M-70-70H4L-6-34 6-10-8 12 5 33-4 70H-70Z"/></clipPath><clipPath id="sR"><path d="M70-70H4L-6-34 6-10-8 12 5 33-4 70H70Z"/></clipPath>
<g id="sb"><path d="M0-52C12-54 22-46 33-41S52-24 51-11 56 13 47 26 34 49 20 51-3 56-16 51-41 44-48 30-57 9-52-6-47-34-34-43-12-50 0-52Z" fill="#9E0D1A"/><circle r="34" fill="none" stroke="#5E0710" stroke-width="3"/><circle r="30" fill="none" stroke="#F4EEE3" stroke-opacity=".5" stroke-width=".8"/><text y="13" text-anchor="middle" font-family="OS Bodoni Display, Bodoni Moda, Didot, serif" font-size="40" fill="#F4EEE3" font-style="italic">œ</text></g></defs>
<use class="seal__whole" href="#sb"/><g class="seal__half seal__l" clip-path="url(#sL)"><use href="#sb"/></g><g class="seal__half seal__r" clip-path="url(#sR)"><use href="#sb"/></g>
<path class="seal__crack" d="M4-52L-6-34 6-10-8 12 5 33-4 52" fill="none" stroke="#F4EEE3" stroke-width="1.2" stroke-opacity="0"/></svg></div></div>
<div class="loader__word">${t(`${BRAND} vous invite`, `${BRAND} invites you`)}</div></div>`;
}
