# Unispace
Unispace est un projet permettant de centraliser plusieurs outils utils à la scolarité d'un étudiant en BUT. Cet outil
permet notamment de retrouver son emploi du temps, calculer la moyenne pour ses UE, retrouver les devoirs ou le contenu
des ressources (cours), etc.

## Installer le projet
Ces instructions vont vous permettre d'installer une copie du projet sur votre machine local, dans un but de
développement et de test. Voir la section déploiement pour connaitre la marche à suivre lors du déploiement en production.

### Prérequis
Pour le développement, le projet a été conteneurisé sous Docker afin de simplifier son installation sur tout type de machine.
Afin d'utiliser Docker, il faut tout d'abord installer Docker Desktop que vous retrouverez
[ici](https://www.docker.com/products/docker-desktop/).

### Installation
L'installation sous Docker a été automatisée à l'aide d'un script d'installation.
- Si vous êtes sous windows, lancez le script [docker/install.bat](docker/install.bat)
- Si vous êtes sous linux ou mac os, lancez le script [docker/install.sh](docker/install.sh)

Il se peut que l'installation de la base de données prenne un certain temps la première fois. Une fois que les ports 
sont marqués comme ouverts, redémarrez le backend de l'application avec :
```shell
docker container restart unispace-backend
```

Une fois le backend redémarré, nous pouvons créer les tables de la base de données à l'aide de l'[ORM](https://fr.wikipedia.org/wiki/Mapping_objet-relationnel) 
[sequelize](https://sequelize.org/docs/v6/). Pour plus d'informations, consultez [la documentation](https://sequelize.org/docs/v6/other-topics/migrations/#running-migrations).
```shell
docker exec unispace-backend npx sequelize-cli db:migrate
```

Une fois les tables créées, vous pouvez charger le jeu de données proposé à l'aide de la commande suivante :
```shell
docker exec unispace-backend npx sequelize-cli db:seed:all
```

Ce jeu de données est constitué de plusieurs groupes distribués dans plusieurs classes pour 3 niveaux d'études et 3 
parcours différentes. Le jeu de données propose également 5 utilisateurs représentatifs des 5 niveaux de droits d'accès
(plus d'informations sur ces droits dans le wiki du projet) :

| Prénom  | Nom         | Email                                  | Mot de passe | Groupe de classe | Droits                  |
|---------|-------------|----------------------------------------|--------------|------------------|-------------------------|
| Jean    | La Fontaine | jean.lafontaine@etu.umontpellier.fr    | mdp1234!     | Q1A              | utilisateur non vérifié |
| Émile   | Zola        | emile.zola@etu.umontpellier.fr         | mdp1234!     | Q1A              | étudiant                |
| Charles | Baudelaire  | charles.baudelaire@etu.umontpellier.fr | mdp1234!     | Q1A              | publicateur             |
| Albert  | Camus       | albert.camus@etu.umontpellier.fr       | mdp1234!     | Q1A              | administrateur          |

Si vous souhaitez utiliser les emails pour des tests, modifiez le fichier [backend/config/mail.json](backend/config/mail.json).
Pour les tests, vous pouvez utiliser l'outil [ethereal.email](https://ethereal.email/).

## Lancer le projet
Pour lancer le projet, vous pouvez vous rendre dans Docker Desktop et lancer le projet Unispace. Il peut être nécessaire 
de redémarrer le backend si la base de données n'était pas déjà démarrée.

## Déploiement
(Cette section est incomplète.)

Merci de ne pas utiliser le docker proposé à des fins de mise en production. Celui-ci a été conçu pour des fins de 
développement et n'est pas adapté en l'état pour un environnement de production.

Lors de la mise en production, plusieurs fichiers doivent être configurés.
### Configuration du backend
Les fichiers de configuration sont dans le dossier [backend/config](backend/config)
#### appli.json
Configuration du backend

| Nom                  | Contenu                                                                                        |
|----------------------|------------------------------------------------------------------------------------------------|
| frontend             | URL de base pour accéder au frontend                                                           |
| lienVerification     | URL pointant vers la partie en frontend s'occupant de vérifier les comptes des utilisateurs    |
| lienMdpOublie        | URL pointant vers la partie en frontend s'occupant de modifier le mot de passe s'il est oublié |
| lienInvitationGroupe | URL permettant à un utilisateur de rejoindre un groupe de travail                              |
| token                | Token utilisé pour l'authentification des utilisateurs via JsonWebToken (doit être fort)       |

#### config.json
Configuration de la base de données utilisée par le backend.

#### mail.json
Configuration du serveur mail.

### Configuration du frontend
Les fichiers de configuration sont dans le dossier [frontend/src/assets/config](frontend/src/assets/config)
#### backend.json
Configuration du lien avec le backend

| Nom                  | Contenu                                                                                        |
|----------------------|------------------------------------------------------------------------------------------------|
| url                  | URL de base pour accéder au backend                                                            |

#### profs.json
Personnalisation de l'affichage des enseignants

| Nom    | Contenu                                     |
|--------|---------------------------------------------|
| icones | Liste des enseignants dont une icon existe |

## Outils utilisés
* [Node.js](https://nodejs.org/fr) - Environnement de développement utilisé
* [npm](https://www.npmjs.com/) - Gestionnaire de packets (dépendances du projet)
* [Express.js](https://expressjs.com/) - Framework web pour node.js utilisé en backend
* [Sequelize.js](https://sequelize.org/docs/v6/) - ORM utilisé en backend pour créer le lien avec la base de données
* [Angular](https://angular.io/) - Framework web utilisé en frontend
* [SCSS](https://sass-lang.com/documentation/syntax/) - Préprocesseur CSS du projet (celui-ci doit être compilé en CSS)

## Contribuer
Merci de lire le fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails 
sur comment participer à ce projet, ainsi que le fichier [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 
pour connaitre les règles de conduite à adopter.

## Documentation
Vous retrouverez l'ensemble de la documentation du projet dans le wiki, ainsi que dans le code source.

N'hésitez pas à poser des questions sur le projet via le discord de celui-ci : [https://discord.gg/VyQA6MNp6q](https://discord.gg/VyQA6MNp6q). 
Une réponse à votre question peut déjà exister, pensez à vérifier celà avant de poser votre question.

## Auteurs

* **Raphaël DELAYGUES** ([Rafiki](https://github.com/Rafiki13)) - *Première version* - 

Voir également la liste des [contributeurs](https://github.com/Schrodin-dev/Unispace/contributors) ayant participé au projet.

## License
Ce projet est sous licence MIT, voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.