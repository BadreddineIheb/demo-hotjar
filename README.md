# Démo Microsoft Clarity — site « SommeilExpress »

Site statique (HTML/CSS/JS, sans serveur) conçu pour **montrer ce qu'un outil d'analyse
comportementale révèle**, ici **Microsoft Clarity** (gratuit : cartes de chaleur,
enregistrements de session, détection des clics de frustration).
SommeilExpress est une marque fictive et parodique (« on te livre des heures de sommeil »),
pensée pour faire rire une salle d'étudiants. Le site contient volontairement
**4 défauts d'ergonomie** que Clarity met en évidence pendant la démo.

- Site en ligne : https://badreddineiheb.github.io/demo-hotjar/
- Projet Clarity : `zazxdpjbht` (https://clarity.microsoft.com/projects/view/zazxdpjbht/dashboard)

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil longue (scroll), pleine de blagues étudiantes |
| `offres.html` | 3 formules (Sieste Flash, Pack Partiels, Nuit Complète) + un lien mort |
| `inscription.html` | Formulaire volontairement pénible |
| `style.css` | Mise en forme |
| `app.js` | Consentement RGPD + chargement de Clarity + événements + validation du formulaire |

---

## Les 4 pièges (et ce que Clarity doit montrer)

| # | Piège | Où | Ce qui le révèle dans Clarity |
|---|---|---|---|
| 1 | Badge « 😴 Dormir maintenant » qui **ressemble à un bouton** mais n'est pas cliquable | Accueil, en haut | **Heatmap de clics** + indicateurs **Dead clicks** / **Rage clicks** |
| 2 | Le **seul vrai bouton d'action** est tout en bas de la page | Accueil, en bas | **Scroll heatmap** : faible part des visiteurs descend jusque-là |
| 3 | Téléphone exigé au format exact `06 12 34 56 78` (avec espaces), message vague « Champ invalide. Va dormir et réessaie. » | Inscription | **Recordings** : l'utilisateur retape le champ, hésite, abandonne |
| 4 | Lien « Comparer les formules » qui **ne mène nulle part** | Offres | **Heatmap** + **Dead clicks** + **Recordings** |

Le site envoie aussi des **événements personnalisés** avec `clarity("event", nom)` :
`form_error`, `form_success`, `dead_click_badge`, `dead_click_compare`, `cta_bottom_click`,
`plan_flash`, `plan_partiels`, `plan_nuit`. Dans Clarity, le filtre **Custom events**
permet de n'afficher que les sessions avec `form_error`, par exemple.

### Points RGPD / vie privée intégrés (à mentionner à l'oral)
- **Bandeau de consentement** : Clarity n'est chargé **qu'après** un clic sur « Accepter »
  (voir `loadClarity()` dans `app.js`). Sans consentement → aucune donnée.
- **Signal de consentement `consentv2`** : depuis le 31/10/2025, Clarity l'exige pour les
  visiteurs de l'UE. Sans lui, chaque page vue devient une session isolée.
- **`data-clarity-mask="true"`** sur les champs personnels : leur contenu apparaît masqué
  dans les enregistrements. À montrer en rejouant une session du formulaire.
- Lien « Gérer les cookies » en pied de page pour retirer son consentement.

---

## Configuration

1. Le site est hébergé sur **GitHub Pages** (dépôt public `BadreddineIheb/demo-hotjar`,
   branche `main`, dossier racine). Clarity a besoin d'une **URL publique**.
2. Le projet Clarity est déclaré sur le domaine `badreddineiheb.github.io`.
3. Pour changer de projet : dans `app.js`, ligne `const CLARITY_ID = "...";`, puis
   ré-uploader `app.js` sur GitHub (*Add file → Upload files → Commit changes*).

## Générer des données AVANT la présentation
Les heatmaps ont besoin de plusieurs visites, et Clarity affiche les données avec
quelques minutes à quelques heures de délai. **Quelques jours avant** :
- Envoie le lien à 5–10 camarades/amis avec la consigne : *« Commande le Pack
  Partiels »* (sans rien dire des pièges), sur PC **et** sur téléphone.
- Demande-leur de cliquer sur **Accepter** dans le bandeau (sinon rien n'est enregistré).

---

## Scénario de démo suggéré (le jour J)

1. **Montrer le site** 30 s : « un site e-commerce (parodique) en apparence correct ».
2. **Heatmap de l'accueil** → la tache sur le faux bouton : *« les gens cliquent là où rien ne se passe »*.
3. **Scroll heatmap de l'accueil** → *« seulement X % voient le bouton d'action »*.
4. **Recordings filtrés sur l'événement `form_error`** → rejouer une session :
   on voit la galère sur le téléphone… et les champs masqués → transition RGPD.
5. **Conclusion GL** : les tests JUnit/Selenium vérifient que le site *fonctionne* ;
   l'analyse comportementale montre qu'il est *mal utilisable*. Chaque problème trouvé
   → une nouvelle Issue GitLab orientée valeur utilisateur.

**Plan B** : fais des captures d'écran / une courte vidéo de la démo au cas où le
réseau de la salle ne marche pas.
