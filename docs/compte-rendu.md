# Évolution de la maquette — compte rendu (novembre 2026)

Travail réalisé à partir des deux messages d’Eléna Déliot (27 octobre et 5 novembre 2026), du document bilingue `TextesitinternetOS2026corrigé.docx`, du moodboard, des logos (`logoLNA.ai`, `logoLNA bonne résolution .jpg`, `MonogrammeOS.png`), des deux cartes de playlists (`Square print.pdf`, capture de la carte Paris) et du dossier PHOTOS (70 originaux).
Les pièces préparatoires et les échanges privés **ne sont pas** dans le dépôt ni dans le site publié.

## 1. Inventaire des pièces

| Pièce | Accès | Usage |
|---|---|---|
| Document bilingue (Word + extraction texte) | lu intégralement | textes FR / EN de toutes les pages |
| Deux messages de la cliente | lus | demandes et priorités ; la partie facturation n’est pas du contenu |
| Moodboard | examiné | inspiration seulement : ni cadres dorés, ni faux logo doré, ni recopie |
| `logoLNA.ai` | converti | logo vectoriel propre (`static/img/brand/logo-*.svg`, et intégré en ligne), dessin et proportions d’origine, point rouge `#BE0B1C` du fichier |
| Logo JPG | examiné | contrôle visuel de la conversion |
| `MonogrammeOS.png` | détouré | favicons ; proportions conservées (mise au carré par ajout de marge, sans déformation) |
| `Square print.pdf` | rendu | illustration de Dean Dorat (page 1) sur la sélection festive ; QR code → `/playlist` |
| Capture carte Paris | lue | QR code → `/playlistparis`, textes « À écouter / For your ears » |
| PHOTOS : 53 Event, 16 Graphisme, 1 portrait | 70/70 lisibles | dérivés AVIF + WebP |

**Non accessibles depuis ce poste** (réseau du conteneur filtré) : `www.loeilsingulier.com` (site actuel, lecteurs des playlists, témoignages en ligne), `www.wix.com` et `support.wix.com` (conditions de Wix Music). Rien n’a été inventé pour combler ces pièces ; voir § 8.

## 2. Architecture

Site statique multipage, sans framework (comme avant). Un petit générateur Node **sans dépendance** assemble les pages à partir d’un gabarit commun :

- `src/site.mjs` : en-tête, menu, pied de page, aides bilingues, images responsives, carte, bandeau R.S.V.P. ;
- `src/pages/*.mjs` : une page par fichier (textes FR et EN côte à côte) ;
- `src/journal.mjs` + `content/journal/*.md` : journal (blog) ;
- `static/` : CSS, JS, polices, images dérivées ;
- `tools/build.mjs` → `public/` (servi par Vercel, `vercel.json` : `buildCommand` + `outputDirectory`) ;
- `tools/images.py` : dérivés des originaux (non versionnés) ;
- `tools/verifier.mjs` et `tools/test-navigateur.cjs` : contrôles.

Les URL existantes sont conservées (`/evenementiel`, `/design-graphique`, `/galerie`, `/agence`, `/references`, `/son`, `/contact`, `/mentions-legales`), plus `/journal`, `/playlist`, `/playlistparis`. Redirection `/blog` → `/journal`. Bibliothèques conservées : GSAP, ScrollTrigger, SplitText, Lenis. Retirés : dorure WebGL (OGL), images d’ambiance générées par IA de la maquette précédente, anciennes photos et réalisations remplacées par la sélection de la cliente.

## 3. Direction artistique

- **Palette** : encre `#121012`, crème `#F3ECE0`, papier `#FBF8F2`, rouge profond `#A3111C` (texte sur crème, contraste 6,9:1), aplat `#6B0B14`, point rouge du logo `#BE0B1C` (et `#DA3340` sur fond sombre), doré mat `#C2A36B` réservé aux petits libellés sur fond sombre. **Aucun bleu structurel** (le bleu des photographies et des créations n’est pas retouché).
- **Typographie** : Bodoni Moda (didone, cohérente avec le dessin du logo) pour les titres, Hanken Grotesk pour le texte et les libellés. Pas d’écriture manuscrite.
- **Rythme** : alternance de séquences encre / crème / papier et un aplat rouge pour l’appel au contact ; compositions éditoriales (colonnes décalées, grands titres, listes typographiques) plutôt que des cartes identiques.
- **L’œil, réinterprété** : une amande tracée d’un seul trait dont la pupille est le point rouge ; elle suit discrètement le pointeur au premier écran (désactivé en mode calme), apparaît sur le portrait, dans le menu, la page 404 et le journal vide, et sert de découpe photographique sur la section Signature. Le logo officiel n’est jamais modifié.
- **Point rouge** : puces des libellés, navigation active, carte (implantations), point qui accompagne le pointeur sans masquer le curseur système.
- **Retirés** : grands aplats bleus, cadres et filets dorés, dorure en relief et ombres métalliques, texture de parchemin.
- **Conservés et retravaillés** : enveloppe qui s’ouvre (noire, cachet rouge) au premier passage, rabat de transition entre pages, six temps, carte Paris ⇄ Londres et horloges, carton R.S.V.P. et enveloppe de confirmation, galerie horizontale, bascule FR / EN, mode calme.

## 4. Correspondance des 14 rubriques du document

| Rubrique | Page(s) |
|---|---|
| 01 Accueil (accroche, sous-titre, 2 paragraphes, bouton) | Accueil : premier écran + introduction |
| 02 Philosophie — L’art de recevoir | Accueil |
| 03 Expertise — Une expertise qui fait la différence (+ citation) | Événementiel (ouverture + citation) ; extrait sur l’Accueil |
| 04 Notre signature — Une certaine idée de l’élégance | Accueil |
| 05 Notre rôle — Une agence qui comprend votre univers | Événementiel |
| 06 Six temps (6 étapes) | Événementiel |
| 07 Les talents — Une équipe sur mesure (7 talents) | Événementiel ; rappel des 7 talents sur L’agence |
| 08 À propos — biographie complète, signature | L’agence, avec le portrait `ElenaDeliotportrait.png` |
| 09 Clients — De belles collaborations (35 noms) | Références ; défilement des 35 noms sur l’Accueil |
| 10 Paris ⇄ Londres, adresses, 8 villes | Accueil et Contact (carte, horloges) ; adresses dans le pied de page de toutes les pages |
| 11 Design graphique | Design graphique ; extrait sur l’Accueil |
| 12 Galerie / Réalisations | Galerie ; aperçu sur l’Accueil |
| 13 Le son | Le son (+ pages `/playlist` et `/playlistparis`) |
| 14 Contact / R.S.V.P. (+ ligne Budget) | Contact ; bandeau R.S.V.P. en fin de page |

Toutes les rubriques sont intégrées en entier, en français et en anglais britannique, sans coupe.

## 5. Corrections et ajouts éditoriaux

**Coquilles corrigées (sans changement de sens)**
- « partenaires de confiance,. » → « partenaires de confiance. » (03 FR)
- double espace « understanding of  the » (03 EN)
- « Quite a colorful combination! » → « colourful » (08 EN, orthographe britannique)
- répétitions parasites « ENGLISH — UK » (12, 13, 14) ignorées
- nom de l’agence : « l’oeil singulier » écrit « l’œil singulier », comme dans le logo et la carte Paris
- espaces insécables de la typographie française ajoutées automatiquement (avant « : ; ! ? » et dans les guillemets)
- accents d’interface harmonisés : « Eléna Déliot » (forme du document), « Fondatrice / Founder »

**Ajouts en anglais, non fournis dans le document (à valider par la cliente)**
- titre de la galerie : « A few fine stories in pictures. » pour « Quelques belles histoires en images. »
- intitulés des six temps : Listen · Find the venue · Awaken the palate · Create the atmosphere · Orchestrate the big day · Make the memory last
- talents : Art historian · Set designer · Graphic designer · Photographer · Technical director · Musicians · Artists
- titres de rubriques : The art of hosting (02), Expertise that makes the difference (03), A certain idea of elegance (04), An agency that understands your world (05), Six stages (06), A bespoke team (07), Rewarding collaborations (09)
- bouton du contact (14) : le libellé anglais n’est pas fourni ; reprise du libellé fourni pour l’accueil, « Tell us about your event »

**Libellés d’interface ajoutés** (navigation, formulaire, journal) : « Journal », « Inspirations et découvertes / Inspiration and discoveries », état vide du journal, « Invitations, cartes & éditions », « Papier & découpe », « Quelques mots de clients », étapes du formulaire, budget. Aucun propos n’est attribué à Eléna.

**Différences FR / EN laissées telles quelles (non réécrites)**
- 01 : le français cite « les banques, les institutions financières » ; l’anglais ne les cite pas.
- 05 : l’anglais cite « banks and financial institutions » ; le français ne cite que les cabinets d’avocats et les structures de conseil.
- 02, 04, 07, 08 : nuances de formulation propres à chaque langue, conservées.

**Rien n’a été raccourci.** Aucune proposition de réduction n’a été nécessaire.

## 6. Photographies

Les 70 originaux ont été examinés sur planches contact, puis convertis : sRGB (profils Display P3 des iPhone convertis), orientation EXIF appliquée (dont le HEIC 3024 × 4032, décodé et redressé), métadonnées retirées, AVIF + WebP en 3 à 5 largeurs plafonnées à l’original, `<picture>` avec `width`/`height`, `sizes`, point focal (`object-position`) et chargement différé hors premier écran. Le GIF `32_dsc0191.gif` (3 images) devient une petite séquence en trois étapes, pilotée par boutons, avec lecture facultative (masquée en mode calme). Les images de faible définition (`Disco.jpg`, `IMG_5739.jpg`, `Toulouse.jpg`, `Voeux2017.jpg`) restent en petit format dans les grilles et ne sont jamais agrandies au-delà de leur taille réelle dans la visionneuse.

| Où | Photographies |
|---|---|
| Accueil, premier écran | `IMG_7707.jpeg` (table dans un salon doré, lumière ambrée : hospitalité et clair-obscur), portrait 3024 × 4032 |
| Accueil | `DinnerParisHD (1).jpg`, `0626-06704.jpg` (philosophie) ; `IMG_3964.jpeg` (signature, découpe en amande) ; `Projet__1838.jpg`, `elena-mockup.jpeg` (deux métiers) ; galerie horizontale de 8 vues |
| Événementiel | `bourse.jpg` (ouverture), `BNF-5010.jpg` (rôle), une photo par étape des six temps, `saxophonist (1).jpg` (talents) |
| L’agence | `ElenaDeliotportrait.png` (noir et blanc), `Capitole 2026-08580.jpg` (musées, Caravage), `IMG_9526.jpeg` (vinyle, noir et blanc), `DinnerParisHD (1).jpg` (la table) |
| Design graphique | les 16 pièces du dossier Graphisme, couleurs d’origine, sans recadrage (`object-fit: contain` sur fond papier), visionneuse avec zoom ; `elena-mockup.jpeg` en ouverture |
| Galerie | les 53 photos Event, filtrables (Lieux, Tables & saveurs, Musique, Scène & lumière, Détails) |
| Le son | `IMG_9526.jpeg`, illustration de Dean Dorat |
| Contact | `2024-00229.jpg` |

**Légendes** : seuls des textes alternatifs décrivant ce qui est visible, en FR et en EN. Aucun lieu, date, client ou crédit n’a été déduit des noms de fichiers (`bourse`, `BNF`, `Capitole`, `Zedel`, `London`, `Toulouse` ne sont pas cités). La galerie est présentée comme « un aperçu de notre univers » (texte de la cliente) : les images d’inspiration (étiquette de vin, club de jazz, platine…) ne sont pas présentées comme des événements de l’agence.

**À confirmer par la cliente** : `Atrium événementiel baigné de vert.png` et `Duo musical glamour en fête.png` n’ont aucune métadonnée et ont un format typique d’images retouchées ou générées ; leur origine est à confirmer avant mise en ligne. Les noms des photographes sont à fournir pour les crédits.

## 7. Contrôles réalisés et résultats

| Contrôle | Résultat |
|---|---|
| `node tools/build.mjs` | 13 pages générées, aucune erreur |
| `node tools/verifier.mjs` (contenus, liens, médias, pièces privées) | 1 484 contrôles réussis, 0 échec |
| `node tools/test-navigateur.cjs` (Chromium) | 46 tests réussis, 0 échec : bascule FR/EN sans perte d’état du formulaire, budget et devise conservés jusqu’au récapitulatif et à l’e-mail prérempli, « À définir », aucune requête sortante ni envoi, anciens liens profonds `#affaires #contrat #equipes #anniversaire #graphisme`, Tab → lien d’évitement, focus visible, menu (ouverture, Échap, focus rendu, contenu inerte), aucun son au chargement, mouvement réduit (pas d’enveloppe, galerie non épinglée, séquence statique), enveloppe au premier passage, 8 villes dont 2 implantations, horloges Paris / Londres justes et 1 h d’écart, filtres et visionneuse au clavier, routes `/playlist` (12 titres) et `/playlistparis` (22 titres), `?lang=en` sans texte français visible |
| Captures pleine page, 13 pages × FR / EN × 375, 768, 1440 px (et 390 px) | examinées après chargement des polices et des images ; aucun débordement horizontal ni texte français visible en anglais ; corrections apportées (voir historique des commits) |
| Routes servies localement | 200 pour toutes les pages, 404 pour une adresse inconnue |

Le changement d’heure est géré par `Intl` avec les fuseaux `Europe/Paris` et `Europe/London` (France et Royaume-Uni changent d’heure le même jour : l’écart reste d’une heure). Testé à la date du jour seulement.

## 8. Points externes non résolus (à fournir ou à valider)

1. **Droits musicaux et migration Wix Music** : voir `docs/son-et-qr-codes.md`. Le lien d’écoute est provisoire en prévisualisation ; un lecteur pérenne doit être choisi et autorisé avant la bascule du domaine.
2. **Envoi du formulaire** : aucun traitement d’envoi n’existe dans le dépôt. La page l’indique (« Démonstration ») et propose d’ouvrir un e-mail prérempli dans la messagerie du visiteur. Pour un envoi réel, il faut choisir un service (formulaire hébergé, fonction serveur avec service d’e-mail) : non provisionné.
3. **Site actuel et témoignages** : `www.loeilsingulier.com` n’était pas joignable depuis ce poste. Les six témoignages (originaux et traductions marquées « proposée ») et les listes de titres viennent de la maquette précédente ; leur source est à reconfirmer avant mise en ligne.
4. **Anciennes URL Wix** : l’inventaire des adresses du site actuel (hors `/playlist` et `/playlistparis`) n’a pas pu être fait ; à exporter avant la bascule pour compléter les redirections de `vercel.json`.
5. **Traductions ajoutées** (§ 5), **origine des deux PNG** et **crédits photo** (§ 6) à valider.
6. **Journal** : aucun article fourni ; la page affiche un état vide. Mode d’emploi : `content/journal/LISEZMOI.md`. Le modèle `modele-brouillon.md` n’est jamais publié.
7. **Mentions légales** : forme juridique, immatriculation, directeur de la publication, durée de conservation à compléter.
8. Aucun changement de domaine, de DNS ni du site Wix n’a été fait.
