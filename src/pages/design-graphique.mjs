// Design graphique : rubrique 11, réalisations du dossier Graphisme (proportions d'origine, aucun recadrage).
import { t, tb, paras, label, btn, pic, photosBy, lbAttrs, frameSrc, rsvpBand, nextPage, attr } from '../site.mjs';

const works = photosBy('design').filter(p => !p.gen.frames && p.id !== 'papeterie'); // la papeterie ouvre déjà la page
const gif = frameSrc('decoupe-laser-gif', 1);
const frames = [1, 2, 3].map(k => frameSrc('decoupe-laser-gif', k));
const stepFr = ['Fermée', 'À demi ouverte', 'Ouverte'], stepEn = ['Closed', 'Half open', 'Open'];

export default {
  slug: 'design-graphique',
  title: { fr: 'Design graphique · l’œil singulier', en: 'Graphic design · l’œil singulier' },
  desc: { fr: 'Invitations, menus, programmes, signalétique, brochures et supports éditoriaux : la première impression commence bien avant l’événement.', en: 'Invitations, menus, programmes, signage, brochures and editorial materials: first impressions begin long before the event.' },
  body: `
<section class="pgh s-cream dg-head" aria-labelledby="dg-t"><div class="wrap pgh__grid pgh__grid--media">
<div class="pgh__txt">
${label('Design graphique', 'Graphic design')}
<h1 class="h1" id="dg-t" data-press>${t('La première impression commence <em>bien avant l’événement.</em>', 'First impressions begin <em>long before the event.</em>')}</h1>
${paras(['Une invitation que l’on a envie d’ouvrir. Un papier dont on apprécie le grain. Une typographie choisie avec soin. Une identité visuelle qui annonce déjà l’univers de votre événement.', 'Invitations, menus, programmes, signalétique, brochures et supports éditoriaux : nous imaginons des créations graphiques qui prolongent l’expérience, du premier regard au dernier souvenir.'], ['An invitation you can’t wait to open. Paper you want to touch. Carefully chosen typography. A visual identity that sets the tone before guests even arrive.', 'Invitations, menus, programmes, signage, brochures and editorial materials: we create graphic pieces that carry the experience from first impression to lasting memory.'], 'prose')}
<div class="btn-row"><a class="btn" href="#realisations" data-magnetic>${t('Découvrir les réalisations', 'Explore our work')} <svg class="arr" viewBox="0 0 22 10" aria-hidden="true" focusable="false"><path d="M0 5h20M16 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></a></div>
</div>
<div class="pgh__media"><figure class="ph ph--contain dg-hero" style="aspect-ratio:1280 / 832">${pic('papeterie', { sizes: '(min-width: 900px) 46vw, 100vw', eager: true })}</figure></div>
</div></section>

<section class="sec s-ink flip-sec" aria-labelledby="fl-t"><div class="wrap flip-grid">
<div class="flip-txt">
${label('Papier & découpe', 'Paper & cut')}
<h2 class="h3" id="fl-t">${t('Invitation en découpe laser : l’ouverture en trois temps', 'Laser-cut invitation: opening in three steps')}</h2>
<div class="flip-ctrl" role="group" aria-label="Étapes de l’ouverture" data-aria-en="Opening steps">
${[0, 1, 2].map(k => `<button type="button" class="flip-dot" data-flipbook-go="${k}" aria-pressed="${k === 0}">${t(stepFr[k], stepEn[k])}</button>`).join('')}
<button type="button" class="tool flip-play" data-flipbook-play aria-pressed="false">${t('Animer', 'Play')}</button>
</div>
</div>
<div class="flipbook" data-flipbook style="aspect-ratio:${gif.w} / ${gif.h}">
${frames.map((f, k) => `<picture class="flipbook__f${k === 0 ? ' is-on' : ''}" data-flipbook-f="${k}"><source type="image/avif" srcset="${f.avif}" sizes="(min-width: 900px) 52vw, 100vw"><img src="${f.src}" srcset="${f.webp}" sizes="(min-width: 900px) 52vw, 100vw" width="${f.w}" height="${f.h}" alt="${attr('Invitation en découpe laser, ' + stepFr[k].toLowerCase())}" data-alt-en="${attr('Laser-cut invitation, ' + stepEn[k].toLowerCase())}" loading="lazy" decoding="async"></picture>`).join('')}
</div>
</div></section>

<section class="sec s-paper" id="realisations" aria-labelledby="wk-t"><div class="wrap">
<div class="works-head">
${label('Réalisations', 'Our work')}
<h2 class="h2" id="wk-t" data-press>${t('Invitations, cartes <em>& éditions</em>', 'Invitations, cards <em>& editions</em>')}</h2>
${tb('p', 'Cliquez sur une pièce pour l’agrandir et la détailler.', 'Click a piece to enlarge it and look closer.', 'small')}
</div>
<ul class="works">
${works.map(p => `<li class="work${p.small ? ' work--small' : ''}${p.gen.w / p.gen.h > 1.2 ? ' work--wide' : ''}"><button type="button" class="work__btn" ${lbAttrs(p.id, 'dg')} data-zoom data-cursor="loupe" aria-label="${attr('Agrandir : ' + p.fr)}" data-aria-en="${attr('Enlarge: ' + p.en)}"><span class="work__paper">${pic(p.id, { sizes: '(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 92vw' })}</span></button><p class="work__cap">${t(p.fr, p.en)}</p></li>`).join('')}
</ul>
</div></section>
${rsvpBand()}
${nextPage('galerie', 'Galerie', 'Gallery', 'salle-voutee')}`
};
