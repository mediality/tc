Tennis Courts Academy - version serveur v120

Lancer en local :
1. Ouvrir un terminal dans ce dossier.
2. Lancer : npm start
3. Ouvrir : http://localhost:3000/

Le serveur affiche un menu/lobby commun :
- choisir un pseudo et un coach
- creer une partie en ligne en match 2 sets ou match 3 sets
- creer ou rejoindre un tournoi amical en ligne jusqu'a 4 joueurs humains
- lancer le tournoi des que 2 joueurs sont presents, puis completer le tableau a 8 avec les IA
- suivre les scores des matchs humains en direct dans le salon du tournoi
- regarder un match en mode visionneuse avec les deux mains masquees et aucune action de jeu possible
- quitter definitivement un tournoi sans fermer le salon tant qu'un autre joueur reste present
- transferer automatiquement le role d'hote au joueur suivant lorsque l'hote quitte
- enregistrer le score au moment d'un abandon en match, puis declarer le joueur forfait
- afficher le Top 20 dans le lobby et le classement complet par pages de 25 joueurs
- administrer et supprimer les salons ouverts depuis le lobby ADMIN
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
