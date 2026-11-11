// Le son : rubrique 13 + deux pages dédiées aux QR codes déjà distribués :
//   /playlist       <- QR code de la carte « Square print » (sélection festive, visuel de Dean Dorat)
//   /playlistparis  <- QR code de la carte « Paris – l’œil singulier »
// Aucune lecture automatique, aucun enregistrement réhébergé. L'écoute reste sur les pages actuelles
// tant que la migration du lecteur et les droits ne sont pas confirmés (voir docs/son-et-qr-codes.md).
import { t, tb, paras, label, btn, fig, pic, rsvpBand, nextPage, arrow } from '../site.mjs';

const PARIS = [['Paris', 'Else'], ['Paris', 'L’Impératrice'], ['From Paris With Love', 'Melody Gardot'], ['Paris canaille', 'Juliette Gréco'], ['Sous le ciel de Paris', 'Édith Piaf'], ['La bohème', 'Charles Aznavour'], ['Les moulins de mon cœur', 'Juliette Armanet'], ['Lovers in Paris', 'Jacob Gurevitsch'], ['Ascenseur pour l’échafaud', 'Miles Davis'], ['Sympathique', 'Pink Martini, China Forbes, Thomas M. Lauderdale'], ['Gosse de Paris', 'Charles Aznavour'], ['Summer in Paris', 'Cam starring Anggun'], ['Parisienne Walkways', 'Gary Moore, Phil Lynott'], ['I Love Paris', 'Ella Fitzgerald'], ['Ça balance pas mal à Paris', 'Michel Berger, France Gall'], ['Paris sera toujours Paris', 'Zaz'], ['Le poinçonneur des Lilas', 'Serge Gainsbourg'], ['Sous les ponts de Paris', 'Juliette Gréco, Melody Gardot'], ['Revoir Paris', 'Charles Trenet'], ['Il est cinq heures, Paris s’éveille', 'Jacques Dutronc'], ['J’ai deux amours', 'Josephine Baker'], ['Un jour je reverrai Paris', 'Line Renaud, Pierre Guillermin Orchestra']];
const FESTIVE = [['Dumb Love', 'Neil Frances'], ['Happiness', 'Blank & Jones, Cathy Battistessa'], ['I’m Coming Home', 'Dino Lenny'], ['Different From The Rest', 'In Flagran'], ['The Love Forever', 'Kevin McKay'], ['All In A Dream', 'DJ Tennis, Joseph Ashworth & LP Giobbi'], ['Most Expensive Diamond', 'Never Dull'], ['L.O.V.E.', 'Purple Disco Machine & Boris Dlugosch'], ['Tonight', 'Suzy Q'], ['Beaches', 'Jesper Ryom'], ['Muyé', 'Rampa, Adam Port, &ME'], ['Running Up That Hill', 'Chromatics']];
const tracks = list => `<ol class="tracks">${list.map(([ti, ar], i) => `<li><span class="tracks__n num">${String(i + 1).padStart(2, '0')}</span><span class="tracks__t">${ti}</span><span class="tracks__a">${ar}</span></li>`).join('')}</ol>`;

/** écoute : en prévisualisation, lien provisoire et clairement identifié vers la page actuelle du site Wix.
 *  Sur le domaine définitif, ce lien deviendrait circulaire : il est donc masqué et remplacé par un message neutre. */
const listen = (path) => `
<div class="listen" data-listen>
<div class="listen__preview" data-preview-only>
<p class="listen__k">${t('Écoute · lien provisoire', 'Listening · temporary link')}</p>
<a class="btn btn--red" href="https://www.loeilsingulier.com/${path}" target="_blank" rel="noopener">${t('Écouter sur le site actuel', 'Listen on the current site')} ${arrow}<span class="sr-only">${t('(nouvel onglet)', '(new tab)')}</span></a>
<p class="small">${t('Maquette : l’écoute renvoie vers la page actuelle de l’œil singulier, en attendant la migration du lecteur.', 'Mock-up: listening links to the current l’œil singulier page until the player is migrated.')}</p>
</div>
<p class="listen__soon small" data-prod-only hidden>${t('Le lecteur de cette sélection est en cours de migration.', 'The player for this selection is being migrated.')}</p>
</div>`;

const son = {
  slug: 'son',
  title: { fr: 'Le son · l’œil singulier', en: 'Sound · l’œil singulier' },
  desc: { fr: 'La bande-son fait partie de l’histoire : des playlists qui créent une atmosphère et donnent à chaque événement sa propre identité musicale.', en: 'Every occasion deserves its own soundtrack: playlists that create an atmosphere and give each event its own musical identity.' },
  body: `
<section class="pgh s-ink son-head" aria-labelledby="son-t"><div class="wrap pgh__grid pgh__grid--media">
<div class="pgh__txt">
${label('Le son', 'Sound')}
<h1 class="h1" id="son-t" data-press>${t('La bande-son fait partie <em>de l’histoire.</em>', 'Every occasion deserves <em>its own soundtrack.</em>')}</h1>
${paras(['Il suffit parfois de quelques notes pour installer une atmosphère, réveiller un souvenir ou donner envie de danser.', 'Passionnés de musique et toujours à l’affût de nouvelles découvertes, nous aimons composer des playlists qui créent une atmosphère, éveillent les émotions et donnent à chaque événement sa propre identité musicale.'], ['Sometimes a few notes are all it takes to bring back a memory or tempt everyone onto the dance floor.', 'Passionate about music and always on the lookout for new discoveries, we love curating playlists that create an atmosphere, stir emotions and give each event its own musical identity.'], 'prose')}
</div>
<div class="pgh__media">
<div class="vinyl" aria-hidden="true">${fig('platine-vinyle', { ratio: '3 / 4', sizes: '(min-width: 900px) 36vw, 100vw', eager: true, reveal: false })}</div>
</div>
</div></section>

<section class="sec s-cream" aria-labelledby="pl-t"><div class="wrap">
<div class="pl-head">${label('Playlists', 'Playlists')}<h2 class="h2" id="pl-t" data-press>${t('Découvrez <em>notre playlist</em>', 'Explore <em>our playlist</em>')}</h2></div>
<div class="pl-cards">
<a class="pl-card pl-card--paris" href="/playlistparis">
<span class="pl-card__k">${t('À écouter', 'For your ears')} · Paris</span>
<span class="pl-card__t">${t('Une sélection musicale inspirée par <em>la Ville Lumière.</em>', 'A musical selection inspired by <em>the City of Light.</em>')}</span>
<span class="pl-card__m num">${PARIS.length} ${t('titres', 'tracks')} ${arrow}</span>
</a>
<a class="pl-card pl-card--festive" href="/playlist">
<span class="pl-card__img">${pic('carte-festive', { sizes: '(min-width: 900px) 18vw, 40vw', alt: false })}</span>
<span class="pl-card__k">${t('Sélection festive', 'Party selection')} · Elena Mix</span>
<span class="pl-card__t">${t('Montez <em>le volume</em>', 'Turn <em>it up</em>')}</span>
<span class="pl-card__m num">${FESTIVE.length} ${t('titres', 'tracks')} ${arrow}</span>
</a>
</div>
</div></section>

<section class="sec s-ink ambience" aria-labelledby="amb-t"><div class="wrap ambience__grid">
<div>
${label('Ambiance', 'Ambience')}
<h2 class="h3" id="amb-t">${t('Une ambiance composée en direct par votre navigateur', 'An ambience composed live by your browser')}</h2>
${tb('p', 'Piano feutré, accords et carillons de verre, générés à la volée : aucun enregistrement n’est diffusé. Rien ne démarre sans votre clic.', 'Soft keys, chords and glass chimes generated on the fly: no recording is played. Nothing starts until you click.', 'small')}
</div>
<button class="play-btn js-sound" type="button" aria-pressed="false"><span class="play-btn__disc" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path class="i-play" d="M8 5l11 7-11 7z" fill="currentColor"/><path class="i-pause" d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg></span><span class="play-btn__l"><span class="ps-off">${t('Lancer l’ambiance', 'Start the ambience')}</span><span class="ps-on">${t('Couper l’ambiance', 'Stop the ambience')}</span></span></button>
</div></section>
${rsvpBand()}
${nextPage('journal', 'Journal', 'Journal', 'statuette-livres')}`
};

const paris = {
  slug: 'playlistparis',
  title: { fr: 'Playlist Paris · l’œil singulier', en: 'Paris playlist · l’œil singulier' },
  desc: { fr: 'À écouter : une sélection musicale inspirée par la Ville Lumière, par l’œil singulier.', en: 'For your ears: a musical selection inspired by the City of Light, by l’œil singulier.' },
  body: `
<section class="pgh s-ink pl-page" aria-labelledby="pp-t"><div class="wrap pl-page__grid">
<div class="pl-page__txt">
<a class="link small" href="/son">← ${t('Le son', 'Sound')}</a>
<span class="label">${t('À écouter', 'For your ears')}</span>
<h1 class="h1" id="pp-t" data-press>Paris <em>– ${'l’œil singulier'}</em></h1>
${tb('p', 'Une sélection musicale inspirée par la Ville Lumière.', 'A musical selection inspired by the City of Light.', 'lead')}
${paras(['Entre héritage et modernité, chaque titre évoque un quartier, une humeur, une époque : la rive gauche et ses amours bohèmes, les néons du Marais, les nuits électro du canal, les voix éternelles de la chanson française. Des sons d’hier et d’aujourd’hui qui dessinent le portrait d’une capitale multiple, romantique, audacieuse, vibrante. Un Paris intime et universel, à écouter comme on tourne les pages d’un carnet de voyage.'], ['Between heritage and modernity, each track evokes a neighbourhood, a mood, an era: the Left Bank and its bohemian loves, the neon of the Marais, electro nights on the canal, the timeless voices of French chanson. Sounds of yesterday and today that paint a city of many faces: romantic, daring, vibrant. An intimate, universal Paris, to be listened to like the pages of a travel journal.'], 'prose small-prose')}
${listen('playlistparis')}
</div>
<div class="pl-page__list">
<p class="pl-page__count num">${PARIS.length} ${t('titres', 'tracks')}</p>
${tracks(PARIS)}
</div>
</div></section>
${nextPage('son', 'Le son', 'Sound', 'platine-vinyle')}`
};

const festive = {
  slug: 'playlist',
  title: { fr: 'Playlist festive · Elena Mix · l’œil singulier', en: 'Party playlist · Elena Mix · l’œil singulier' },
  desc: { fr: 'Elena Mix : une sélection musicale faite avec amour pour égayer vos moments festifs. Illustration de Dean Dorat.', en: 'Elena Mix: a lovingly made selection to brighten your festive moments. Artwork by Dean Dorat.' },
  body: `
<section class="pgh s-ink pl-page" aria-labelledby="pf-t"><div class="wrap pl-page__grid">
<div class="pl-page__txt">
<a class="link small" href="/son">← ${t('Le son', 'Sound')}</a>
<span class="label">${t('Sélection festive · Elena Mix', 'Party selection · Elena Mix')}</span>
<h1 class="h1" id="pf-t" data-press>${t('Montez <em>le volume</em>', 'Turn <em>it up</em>')}</h1>
<figure class="festive-art">${pic('carte-festive', { sizes: '(min-width: 900px) 34vw, 86vw', eager: true })}<figcaption>${t('Illustration : Dean Dorat', 'Artwork: Dean Dorat')} · <a href="https://deandorat.co.uk" target="_blank" rel="noopener">deandorat.co.uk</a></figcaption></figure>
${paras(['Une sélection musicale faite avec amour pour égayer vos moments festifs : une expérience sonore conçue spécialement pour enchanter vos soirées.'], ['A lovingly made selection to brighten your festive moments: a sound experience designed to enchant your evenings.'], 'prose small-prose')}
${tb('p', 'Merci à Patrick Clark pour son aide précieuse pour le mix des morceaux, et à Dean Dorat pour la réalisation du visuel.', 'Thanks to Patrick Clark for his invaluable help mixing the tracks, and to Dean Dorat for the artwork.', 'small credits')}
${listen('playlist')}
</div>
<div class="pl-page__list">
<p class="pl-page__count num">${FESTIVE.length} ${t('titres', 'tracks')}</p>
${tracks(FESTIVE)}
</div>
</div></section>
${nextPage('son', 'Le son', 'Sound', 'platine-vinyle')}`
};

export default [son, paris, festive];
