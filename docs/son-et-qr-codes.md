# Le son, les playlists et les QR codes

Note de travail, novembre 2026. Ce document sépare **ce qui a été vérifié techniquement** de **ce qui reste à confirmer** (droits, migration). Ce n’est pas un avis juridique.

## 1. Les deux QR codes déjà distribués

| Support imprimé | Adresse encodée dans le QR code | Page dans cette maquette | Contenu |
|---|---|---|---|
| Carte « Square print » (visuel de Dean Dorat) | `https://www.loeilsingulier.com/playlist` | `/playlist` | Sélection festive « Elena Mix », 12 titres, crédits Patrick Clark (mix) et Dean Dorat (illustration) |
| Carte « À écouter / For your ears — Paris » | `https://www.loeilsingulier.com/playlistparis` | `/playlistparis` | Sélection Paris, 22 titres |

Les adresses ont été lues dans les pièces jointes (PDF et capture). Les QR codes ne sont **pas** régénérés : les deux chemins exacts sont conservés comme **pages dédiées** (`public/playlist.html`, `public/playlistparis.html`, servies sans extension grâce à `cleanUrls`). Aucune redirection vers l’accueil.

Testé (`tools/test-navigateur.cjs`) : les deux routes répondent 200, affichent la bonne sélection (12 et 22 titres) et proposent le lien d’écoute correspondant.

## 2. Ce que la maquette fait aujourd’hui pour l’écoute

- **Aucun enregistrement n’est hébergé, extrait ni réhébergé** dans le dépôt ou le site.
- **Aucune lecture automatique.** La seule source sonore du site est l’« ambiance » de la page Le son, générée en direct par le navigateur (Web Audio, aucune œuvre enregistrée), qui ne démarre qu’au clic et s’arrête en quittant la page ou en suivant un lien d’écoute : pas de superposition de sources.
- En prévisualisation (domaine `*.vercel.app`), chaque page de playlist affiche un **lien provisoire clairement identifié** « Écouter sur le site actuel » vers `https://www.loeilsingulier.com/playlist` ou `/playlistparis`.
- **Sur le domaine définitif, ce lien deviendrait circulaire** : il est automatiquement masqué quand le site tourne sur `loeilsingulier.com`, et remplacé par la mention « Le lecteur de cette sélection est en cours de migration ». Cela évite un lien cassé, mais **ne résout pas la migration** : sans action, les visiteurs qui scannent les QR codes après la bascule verront la liste des titres sans pouvoir écouter.

## 3. Constats techniques et limites de vérification

- D’après le dossier préparatoire, la page `/playlist` du site actuel présente un lecteur **Wix Music** intitulé « Elena Mix ». La nature exacte du lecteur de `/playlistparis` n’a pas pu être vérifiée.
- **Ce conteneur de travail n’a pas pu accéder à `www.loeilsingulier.com`, `www.wix.com` ni `support.wix.com`** (réseau filtré) : les deux lecteurs actuels et les conditions officielles de Wix Music **n’ont pas été consultés dans cette session**. Les listes de titres et les crédits proviennent de la maquette précédente.
- Un widget Wix Music fonctionne à l’intérieur d’un site Wix ; il ne faut pas supposer qu’il puisse être copié ou intégré tel quel sur un site hébergé par Vercel, ni qu’une URL technique de fichier audio Wix soit pérenne.

## 4. À décider et à faire avant la bascule du domaine

1. **Choisir le mode d’écoute pérenne** pour chaque sélection, par exemple : playlist publique sur un service de diffusion qui propose un lecteur intégrable officiel (Spotify, Apple Music, Deezer…), ou simple lien vers ce service. Dans tous les cas, remplacer le bloc `listen()` de `src/pages/son.mjs` par le lecteur ou le lien choisi, **sans lecture automatique**.
2. **Conserver les deux chemins** `/playlist` et `/playlistparis` sur le futur site (déjà en place ici). Ne pas modifier les QR codes.
3. Tant que l’ancien site Wix reste en ligne, ne pas supprimer ses pages de playlist.
4. Tester sur le domaine définitif, téléphone en main, en scannant les deux cartes imprimées.
5. Ne pas changer le DNS ni le domaine sans validation de la cliente (non fait dans ce travail).

## 5. Questions juridiques précises à faire confirmer

À poser à un conseil (droit d’auteur / droits voisins) et, pour la partie technique, au support Wix. Rien ici ne doit être lu comme une autorisation.

**Sur la sélection festive « Elena Mix » (Wix Music, mix de Patrick Clark)**
1. Les 12 enregistrements sont des œuvres d’autres artistes (labels tiers). Sur quelle base l’agence diffuse-t-elle ce mix : licence obtenue, accord des ayants droit, ou aucune ? Qui détient les droits du mix lui-même (Patrick Clark, l’agence) ?
2. Les conditions de Wix Music autorisent-elles la mise en ligne d’enregistrements dont l’utilisateur n’est pas titulaire des droits ? (À vérifier dans les conditions d’utilisation officielles de Wix et de Wix Music, non consultables depuis ce poste.)
3. La diffusion en écoute d’un mix d’artistes tiers sur le site d’une entreprise, à des fins de promotion de ses services, relève-t-elle d’une déclaration ou d’une licence (SACEM/SCPP/SPPF en France, PRS/PPL au Royaume-Uni) ? Le fait d’avoir distribué des QR codes en version imprimée change-t-il l’analyse ?
4. En cas de migration hors de Wix : l’agence a-t-elle le droit de récupérer et réhéberger ce fichier audio ? (Par défaut, **ne pas le faire**.)

**Sur la sélection Paris (22 titres)**
5. Si l’écoute passe par une playlist publique d’un service de diffusion, les conditions de ce service autorisent-elles son intégration (lecteur officiel) sur un site commercial ? Faut-il un compte au nom de l’agence ?
6. La simple liste des titres et artistes affichée sur le site pose-t-elle une question de droits ? (Usage courant, à confirmer.)

**Sur l’illustration**
7. L’illustration de Dean Dorat (deandorat.co.uk) peut-elle être utilisée sur le site, en grand, avec le crédit affiché ? Le contrat ou l’accord couvre-t-il le web ?

**Sur l’ambiance générée**
8. L’ambiance Web Audio est composée par le code du site (aucun échantillon). Aucun droit tiers identifié ; à confirmer si la cliente souhaite la conserver.
