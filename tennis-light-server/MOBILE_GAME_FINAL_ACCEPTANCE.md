# Recette finale smartphone — Tennis Courts Academy v3.8

Date : 24 juillet 2026  
Révision technique testée : `3.8.3`

## Verdict

La nouvelle interface smartphone est fonctionnellement prête pour une
prépublication. Aucun écart de règle ou de résultat moteur n'a été constaté.
Une correction de libellé a été appliquée pendant la recette : le bouton
principal demande désormais de « Choisir un mode de jeu » lorsqu'une carte
propose plusieurs modes, au lieu de mentionner à tort uniquement Effet/Remise.

La publication publique reste conditionnée à une passe sur appareils iOS et
Android réels et à une recette multijoueur avec deux comptes et deux appareils.

## Matrice de recette

| Domaine | Résultat | Contrôle |
|---|---|---|
| Score, sets et serveur | Succès | Score accessible, serveur nommé et indiqué sans dépendre uniquement de la couleur |
| Informations joueurs | Succès | Identité, endurance, cartes, couleurs et bonus lisibles |
| Confrontation de puissance | Succès | Valeurs moteur, icône éclair, vainqueur textuel |
| Sélection / remplacement / Annuler | Succès | Sélection visible, remplacement et annulation sans mutation moteur |
| Coût, puissance, placement, effets | Succès | Aperçu fourni par `app.js`; cas réel Lob : coût 1, puissance +2, récupération +1 |
| Carte incompatible | Succès | Carte grisée/verrouillée et dialogue explicitant la raison |
| Boost | Succès | Modes Coup/Boost, choix du sacrifice et coût réel exposés |
| Effet / Remise et cumul | Succès | Modes distincts et enchaînement de cartes avant le coup couvert |
| Validation / double appui | Succès | Un seul retrait de carte et une seule résolution après double clic |
| Résolution / animations | Succès | Verrou, deltas, dernière carte et état final cohérents |
| Réduction des animations | Succès | Chemin `reduceMotion=1` et garde `prefers-reduced-motion` validés |
| Tour adverse / Continuer | Succès | Carte persistante, main verrouillée, aucune fermeture automatique |
| Bonus | Succès | Feuille accessible, fermeture Échap et synchronisation non bloquée |
| Historique | Succès | Coûts, puissances, effets, bonus et cartes en ordre récent |
| Dernière carte | Succès | Détail ouvrable et fermeture avec retour du focus |
| Sortie | Succès | Conséquence explicite, annulation et confirmation distinctes |
| Fin d'échange | Succès | Résultat, couleur, score et action « Échange suivant » |
| Fin de set / match | Succès automatisé | États et actions de progression couverts par les tests de modes |
| Entraînement / tutoriel | Succès automatisé | Étapes, progression, sauvegarde et commandes guidées |
| IA / échange libre / set / match | Succès | Parcours réel IA plus couverture automatisée |
| Tournoi / Circuit Pro / League | Succès automatisé | États, classements et progression couverts |
| Club House / amical | Succès automatisé | Retour contextuel et sauvegarde couverts |
| En ligne / spectateur | Succès automatisé | Siège, lecture seule, masquage de main et synchronisation couverts |
| Reconnexion / restauration | Succès automatisé | Révision distante, restauration et non-répétition des animations |
| Multijoueur distant réel | Non testable localement | Nécessite deux comptes, deux appareils et l'infrastructure distante |
| Reprise authentifiée de compétition | Non testable localement | Nécessite une sauvegarde de production et un compte autorisé |
| Contrôles administrateur | Non testable localement | Nécessite un compte administrateur; aucun contrôle public ajouté |
| Accessibilité | Succès navigateur | Focus, Échap, annonces, rôles, libellés et cibles 44 × 44 |
| Lecteurs d'écran natifs | Non testable localement | VoiceOver et TalkBack à valider sur appareils réels |
| 320 / 360 / 375 / 390 / 430 px | Succès | Aucun débordement horizontal et aucune cible visible sous 44 px |
| Paysage smartphone | Succès | Vue mobile conservée, Desktop masqué, invitation au portrait |
| Zones sûres réelles | Succès structurel | `viewport-fit=cover` et quatre insets présents; encoche réelle à valider sur appareils |
| Tablette 768 px | Succès | Interface historique chargée, interface mobile masquée |
| Desktop 1280 px | Succès | Interface historique chargée, largeur exacte, aucun style mobile visible |
| Parité moteur | Succès | Le mobile appelle les mêmes `playCard`, `endTurn`, coûts et aperçus que Desktop |

## Tests automatisés

- 21 contrôles ciblés mobile, modes, tutoriel, IA et restauration : tous réussis.
- Suite complète : 62 fichiers exécutés, 25 réussis et 37 arrêtés.
- 34 tests historiques s'arrêtent sur des assertions de version ou d'URL de
  cache anciennes (`v148`, `v169`, `2.169.x`, `3.5.0`).
- `v143-ai-logging.mjs` attend encore le stockage `V1`, remplacé par `V2`.
- `v143-rankia-circuit.mjs` exécute une fonction isolée sans injecter la
  constante `HUMAN_TOURNAMENT_ENTRY` dont elle dépend désormais.
- `v143-smoke.mjs`, exécuté avec son serveur sur le port 3029, attend une
  réponse HTTP 400 pour une télémétrie refusée alors que le serveur renvoie
  désormais 403.

Ces trois derniers écarts concernent les bancs de test historiques. Aucun ne
provient de l'interface mobile, mais ils empêchent d'utiliser la suite complète
comme barrière de publication tant que les contrats attendus ne sont pas
réalignés.

## Comparaison Desktop / Tablette

- Aucun changement de `public/styles.css` entre `v3.7` et la révision testée.
- `public/mobile-game.css` ne contient aucun sélecteur `.game-app`.
- À 768 et 1280 px, `.mobile-game-app` est masquée et `.game-app` reste active.
- Les commandes historiques Effet, Remise, Boost, Passer et agrandissement des
  cartes restent présentes dans le DOM accessible.

## Correction effectuée

- Remplacement du libellé trompeur « Choisissez Effet ou Remise » par
  « Choisissez un mode de jeu » pour toutes les cartes multimodes.
- Ajout d'une assertion automatisée sur ce libellé.
- Incrément de la révision technique et des URLs de cache à `3.8.3`.

## Risques résiduels

1. Les scénarios réseau réels, spectateur distant et reconnexion multi-appareils
   ne peuvent pas être certifiés avec le serveur local seul.
2. VoiceOver, TalkBack, taille de texte système maximale, encoche et barre
   système doivent encore être contrôlés sur le matériel cible.
3. Les 37 tests historiques arrêtés ne constituent plus une barrière CI fiable
   tant que leurs attentes de version et leurs anciens contrats ne sont pas
   remis à niveau.
4. Les images de cartes WebP les plus lourdes approchent 240 Ko; surveiller le
   chargement sur réseau mobile ralenti malgré le chargement différé.

## Recommandations avant publication iOS / Android

1. Recetter sur au moins un iPhone avec encoche et un Android à découpe d'écran.
2. Effectuer un match en ligne complet entre deux appareils, puis couper et
   rétablir le réseau pendant un tour adverse et pendant une résolution.
3. Valider VoiceOver et TalkBack avec texte système maximal.
4. Exécuter un profil réseau « Slow 4G » et vérifier les cartes de première vue.
5. Réaligner les tests historiques avant d'activer une règle CI « suite verte
   obligatoire ».
6. Conserver un déploiement progressif et surveiller erreurs JavaScript,
   abandons pendant la résolution et reprises de salon.
