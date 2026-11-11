// Références : rubrique 09 Clients et liste actualisée (35 noms, dénominations telles que fournies).
import { t, tb, paras, label, nextPage, rsvpBand, fig } from '../site.mjs';

export const REFS = {
  droit: ['Allen & Overy', 'Angle Droit Notaires', 'Ashurst', 'Bénédicte Papin Avocats', 'Cabinet Tuffal Nerson Douarre & Associés', 'Calix Avocats', 'Cleary Gottlieb Steen & Hamilton', 'Clifford Chance', 'DS Avocats', 'Fréget & Associés', 'Freshfields', 'King & Spalding', 'K&L Gates', 'Norton Rose Fulbright', 'Skadden, Arps', 'Willkie Farr & Gallagher'],
  education: ['Alumni EM Normandie', 'Ecole de Management Normandie', 'Fondation EM Normandie', 'ESPCI Paris', 'Ecole Nationale d’Administration', 'Université Paris-Dauphine'],
  finance: ['HSBC', 'Next World Capital', 'Oddo & Cie', 'PAI Partners'],
  management: ['AlixPartners', 'A.T. Kearney'],
  divers: ['AG2R La Mondiale', 'Barbanel', 'D-Edge', 'Laboratoires Décléor', 'Mission Foods Europe', 'Promedif', 'Procos']
};
const SECTORS = [['droit', 'Droit', 'Law'], ['education', 'Éducation', 'Education'], ['finance', 'Finance', 'Finance'], ['management', 'Management', 'Management'], ['divers', 'Divers', 'Other sectors']];
const TOTAL = Object.values(REFS).flat().length;
if (TOTAL !== 35) throw new Error('La liste des références doit compter 35 noms, elle en compte ' + TOTAL);

// Témoignages repris de la maquette précédente (texte original + traduction signalée). Source à reconfirmer : voir docs/compte-rendu.md.
const LETTERS = [
  { lang: 'fr', who: 'Valérie Rasson', role: 'HR Director at A.T. Kearney', q: 'J’ai travaillé avec Elena sur un grand événement interne mené il y a un an à la Philharmonie de Paris. Comme toujours, j’ai pu compter sur Elena pour prendre en charge le suivi de ce projet d’envergure de A à Z. Elena est très professionnelle, carrée, ajoutant toujours une touche personnelle qui fait que l’événement marque les esprits. J’ai aussi beaucoup apprécié ses qualités d’écoute, sa créativité et son exigence sur tout ainsi que sa parfaite maîtrise des rouages des événements impliquant beaucoup d’intervenants (traiteurs différents, lieu, technique, DJ, photo, etc). Enfin son humilité et sa discrétion lui permettent aussi de travailler efficacement. Si je devais synthétiser, je dirais : singularité, exigence, professionnalisme, et toujours avec le sourire ! Je recommande donc Elena et partagerai volontiers mon expérience auprès de ceux qui voudraient découvrir L’Œil Singulier.', tr: 'I worked with Elena on a major internal event held a year ago at the Philharmonie de Paris. As always, I could count on Elena to manage this large-scale project from A to Z. Elena is highly professional and rigorous, always adding a personal touch that makes the event memorable. I also greatly appreciated her listening skills, her creativity and her high standards in everything, as well as her perfect command of events involving many contributors (different caterers, venue, technical teams, DJ, photography, etc.). Finally, her humility and discretion allow her to work efficiently. To sum up, I would say: singularity, high standards, professionalism, and always with a smile! I recommend Elena and will gladly share my experience with anyone who would like to discover L’Œil Singulier.' },
  { lang: 'fr', who: 'Sylvie Guilbaud', role: 'Chief Operating Officer at Dentons', q: 'Elena est une très grande professionnelle qui sait donner tout son sens ou plutôt tous ses sens à l’événement que l’on lui confie. Elle comprend et saisit parfaitement son client et sait soigner tous les détails qui feront la différence. J’ai eu l’occasion de confier à Elena différents événements. Chacun d’eux a été une réussite et je le ferai à nouveau les yeux fermés à la prochaine occasion. Last but not least, travailler avec Elena est un vrai plaisir.', tr: 'Elena is a true professional who knows how to give full meaning, or rather all the senses, to the event entrusted to her. She understands her client perfectly and takes care of every detail that will make the difference. I have entrusted Elena with several events. Each one was a success, and I would do it again with my eyes closed at the next opportunity. Last but not least, working with Elena is a real pleasure.' },
  { lang: 'fr', who: 'Olivier Fréget', role: 'Partner, Co-head Global Antitrust Group, Head of Paris Competition Law Group, Allen & Overy', q: 'J’ai travaillé à de nombreuses reprises avec Elena sur l’organisation d’évènements complexes. Excellentes idées, très grande facilité à travailler avec Elena, très grande efficacité, autonomie, sens de l’initiative… l’ensemble avec beaucoup de courtoisie et de patience.', tr: 'I have worked with Elena many times on organising complex events. Excellent ideas, very easy to work with, highly efficient, autonomous, full of initiative… all with great courtesy and patience.' },
  { lang: 'en', who: 'Carole Guettier', role: 'Senior Business Development Manager at Norton Rose Fulbright', q: 'Last year, Elena has been key in the success of the first major client event Norton Rose Fulbright was organizing for the first time in three years in France. She has been truly professional and very flexible with us. At all the stages of our project, she has been solution oriented. We have really appreciated her personality and her skills and would highly recommend her.', tr: 'L’an dernier, Elena a joué un rôle clé dans la réussite du premier grand événement client que Norton Rose Fulbright organisait en France depuis trois ans. Elle s’est montrée très professionnelle et très flexible. À chaque étape du projet, elle a su trouver des solutions. Nous avons beaucoup apprécié sa personnalité et ses compétences, et nous la recommandons vivement.' },
  { lang: 'en', who: 'Frederic Halley', role: 'Venture Partner at Next World Capital', q: 'Over the last 2 years, Elena has run Next World Capital marketing events across Europe with great success. She is very personable and efficient with a strong ability to deliver C-Level events internationally.', tr: 'Ces deux dernières années, Elena a organisé avec grand succès les événements marketing de Next World Capital à travers l’Europe. Très avenante et efficace, elle sait parfaitement mener des événements pour les dirigeants à l’international.' },
  { lang: 'en', who: 'Filip Stuer', role: 'Director Marketing & Communication at BOZAR', q: 'I’ve always been impressed by Elena’s professionalism. The events that she organises always seem to be the fruit of quiet organisation, without a trace of the usual panic that often besets event organisers. Breakfast events in prestigious museums, content seminars or glamorous nights for a 800+ crowd in the Louvre – every event was a classy combination of Gallic savoir-faire and Anglo-Saxon business-mindedness.', tr: 'J’ai toujours été impressionné par le professionnalisme d’Elena. Ses événements semblent toujours le fruit d’une organisation tranquille, sans la moindre trace de la panique qui gagne souvent les organisateurs. Petits-déjeuners dans des musées prestigieux, séminaires de fond ou soirées glamour pour plus de 800 invités au Louvre : chaque événement alliait avec classe le savoir-faire gaulois et le sens des affaires anglo-saxon.' }
];
const quote = (s, l) => l === 'fr' ? `« ${s} »` : `“${s}”`;
const other = l => l === 'fr' ? 'en' : 'fr';

const tabs = [['tout', 'Toutes', 'All', TOTAL], ...SECTORS.map(([k, fr, en]) => [k, fr, en, REFS[k].length])];

export default {
  slug: 'references',
  title: { fr: 'Références · l’œil singulier', en: 'Clients · l’œil singulier' },
  desc: { fr: 'De belles collaborations : 35 références parmi les cabinets d’avocats internationaux, l’éducation, la finance, le conseil et l’entreprise.', en: 'Rewarding collaborations: 35 clients across international law firms, education, finance, consultancy and business.' },
  body: `
<section class="pgh s-ink"><div class="wrap pgh__grid">
<div class="pgh__txt">
${label('Références', 'Clients')}
<h1 class="h1" data-press>${t('De belles <em>collaborations</em>', 'Rewarding <em>collaborations</em>')}</h1>
${paras(['Au fil des années, nous avons eu le plaisir d’accompagner des cabinets d’avocats internationaux, des sociétés de conseil et des entreprises dans leurs événements professionnels.', 'Chaque collaboration est avant tout une histoire de confiance, d’écoute et d’attention aux détails.'], ['Over the years, we’ve had the pleasure of working with international law firms, consultancies and businesses on their corporate events.', 'Every collaboration begins with trust, understanding and a shared appreciation of the details that matter.'], 'prose lead-prose')}
</div>
<div class="pgh__count" aria-hidden="true"><span class="num">${TOTAL}</span>${t('références', 'clients')}</div>
</div></section>

<section class="sec s-cream" aria-labelledby="list-t"><div class="wrap">
<h2 class="sr-only" id="list-t">${t('Liste des références par secteur', 'Clients by sector')}</h2>
<div class="tabs" role="tablist" aria-label="Secteurs" data-aria-en="Sectors" data-tabs>
${tabs.map(([k, fr, en, n], i) => `<button type="button" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t(fr, en)} <span class="num">${n}</span></button>`).join('')}
</div>
<div class="tabpanel" id="panel-tout" role="tabpanel" aria-labelledby="tab-tout" tabindex="0">
<div class="guests">${SECTORS.map(([k, fr, en]) => `<div class="guests__col"><h3 class="guests__h">${t(fr, en)} <span class="num">${REFS[k].length}</span></h3><ul>${REFS[k].map(n => `<li data-ink>${n}</li>`).join('')}</ul></div>`).join('')}</div>
</div>
${SECTORS.map(([k, fr, en]) => `<div class="tabpanel" id="panel-${k}" role="tabpanel" aria-labelledby="tab-${k}" tabindex="0" hidden><ul class="guests guests--one">${REFS[k].map(n => `<li data-ink>${n}</li>`).join('')}</ul></div>`).join('')}
</div></section>

<section class="sec s-paper" aria-labelledby="lt-t"><div class="wrap">
<div class="letters__head">
${label('Ils en parlent', 'In their words')}
<h2 class="h2" id="lt-t" data-press>${t('Quelques <em>mots</em> de clients', 'A few <em>words</em> from clients')}</h2>
${tb('p', 'Témoignages reproduits dans leur langue d’origine ; la traduction est signalée comme telle.', 'Testimonials shown in their original language; translations are marked as such.', 'small')}
</div>
<div class="letters">${LETTERS.map(l => `<article class="letter" data-rise>
<blockquote lang="${l.lang}">${quote(l.q, l.lang)}</blockquote>
<p class="who"><b>${l.who}</b><span>${l.role}</span></p>
<details class="tr-box"><summary>${l.lang === 'fr' ? t('Traduction anglaise proposée', 'Suggested English translation') : t('Traduction française proposée', 'Suggested French translation')}</summary><p lang="${other(l.lang)}">${l.tr}</p></details>
</article>`).join('')}</div>
</div></section>
${rsvpBand()}
${nextPage('son', 'Le son', 'Sound', 'platine-vinyle')}`
};
