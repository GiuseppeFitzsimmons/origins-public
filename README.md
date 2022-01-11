# API de Vidéo Origins
Ce projet est composé d'une couche API développée en Express et utilisant une database PostGres, ainsi qu'un client développé en React.

## Conteneurs
La couche Express et l'application React sont dockerisés dans un fichier nommé DockerExpress.
L'instance de Postgres est dockerisée dans un fichier nommé DockerPostgres.

Ces conteneurs sont composés dans un fichier docker compose nommé docker-compose.yml.

La manière la plus facile d'avoir une instance entière de l'application est d'utiliser les commandes suivantes:
1. docker compose build
2. docker compose up
Ceci lancera Postgres dans son propre conteneur et Express dans un autre.

### Conteneur PostGres
Il y'a un schéma nommé originsdb. </br>Le nom d'utilisateur et le mot de passe sont 'docker'.</br> Le port est 5432.

### Conteneur Express
Son port est 3000. Le serveur Express sert aussi l'application React.
Le point d'entrée pour le client est donc localhost:3000.</br>Pour l'API, il s'agit de localhost:3000/.<resource\>

## Environnement dev
La manière la plus facile d'avoir un environnement de développement est de démarrer le conteneur Postgres, l'application Express et l'application React:
1. docker build -f DockerPostgres -t pg_container .</br>(Cette étape n'est que nécessaire que s'il s'agit du premier lancement, ou si le conteneur a été modifié)
2. docker run --rm -P -p 5432:5432 -e POSTGRES_PASSWORD=docker -e POSTGRES_USER=docker -e POSTGRES_DB=originsdb --name db_container pg_container
3. Depuis /back, exécuter 'npm run start'
4. Depuis /front, exécuter 'npm run start'. Il est à noter que ceci démarrera l'application React sur le port 3001.

## Environnement prod
Actuellement, ce projet n'a pas de modèle de déploiement en production.</br>
Pour l'environnement de staging, l'image PostGres serait déployée dans un seul conteneur, et l'image Express dans un autre. Ainsi, l'application client et la couche API demeurent sur le même serveur.</br>
Pour une meilleure scalabilité, la database serait répliquée dans un outil tel qu'AWS Aurora, l'image Express serait déployée dans des conteneurs auto-scaling (comme AWS EC2 élasticisé par Kubernetes), et l'application client serait hébergée dans sa propre instance - ou mieux encore, sur un bucket AWS S3 servi par CloudFront.

## Tests d'intégration
Les tests unitaires sont implémentés en Mocha et s'occupent des fonctionnalités de CRUD basiques de l'API.
* Ces tests ne sont pas encore compréhensifs - il s'agit principalement de happy paths.
Les tests peuvent être lancés à partir de la racine du projet avec `npm test`</br>
Il est à noter que le serveur et la database doivent être lancés (il n'y a actuellement pas de mocks).</br>
Il n'y a actuellement pas de tests pour le client.

## Mise en cache
La mise en cache se fait à deux niveaux - d'abord dans l'application Express avec l'usage de memory-cache, et ensuite dans le client React avec l'usage du state. Dans le premier cas, l'application va d'abord chercher la vidéo dans le cache via son ID et le renvoie s'il est trouvé. Si pas, il effectue sa requête à la database, et le met en cache une fois trouvé avant de le renvoyer.

## TODO
* Authentication
    * Les méthodes et technologies choisies pour l'implémentation de la sécurité l'ont été afin de démontrer ma compréhension des flux d'authentication, spécifiquement OAuth2. Ce n'est qu'une implémentation partielle, il manque encore les choses suivantes:
        * Expiration de token
        * Refresh tokens
        * Logout
        * Scopes
        * Récupération de mot de passe oublié / changement de mot de passe
        * Bloquage d'utilisateur
* Validation
    * Actuellement, la database est responsable de toute validation. Une des conséquences est que les messages d'erreur sont souvent imprécis - par exemple, un utilisateur en doublon est perçu comme UNAUTHORIZED.
    * Il y'a des options avancées de validation dans Sequelize, comme des règles émises sous forme de regular expressions.
* Expansion des tests
    * Comme dit plus haut, les tests sont actuellement limités au CRUD basique, et principalement les happy paths.
    * Dû à un conflit avec le tsconfig, les tests Mocha ne sont pas faits en respectant totalement les meilleures pratiques.
* Environnements
    * La topologie de déploiement n'est que le docker compose, ce qui fonctionne en développement mais une stratégie de staging doit être mise en place.
    * Il y'a des variables d'environnement qui sont actuellement hard-coded, comme le cryptage et les clefs de signature.
* Elasticsearch
    * Bien qu'ayant essayé, je me suis trouvé à court de temps et j'ai donc décidé de me pencher sur la livraison d'un produit fini. Il n'empêche que j'ai pu en apprendre un peu plus sur l'intégration d'Elasticsearch à Docker.
* GraphQL/Apollo
    * Similairement à Elasticsearch, je ne m'y suis pas plus aventuré par manque de temps.
* Application client
    * L'application client est extrêmement simple car j'ai voulu porter mon attention sur le backend. Il s'agit donc du strict minimum - même moins, puisqu'il ne fait de logout, et ne peut pas effectuer toutes les opérations de CRUD.
* Optimisation des queries
    * Certaines queries sont faites de manière longue et lente, notamment get favourites. C'est par manque de temps que je n'ai pas été plus loin dans l'écriture de queries SQL crues, mais quelques traces de ces efforts existent (bien que mises en commentaire).