// Contact / R.S.V.P. : rubrique 14. Carton-réponse en quatre étapes, champ Budget (saisie libre + devise, ou « À définir »).
// L'envoi n'est raccordé à aucun service : la page le dit honnêtement et propose d'ouvrir un e-mail prérempli.
import { t, tb, paras, label, fig, mapSection, nextPage, CONTACT } from '../site.mjs';

// valeurs du parcours ; « alias » = anciens liens profonds (#affaires, #contrat, #anniversaire) toujours acceptés
const PURPOSES = [
  ['relations', 'Développer des relations', 'Strengthening relationships', 'affaires'],
  ['clients', 'Remercier des clients', 'Thanking clients', 'contrat'],
  ['equipes', 'Réunir des équipes', 'Bringing teams together', ''],
  ['etape', 'Célébrer une étape importante', 'Marking a milestone', 'anniversaire'],
  ['autre', 'Autre idée', 'Something else', '']
];
const FORMATS = [['cocktail', 'Cocktail', 'Drinks reception'], ['diner', 'Dîner', 'Dinner'], ['reception', 'Réception', 'Celebration'], ['conference', 'Conférence', 'Conference'], ['petit-dejeuner', 'Petit-déjeuner', 'Breakfast'], ['autre', 'Autre', 'Other']];
const chip = (type, name, [v, fr, en, alias], big) => `<label class="chip${big ? ' chip--big' : ''}"><input type="${type}" name="${name}" value="${v}"${alias ? ` data-alias="${alias}"` : ''} data-label-fr="${fr}" data-label-en="${en}"><span>${t(fr, en)}</span></label>`;

export default {
  slug: 'contact',
  title: { fr: 'Contact · R.S.V.P. · l’œil singulier', en: 'Contact · R.S.V.P. · l’œil singulier' },
  desc: { fr: 'Un événement en tête ? Parlons-en. Quelques questions suffisent pour commencer.', en: 'An event in mind? Let’s talk. Just a few questions to get started.' },
  body: `
<section class="pgh s-ink" aria-labelledby="ct-t"><div class="wrap pgh__grid">
<div class="pgh__txt">
${label('Contact · R.S.V.P.', 'Contact · R.S.V.P.')}
<h1 class="h1" id="ct-t" data-press>${t('Un événement en tête ? <em>Parlons-en.</em>', 'An event in mind? <em>Let’s talk.</em>')}</h1>
${paras(['Un cocktail, un dîner, une réception ou une idée encore à inventer ? Racontez-nous ce que vous imaginez. Nous serons ravis d’en discuter.', 'Quelques questions suffisent pour commencer. Et si vous préférez un échange de vive voix, c’est encore mieux.'], ['A reception, a dinner, a celebration or an idea still taking shape? Tell us what you have in mind. We’d love to hear about it.', 'Just a few questions to get started. And if you’d rather have a conversation, all the better.'], 'prose')}
</div>
</div></section>

<section class="sec s-cream" aria-label="Carton-réponse" data-aria-en="Reply card"><div class="wrap brief">
<form class="reply" id="brief" novalidate data-brief>
<div class="reply__top"><span class="rs">R.S.V.P.</span><div class="progress" aria-hidden="true"><i class="on"></i><i></i><i></i><i></i></div><p class="small" data-step-label aria-live="polite">${t('Étape 1 sur 4', 'Step 1 of 4')}</p></div>
<div data-steps>
<fieldset class="stepf" data-step="1"><legend>${t('Quel est l’objectif de votre événement ?', 'What is the purpose of your event?')}</legend>
<div class="chips">${PURPOSES.map(p => chip('radio', 'objectif', p, true)).join('')}</div>
<label class="check"><input type="checkbox" id="b-graph" name="graphisme" value="oui"><span>${t('J’ai aussi besoin de supports graphiques (invitations, menus, programmes…)', 'I also need graphic materials (invitations, menus, programmes…)')}</span></label>
<p class="err" data-err="1" role="alert"></p></fieldset>

<fieldset class="stepf" data-step="2" hidden><legend>${t('Quel format imaginez-vous ?', 'What format do you have in mind?')}</legend>
<p class="hint">${t('Plusieurs choix possibles.', 'Choose as many as you like.')}</p>
<div class="chips">${FORMATS.map(f => chip('checkbox', 'format', f)).join('')}</div></fieldset>

<fieldset class="stepf" data-step="3" hidden><legend>${t('Où, quand, pour combien d’invités, et avec quel budget ?', 'Where, when, for how many guests, and with what budget?')}</legend>
<div class="chips">${[['paris', 'Paris', 'Paris'], ['londres', 'Londres', 'London'], ['ailleurs', 'Ailleurs', 'Elsewhere']].map(c => chip('radio', 'ville', c)).join('')}</div>
<div class="fields">
<div class="field" data-city-other hidden><label for="b-ville">${t('Ville', 'City')}</label><input id="b-ville" name="ville_autre" autocomplete="address-level2"></div>
<div class="field"><label for="b-date">${t('Période souhaitée', 'Preferred date')}</label><input id="b-date" name="date" type="month"></div>
<div class="field"><label for="b-guests">${t('Nombre d’invités', 'Number of guests')}</label><div class="range-row"><output class="range-out num" for="b-guests" id="b-guests-out">80</output><input id="b-guests" name="invites" type="range" min="10" max="1000" step="10" value="80"></div></div>
<div class="field budget" data-budget>
<label for="b-budget">${t('Budget', 'Budget')}</label>
<div class="budget__row">
<input id="b-budget" name="budget" inputmode="decimal" autocomplete="off" aria-describedby="b-budget-h" placeholder="ex. 25 000" data-ph-en="e.g. 25,000">
<select id="b-devise" name="devise" aria-label="Devise" data-aria-en="Currency"><option value="EUR">€ EUR</option><option value="GBP">£ GBP</option></select>
</div>
<label class="check check--sm"><input type="checkbox" id="b-budget-tbd" name="budget_a_definir" value="1"><span>${t('À définir', 'To be defined')}</span></label>
<p class="hint" id="b-budget-h">${t('Montant indicatif, en saisie libre. Vous pouvez aussi cocher « À définir ».', 'An indicative amount, in your own words. You can also tick “To be defined”.')}</p>
</div>
</div><p class="err" data-err="3" role="alert"></p></fieldset>

<fieldset class="stepf" data-step="4" hidden><legend>${t('À qui devons-nous répondre ?', 'Who should we reply to?')}</legend>
<div class="fields">
<div class="field"><label for="b-prenom">${t('Prénom', 'First name')}</label><input id="b-prenom" name="prenom" autocomplete="given-name" required></div>
<div class="field"><label for="b-nom">${t('Nom', 'Last name')}</label><input id="b-nom" name="nom" autocomplete="family-name" required></div>
<div class="field"><label for="b-societe">${t('Société', 'Company')}</label><input id="b-societe" name="societe" autocomplete="organization"></div>
<div class="field"><label for="b-tel">${t('Téléphone', 'Phone')}</label><input id="b-tel" name="telephone" type="tel" autocomplete="tel"></div>
<div class="field full"><label for="b-mail">E-mail</label><input id="b-mail" name="email" type="email" autocomplete="email" required></div>
<div class="field full"><label for="b-msg">${t('Votre message', 'Your message')}</label><textarea data-lenis-prevent id="b-msg" name="message" placeholder="Quelques mots sur vos invités, le lieu rêvé, l’ambiance…" data-ph-en="A few words about your guests, the dream venue, the mood…"></textarea></div>
</div>
<label class="check"><input type="checkbox" id="b-ok" name="consentement" required><span>${t('J’accepte que ces informations servent uniquement à répondre à ma demande (voir <a href="/mentions-legales#confidentialite">confidentialité</a>).', 'I agree that this information is used only to answer my request (see <a href="/mentions-legales#confidentialite">privacy</a>).')}</span></label>
<p class="err" data-err="4" role="alert"></p></fieldset>
</div>
<div class="reply__nav"><button class="btn btn--ghost" type="button" data-prev hidden>${t('Retour', 'Back')}</button><button class="btn" type="button" data-next>${t('Continuer', 'Continue')}</button><button class="btn btn--red" type="submit" data-submit hidden>${t('Préparer le carton-réponse', 'Prepare the reply card')}</button></div>
<p class="sim-note"><b class="demo-tag">${t('Démonstration', 'Demo')}</b>${t('Ce formulaire n’est raccordé à aucun envoi : rien n’est transmis automatiquement. Vous pourrez ensuite ouvrir un e-mail prérempli dans votre messagerie.', 'This form is not connected to any sending service: nothing is transmitted automatically. You can then open a pre-filled email in your own mail app.')}</p>
<div class="sent" data-sent hidden tabindex="-1"></div>
</form>
<aside class="coords">
<div class="coord"><h2 class="h4">Eléna Déliot</h2>
<div class="copy-row"><a class="sel num coord__big" href="tel:${CONTACT.tel}">${CONTACT.telLabel}</a><button class="copy" type="button" data-copy="${CONTACT.tel}">${t('Copier', 'Copy')}</button></div>
<div class="copy-row"><a class="sel" href="mailto:${CONTACT.mail}">${CONTACT.mail}</a><button class="copy" type="button" data-copy="${CONTACT.mail}">${t('Copier', 'Copy')}</button></div></div>
<div class="coord"><h2 class="h4">Paris</h2><address>1 passage Rauch<br>75011 Paris<br>France</address></div>
<div class="coord"><h2 class="h4">${t('Londres', 'London')}</h2><address>264 Gloucester Terrace<br>London W2 6HU<br>${t('Royaume-Uni', 'United Kingdom')}</address></div>
${fig('verre-fumant', { ratio: '4 / 5', sizes: '(min-width: 920px) 26vw, 92vw', cls: 'coords__ph' })}
</aside>
</div></section>
${mapSection('map-c')}
${nextPage('index', 'Accueil', 'Home', 'table-ambre')}`
};
