// Accueil : rubriques 01 Accueil, 02 Philosophie, 04 Signature, puis aperçus (prestations, galerie, références, carte, contact).
import { t, tb, paras, label, btn, pic, fig, eye, rsvpBand, mapSection, nextPage, arrow } from '../site.mjs';
import { REFS } from './references.mjs';

const galleryPreview = ['salle-voutee', 'longue-table', 'salon-lanternes', 'pianiste-bleu', 'rotonde-coupole', 'cocktails-fleurs', 'danseuses-lustre', 'salle-ovale'];
const allRefs = Object.values(REFS).flat();

export default {
  slug: 'index', loader: true, bodyClass: 'is-home',
  title: { fr: 'l’œil singulier · Le sens du détail. Le supplément d’âme.', en: 'l’œil singulier · Precision in every detail. Personality in every event.' },
  desc: {
    fr: 'Depuis 2012, l’œil singulier imagine et orchestre des événements sur mesure pour les cabinets d’avocats internationaux, les sociétés de conseil et les entreprises, à Paris, à Londres et ailleurs.',
    en: 'Since 2012, l’œil singulier has created and delivered bespoke events for international law firms, consultancy firms and corporations in Paris, London and beyond.'
  },
  body: `
<section class="hero s-ink" aria-labelledby="hero-t"><div class="wrap hero__grid">
<div class="hero__txt">
${label('Événementiel · Paris & Londres', 'Events · Paris & London', 'label--hero')}
<h1 class="display" id="hero-t">${t('<span class="ln">Le sens du détail.</span> <em class="ln">Le supplément d’âme.</em>', '<span class="ln">Precision in every detail.</span> <em class="ln">Personality in every event.</em>')}</h1>
${tb('p', 'L’art de recevoir, notre métier.', 'The art of hosting is our craft.', 'hero__sub')}
<div class="btn-row hero__cta">${btn('/contact', 'Nous confier votre projet', 'Tell us about your event', 'btn--red')}${btn('/galerie', 'Voir les événements', 'View our events', 'btn--ghost')}</div>
</div>
<div class="hero__media">
<figure class="ph hero__ph" style="aspect-ratio:3 / 4">${pic('table-ambre', { sizes: '(min-width: 960px) 40vw, 100vw', eager: true })}</figure>
<div class="hero__eye" data-eye>${eye()}</div>
<p class="hero__since">${t('Depuis', 'Since')} <span class="num">2012</span></p>
</div>
</div>
<div class="scroll-hint" aria-hidden="true"><i></i></div>
</section>

<section class="sec s-cream intro" aria-labelledby="intro-t"><div class="wrap intro__grid">
<h2 class="sr-only" id="intro-t">${t('L’agence en quelques mots', 'The agency in brief')}</h2>
<div class="intro__lead" data-rise>
${paras(
  ['Depuis 2012, nous imaginons et orchestrons des événements sur mesure pour les cabinets d’avocats internationaux, les sociétés de conseil, les banques, les institutions financières et les entreprises internationales, à Paris, à Londres et ailleurs.'],
  ['Since 2012, we have created and delivered bespoke events for international law firms, consultancy firms and corporations in Paris, London and beyond.'], 'big-lead')}
</div>
<div class="intro__side" data-rise>
${paras(
  ['Notre connaissance approfondie de ces environnements exigeants nous permet d’en comprendre les codes, les enjeux et les attentes. Nous y associons notre sens de l’hospitalité, notre créativité et une attention particulière à chaque projet. Des événements où l’exigence rencontre le plaisir de recevoir.'],
  ['Our first-hand experience and knowledge of these demanding international environments means we understand their culture, expectations and priorities. We combine that insight with tailor-made hospitality, creativity and a genuinely personal approach. Events where exacting standards meet the pleasure of bringing people together.'], 'prose')}
<a class="link-arrow" href="/evenementiel">${t('Événementiel', 'Events')} ${arrow}</a>
</div>
</div></section>

<section class="sec s-cream philo" aria-labelledby="philo-t" style="padding-top:0"><div class="wrap philo__grid">
<div class="philo__media">
${fig('longue-table', { cls: 'philo__a', sizes: '(min-width: 900px) 30vw, 60vw' })}
${fig('cocktails-fleurs', { cls: 'philo__b', sizes: '(min-width: 900px) 20vw, 40vw' })}
</div>
<div class="philo__txt">
${label('Philosophie', 'Philosophy')}
<h2 class="h2" id="philo-t" data-press>${t('L’art <em>de recevoir</em>', 'The art <em>of hosting</em>')}</h2>
${paras(
  ['Recevoir, c’est bien plus que réunir des invités dans un beau lieu. C’est créer une atmosphère, susciter des rencontres, imaginer ces petites attentions qui font que chacun se sent attendu.', 'Nous aimons les lieux qui ont une âme, les tables qui invitent à prolonger les conversations et la musique qui trouve naturellement sa place.', 'Notre vision de l’événementiel est profondément liée à cette idée de l’hospitalité : généreuse, élégante, attentive et toujours personnelle.'],
  ['Hosting is about much more than gathering people in a beautiful venue. It is about creating an atmosphere, encouraging connections and thinking of those little touches that make everyone feel welcome.', 'We love places with a unique soul, tables that invite conversations to linger on and music that complements the occasion without overwhelming it.', 'Our approach to events is rooted in a generous, elegant, attentive and genuinely personal sense of hospitality.'], 'prose')}
</div>
</div></section>

<section class="sec s-ink sig" aria-labelledby="sig-t"><div class="wrap">
<div class="sig__head">
${label('Notre signature', 'Our signature')}
<h2 class="h2" id="sig-t" data-press>${t('Une certaine idée <em>de l’élégance</em>', 'A certain idea <em>of elegance</em>')}</h2>
</div>
<div class="sig__grid">
<ul class="sig__list" data-rise="stagger">
${[['Des lieux qui racontent une histoire.', 'Venues with a story to tell.'], ['Une gastronomie qui éveille les sens.', 'Food that awakens the senses.'], ['Une musique qui accompagne l’instant.', 'Music that sets the mood.'], ['Une direction artistique qui relie l’ensemble.', 'Creative direction that brings it all together.']].map(([fr, en], i) => `<li><span class="num">0${i + 1}</span>${t(fr, en)}</li>`).join('')}
</ul>
<div class="sig__side">
${fig('salon-lanternes', { cls: 'sig__ph cut-eye', ratio: '4 / 5', sizes: '(min-width: 900px) 32vw, 90vw' })}
${paras(['Nous aimons les belles choses, mais surtout celles qui ont une âme, une personnalité, quelque chose à raconter. Entourés de partenaires talentueux, nous créons des expériences qui vous ressemblent, avec une attention particulière portée à l’harmonie de l’ensemble.'], ['We appreciate beautiful things, especially those with soul, character and a story of their own. Working with talented partners, we create experiences that reflect your identity, with a thoughtful eye for the harmony of the whole.'], 'prose')}
</div>
</div>
${tb('p', 'Parce que l’élégance est aussi une affaire de personnalité.', 'Because elegance is also a matter of personality.', 'sig__punch', ' data-press')}
</div></section>

<section class="sec s-cream offers" aria-labelledby="off-t"><div class="wrap">
<h2 class="sr-only" id="off-t">${t('Nos savoir-faire', 'What we do')}</h2>
<div class="offer offer--events">
<a class="offer__media" href="/evenementiel" tabindex="-1" aria-hidden="true">${fig('salle-voutee', { ratio: '3 / 2', sizes: '(min-width: 900px) 55vw, 100vw', alt: false })}</a>
<div class="offer__txt">
<span class="offer__n num">I</span>
${label('Événementiel', 'Events')}
<h3 class="h3">${t('Une expertise qui fait <em>la différence</em>', 'Expertise that makes <em>the difference</em>')}</h3>
${tb('p', 'Cocktails clients, dîners de prestige, conférences ou célébrations d’entreprise : nous associons cette connaissance des codes professionnels à une organisation rigoureuse et à une réelle liberté créative.', 'From client receptions and prestigious dinners to conferences and corporate celebrations, we combine an understanding of professional expectations with meticulous planning and creative freedom.', 'small')}
<a class="link-arrow" href="/evenementiel">${t('Événementiel', 'Events')} ${arrow}</a>
</div>
</div>
<div class="offer offer--design">
<a class="offer__media offer__media--paper" href="/design-graphique" tabindex="-1" aria-hidden="true">${fig('papeterie', { sizes: '(min-width: 900px) 45vw, 100vw', alt: false, cls: 'ph--contain' })}</a>
<div class="offer__txt">
<span class="offer__n num">II</span>
${label('Design graphique', 'Graphic design')}
<h3 class="h3">${t('La première impression commence <em>bien avant l’événement.</em>', 'First impressions begin <em>long before the event.</em>')}</h3>
${tb('p', 'Invitations, menus, programmes, signalétique, brochures et supports éditoriaux : nous imaginons des créations graphiques qui prolongent l’expérience, du premier regard au dernier souvenir.', 'Invitations, menus, programmes, signage, brochures and editorial materials: we create graphic pieces that carry the experience from first impression to lasting memory.', 'small')}
<a class="link-arrow" href="/design-graphique">${t('Découvrir les réalisations', 'Explore our work')} ${arrow}</a>
</div>
</div>
</div></section>

<section class="sec s-ink hs-sec" aria-labelledby="ga-t">
<div class="wrap hs__head">
<div>${label('Galerie', 'Gallery')}
<h2 class="h2" id="ga-t" data-press>${t('Quelques belles histoires <em>en images.</em>', 'A few fine stories <em>in pictures.</em>')}</h2></div>
${btn('/galerie', 'Voir les événements', 'View our events', 'btn--ghost')}
</div>
<div class="hs" data-hs><div class="hs__track">
${galleryPreview.map((id, i) => `<div class="hs__item">${fig(id, { ratio: i % 3 === 1 ? '4 / 3' : '3 / 4', sizes: '(min-width: 900px) 34vw, 80vw' })}</div>`).join('')}
</div></div>
</section>

<section class="sec s-cream refs-teaser" aria-labelledby="rf-t">
<div class="wrap refs-teaser__head">
${label('Clients', 'Clients')}
<h2 class="h2" id="rf-t" data-press>${t('De belles <em>collaborations</em>', 'Rewarding <em>collaborations</em>')}</h2>
${tb('p', 'Au fil des années, nous avons eu le plaisir d’accompagner des cabinets d’avocats internationaux, des sociétés de conseil et des entreprises dans leurs événements professionnels.', 'Over the years, we’ve had the pleasure of working with international law firms, consultancies and businesses on their corporate events.', 'lead')}
</div>
<div class="marquee" aria-hidden="true"><div class="marquee__in">${[0, 1].map(() => `<div class="marquee__row">${allRefs.slice(0, 18).map(n => `<span>${n}</span>`).join('<i></i>')}<i></i></div>`).join('')}</div></div>
<div class="marquee marquee--rev" aria-hidden="true"><div class="marquee__in">${[0, 1].map(() => `<div class="marquee__row">${allRefs.slice(18).map(n => `<span>${n}</span>`).join('<i></i>')}<i></i></div>`).join('')}</div></div>
<p class="sr-only">${t('Références : ', 'Clients: ')}${allRefs.join(', ')}.</p>
<div class="wrap" style="margin-top:clamp(36px,5vw,64px)">${btn('/references', 'Les 35 références', 'All 35 clients', 'btn--ghost')}</div>
</section>

${mapSection('map-t')}
${rsvpBand()}
${nextPage('evenementiel', 'Événementiel', 'Events', 'salle-voutee')}`
};
