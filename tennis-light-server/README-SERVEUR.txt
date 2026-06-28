Tennis Courts Light - version serveur

Lancer en local :
1. Ouvrir un terminal dans ce dossier.
2. Lancer : npm start
3. Ouvrir : http://localhost:3000/new-room

Le serveur cree un salon et redirige vers le lien Coach Ju.
Dans le panneau "Partie en ligne", copier le lien adversaire et l'envoyer a Coach Max.

Deployer :
- Uploader tout ce dossier sur un hebergeur Node.js.
- La commande de demarrage est : npm start
- Le serveur utilise la variable PORT si l'hebergeur l'impose.

Note importante :
Cette premiere couche serveur synchronise l'etat de jeu entre deux navigateurs et masque la main du joueur inactif dans l'interface. Elle ne fait pas encore une validation serveur complete de toutes les regles carte par carte. Pour une version anti-triche stricte, la prochaine etape sera de deplacer le moteur de regles entier cote serveur et de n'envoyer a chaque joueur que sa vue privee.
