# DB caching with Redis

## Installation

Il est possible de faire l'installation en compilant l'application directement : 

```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```

Il est également possible selon la distribution de faire l'installation depuis un repo :

```
apt install redis-server
```

Une fois installé le serveur peut être démarré avec la commande :

```
redis-server
```

## Start Redis

`redis-server --maxmemory 10mb --maxmemory-policy allkeys-lru `

## Commandes CLI

open CLI : `redis-cli`

- `keys` : permet de voir toutes les clé enregistrée dans le cache. 
- `set <key> <value>` : permet d'enregistrer une valeur
- `get <key> ` : retourne la valeur enregistrée.