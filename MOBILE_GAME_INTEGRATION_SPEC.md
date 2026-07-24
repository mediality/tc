# Spécification d’intégration — Interface de jeu mobile

## 1. Décision produit

L’interface mobile adopte la direction **A — Focus central**.

Elle constitue une vue dédiée aux smartphones en orientation portrait. Elle ne remplace pas, ne redimensionne pas et ne modifie pas les interfaces Desktop et Tablette.

Le moteur de jeu reste l’unique source de vérité pour :

- les règles ;
- les cartes disponibles ;
- les coûts ;
- la puissance ;
- l’endurance ;
- les placements ;
- les bonus et effets ;
- le score ;
- l’historique ;
- le joueur au service ;
- la résolution des tours.

La couche mobile ne réalise aucun calcul métier.

## 2. Séparation d’architecture

Structure cible, à adapter à la technologie réelle du projet :

```text
game-core/
  règles, calculs, commandes, événements et état du match

game-ui/
  desktop/
    interface existante — inchangée
  tablet/
    interface existante — inchangée
  mobile/
    MobileGameScreen
    composants mobiles
    animations de présentation
    gestes et accessibilité

game-assets/
  cartes, personnages, icônes et sons partagés
```

### Règle d’isolation

La sélection de l’interface doit se faire au niveau du point d’entrée de la vue de match :

- smartphone portrait : `MobileGameScreen` ;
- tablette : vue existante ;
- desktop : vue existante.

Les composants Desktop ne doivent pas recevoir de conditions ou de styles mobiles. Les composants mobiles ne doivent pas importer la mise en page Desktop.

## 3. Contrat minimal avec le moteur

La vue mobile consomme un état immuable équivalent à :

```ts
type MobileMatchViewState = {
  phase:
    | "PLAYER_TURN"
    | "CARD_SELECTED"
    | "PLAYER_CARD_RESOLVING"
    | "OPPONENT_CARD_REVEAL"
    | "WAITING_FOR_CONTINUE"
    | "MATCH_COMPLETE";

  score: {
    sets: Array<{
      player: number | null;
      opponent: number | null;
      winner: "PLAYER" | "OPPONENT" | null;
    }>;
    server: "PLAYER" | "OPPONENT";
  };

  player: MobilePlayerSummary;
  opponent: MobilePlayerSummary;

  confrontation: {
    playerPower: number;
    opponentPower: number;
    contextMessage?: string;
  };

  hand: MobilePlayableCard[];
  selectedCardId?: string;
  selectedCardPreview?: MobileCardPreview;
  activeCard?: MobileResolvedCard;
  lastPlayedCard?: MobileResolvedCard;
  exchangeHistory: MobileHistoryEntry[];
};
```

Chaque carte de la main doit exposer :

```ts
type MobilePlayableCard = {
  id: string;
  artwork: string;
  name: string;
  playable: boolean;
  unavailableReason?: string;
  recommendedPlacement: boolean;
  requiredPlacement: boolean;
};
```

Le moteur doit fournir l’aperçu calculé après sélection :

```ts
type MobileCardPreview = {
  realCost: number;
  realPower: number;
  effects: string[];
  resultingPlacement: string;
  appliedBonuses: string[];
};
```

## 4. Commandes envoyées au moteur

La vue mobile ne doit émettre que des intentions :

```ts
selectCard(cardId)
cancelCardSelection()
playSelectedCard()
acknowledgeOpponentCard()
requestExitMatch()
confirmExitMatch()
cancelExitMatch()
```

Les actions de présentation suivantes restent locales à l’interface :

```ts
openActiveBonuses()
closeActiveBonuses()
openExchangeHistory()
closeExchangeHistory()
expandLastPlayedCard()
collapseCardDetail()
```

## 5. Machine d’états de l’interface

```text
TOUR_JOUEUR
  → CARTE_SÉLECTIONNÉE
  → CONFIRMATION
  → CARTE_EN_MOUVEMENT
  → RÉSOLUTION
  → TOUR_ADVERSE
  → ATTENTE_CONTINUER
  → TOUR_JOUEUR
```

États superposables, sans modifier la phase métier :

- bonus actifs ;
- historique ;
- détail de la dernière carte ;
- explication d’une incompatibilité ;
- confirmation de sortie.

Pendant `CARTE_EN_MOUVEMENT` et `RÉSOLUTION`, les actions de jeu sont verrouillées afin d’éviter les doubles validations.

## 6. Composition de l’écran

Ordre vertical permanent :

1. zone système haute ;
2. barre de score ;
3. résumés des joueurs ;
4. confrontation de puissance ;
5. scène active ;
6. dernière carte jouée ;
7. aperçu calculé de la sélection, si nécessaire ;
8. main horizontale ;
9. actions contextuelles ;
10. navigation basse et zone système.

### Priorité de conservation sur petit écran

Éléments qui ne peuvent jamais disparaître :

- score ;
- endurance ;
- nombre de cartes ;
- puissance des deux joueurs ;
- carte active ;
- main ;
- action principale.

Ordre de réduction :

1. masquer le message contextuel de confrontation ;
2. réduire les espacements verticaux ;
3. réduire légèrement la carte centrale ;
4. réduire le nombre de cartes partiellement visibles ;
5. conserver les informations secondaires dans les feuilles basses.

## 7. Composants mobiles

```text
MobileGameScreen
├── MobileSetScore
├── MobilePlayerSummary × 2
├── PowerConfrontation
├── ActivePlayScene
│   ├── ActiveCard
│   ├── PowerDelta
│   └── ImportantMessage
├── LastPlayedCard
├── SelectedCardPreview
├── MobileCardHand
│   └── MobileHandCard
├── CardConfirmationActions
├── OpponentContinueAction
├── ActiveBonusesSheet
├── ExchangeHistorySheet
├── CardUnavailableExplanation
└── ExitMatchConfirmation
```

Chaque composant reçoit des données de présentation et des callbacks. Aucun composant ne lit ou ne modifie directement l’état global du moteur.

## 8. Interactions

### Main

- défilement horizontal natif ;
- toucher une carte jouable pour la sélectionner ;
- toucher une autre carte pour remplacer la sélection ;
- toucher une carte verrouillée pour afficher la raison ;
- aucune validation par glissement vertical ;
- sélection toujours confirmée par le bouton `Jouer`.

### Feuilles basses

- ouverture de l’historique par bouton ou glissement vers le haut ;
- fermeture par bouton, glissement vers le bas ou toucher hors de la feuille ;
- mêmes règles pour les bonus ;
- la confirmation de sortie ne se ferme pas par un geste ambigu.

### Carte adverse

- reste visible jusqu’à l’action `Continuer` ;
- le coût, la puissance et l’effet sont lisibles sans appui supplémentaire ;
- aucune fermeture automatique dans la première version.

## 9. Animations

Durées recommandées :

| Transition | Durée | Courbe |
|---|---:|---|
| Sélection de carte | 180 ms | ease-out |
| Apparition des actions | 160 ms | ease-out |
| Main vers scène | 320 ms | ease-out |
| Carte adverse vers scène | 360 ms | ease-out |
| Delta de puissance/endurance | 700 ms | ease-out |
| Scène vers dernière carte | 240 ms | ease-in-out |
| Feuille basse | 280 ms | ease-out |

Contraintes :

- aucune animation en boucle ;
- aucune animation ne bloque la lecture ;
- les données finales sont appliquées même si l’animation est désactivée ;
- le réglage système de réduction des animations est respecté ;
- en cas d’interruption, l’interface rejoint directement l’état final cohérent.

## 10. Couleurs fonctionnelles

La couleur n’est jamais le seul indicateur.

- placement conseillé : couleur douce + libellé ou icône ;
- placement obligatoire : couleur plus marquée + libellé explicite ;
- carte incompatible : désaturation + verrou + état non sélectionnable ;
- vainqueur du set : couleur + contraste typographique ;
- set non commencé : faible opacité, toujours lisible par les technologies d’assistance.

## 11. Accessibilité

- cible tactile minimale : 44 × 44 points ;
- boutons nommés pour les lecteurs d’écran ;
- ordre de lecture identique à l’ordre visuel ;
- annonce des variations de puissance et d’endurance via une zone dynamique non intrusive ;
- état verrouillé et raison annoncés ensemble ;
- aucune information exclusivement communiquée par couleur, animation ou geste ;
- contraste conforme à WCAG AA ;
- taille de texte compatible avec l’agrandissement système ;
- respect des zones sûres iOS et Android.

## 12. Détection du support

La décision ne doit pas reposer uniquement sur la largeur CSS.

Le point d’entrée doit combiner :

- classe d’appareil ou plateforme fournie par l’application ;
- largeur disponible ;
- orientation ;
- capacité tactile.

Le changement d’orientation pendant un match ne doit pas charger l’interface Desktop. Pour la première version, le jeu mobile reste en portrait ou affiche une invitation à revenir en portrait.

## 13. Performance

- précharger uniquement les illustrations de la main, de la carte active et de la dernière carte ;
- charger les détails secondaires à la demande ;
- éviter de dupliquer les grandes images en mémoire ;
- limiter les animations aux propriétés accélérées (`transform`, `opacity`) ;
- conserver une réponse tactile immédiate, même pendant une synchronisation distante ;
- empêcher toute double soumission de `playSelectedCard`.

## 14. Instrumentation recommandée

Événements anonymes :

- `mobile_card_selected` ;
- `mobile_card_selection_cancelled` ;
- `mobile_card_play_confirmed` ;
- `mobile_locked_card_explanation_opened` ;
- `mobile_bonus_sheet_opened` ;
- `mobile_history_opened` ;
- `mobile_opponent_card_continued` ;
- `mobile_exit_requested` ;
- `mobile_exit_cancelled` ;
- `mobile_exit_confirmed`.

Ne jamais inclure de données personnelles ou le contenu libre d’un utilisateur.

## 15. Critères de recette

### Non-régression

- Desktop est visuellement et fonctionnellement inchangé.
- Tablette est visuellement et fonctionnellement inchangée.
- Les mêmes commandes produisent les mêmes résultats métier sur les trois interfaces.

### Mobile

- tous les sets du format sont visibles ;
- le serveur est identifiable sans texte permanent ;
- endurance et cartes restantes sont visibles pour les deux joueurs ;
- les bonus sont consultables mais jamais permanents ;
- les valeurs de puissance dominent la hiérarchie ;
- coût, puissance, effets, placement et bonus calculés sont visibles avant validation ;
- une carte incompatible ne peut pas être jouée et sa raison est disponible ;
- la carte adverse reste affichée jusqu’à `Continuer` ;
- l’historique contient cartes, effets, bonus, endurance et puissance ;
- toute sortie demande confirmation ;
- l’interface reste utilisable d’une seule main sur les largeurs cibles.

### Robustesse

- un double toucher sur `Jouer` n’envoie qu’une commande ;
- une reconnexion restaure l’état fourni par le moteur sans rejouer les animations déjà terminées ;
- un état incomplet affiche un repli lisible sans bloquer le match ;
- le mode réduction des animations conserve toutes les informations.

## 16. Séquence d’implémentation

1. Identifier le point d’entrée actuel de la vue de match.
2. Documenter l’API réelle du moteur et la comparer au contrat ci-dessus.
3. Ajouter la sélection de vue mobile sans toucher aux vues existantes.
4. Construire la structure statique de `MobileGameScreen`.
5. Brancher les états et commandes du moteur.
6. Ajouter sélection, validation et incompatibilités.
7. Ajouter tour adverse et historique.
8. Ajouter les animations de présentation.
9. Ajouter accessibilité et adaptation aux zones sûres.
10. Exécuter les tests métier partagés et la recette visuelle multi-appareils.

## 17. Prérequis avant développement

Le dossier actuellement disponible contient des images, un fichier PSD et deux PDF, mais aucun code source d’application.

Pour démarrer l’implémentation, il faut fournir ou ouvrir le dépôt contenant au minimum :

- le point d’entrée de l’application ;
- la vue de match Desktop/Tablette ;
- le moteur ou son interface publique ;
- la gestion d’état ;
- les scripts de lancement et de test ;
- la technologie mobile prévue, si elle est déjà choisie.

