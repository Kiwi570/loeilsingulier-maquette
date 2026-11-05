// Journal (blog) : articles en Markdown simple dans content/journal/*.md, voir content/journal/LISEZMOI.md.
// Un article n'est publié que si « status: published ». Les brouillons ne sont jamais écrits dans public/.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { t, tb, label, pic, photo, esc, btn, nextPage, rsvpBand } from './site.mjs';

function frontMatter(src, file) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file} : en-tête --- manquant`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const k = line.match(/^([a-z_]+):\s*(.*?)\s*(#.*)?$/);
    if (k) meta[k[1]] = k[2].replace(/^"(.*)"$/, '$1');
  }
  const body = {};
  const parts = m[2].split(/^:::\s*(fr|en)\s*$/m);
  for (let i = 1; i < parts.length; i += 2) body[parts[i]] = parts[i + 1].trim();
  return { meta, body };
}

const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/\[(.+?)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_, txt, url) => `<a href="${url}"${url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${txt}</a>`);

/** Markdown minimal : ## titres, paragraphes, > citations, listes -, ![photo-id] images du site */
export function md(src) {
  return src.split(/\n{2,}/).map(block => {
    const b = block.trim();
    if (!b) return '';
    let m;
    if ((m = b.match(/^(#{2,3})\s+(.*)$/))) return `<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`;
    if ((m = b.match(/^!\[([a-z0-9-]+)\]$/))) return `<figure class="art-fig">${pic(m[1], { sizes: '(min-width: 900px) 760px, 100vw' })}</figure>`;
    if (b.startsWith('>')) return `<blockquote>${inline(b.replace(/^>\s?/gm, ''))}</blockquote>`;
    if (/^-\s/.test(b)) return `<ul>${b.split('\n').map(l => `<li>${inline(l.replace(/^-\s*/, ''))}</li>`).join('')}</ul>`;
    return `<p>${inline(b).replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
}

export function loadArticles(dir, { drafts = false } = {}) {
  let files = [];
  try { files = readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'LISEZMOI.md'); } catch (e) { return []; }
  return files.map(f => {
    const { meta, body } = frontMatter(readFileSync(join(dir, f), 'utf8'), f);
    for (const k of ['slug', 'status', 'title_fr', 'title_en']) if (!meta[k]) throw new Error(`${f} : champ « ${k} » manquant`);
    if (!body.fr || !body.en) throw new Error(`${f} : sections « ::: fr » et « ::: en » obligatoires`);
    if (meta.cover) photo(meta.cover); // vérifie que l'image existe
    return { ...meta, body, file: f };
  }).filter(a => a.status === 'published' || (drafts && a.status === 'draft'))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

const dateFr = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
const dateEn = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
const THEMES = 'art · lieux · musique · papier · inspirations';
const THEMES_EN = 'art · places · music · paper · inspiration';

export function journalPages(articles) {
  const cards = articles.map(a => `
<article class="jcard">
<a class="jcard__a" href="/journal/${a.slug}">
${a.cover ? `<figure class="ph jcard__img" style="aspect-ratio:4 / 3">${pic(a.cover, { sizes: '(min-width: 900px) 30vw, 100vw', alt: false })}</figure>` : ''}
<span class="jcard__meta">${a.status === 'draft' ? '<b class="draft-tag">Brouillon / Draft</b> ' : ''}${t(esc(a.theme_fr || ''), esc(a.theme_en || ''))}${a.date ? ` · <time datetime="${a.date}">${t(dateFr(a.date), dateEn(a.date))}</time>` : ''}</span>
<h2 class="h3">${t(esc(a.title_fr), esc(a.title_en))}</h2>
${a.excerpt_fr ? tb('p', esc(a.excerpt_fr), esc(a.excerpt_en || a.excerpt_fr), 'small') : ''}
</a></article>`).join('');

  const empty = `
<div class="jempty">
${'<svg class="eye eye--big" viewBox="0 0 200 100" aria-hidden="true" focusable="false"><path class="eye__lid" d="M4 50C40 6 160 6 196 50C160 94 40 94 4 50Z"/><circle class="eye__iris" cx="100" cy="50" r="27"/><circle class="eye__dot" cx="100" cy="50" r="9"/></svg>'}
${tb('p', 'Les premières pages du journal sont en préparation.', 'The first pages of the journal are in preparation.', 'h3')}
${tb('p', 'En attendant, l’univers de l’agence se découvre en images et en musique.', 'In the meantime, discover the agency’s world in pictures and music.', 'small')}
<div class="btn-row">${btn('/galerie', 'Voir les événements', 'View our events', 'btn--ghost')}${btn('/son', 'Le son', 'Sound', 'btn--ghost')}</div>
</div>`;

  const list = {
    slug: 'journal', file: 'journal.html',
    title: { fr: `Journal · ${'l’œil singulier'}`, en: `Journal · ${'l’œil singulier'}` },
    desc: { fr: 'Le journal de l’œil singulier : inspirations et découvertes, art, lieux, musique et papier.', en: 'The l’œil singulier journal: inspiration and discoveries, art, places, music and paper.' },
    body: `
<section class="pgh s-cream"><div class="wrap pgh__grid">
<div class="pgh__txt">
${label('Journal', 'Journal')}
<h1 class="h1" data-press>${t('Inspirations <em>et découvertes</em>', 'Inspiration <em>and discoveries</em>')}</h1>
<p class="themes">${t(THEMES, THEMES_EN)}</p>
</div>
</div></section>
<section class="sec s-cream" aria-label="Articles" style="padding-top:0"><div class="wrap">
${articles.length ? `<div class="jgrid">${cards}</div>` : empty}
</div></section>
${nextPage('contact', 'Contact', 'Contact', 'longue-table')}`
  };

  const pages = articles.map(a => ({
    slug: 'journal/' + a.slug, file: `journal/${a.slug}.html`, ogType: 'article',
    robots: a.status === 'draft' ? 'noindex, nofollow' : undefined,
    title: { fr: `${a.title_fr} · Journal`, en: `${a.title_en} · Journal` },
    desc: { fr: a.excerpt_fr || a.title_fr, en: a.excerpt_en || a.title_en },
    body: `
<article class="art">
<header class="pgh s-cream"><div class="wrap art__head">
<a class="link small" href="/journal">← ${t('Journal', 'Journal')}</a>
${a.status === 'draft' ? '<p class="draft-banner">Brouillon non publié · Unpublished draft</p>' : ''}
<span class="label">${t(esc(a.theme_fr || 'Journal'), esc(a.theme_en || 'Journal'))}</span>
<h1 class="h1" data-press>${t(esc(a.title_fr), esc(a.title_en))}</h1>
${a.date ? `<p class="small"><time datetime="${a.date}">${t(dateFr(a.date), dateEn(a.date))}</time>${a.author ? ' · ' + esc(a.author) : ''}</p>` : ''}
</div></header>
${a.cover ? `<div class="wrap art__cover">${pic(a.cover, { sizes: '(min-width: 1200px) 1100px, 100vw', eager: true })}</div>` : ''}
<div class="wrap"><div class="art__body prose">
<div class="l-fr" lang="fr">${md(a.body.fr)}</div>
<div class="l-en" lang="en">${md(a.body.en)}</div>
</div></div>
</article>
${rsvpBand()}`
  }));
  return [list, ...pages];
}
