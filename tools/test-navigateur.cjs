// Tests fonctionnels dans un vrai navigateur (Playwright requis, non installé par le dépôt).
// Usage : node tools/build.mjs && npx serve public -l 4173 &  puis  node tools/test-navigateur.cjs [http://localhost:4173]
// Aucun test n'envoie de message : toute requête sortante hors du site fait échouer le test.
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:4173';
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('ok    ' + m); } else { fails++; console.log('ÉCHEC ' + m); } };

(async () => {
  const browser = await chromium.launch();
  const newPage = async (opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, ...opts });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('os-seen', '1'); } catch (e) {} window.__audio = 0; const A = window.AudioContext; if (A) window.AudioContext = function (...a) { window.__audio++; return new A(...a); }; });
    const page = await ctx.newPage();
    page.__external = [];
    page.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:')) page.__external.push(r.method() + ' ' + u); if (r.method() !== 'GET') page.__external.push(r.method() + ' ' + u); });
    page.__errors = [];
    page.on('pageerror', e => page.__errors.push(e.message));
    return page;
  };

  // 1. Carton-réponse : budget, conservation de l'état à la bascule de langue, récapitulatif, aucun envoi
  {
    const p = await newPage();
    await p.goto(BASE + '/contact', { waitUntil: 'networkidle' });
    await p.click('label.chip:has(input[value="equipes"])');
    await p.click('[data-next]');
    await p.click('label.chip:has(input[value="diner"])');
    await p.click('[data-next]');
    await p.click('label.chip:has(input[value="londres"])');
    await p.fill('#b-budget', '25 000');
    await p.selectOption('#b-devise', 'GBP');
    await p.click('.js-lang'); // bascule en anglais en plein parcours
    ok(await p.$eval('html', h => h.lang) === 'en', 'bascule FR → EN sans rechargement');
    ok(await p.inputValue('#b-budget') === '25 000' && await p.inputValue('#b-devise') === 'GBP', 'budget conservé après bascule de langue');
    ok((await p.textContent('[data-step-label]')).includes('Step 3 of 4'), 'étape traduite et conservée');
    ok(await p.isChecked('input[value="londres"]'), 'ville conservée');
    await p.click('[data-next]');
    await p.fill('#b-prenom', 'Test'); await p.fill('#b-nom', 'Maquette'); await p.fill('#b-mail', 'test@example.invalid');
    await p.click('[data-submit]');
    ok((await p.textContent('[data-err="4"]')).includes('consent'), 'validation en anglais : case d’accord requise');
    await p.check('#b-ok');
    await p.click('[data-submit]');
    await p.waitForSelector('.recap');
    const recap = await p.textContent('.recap');
    ok(recap.includes('25 000 £ (GBP)'), 'budget et devise dans le récapitulatif');
    ok(recap.includes('Bringing teams together') && recap.includes('Dinner') && recap.includes('London'), 'récapitulatif complet en anglais');
    const href = await p.getAttribute('[data-mailto]', 'href');
    ok(href.startsWith('mailto:elena.deliot@loeilsingulier.com') && decodeURIComponent(href).includes('Budget : 25 000 £ (GBP)'), 'e-mail prérempli contenant le budget (non ouvert)');
    ok((await p.textContent('.sent')).includes('Nothing has been sent'), 'mention honnête : rien n’a été envoyé');
    await p.click('.js-lang');
    ok((await p.textContent('.recap')).includes('Réunir des équipes'), 'récapitulatif retraduit en français');
    await p.click('[data-edit]');
    ok(await p.inputValue('#b-prenom') === 'Test', 'retour en modification : valeurs conservées');
    await p.click('[data-prev]'); await p.check('#b-budget-tbd');
    await p.click('[data-next]'); await p.click('[data-submit]');
    ok((await p.textContent('.recap')).includes('À définir'), 'budget « À définir »');
    ok(!p.__external.length, 'aucune requête sortante ni envoi : ' + p.__external.join(', '));
    ok(!p.__errors.length, 'aucune erreur JS ' + p.__errors.join(' | '));
    await p.context().close();
  }

  // 2. Liens profonds hérités
  for (const [hash, val] of [['affaires', 'relations'], ['contrat', 'clients'], ['equipes', 'equipes'], ['anniversaire', 'etape']]) {
    const p = await newPage();
    await p.goto(`${BASE}/contact#${hash}`, { waitUntil: 'networkidle' });
    ok(await p.isChecked(`input[value="${val}"]`), `lien profond #${hash} présélectionne « ${val} »`);
    await p.context().close();
  }
  {
    const p = await newPage();
    await p.goto(`${BASE}/contact#graphisme`, { waitUntil: 'networkidle' });
    ok(await p.isChecked('#b-graph'), 'lien profond #graphisme coche les supports graphiques');
    await p.context().close();
  }

  // 3. Clavier, focus visible, menu mobile
  {
    const p = await newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.keyboard.press('Tab');
    ok(await p.evaluate(() => document.activeElement.classList.contains('skip')), 'premier Tab : lien d’évitement');
    const outline = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    ok(outline !== 'none', 'focus visible (' + outline + ')');
    await p.click('.js-burger');
    await p.waitForTimeout(400);
    ok(await p.getAttribute('.js-burger', 'aria-expanded') === 'true', 'menu ouvert');
    ok(await p.evaluate(() => document.querySelector('main').inert), 'contenu inerte pendant le menu');
    await p.keyboard.press('Escape');
    ok(await p.getAttribute('.js-burger', 'aria-expanded') === 'false' && await p.evaluate(() => document.activeElement.classList.contains('js-burger')), 'Échap ferme le menu, focus rendu au bouton');
    ok(await p.evaluate(() => window.__audio) === 0, 'aucun son créé au chargement');
    await p.context().close();
  }

  // 4. Réduction des animations
  {
    const p = await newPage({ reducedMotion: 'reduce' });
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    ok(await p.$eval('html', h => h.dataset.calm) === '1', 'prefers-reduced-motion active le mode calme');
    ok(!(await p.$('.loader')), 'pas d’enveloppe animée en mode calme');
    ok(await p.$eval('[data-hs]', e => e.classList.contains('is-native')), 'galerie horizontale non épinglée en mode calme');
    await p.goto(BASE + '/design-graphique', { waitUntil: 'networkidle' });
    ok(await p.$eval('[data-flipbook-play]', b => b.hidden), 'animation de l’invitation remplacée par les étapes statiques');
    await p.click('[data-flipbook-go="2"]');
    ok(await p.$eval('[data-flipbook-f="2"]', f => f.classList.contains('is-on')), 'étape « Ouverte » accessible au clic');
    await p.context().close();
  }

  // 5. Enveloppe d'ouverture (premier passage), carte, horloges
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    ok(!!(await p.$('.loader .seal')), 'enveloppe et cachet présents au premier passage');
    await p.waitForTimeout(4200);
    ok(!(await p.$('.loader')), 'enveloppe ouverte puis retirée');
    await p.evaluate(() => document.querySelector('[data-map]').scrollIntoView());
    await p.waitForTimeout(1500);
    ok(await p.$$eval('[data-map] .city', c => c.length) === 8, 'huit villes sur la carte');
    ok(await p.$$eval('[data-map] .city.is-main', c => c.length) === 2, 'deux implantations principales');
    const clocks = await p.$$eval('[data-clock]', els => els.map(e => [e.dataset.clock, e.textContent]));
    // l'horloge se met à jour toutes les 15 s : on accepte la minute courante ou la précédente
    const fmt = (tz, d) => new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(d);
    const near = (tz, v) => [0, -60000].some(dt => fmt(tz, new Date(Date.now() + dt)) === v);
    ok(clocks.every(([tz, v]) => near(tz, v)), 'horloges à l’heure de Paris et de Londres ' + JSON.stringify(clocks));
    const [hp, hl] = clocks.map(([, v]) => +v.slice(0, 2));
    ok((hp - hl + 24) % 24 === 1, 'une heure de décalage Paris / Londres');
    await ctx.close();
  }

  // 6. Visionneuse et filtres
  {
    const p = await newPage();
    await p.goto(BASE + '/galerie', { waitUntil: 'networkidle' });
    await p.click('[data-filter="musique"]');
    ok(await p.$$eval('.m-item:not([hidden])', x => x.length) === await p.$$eval('.m-item[data-cat="musique"]', x => x.length), 'filtre Musique');
    await p.click('.m-item:not([hidden]) .m-btn');
    await p.waitForTimeout(400);
    ok(await p.$eval('.lb', l => l.classList.contains('is-open')), 'visionneuse ouverte');
    await p.keyboard.press('ArrowRight');
    ok((await p.textContent('.lb__cnt')).startsWith('2 /'), 'flèche droite : image suivante');
    await p.keyboard.press('Escape');
    ok(!(await p.$eval('.lb', l => l.classList.contains('is-open'))) && await p.evaluate(() => !!document.activeElement.closest('.m-item')), 'Échap ferme, focus rendu');
    await p.context().close();
  }

  // 7. Routes des QR codes et langue en paramètre
  for (const [path, n] of [['/playlist', 12], ['/playlistparis', 22]]) {
    const p = await newPage();
    const r = await p.goto(BASE + path, { waitUntil: 'networkidle' });
    ok(r.status() === 200 && await p.$$eval('.tracks li', x => x.length) === n, `${path} : page dédiée, ${n} titres`);
    ok(await p.getAttribute('[data-preview-only] a', 'href') === 'https://www.loeilsingulier.com' + path, `${path} : lien provisoire vers la sélection correspondante`);
    await p.context().close();
  }
  {
    const p = await newPage();
    await p.goto(BASE + '/references?lang=en', { waitUntil: 'networkidle' });
    ok(await p.$eval('html', h => h.lang) === 'en' && (await p.title()).startsWith('Clients'), '?lang=en : page et titre en anglais');
    const frVisible = await p.$$eval('.l-fr', els => els.filter(e => e.offsetParent).length);
    ok(frVisible === 0, 'aucun texte français visible en anglais');
    await p.context().close();
  }

  await browser.close();
  console.log(`\n${oks} tests réussis, ${fails} échec(s)`);
  process.exit(fails ? 1 : 0);
})();
