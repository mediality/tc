# Matrice de compatibilité de l’interface smartphone

Cette matrice décrit les états et intentions existants. L’interface mobile ne
recalcule aucune règle : elle consomme l’adaptateur de `app.js`, qui appelle les
commandes historiques.

| Famille | États à couvrir | Actions autorisées | Équivalent mobile |
|---|---|---|---|
| Entraînement / tutoriel | lecture, action guidée, réponse automatique, fin de module | Suivant, carte/mode imposé, Passer, Terminer | dialogue tutoriel contextuel, cible tactile et progression |
| Échange libre IA | tour joueur, tour IA, fin d’échange | jouer, passer, échange suivant | scène mobile, révélation adverse, résultat |
| Set | échange, fin d’échange, fin de set | échange suivant, set suivant | score des sets, résultat et action principale |
| Match complet | échange, fin de set, fin de match | échange/set suivant, rejouer | résultat complet et progression |
| Tournoi / Circuit Pro | match en cours, tour suivant, élimination, victoire | match suivant, demi-finale, finale, sortir | feuille Compétition, résultat et action contextuelle |
| League | groupes, journées, demies, finale | match suivant, sortir | classement condensé et liste des matchs |
| Club House / amical | attente, match humain, retour Club House | retour Club House | statut contextuel et action de retour |
| Jeu en ligne | attente, synchronisation, tour local/distant, reconnexion | commandes du siège, retour lobby | état réseau permanent, main verrouillée hors siège |
| Spectateur | direct, reconnexion, fin | agrandir les cartes, quitter | badge Lecture seule, aucune main ni commande de jeu |
| Sauvegarde / reprise | restauration locale, reprise Circuit/Club House, révision distante | poursuivre l’état restauré | état dérivé à chaque rendu, aucune animation rejouée |
| Administration | outils de simulation et contrôles réservés | selon rôle uniquement | aucun contrôle ajouté au mobile public |

## États terminaux

| État moteur | Présentation mobile | Action |
|---|---|---|
| `gameOver` | vainqueur, type de victoire, raison, score | action de progression existante |
| `setOver` | score final du set | Set suivant |
| `matchOver` | sets gagnés et résultat du match | Rejouer, match suivant ou sortie selon le mode |
| tournoi `readyNext` | prochain tour et tableau condensé | Match suivant |
| tournoi `readySemi` / `readyFinal` | tour débloqué | Demi-finale / Finale |
| tournoi `complete` | champion et parcours | Sortir du tournoi |
| amical terminé | résultat et attente Club House | Retour Club House |

## Cas nécessitant une infrastructure externe

- reconnexion réelle de deux navigateurs à un salon distant ;
- reprise d’un tournoi hebdomadaire authentifié depuis la base de production ;
- Club House humain à plusieurs participants et mode spectateur distant ;
- contrôles administrateur avec un compte autorisé.

Ces chemins sont couverts statiquement par l’adaptateur et les tests de garde,
mais leur recette bout en bout nécessite les services et comptes correspondants.
