#!/usr/bin/env node
// Contrôles statiques du site généré (sans dépendance) : node tools/build.mjs && node tools/verifier.mjs
// Vérifie le contenu demandé par la cliente, les liens internes, les médias, et l'absence de pièces privées.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUB = join(ROOT, 'public');
let fails = 0, oks = 0;
const ok = (cond, msg) => { if (cond) oks++; else { fails++; console.log('ÉCHEC  ' + msg); } };
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(PUB);
const html = Object.fromEntries(files.filter(f => f.endsWith('.html')).map(f => [f.slice(PUB.length + 1), readFileSync(f, 'utf8')]));
const text = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/[  ]/g, ' ').replace(/\s+/g, ' ');
const page = n => text(html[n] || '');
const css = readFileSync(join(PUB, 'assets/css/site.css'), 'utf8');
const js = readFileSync(join(PUB, 'assets/js/main.js'), 'utf8');

// 1. pages et routes
for (const p of ['index', 'evenementiel', 'design-graphique', 'galerie', 'agence', 'references', 'son', 'contact', 'journal', 'mentions-legales', '404', 'playlist', 'playlistparis'])
  ok(html[p + '.html'], `page ${p}.html présente`);
ok(!Object.keys(html).some(f => f.startsWith('journal/') && /modele-brouillon/.test(f)), 'aucun brouillon du journal publié');

// 2. textes clés FR / EN
const idx = page('index.html');
for (const s of ['Le sens du détail.', 'Le supplément d’âme.', 'L’art de recevoir, notre métier.', 'Precision in every detail.', 'Personality in every event.', 'The art of hosting is our craft.', 'Nous confier votre projet', 'Tell us about your event'])
  ok(idx.includes(s), `accueil contient « ${s} »`);
const ev = page('evenementiel.html');
for (const s of ['Écouter', 'Trouver le lieu', 'Éveiller les papilles', 'Créer l’ambiance', 'Orchestrer le jour J', 'Prolonger le souvenir'])
  ok(ev.includes(s), `six temps : « ${s} »`);
ok((html['evenementiel.html'].match(/class="step"/g) || []).length === 6, 'exactement six étapes');
const talents = ['Historien d’art', 'Scénographe', 'Graphiste', 'Photographe', 'Directeur technique', 'Musiciens', 'Artistes'];
const talUl = (html['evenementiel.html'].match(/<ul class="talents__list"[\s\S]*?<\/ul>/) || [''])[0];
ok((talUl.match(/<li>/g) || []).length === 7 && talents.every(x => talUl.includes(x)), 'sept talents, libellés non interactifs');
ok(!/<a[^>]*>[^<]*(Historien d’art|Scénographe)/.test(talUl), 'talents sans faux bouton');
ok(!Object.values(html).some(h => /Huit métiers/.test(h)), 'ancien titre « Huit métiers » retiré');
const refs = html['references.html'];
const refList = (refs.match(/id="panel-tout"[\s\S]*?<\/div>\s*<\/div>/) || [''])[0];
ok((refList.match(/<li data-ink>/g) || []).length === 35, '35 références');
for (const n of ['Freshfields', 'King & Spalding', 'HSBC', 'Promedif', 'Procos']) ok(refList.includes(n) || refList.includes(n.replace('&', '&amp;')), `référence ${n}`);
ok(!/30 références|30 clients/.test(Object.values(html).join('')), 'ancien compteur « 30 références » retiré');
for (const c of ['Paris', 'Cannes', 'Toulouse', 'London', 'Milan', 'Rome', 'Munich', 'Monaco']) ok(js.includes(`'${c}'`) || js.includes(`en: '${c}'`), `ville ${c} sur la carte`);
ok(js.includes("data-clock") && /Europe\/Paris/.test(html['index.html']) && /Europe\/London/.test(html['index.html']), 'horloges Europe/Paris et Europe/London');
ok(!/Barcelon|München/.test(Object.values(html).join('') + js), 'Barcelone et Munich-bureau retirés');
const ag = page('agence.html');
ok(ag.includes('Eléna Déliot — Fondatrice') && ag.includes('Founder'), 'signature Eléna Déliot — Fondatrice / Founder');
ok(/portrait-elena-\d+\.(avif|webp)/.test(html['agence.html']), 'portrait fourni sur L’agence');
ok(ag.includes('colourful') && !ag.includes('colorful'), '« colourful » harmonisé');
ok(!/confiance,\./.test(Object.values(html).join('')), 'coquille « confiance,. » corrigée');
const ct = html['contact.html'];
ok(/id="b-budget"/.test(ct) && /name="devise"/.test(ct) && /À définir/.test(ct) && /To be defined/.test(ct), 'champ Budget FR/EN, devise, « À définir »');
ok(!/quatre questions|Four questions/i.test(Object.values(html).join('')), 'textes « quatre questions » actualisés');
ok(/data-alias="affaires"/.test(ct) && /data-alias="contrat"/.test(ct) && /data-alias="anniversaire"/.test(ct), 'anciens liens profonds du contact conservés');
ok(/Démonstration/.test(ct) && !/a bien été envoyé|has been sent successfully/i.test(ct + js), 'mode démonstration honnête, aucun faux succès');
ok(page('playlist.html').includes('Dean Dorat') && page('playlist.html').includes('Patrick Clark'), 'crédits de la sélection festive');
ok((html['playlistparis.html'].match(/<li><span class="tracks__n/g) || []).length === 22, '22 titres Paris');
ok((html['playlist.html'].match(/<li><span class="tracks__n/g) || []).length === 12, '12 titres festifs');
ok(!/Lien d’écoute de la playlist à fournir|Listening link to be provided/.test(Object.values(html).join('')), 'anciens emplacements « lien d’écoute à fournir » remplacés');
ok(!/autoplay/i.test(Object.values(html).join('')), 'aucune lecture automatique');
ok(/Inspirations/.test(page('journal.html')) && !/class="jcard"/.test(html['journal.html']), 'journal : état vide, aucun article inventé');
ok(/Journal/.test(text(html['index.html'].match(/<nav class="nav"[\s\S]*?<\/nav>/)[0])), 'Journal dans la navigation');

// 3. charte : pas de bleu structurel, pas de dorure en relief
const blues = css.match(/#(?:1[0-9a-f]2[0-9a-f]{3}|0[0-9a-f]1[0-9a-f]3[0-9a-f]|14213A|0F1A30|1B2947|1D2D54|3b4f86)\b/gi) || [];
ok(!blues.length, 'aucune couleur bleu nuit de l’ancienne charte dans le CSS ' + blues.join(' '));
ok(!/gold-grad|foil|drop-shadow\(0 1px 0 rgba\(255/.test(css), 'aucun dégradé doré en relief');

// 4. liens internes et médias
const pages = new Set(Object.keys(html).map(f => '/' + f.replace(/\.html$/, '').replace(/^index$/, '')));
pages.add('/');
for (const [f, h] of Object.entries(html)) {
  for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) { const u = m[1]; if (/\.(css|png|jpg|webp|avif|svg|woff2|js)$/.test(u)) ok(existsSync(join(PUB, u)), `${f} : ressource ${u}`); else ok(pages.has(u.replace(/\/$/, '') || '/'), `${f} : lien ${u}`); }
  for (const m of h.matchAll(/(?:src|srcset)="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (u.startsWith('/')) ok(existsSync(join(PUB, u.split('?')[0])), `${f} : média ${u}`); }
  for (const m of h.matchAll(/<img [^>]*>/g)) ok(/width="\d+"/.test(m[0]) && /height="\d+"/.test(m[0]), `${f} : dimensions explicites ${m[0].slice(0, 60)}`);
}

// 5. pièces privées jamais servies
const priv = files.filter(f => /\.(docx|ai|txt|eml|zip)$/i.test(f) && !/OFL-|LICENSE/.test(f) || /echanges|brief|PROMPT|inventaire/i.test(f));
ok(!priv.length, 'aucune pièce privée dans public/ ' + priv.join(' '));

console.log(`${oks} contrôles réussis, ${fails} échec(s)`);
process.exit(fails ? 1 : 0);
