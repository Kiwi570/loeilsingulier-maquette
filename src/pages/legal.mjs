// Mentions légales, confidentialité et page 404.
import { t, label, btn, eye, CONTACT } from '../site.mjs';

const todo = (fr, en) => `<span class="todo">${t(fr, en)}</span>`;
const row = (fr, en, dd) => `<dt>${t(fr, en)}</dt><dd>${dd}</dd>`;

const legal = {
  slug: 'mentions-legales',
  title: { fr: 'Mentions légales et confidentialité · l’œil singulier', en: 'Legal notice and privacy · l’œil singulier' },
  desc: { fr: 'Mentions légales, crédits et politique de confidentialité du site de l’œil singulier.', en: 'Legal notice, credits and privacy policy of the l’œil singulier website.' },
  body: `
<section class="pgh s-cream"><div class="wrap">
${label('Informations légales', 'Legal information')}
<h1 class="h1" data-press>${t('Mentions légales <em>et confidentialité</em>', 'Legal notice <em>and privacy</em>')}</h1>
</div></section>
<section class="sec s-cream" style="padding-top:0"><div class="wrap legal">
<nav class="legal__toc" aria-label="Sommaire" data-aria-en="Contents"><a href="#editeur">${t('Éditeur', 'Publisher')}</a><a href="#hebergeur">${t('Hébergeur', 'Host')}</a><a href="#credits">${t('Crédits', 'Credits')}</a><a href="#confidentialite">${t('Confidentialité', 'Privacy')}</a><a href="#cookies">${t('Préférences', 'Preferences')}</a></nav>
<div class="legal__body">
<section id="editeur"><h2 class="h3">${t('Éditeur du site', 'Site publisher')}</h2><dl>
${row('Nom commercial', 'Trading name', 'l’œil singulier')}
${row('Forme juridique et capital', 'Legal form and capital', todo('À compléter', 'To be completed'))}
${row('Siège', 'Registered office', '1 passage Rauch, 75011 Paris, France')}
<dt>SIRET</dt><dd class="num">537 593 352 00017</dd>
${row('TVA intracommunautaire', 'EU VAT number', '<span class="num">FR 62 537593352</span>')}
${row('Immatriculation (RCS ou RNE)', 'Registration (RCS or RNE)', todo('À compléter', 'To be completed'))}
${row('Directeur de la publication', 'Publication director', todo('À confirmer', 'To be confirmed'))}
<dt>Contact</dt><dd><a href="mailto:${CONTACT.mail}">${CONTACT.mail}</a> · <a class="num" href="tel:${CONTACT.tel}">${CONTACT.telLabel}</a></dd>
${row('Adresse à Londres', 'London address', `264 Gloucester Terrace, London W2 6HU, ${t('Royaume-Uni', 'United Kingdom')}`)}
</dl></section>
<section id="hebergeur"><h2 class="h3">${t('Hébergeur', 'Host')}</h2><dl>
${row('Société', 'Company', 'Vercel Inc.')}
${row('Adresse', 'Address', `440 N Barranca Ave #4133, Covina, CA 91723, ${t('États-Unis', 'USA')} ${todo('À vérifier à la mise en ligne', 'Check at launch')}`)}
</dl></section>
<section id="credits"><h2 class="h3">${t('Crédits', 'Credits')}</h2><dl>
${row('Photographies et réalisations graphiques', 'Photography and graphic work', `© l’œil singulier ${todo('Noms des photographes à compléter', 'Photographer names to be added')}`)}
${row('Illustration de la sélection festive', 'Party selection artwork', 'Dean Dorat (deandorat.co.uk)')}
${row('Mix de la sélection festive', 'Party selection mix', t('avec l’aide de Patrick Clark', 'with help from Patrick Clark'))}
${row('Typographies', 'Typefaces', 'Bodoni Moda, Hanken Grotesk (SIL Open Font License)')}
</dl></section>
<section id="confidentialite"><h2 class="h3">${t('Confidentialité', 'Privacy')}</h2>
<p>${t('Les informations saisies dans le carton-réponse (prénom, nom, société, téléphone, e-mail, message et détails du projet, dont le budget indicatif) servent uniquement à répondre à votre demande et à préparer une proposition. Dans cette maquette, elles ne quittent pas votre navigateur : seul l’e-mail que vous choisissez d’envoyer depuis votre messagerie les transmet.', 'Information entered in the reply card (first name, last name, company, phone, email, message and project details, including the indicative budget) is used only to answer your request and prepare a proposal. In this mock-up it never leaves your browser: only the email you choose to send from your own mail app transmits it.')}</p>
<dl>
${row('Responsable du traitement', 'Data controller', `l’œil singulier, 1 passage Rauch, 75011 Paris · ${CONTACT.mail}`)}
${row('Base légale', 'Legal basis', t('Mesures précontractuelles prises à votre demande (article 6.1.b du RGPD)', 'Pre-contractual steps taken at your request (GDPR article 6.1.b)'))}
${row('Destinataires', 'Recipients', t('l’œil singulier uniquement, et ses prestataires techniques d’hébergement', 'l’œil singulier only, and its technical hosting providers'))}
${row('Durée de conservation', 'Retention period', `${t('3 ans à compter du dernier contact', '3 years from the last contact')} ${todo('À valider', 'To be confirmed')}`)}
${row('Vos droits', 'Your rights', `${t('Accès, rectification, effacement, limitation, opposition et portabilité, en écrivant à ', 'Access, rectification, erasure, restriction, objection and portability, by writing to ')}${CONTACT.mail}. ${t('Vous pouvez aussi saisir la CNIL (cnil.fr).', 'You may also contact the CNIL (cnil.fr).')}`)}
</dl></section>
<section id="cookies"><h2 class="h3">${t('Préférences et cookies', 'Preferences and cookies')}</h2>
<p>${t('Ce site n’utilise aucun cookie publicitaire ni de mesure d’audience. Il mémorise seulement dans votre navigateur vos choix de langue et de mode calme.', 'This site uses no advertising or analytics cookies. It only remembers your language and calm-mode choices in your browser.')}</p>
</section>
</div></div></section>`
};

const notFound = {
  slug: '404', robots: 'noindex, nofollow',
  title: { fr: 'Page introuvable · l’œil singulier', en: 'Page not found · l’œil singulier' },
  desc: { fr: 'Cette page s’est éclipsée.', en: 'This page has slipped away.' },
  body: `
<section class="pgh s-ink nf"><div class="wrap nf__in">
${eye('nf__eye')}
${label('Erreur 404', 'Error 404')}
<h1 class="h1">${t('Cette page <em>s’est éclipsée</em>', 'This page has <em>slipped away</em>')}</h1>
<p class="lead">${t('La soirée continue ailleurs : revenez à l’accueil ou confiez-nous votre projet.', 'The party carries on elsewhere: head back home or tell us about your event.')}</p>
<div class="btn-row">${btn('/', 'Retour à l’accueil', 'Back to home', 'btn--ghost')}${btn('/contact', 'Confier un projet', 'Tell us about your event', 'btn--red')}</div>
</div></section>`
};

export default [legal, notFound];
