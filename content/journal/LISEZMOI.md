# Journal : ajouter un article

1. Copier `modele-brouillon.md` sous un nouveau nom, par exemple `caravage-a-rome.md`.
2. Renseigner l’en-tête :
   - `slug` : l’adresse de l’article (`/journal/caravage-a-rome`), en minuscules, sans accents ni espaces ;
   - `status` : `draft` tant que l’article n’est pas validé, `published` pour le mettre en ligne ;
   - `date` : AAAA-MM-JJ ;
   - `title_fr` / `title_en`, `excerpt_fr` / `excerpt_en`, `theme_fr` / `theme_en` ;
   - `cover` (facultatif) : identifiant d’une photo de `src/data/photos.json` (par exemple `platine-vinyle`) ;
   - `author` (facultatif).
3. Écrire le texte français après `::: fr` et le texte anglais après `::: en`.
   Mise en forme disponible : `## Intertitre`, `*italique*`, `**gras**`, `[lien](/page)`, `> citation`, listes `- `,
   et `![identifiant-photo]` seul sur une ligne pour insérer une photo du site.
4. Vérifier en local : `node tools/build.mjs --drafts --out=/tmp/apercu` puis `npx serve /tmp/apercu`.
5. Passer `status: published`, lancer `node tools/build.mjs`, vérifier, puis valider (commit).

Les brouillons ne sont jamais copiés dans `public/` par la commande de publication.
Une nouvelle photo doit d’abord être ajoutée à `src/data/photos.json` puis traitée par `tools/images.py`.
