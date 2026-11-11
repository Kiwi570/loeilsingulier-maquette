# l’œil singulier · maquette (direction « Clair-obscur »)

Maquette du futur site de l’œil singulier : événementiel et design graphique, Paris et Londres.
Encre, crème, rouge profond et quelques touches de doré mat ; textes FR / EN fournis par la cliente en novembre 2026.

Site statique multipage, sans framework. Un petit générateur Node (aucune dépendance) assemble les pages dans `public/`, que Vercel publie (`vercel.json`).

## Commandes

```bash
node tools/build.mjs
```

```bash
npx serve public -l 4173
```

```bash
node tools/verifier.mjs
```

Tests navigateur (Playwright requis, avec le serveur local lancé) :

```bash
node tools/test-navigateur.cjs http://localhost:4173
```

Dérivés d’images à partir des originaux de la cliente (non versionnés ; Pillow ≥ 11 et pillow-heif) :

```bash
python3 -I tools/images.py /chemin/vers/PHOTOS
```

## Organisation

| Dossier | Contenu |
|---|---|
| `src/site.mjs` | gabarit commun : en-tête, menu, pied de page, carte, R.S.V.P., aides bilingues et images |
| `src/pages/` | une page par fichier, textes FR et EN côte à côte |
| `src/data/photos.json` | sélection des photos, textes alternatifs FR / EN, points focaux |
| `content/journal/` | articles du journal en Markdown (voir `LISEZMOI.md`) |
| `static/` | CSS, JS, polices, images dérivées (copiés tels quels dans `public/`) |
| `tools/` | génération, images, contrôles |
| `docs/` | compte rendu, son et QR codes |

## Pages

Accueil, Événementiel, Design graphique, Galerie, L’agence, Références, Le son, Journal, Contact, Mentions légales, 404, ainsi que `/playlist` et `/playlistparis` (adresses des QR codes déjà imprimés : ne pas les renommer).

## Accessibilité et préférences

Bouton FR / EN sans rechargement (la page et le formulaire gardent leur état ; `?lang=en` force l’anglais), mode « Calme » activé d’office si le système demande de réduire les animations, navigation au clavier, aucun son automatique.

Les points à fournir ou à valider sont listés dans `docs/compte-rendu.md`.
