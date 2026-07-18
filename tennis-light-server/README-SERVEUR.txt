Tennis Courts Academy - version serveur v141

Lancer en local :
1. Ouvrir un terminal dans ce dossier.
2. Lancer : npm start
3. Ouvrir : http://localhost:3000/

Le serveur affiche un menu/lobby commun :
- choisir un pseudo et un coach
- journaliser chaque partie impliquant un joueur humain sous un identifiant de match stable
- conserver ensemble tous les echanges, actions, decisions IA, effets, suppressions, scores de sets et resultat final
- envoyer les parties terminees au serveur et permettre leur export personnel ou administrateur
- exporter un fichier dedie tennis-courts-human-matches-v141 avec les parties completes du circuit, contre l'IA et entre humains
- empecher l'IA de passer volontairement lorsqu'une reponse sure et abordable respecte le placement
- preserver Suppression adverse lors des sacrifices et ne la jouer que sur une cible suffisamment rentable ou une menace obligatoire
- absorber Annulez l'effet avec une carte moins chere lorsqu'un coup de suivi utile reste possible
- construire a chaque tour IA un scenario Points et un scenario BOOST, chacun avec une voie principale et deux solutions de repli
- choisir au debut de l'echange une posture agressive, prudente ou opportuniste selon la main et l'experience recente, puis la reevaluer si le plan est contrarie
- reveler pendant 10 secondes la main adverse lorsque l'humain active l'effet bleu d'Eliana Marquez, avec fermeture manuelle et decompte integre
- memoriser les cartes revelees par Eliana lorsque l'IA active cet effet et les integrer aux projections de scenario et de risque
- afficher pendant 5 secondes une presentation de la confrontation avec cartes personnages, pseudos, classements, stade et rivalite eventuelle
- conserver le pseudo du joueur humain dans tous les echanges et revenir au profil apres l'enregistrement d'un personnage
- poursuivre une victoire deja securisee lorsque la main et l'endurance humaines rendent une punition supplementaire suffisamment sure
- projeter l'effet Double selon sa puissance copiee, son cout, son impact sur l'ecart final et la pression imposee au joueur humain
- interdire le sacrifice optionnel de Suppression et son usage comme simple Remise de placement hors defense obligatoire
- afficher Domination, Ascendant humain, Ascendant IA ou Bete noire a partir de 6 confrontations
- afficher dans le profil l'illustration et les cartes recto/verso du personnage avec une loupe haute definition
- marquer avec le logo interdit toute carte utilisee en Remise et agrandir proprement les cartes deja jouees
- ouvrir une entree unique CLUB HOUSE pour configurer une competition amicale hors circuit
- choisir les adversaires IA aleatoirement ou parmi les mieux classes, puis repartir le tableau aleatoirement ou selon le classement
- proposer un niveau IA selon classement : 3 bonus au meilleur IA, 2 aux IA n°2 et n°3, 1 aux IA n°4 a n°10
- choisir un TOURNOI ou une LEAGUE en 2 ou 3 sets gagnants contre des adversaires IA tires par la competition
- regler le niveau IA : NORMAL sans bonus, EXPERT avec 1 bonus, CHAMPION avec 2 bonus ou LEGENDE avec 3 bonus
- tirer les bonus IA sans doublon parmi les 9 bonus de tetes de serie du Tennis Courts Pro Circuit
- garantir que ces competitions contre l'IA n'enregistrent aucun point et ne modifient pas le circuit professionnel
- creer une partie en ligne en match 2 sets ou match 3 sets
- creer ou rejoindre un tournoi amical en ligne jusqu'a 4 joueurs humains
- choisir avant le lancement un tournoi CLASSIC ou LEAGUE, en 2 ou 3 sets gagnants
- repartir les joueurs aleatoirement, selon le classement mondial ou en separant les humains
- jouer la LEAGUE en 2 groupes de 4, journee par journee, puis demi-finales et finale
- afficher la LEAGUE en journees 1, 2 et 3, puis demies, finale et vainqueur dans le jeu et le CLUB HOUSE
- classer la LEAGUE avec 1 point par victoire, puis les differences de sets, de jeux et le classement mondial
- placer deux humains opposes dans une session de match unique avec un score et un vainqueur partages
- restaurer cette session partagee apres un rechargement sans recreer un match ni un adversaire IA
- valider cote serveur les places, le format, les sets termines et le vainqueur d'un match humain contre humain
- devoiler les rencontres entre IA set par set selon l'avancement des joueurs humains
- masquer le vainqueur IA et son impact au classement LEAGUE jusqu'au score integral
- exclure un joueur du CLUB HOUSE avant le lancement lorsque l'on est l'hote
- lancer le tournoi des que 2 joueurs sont presents, puis completer le tableau a 8 avec les IA
- suivre les scores des matchs humains en direct dans le CLUB HOUSE du tournoi
- regarder un match en mode visionneuse avec les deux mains masquees et aucune action de jeu possible
- quitter temporairement un tournoi sans perdre son inscription ni fermer le CLUB HOUSE
- reprendre depuis le lobby un match en cours ou revenir attendre dans le CLUB HOUSE
- conserver exactement le score et l'etat d'un match interrompu avant la reconnexion
- accorder 20 secondes pour revenir dans un match humain et 10 secondes contre une IA avant le forfait
- afficher a l'adversaire humain un decompte dynamique pendant la reconnexion
- detecter la fermeture de la fenetre ou l'arret silencieux des pulsations pendant un match
- declarer forfait apres 20 secondes sans reconnexion et annuler automatiquement le decompte si la connexion revient
- reactiver le joueur lors d'un rechargement de page sans perdre la session synchronisee
- proteger le vainqueur d'un match humain contre une reponse reseau tardive qui pourrait l'ejecter du tournoi
- transferer automatiquement le role d'hote au joueur suivant lorsque l'hote quitte
- enregistrer le score au moment d'un abandon en match, puis declarer le joueur forfait
- afficher le Top 20 dans le lobby et le classement complet par pages de 25 joueurs
- quitter puis rejoindre de nouveau un CLUB HOUSE tant que le tournoi n'est pas lance
- rejoindre un tournoi en cours comme spectateur depuis le lobby
- afficher les parties en cours sur les profils avec adversaire, score et bouton VOIR
- prevenir le vainqueur lorsqu'un adversaire humain abandonne par forfait
- reconnecter le vainqueur par forfait a son prochain match apres confirmation
- administrer et supprimer les parties et tournois en ligne depuis le lobby ADMIN
- les autres joueurs avec le meme lien voient les parties ouvertes et peuvent rejoindre

L'ancien lien direct reste disponible :
http://localhost:3000/new-room

Deployer :
- Uploader tout ce dossier sur un hebergeur Node.js.
- La commande de demarrage est : npm start
- Le serveur utilise la variable PORT si l'hebergeur l'impose.

Comptes utilisateurs avec PostgreSQL :
- Creer une base PostgreSQL sur Render.
- Dans le service Web Render, ajouter les variables d'environnement :
  DATABASE_URL = Internal Database URL de la base PostgreSQL
  SESSION_SECRET = une longue phrase aleatoire, privee
- Au premier demarrage, le serveur cree automatiquement les tables users et sessions.
- En local, si DATABASE_URL n'est pas configuree, les comptes fonctionnent en memoire mais disparaissent au redemarrage.

Note importante :
Cette premiere couche serveur synchronise l'etat de jeu entre deux navigateurs et masque la main du joueur inactif dans l'interface. Elle ne fait pas encore une validation serveur complete de toutes les regles carte par carte. Pour une version anti-triche stricte, la prochaine etape sera de deplacer le moteur de regles entier cote serveur et de n'envoyer a chaque joueur que sa vue privee.
