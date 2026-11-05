// Galerie / Réalisations : rubrique 12. Aucune légende inventée : seul le contenu visible est décrit.
import { t, tb, label, btn, pic, photosBy, lbAttrs, rsvpBand, nextPage, attr } from '../site.mjs';

const CATS = [['tout', 'Tout', 'All'], ['lieux', 'Lieux', 'Venues'], ['tables', 'Tables & saveurs', 'Tables & food'], ['musique', 'Musique', 'Music'], ['scene', 'Scène & lumière', 'Stage & light'], ['details', 'Détails', 'Details']];
// ordre éditorial : alterne lieux, tables, musique et détails
const ORDER = ['salle-voutee', 'longue-table', 'pianiste-bleu', 'coupole-damier', 'cocktails-fleurs', 'salon-lanternes', 'rideau-rouge', 'rotonde-coupole', 'platine-vinyle', 'chef-bols', 'nef-globe', 'saxophoniste', 'hall-escalier', 'danseuses-lustre', 'buste-niche', 'table-ambre', 'salle-ovale', 'soprano-cuivres', 'verre-fumant', 'atrium-vert', 'duo-accordeon', 'galerie-peinte', 'statuette-livres', 'tente-rose', 'nef-arcades', 'club-jazz', 'coupole-beton', 'acrobate', 'buffet-glace', 'salon-lustres', 'guitaristes', 'panneaux-fleuris', 'plafond-dore', 'artiste-porte', 'chefs-buche', 'machine-volante', 'musiciens-jardin', 'bar-glace', 'faisceaux-bleus', 'couloir-blanc', 'salle-fauteuils', 'ailes-lumineuses', 'etiquette-vin', 'facade-projection', 'musicien-lumiere', 'coeurs-facettes', 'amphitheatre', 'bar-flammes', 'console-scene', 'lasers', 'boule-facettes', 'chapiteaux', 'colonnade-lanternes'];
const all = photosBy('photos').filter(p => p.cat !== 'portrait');
const map = Object.fromEntries(all.map(p => [p.id, p]));
const missing = all.filter(p => !ORDER.includes(p.id));
if (missing.length) throw new Error('Galerie : photos non classées ' + missing.map(p => p.id));
const items = ORDER.map(id => map[id]);

export default {
  slug: 'galerie',
  title: { fr: 'Galerie · l’œil singulier', en: 'Gallery · l’œil singulier' },
  desc: { fr: 'Quelques belles histoires en images : lieux singuliers, tables imaginées avec soin, instants partagés et détails qui font sourire.', en: 'A few fine stories in pictures: distinctive venues, thoughtfully styled tables, shared moments and details that raise a smile.' },
  body: `
<section class="pgh s-ink" aria-labelledby="gal-t"><div class="wrap pgh__grid">
<div class="pgh__txt">
${label('Galerie · Réalisations', 'Gallery · Our events')}
<h1 class="h1" id="gal-t" data-press>${t('Quelques belles histoires <em>en images.</em>', 'A few fine stories <em>in pictures.</em>')}</h1>
${tb('p', 'Lieux singuliers, tables imaginées avec soin, instants partagés et détails qui font sourire : un aperçu de notre univers et de ceux qui nous ont fait confiance.', 'Distinctive venues, thoughtfully styled tables, shared moments and details that raise a smile: a glimpse into our world and the events entrusted to us.', 'lead')}
</div>
</div></section>

<section class="sec s-ink" aria-label="Photographies" data-aria-en="Photographs" style="padding-top:0"><div class="wrap">
<div class="filters" role="group" aria-label="Filtrer les photographies" data-aria-en="Filter the photographs" data-filters="gal">
${CATS.map(([k, fr, en], i) => `<button type="button" class="filter" data-filter="${k}" aria-pressed="${i === 0}">${t(fr, en)} <span class="num">${k === 'tout' ? items.length : items.filter(p => p.cat === k).length}</span></button>`).join('')}
</div>
<p class="sr-only" aria-live="polite" data-filter-status></p>
<ul class="masonry" data-filter-grid="gal">
${items.map(p => `<li class="m-item${p.small ? ' m-item--small' : ''}" data-cat="${p.cat}"><button type="button" class="m-btn" ${lbAttrs(p.id, 'gal')} data-cursor="view" aria-label="${attr('Agrandir : ' + p.fr)}" data-aria-en="${attr('Enlarge: ' + p.en)}"><figure class="ph" data-reveal style="aspect-ratio:${p.gen.w} / ${p.gen.h}">${pic(p.id, { sizes: p.small ? '(min-width: 1100px) 22vw, (min-width: 700px) 30vw, 46vw' : '(min-width: 1100px) 24vw, (min-width: 700px) 32vw, 48vw' })}</figure></button></li>`).join('')}
</ul>
</div></section>
${rsvpBand()}
${nextPage('agence', 'L’agence', 'The agency', 'portrait-elena')}`
};
