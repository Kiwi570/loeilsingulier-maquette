// Événementiel : rubriques 03 Expertise, 05 Notre rôle, 06 Six temps, 07 Talents.
import { t, tb, paras, label, btn, fig, pic, rsvpBand, nextPage } from '../site.mjs';

// Intitulés anglais des six temps : ajouts éditoriaux (non fournis dans le document), signalés dans docs/compte-rendu.md.
export const STEPS = [
  { fr: 'Écouter', en: 'Listen', dfr: 'Tout commence par une conversation. Nous prenons le temps de comprendre vos objectifs, votre public, vos contraintes et vos envies.', den: 'It all starts with a conversation. We take the time to understand your objectives, audience, requirements and ambitions.' },
  { fr: 'Trouver le lieu', en: 'Find the venue', dfr: 'Une adresse inattendue, un lieu chargé d’histoire ou un espace à réinventer : nous cherchons celui qui correspond à l’esprit de votre événement.', den: 'An unexpected address, a place steeped in history or a space waiting to be transformed: we find the setting that best captures the spirit of your event.' },
  { fr: 'Éveiller les papilles', en: 'Awaken the palate', dfr: 'Un cocktail inventif, un dîner raffiné, une belle sélection de vins : la gastronomie fait pleinement partie de l’expérience.', den: 'Inventive canapés, a beautifully considered dinner, an excellent wine selection: food and drink are an essential part of the experience.' },
  { fr: 'Créer l’ambiance', en: 'Create the atmosphere', dfr: 'Lumière, son, musique, scénographie : nous composons un ensemble harmonieux et choisissons les talents qui lui donneront vie.', den: 'Lighting, sound, music and creative direction: we bring every element together and pick the best talent in their field to make it come alive.' },
  { fr: 'Orchestrer le jour J', en: 'Orchestrate the big day', dfr: 'En coulisses, nous anticipons, coordonnons et ajustons, pour que chaque étape se déroule avec fluidité, même lorsque l’imprévu s’invite.', den: 'Behind the scenes, we anticipate, coordinate and adapt, keeping everything running smoothly even when faced with the unexpected.' },
  { fr: 'Prolonger le souvenir', en: 'Make the memory last', dfr: 'Photographies, vidéos et attentions bien choisies : parce qu’un bel événement mérite de laisser une trace.', den: 'Photography, film and thoughtful finishing touches: because a wonderful occasion deserves to leave a lasting impression.' }
];
const STEP_IMG = ['cocktails-fleurs', 'salle-ovale', 'chef-bols', 'salle-voutee', 'console-scene', 'platine-vinyle'];

// Talents (bouton « Talents » du document) : libellés non interactifs, aucun contenu n'existe derrière.
// Intitulés anglais : ajouts éditoriaux.
export const TALENTS = [['Historien d’art', 'Art historian'], ['Scénographe', 'Set designer'], ['Graphiste', 'Graphic designer'], ['Photographe', 'Photographer'], ['Directeur technique', 'Technical director'], ['Musiciens', 'Musicians'], ['Artistes', 'Artists']];

export default {
  slug: 'evenementiel',
  title: { fr: 'Événementiel · l’œil singulier', en: 'Events · l’œil singulier' },
  desc: { fr: 'Cocktails clients, dîners de prestige, conférences ou célébrations d’entreprise : une expertise qui fait la différence, en six temps.', en: 'Client receptions, prestigious dinners, conferences and corporate celebrations: expertise that makes the difference, in six stages.' },
  body: `
<section class="pgh s-ink" aria-labelledby="ev-t"><div class="wrap pgh__grid pgh__grid--media">
<div class="pgh__txt">
${label('Événementiel · Expertise', 'Events · Expertise')}
<h1 class="h1" id="ev-t" data-press>${t('Une expertise qui fait <em>la différence</em>', 'Expertise that makes <em>the difference</em>')}</h1>
${tb('p', 'Nous connaissons de l’intérieur les exigences des cabinets d’avocats internationaux et des grandes organisations : la discrétion, le sens du protocole, la réactivité et le respect des budgets comme des engagements.', 'We have an insider’s understanding of the demands of international law firms and major organisations: discretion, protocol, responsiveness and careful stewardship of budgets and commitments.', 'lead')}
<div class="btn-row">${btn('/contact', 'Nous confier votre projet', 'Tell us about your event', 'btn--red')}</div>
</div>
<div class="pgh__media">${fig('rotonde-coupole', { ratio: '4 / 5', sizes: '(min-width: 900px) 40vw, 100vw', eager: true, reveal: false, focal: '50% 40%' })}</div>
</div></section>

<section class="sec s-cream" aria-labelledby="exp-t"><div class="wrap split">
<div class="split__a">
<h2 class="sr-only" id="exp-t">${t('Notre expertise', 'Our expertise')}</h2>
${paras(['Cocktails clients, dîners de prestige, conférences ou célébrations d’entreprise : nous associons cette connaissance des codes professionnels à une organisation rigoureuse et à une réelle liberté créative.', 'Recherche de lieux, scénographie, gastronomie, technique, invitations et coordination : nous orchestrons chaque étape avec souplesse, bonne humeur et des partenaires de confiance.'], ['From client receptions and prestigious dinners to conferences and corporate celebrations, we combine an understanding of professional expectations with meticulous planning and creative freedom.', 'Venue sourcing, creative direction, catering, technical production, invitations and on-site coordination: we oversee every stage with trusted partners, flexibility and good humour.'], 'prose')}
</div>
<figure class="split__b quote-fig">
<blockquote class="bq">${t('« Le luxe, c’est de pouvoir profiter de ses invités. »', '“Luxury is being free to enjoy your guests.”')}</blockquote>
</figure>
</div></section>

<section class="sec s-cream role" aria-labelledby="role-t" style="padding-top:0"><div class="wrap role__grid">
<div class="role__media">${fig('salle-ovale', { ratio: '4 / 3', sizes: '(min-width: 900px) 46vw, 100vw' })}</div>
<div class="role__txt">
${label('Notre rôle', 'Our role')}
<h2 class="h2" id="role-t" data-press>${t('Une agence qui comprend <em>votre univers</em>', 'An agency that understands <em>your world</em>')}</h2>
${paras(['Développer des relations, remercier des clients, réunir des équipes ou célébrer une étape importante : nous savons qu’un événement professionnel répond toujours à un objectif précis.', 'Notre expérience des cabinets d’avocats internationaux et des structures de conseil nous permet d’en comprendre les circuits de décision, les impératifs de confidentialité et les niveaux d’exigence. Nous traduisons ces enjeux en solutions concrètes, adaptées à votre culture et à votre image.', 'Une agence indépendante et franco-britannique, où chaque projet est unique et chaque client bénéficie d’une attention toute particulière.'], ['Strengthening relationships, thanking clients, bringing teams together or marking a milestone: we know every corporate event serves a clear purpose.', 'Our experience working with international law firms, consultancies, banks and financial institutions gives us a thorough understanding of their decision-making processes, confidentiality requirements and exacting standards. We translate this understanding into tailored solutions that reflect your organisation’s culture, values and reputation.', 'An independent Franco-British boutique agency, where every project is unique and every client receives genuinely personal attention.'], 'prose')}
<ul class="purposes">
<li><a href="/contact#relations">${t('Développer des relations', 'Strengthening relationships')}</a></li>
<li><a href="/contact#clients">${t('Remercier des clients', 'Thanking clients')}</a></li>
<li><a href="/contact#equipes">${t('Réunir des équipes', 'Bringing teams together')}</a></li>
<li><a href="/contact#etape">${t('Célébrer une étape importante', 'Marking a milestone')}</a></li>
</ul>
</div>
</div></section>

<section class="sec s-ink steps-sec" aria-labelledby="steps-t"><div class="wrap steps-grid">
<div class="steps-head">
${label('Six temps', 'Six stages')}
<h2 class="h2" id="steps-t" data-press>${t('Six temps pour <em>un événement</em>', 'Six stages for <em>an event</em>')}</h2>
<div class="steps-visual" aria-hidden="true">${STEP_IMG.map((id, i) => `<div class="steps-visual__i${i === 0 ? ' is-on' : ''}" data-step-img="${i}">${pic(id, { sizes: '(min-width: 1000px) 30vw, 1px', alt: false })}</div>`).join('')}</div>
</div>
<ol class="steps" data-steps-list>
${STEPS.map((s, i) => `<li class="step" data-step-i="${i}"><span class="step__n num">0${i + 1}</span><div><h3 class="step__t">${t(s.fr, s.en)}</h3>${tb('p', s.dfr, s.den)}</div></li>`).join('')}
</ol>
</div></section>

<section class="sec s-paper talents" aria-labelledby="tal-t"><div class="wrap talents__grid">
<div class="talents__txt">
${label('Les talents', 'Our talent')}
<h2 class="h2" id="tal-t" data-press>${t('Une équipe <em>sur mesure</em>', 'A <em>bespoke</em> team')}</h2>
${paras(['Nous nous entourons de partenaires choisis pour leur savoir-faire, leur sens du service et leur personnalité : scénographes, techniciens, fleuristes, musiciens, photographes, graphistes et autres talents.', 'Une équipe adaptée à chaque projet, unie par la même exigence : faire de votre événement un moment singulier.'], ['We work with carefully chosen partners who share our standards, service ethos and creative spirit: designers, technical specialists, florists, musicians, photographers, graphic designers and other talents.', 'A team tailored to each occasion, united by one ambition: to make your event truly distinctive.'], 'prose')}
</div>
<ul class="talents__list" aria-label="Talents" data-aria-en="Talent" data-rise="stagger">
${TALENTS.map(([fr, en]) => `<li>${t(fr, en)}</li>`).join('')}
</ul>
<div class="talents__ph">${fig('saxophoniste', { ratio: '3 / 4', sizes: '(min-width: 900px) 24vw, 70vw' })}</div>
</div></section>
${rsvpBand()}
${nextPage('design-graphique', 'Design graphique', 'Graphic design', 'papeterie')}`
};
