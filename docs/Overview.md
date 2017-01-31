# Overview

```

             Incoming Requests
                |  |  |  |
                |  |  |  |
                v  v  v  v
          +---------------------+                                +-----------------+
          |                     |                                |                 |
          |    Server (Hapi)    |------- Store/Retrieve Data --->|  Elasticsearch  |
          |                     |                                |                 |
          +---------------------+                                +-----------------+
                     |
                     |
                     v
              +------------+                     
              | Google API |
              +------------+


```

### `elasticsearch`

Dieses Verzeichnis enthält aus Gründen der Einfachheit eine komplette Elasticsearch-Installation. 
Am besten wäre es, diese aus dem Projekt zu entfernen und als externe Abhängigkeit anzugeben.

### `scripts`

- **`setup.js`** legt die Indices in Elasticsearch an - ⚠️ WICHTIG: beim Ausführen dieses Scripts werden 
  alle in Elasticsearch gespeicherten Daten gelöscht!
- **`test-setup.js`** enthält setup für die Tests


### `src/env.ts`

Konfigurationen, wie bspw. an welchen Port sich der Server bindet, bzw. welcher Google API Key verwendet 
werden soll.

### `src/handlers`

Route-Handlers für eingehende Requests. Werden in `src/server.ts` registriert.

### `src/helpers`

Durcheinander von Helferchen und Typ-Definitionen.

### `src/services`

Code für Services die über Requests angesprochen werden: momentan sind dies 
- Google APIs
- Elasticsearch


### Notizen

- [ ] Elasticsearch aus dem Repository entfernen.
- [ ] `src/helpers` aufräumen
- [ ] JSON Web Tokens `exp` setzen
