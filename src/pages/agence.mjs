// L'agence : rubrique 08 À propos, avec le portrait fourni et la biographie complète.
import { t, tb, label, fig, pic, eye, rsvpBand, nextPage } from '../site.mjs';
import { TALENTS } from './evenementiel.mjs';

// Biographie : texte intégral, paragraphe par paragraphe (FR / EN), avec une image d'accompagnement facultative.
const BIO = [
  { fr: 'Franco-britannique, j’ai grandi entre l’Afrique et l’Angleterre avant de tomber amoureuse de Paris. De mes deux cultures, j’ai gardé le meilleur : le sens du service, la politesse et l’autodérision britanniques, associés à l’art de vivre à la française, aux bonnes tables et aux grands vins. Un mélange qui ne manque pas de caractère !',
    en: 'Franco-British, I grew up between Africa and England before falling in love with Paris. From my two cultures, I’ve kept the best of both worlds: British manners, a strong sense of service and a healthy dose of self-deprecating humour, combined with the French art de vivre, good food and great wine. Quite a colourful combination!' },
  { fr: 'Curieuse insatiable, j’aime explorer les musées, pousser les portes des églises et dénicher des lieux inattendus. J’ai un faible pour les extravagances du maniérisme italien et une obsession pour Le Caravage, ses ombres et ses lumières. Même en vacances, je continue mes repérages. Mon entourage a fini par s’y faire… ou presque.',
    en: 'Endlessly curious, I love exploring museums, stepping inside churches and discovering unexpected places. I have a particular weakness for the extravagance of Italian Mannerism and something of an obsession with Caravaggio, his dramatic contrasts of light and shadow. Even on holiday, I find myself scouting potential venues. My family and friends have learnt to live with it… more or less.', img: 'galerie-peinte' },
  { fr: 'Audiophile et collectionneuse de vinyles, je compose des playlists en permanence. Mes oreilles réclament toujours de nouveaux sons ! J’ai aussi une faiblesse pour les beaux papiers, leur grain, leur texture, le plaisir de les toucher. Une belle dorure à chaud peut me bouleverser. Chacun ses petits plaisirs !',
    en: 'An audiophile and vinyl collector, I’m forever putting together playlists. My ears are always hungry for new sounds! I also have a weakness for beautiful paper: its grain, texture and the pleasure of holding it. A beautifully executed gold foil finish can genuinely make my day. We all have our little pleasures!', img: 'platine-vinyle' },
  { fr: 'J’adore cuisiner pour mes proches, réunir des amis autour d’une belle table et partager une bonne bouteille. Et j’aime encore davantage offrir que recevoir : imaginer la petite attention qui fera vraiment plaisir. Le plaisir de faire plaisir, tout simplement.',
    en: 'I love cooking for those closest to me, bringing friends together around a beautiful table and sharing a good bottle of wine. And I enjoy giving presents even more than receiving them: finding that thoughtful little something that will make someone truly happy. The pleasure of giving pleasure, quite simply.', img: 'longue-table' },
  { fr: 'Après un parcours dans l’hôtellerie, la restauration et près de quinze ans dans l’événementiel et les relations publiques au sein d’un cabinet d’avocats international, j’ai acquis une connaissance de l’intérieur de cet univers exigeant. J’ai fondé l’œil singulier en 2012 : une agence indépendante, à taille humaine, où exigence et créativité vont de pair avec une approche bienveillante et profondément humaine.',
    en: 'After a career in hospitality and catering, followed by nearly fifteen years in events and public relations at an international law firm, I gained first-hand insight into this demanding professional world. I founded l’œil singulier in 2012: an independent, boutique agency where high standards and creativity go hand in hand with a genuinely thoughtful, personal approach.', mark: '2012' },
  { fr: 'Aujourd’hui, j’imagine et orchestre des événements à Paris, à Londres et ailleurs, entourée de partenaires qui partagent ma passion des belles expériences.',
    en: 'Today, I create and orchestrate events in Paris, London and beyond, working alongside partners who share my passion for exceptional experiences.' }
];

export default {
  slug: 'agence',
  title: { fr: 'L’agence · Eléna Déliot · l’œil singulier', en: 'The agency · Eléna Déliot · l’œil singulier' },
  desc: { fr: 'Un pied à Paris, l’autre à Londres. Et toujours l’œil ailleurs ! Eléna Déliot a fondé l’œil singulier en 2012.', en: 'One foot in Paris, the other in London. And always an eye on somewhere new! Eléna Déliot founded l’œil singulier in 2012.' },
  body: `
<section class="pgh s-cream about-head" aria-labelledby="ab-t"><div class="wrap about-head__grid">
<div class="about-head__txt">
${label('L’agence · À propos', 'The agency · About')}
<h1 class="h1" id="ab-t" data-press>${t('Un pied à Paris, l’autre à Londres. <em>Et toujours l’œil ailleurs&nbsp;!</em>', 'One foot in Paris, the other in London. <em>And always an eye on somewhere new!</em>')}</h1>
</div>
<figure class="portrait">
<div class="portrait__ph">${pic('portrait-elena', { sizes: '(min-width: 900px) 34vw, 86vw', eager: true })}</div>
<figcaption>Eléna Déliot — ${t('Fondatrice', 'Founder')}</figcaption>
${eye('portrait__eye')}
</figure>
</div></section>

<section class="sec s-cream bio" aria-label="Biographie" data-aria-en="Biography" style="padding-top:0"><div class="wrap">
${BIO.map((b, i) => `<div class="bio__row${b.img ? ' has-img' : ''}${i % 2 ? ' is-alt' : ''}" data-rise>
<span class="bio__n num" aria-hidden="true">${b.mark || ['I', 'II', 'III', 'IV', 'V', 'VI'][i]}</span>
${tb('p', b.fr, b.en, i === 0 ? 'bio__p bio__p--first' : 'bio__p')}
${b.img ? `<div class="bio__img">${fig(b.img, { ratio: '4 / 5', sizes: '(min-width: 900px) 22vw, 60vw' })}</div>` : ''}
</div>`).join('')}
<div class="bio__end" data-rise>
${tb('p', 'En somme, j’ai réussi à faire de mes passions un métier. Une excellente excuse pour ne jamais vraiment décrocher !', 'In short, I’ve managed to turn my passions into my profession. A rather good excuse never to switch off completely!', 'bio__last')}
<p class="signature">Eléna Déliot — ${t('Fondatrice', 'Founder')}</p>
</div>
</div></section>

<section class="sec s-ink talents-mini" aria-labelledby="tm-t"><div class="wrap">
${label('Les talents', 'Our talent')}
<h2 class="h3" id="tm-t">${t('Une équipe sur mesure', 'A bespoke team')}</h2>
<ul class="talents__list talents__list--row">${TALENTS.map(([fr, en]) => `<li>${t(fr, en)}</li>`).join('')}</ul>
<a class="link-arrow" href="/evenementiel#tal-t">${t('Événementiel', 'Events')} <svg class="arr" viewBox="0 0 22 10" aria-hidden="true" focusable="false"><path d="M0 5h20M16 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></a>
</div></section>
${rsvpBand()}
${nextPage('references', 'Références', 'Clients', 'salon-lustres')}`
};
