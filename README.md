# DB Caching avec REDIS

Pour illustrer l'utilisation de redis pour faire du db caching, nous allons mettre un place une structre avec MongoDB et Express.js.

Le schéma réaliser va permettre de comprendre le fonctionnement et la mise en place des ressources nécessaires. Pour cela nous allons utiliser une structure fictive de librairie virtuelle.



## Installation



## Utilisation

Démarrer : `redis-server <options> `

Stopper :  `/etc/init.d/redis-server stop`

## Configuration

Par défaut redis stock dans la RAM tant qu'il y trouve de la place. Il va donc surcharger la RAM au bout d'un moment. Pour éviter cela il est important de donner une règle 

### Memory

Definir l'espace maximum que le cache est autorisé à utiliser.

`--maxmemory 10mb`

### Caching Policy

- LRU (Least Recently Used) : `--maxmemory-policy allkeys-lru`



## Garder le cache valide



source : https://www.sitepoint.com/caching-a-mongodb-database-with-redis/