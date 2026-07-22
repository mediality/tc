# Tutorial_System.md

# Tennis Courts Academy

## Architecture fonctionnelle du moteur de tutoriel

Version 1.0

------------------------------------------------------------------------

# Objectif

Le tutoriel est une extension de Tennis Courts Academy.

Il ne remplace jamais les composants existants.

Le moteur de tutoriel pilote simplement l'interface existante.

------------------------------------------------------------------------

# Analyse préalable (obligatoire)

Avant toute implémentation :

1.  Analyser le projet actuel.
2.  Identifier les composants existants.
3.  Réutiliser ces composants.
4.  Éviter toute duplication de logique.
5.  Présenter un plan d'intégration avant de modifier le code.

------------------------------------------------------------------------

# Principe

Le moteur ne contient aucune logique spécifique à un module.

Les modules sont des données.

Le moteur les interprète.

------------------------------------------------------------------------

# Structure d'un module

Chaque module contient :

-   Identifiant
-   Nom
-   Objectif
-   Conditions de démarrage
-   Liste d'étapes
-   Conditions de fin

------------------------------------------------------------------------

# Structure d'une étape

Chaque étape doit décrire :

## Objectif

Une seule notion pédagogique.

## Dialogue

Texte de Coach Ju.

## Interface

Décrire uniquement les éléments à afficher ou masquer.

## Mise en évidence

Liste des éléments à surligner.

## Carte agrandie

Optionnelle.

Peut afficher une carte et cibler une zone précise : - coût -
puissance - précision - placement - effet - boost

## Flèches

Peuvent pointer : - une carte - un bouton - une jauge - une zone de
carte

Une flèche disparaît dès que l'action attendue est réalisée.

## Actions autorisées

Liste blanche.

Toutes les autres actions sont ignorées ou expliquées.

## Réaction en cas d'erreur

Coach Ju explique pourquoi l'action n'est pas attendue.

Le joueur recommence immédiatement.

## Actions automatiques

Le moteur doit pouvoir déclencher automatiquement :

-   jouer une carte
-   passer
-   booster
-   terminer un tour
-   afficher un message
-   changer d'étape

## Validation

Une étape est validée uniquement lorsque la condition prévue est
satisfaite.

Exemples :

-   clic sur Suivant
-   carte jouée
-   boost effectué
-   bouton Passer

------------------------------------------------------------------------

# Etats du moteur

Le moteur doit mémoriser :

-   module courant
-   étape courante
-   progression
-   éléments affichés
-   éléments surlignés
-   flèches actives
-   cartes agrandies
-   actions autorisées

------------------------------------------------------------------------

# Contraintes

Le moteur ne doit jamais modifier les règles du jeu.

Toutes les actions passent par les systèmes existants de Tennis Courts
Academy.

Le tutoriel agit uniquement comme un contrôleur.

------------------------------------------------------------------------

# Extensibilité

Ajouter un nouveau module ne doit nécessiter aucune modification du
moteur.

Créer un nouveau fichier de module doit suffire.

------------------------------------------------------------------------

# Attentes vis-à-vis de Codex

Après lecture de ce document :

-   proposer l'architecture la plus adaptée au projet existant ;
-   expliquer les composants qui seront réutilisés ;
-   identifier les nouveaux composants nécessaires ;
-   attendre validation avant de commencer le développement.
