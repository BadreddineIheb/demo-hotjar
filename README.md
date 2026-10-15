# Démo Hotjar — site « SommeilExpress »

Site statique (HTML/CSS/JS, sans serveur) conçu pour **montrer ce que Hotjar révèle**.
SommeilExpress est une marque fictive et parodique (« on te livre des heures de sommeil »), pensée pour faire rire une salle d'étudiants. Le site contient volontairement **4 défauts d'ergonomie**
que Hotjar va mettre en évidence pendant la démo.

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil longue (scroll), pleine de blagues étudiantes |
| `offres.html` | 3 formules (Sieste Flash, Pack Partiels, Nuit Complète) + un lien mort |
| `inscription.html` | Formulaire volontairement pénible |
| `style.css` | Mise en forme |
| `app.js` | Consentement RGPD + chargement Hotjar + événements + validation du formulaire |

---

## Les 4 pièges (et ce que Hotjar doit montrer)

| # | Piège | Où | Outil Hotjar qui le révèle |
|---|---|---|---|
| 1 | Badge « 😴 Dormir maintenant » qui **ressemble à un bouton** mais n'est pas cliquable | Accueil, en haut | **Heatmap de clics** : tache rouge sur un élément inerte (« dead clicks » / « rage clicks ») |
| 2 | Le **seul vrai bouton d'action** est tout en bas de la page | Accueil, en bas | **Scroll map** : on voit qu'une faible part des visiteurs descend jusque-là |
| 3 | Téléphone exigé au format exact `06 12 34 56 78` (avec espaces), message vague « Champ invalide. Va dormir et réessaie. » | Inscription | **Recordings** : on voit l'utilisateur retaper le champ, hésiter, abandonner |
| 4 | Lien « Comparer les formules » qui **ne mène nulle part** | Offres | **Heatmap** + **Recordings** (clic sans effet) |

Le formulaire envoie aussi des **événements Hotjar** (`form_error`, `form_success`,
`dead_click_badge`, `dead_click_compare`, `cta_bottom_click`, `plan_flash`, `plan_partiels`, `plan_nuit`) : dans Hotjar,
on peut **filtrer les enregistrements** par événement (« montre-moi uniquement les
sessions avec `form_error` »). C'est un excellent moment de démo.

### Points RGPD / vie privée intégrés (à mentionner à l'oral)
- **Bandeau de consentement** : Hotjar n'est chargé **qu'après** un clic sur « Accepter »
  (voir `loadHotjar()` dans `app.js`). Sans consentement → aucune donnée.
- **`data-hj-suppress`** sur les champs personnels : dans les enregistrements, leur contenu
  apparaît masqué (`*****`). À montrer en rejouant une session du formulaire.
- Lien « Gérer les cookies » en pied de page pour retirer son consentement.

---

## Étape 1 — Mettre le site en ligne (GitHub Pages, gratuit)

Hotjar a besoin d'une **URL publique** : il ne fonctionne pas correctement sur un fichier
ouvert en local ni sur `localhost`.

1. Crée un compte sur https://github.com (si tu n'en as pas).
2. **New repository** → nom : `demo-hotjar` → **Public** → *Create repository*.
3. *uploading an existing file* → glisse les 5 fichiers (`index.html`, `offres.html`,
   `inscription.html`, `style.css`, `app.js`) → *Commit changes*.
4. **Settings → Pages** → *Source* : `Deploy from a branch` → Branch `main`, dossier `/ (root)` → *Save*.
5. Après 1–2 minutes, le site est à : `https://<ton-pseudo>.github.io/demo-hotjar/`

*(Alternative : Netlify — https://app.netlify.com/drop — glisser le dossier, créer un compte pour garder le site.)*

## Étape 2 — Créer le site dans Hotjar

1. Crée un compte gratuit sur https://www.hotjar.com.
2. Ajoute un site avec l'URL GitHub Pages ci-dessus.
3. Récupère le **Site ID** (nombre à ~7 chiffres, visible dans *Sites & Organizations*
   ou dans le code de suivi proposé : `hjid:XXXXXXX`).
4. Dans `app.js`, ligne `const HOTJAR_ID = 0;` → remplace `0` par ton Site ID.
5. Ré-uploade `app.js` sur GitHub (glisser-déposer → *Commit changes*).
6. Ouvre ton site, clique **Accepter** sur le bandeau, puis dans Hotjar lance la
   **vérification de l'installation** (bouton *Verify installation*).

> Si Hotjar te donne un code de suivi d'une autre forme (par ex. une balise Contentsquare),
> dis-le-moi : on adaptera `loadHotjar()`.

## Étape 3 — Configurer dans le tableau de bord Hotjar (sans code)
- **Heatmaps** et **Recordings** : activés automatiquement une fois le script installé.
- **Survey** (optionnel) : crée un sondage affiché sur `inscription.html`, par ex.
  *« Qu'est-ce qui vous a empêché de finir votre inscription ? »*
- **Feedback widget** (optionnel) : le petit onglet « Feedback » sur le côté avec des émojis.

## Étape 4 — Générer des données AVANT la présentation
Les heatmaps ont besoin de plusieurs visites, et les données mettent un peu de temps
à apparaître. **Quelques jours avant** :
- Envoie le lien à 5–10 camarades/amis avec la consigne : *« Commande le Pack
  Partiels »* (sans rien dire des pièges) — sur PC **et** sur téléphone.
- Fais toi-même quelques sessions « réalistes » (cliquer sur le badge, se tromper au téléphone…).

---

## Scénario de démo suggéré (le jour J)

1. **Montrer le site** 30 s : « un site e-commerce (parodique) en apparence correct ».
2. **Heatmap de l'accueil** → la tache sur le faux bouton : *« les gens cliquent là où rien ne se passe »*.
3. **Scroll map de l'accueil** → *« seulement X % voient le bouton d'action »*.
4. **Filtrer les recordings par l'événement `form_error`** → rejouer une session :
   on voit la galère sur le téléphone… et les champs masqués (`*****`) → transition RGPD.
5. **Conclusion GL** : les tests JUnit/Selenium vérifient que le site *fonctionne* ;
   Hotjar montre qu'il est *mal utilisable*. Chaque problème trouvé → une nouvelle
   Issue GitLab orientée valeur utilisateur.

**Bonus live** : affiche un QR code du site au début de l'exposé pour que la classe
navigue dessus pendant que tu parles. Note que les données peuvent ne pas apparaître
instantanément : garde tes données préparées pour la démo principale.

**Plan B** : fais des captures d'écran / une courte vidéo de la démo au cas où le
réseau de la salle ne marche pas.
