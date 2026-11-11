#!/usr/bin/env node
// Générateur statique sans dépendance : src/pages/*.mjs + content/journal/*.md -> public/
// Usage : node tools/build.mjs            (site publié)
//         node tools/build.mjs --drafts --out=/tmp/apercu   (aperçu local des brouillons du journal, jamais publié)
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { layout } from '../src/site.mjs';
import { loadArticles, journalPages } from '../src/journal.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const drafts = args.includes('--drafts');
const outArg = args.find(a => a.startsWith('--out='));
const OUT = outArg ? outArg.slice(6) : join(ROOT, 'public');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'static'), OUT, { recursive: true });

const pages = [];
for (const f of readdirSync(join(ROOT, 'src/pages')).filter(f => f.endsWith('.mjs')).sort()) {
  const mod = await import(pathToFileURL(join(ROOT, 'src/pages', f)).href);
  const list = Array.isArray(mod.default) ? mod.default : [mod.default];
  pages.push(...list);
}
const articles = loadArticles(join(ROOT, 'content/journal'), { drafts });
pages.push(...journalPages(articles));

const seen = new Set();
for (const pg of pages) {
  const file = pg.file || (pg.slug === 'index' ? 'index.html' : pg.slug + '.html');
  if (seen.has(file)) throw new Error('page en double : ' + file);
  seen.add(file);
  const dest = join(OUT, file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, layout(pg));
}
console.log(`${pages.length} pages -> ${OUT}${drafts ? ' (brouillons inclus, aperçu local uniquement)' : ''}`);
if (!existsSync(join(OUT, 'img/partage.jpg'))) console.warn('! image de partage manquante');
