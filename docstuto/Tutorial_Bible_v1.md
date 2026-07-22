# Tutorial_Bible.md

# Tennis Courts Academy

## Documentation de référence du tutoriel

**Version :** 1.0\
**Auteur :** Coach Ju / ChatGPT

------------------------------------------------------------------------

# 1. Objectif

Ce document définit les règles de conception du tutoriel de **Tennis
Courts Academy**. Il constitue la référence principale du projet.

Le tutoriel est **une fonctionnalité intégrée** à Tennis Courts Academy.
Il ne doit jamais être développé comme une application ou un site
distinct.

------------------------------------------------------------------------

# 2. Principe fondamental

Le tutoriel doit réutiliser l'application existante.

Ne pas recréer : - le plateau de jeu - les cartes - les règles - les
calculs - les composants existants

Le tutoriel ajoute uniquement : - une zone de dialogue Coach Ju - le
portrait de Coach Ju - des flèches de guidage - des mises en évidence -
des cartes agrandies - un moteur de progression par étapes

Avant toute implémentation, analyser le code existant et privilégier la
réutilisation des composants.

------------------------------------------------------------------------

# 3. Vision

Tennis Courts Academy est une académie d'entraînement.

Le joueur apprend en jouant.

Chaque écran introduit une seule notion.

Coach Ju accompagne le joueur tout au long des modules.

------------------------------------------------------------------------

# 4. Philosophie pédagogique

-   Une seule notion par étape.
-   Montrer avant d'expliquer.
-   Le joueur agit souvent.
-   Les erreurs sont pédagogiques, jamais punitives.
-   Les dialogues sont courts (2 à 4 phrases).

------------------------------------------------------------------------

# 5. Coach Ju

Coach Ju est le créateur de Tennis Courts.

Ton : - bienveillant - précis - enthousiaste - naturel

Il parle comme un entraîneur, jamais comme un manuel.

------------------------------------------------------------------------

# 6. Interface

Le plateau actuel est conservé.

Le tutoriel ajoute :

-   une zone de dialogue en bas de l'écran
-   le portrait de Coach Ju à gauche
-   des flèches de guidage
-   des cartes agrandies
-   des surbrillances

Le texte ne passe jamais sous le portrait.

------------------------------------------------------------------------

# 7. Responsive

Le comportement est identique sur PC, tablette et mobile.

Les repères visuels restent les mêmes.

------------------------------------------------------------------------

# 8. Guidage

Quand Coach Ju parle d'un élément :

-   il est visible
-   il est mis en évidence
-   le joueur ne cherche jamais où regarder

Quand une action est demandée :

-   une flèche indique précisément où cliquer.

------------------------------------------------------------------------

# 9. Architecture

Le tutoriel est composé de modules.

Chaque module est composé d'étapes.

Chaque étape décrit : - le dialogue - les éléments visibles - les
actions autorisées - les actions interdites - les validations - les
actions automatiques

Le moteur doit être générique afin d'ajouter facilement de nouveaux
modules.

------------------------------------------------------------------------

# 10. Objectif final

Le joueur doit terminer Tennis Courts Academy capable de jouer une
partie complète sans assistance.

Tous les futurs documents devront respecter cette Bible.
