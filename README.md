# Mobility Choices Server

[![Build Status](https://travis-ci.org/MobilityChoices/mc-server.svg?branch=master)](https://travis-ci.org/MobilityChoices/mc-server)
[![dependencies Status](https://david-dm.org/MobilityChoices/mc-server/status.svg)](https://david-dm.org/MobilityChoices/mc-server)

## Scripts

- `npm run cover`: runs all tests and collects code coverage information

- `npm run develop`: restarts the server on every change

- `npm run test`: runs all tests

- `npm run lint`: checks the code style


## Deployment

### Setup Data Store

1. Start `elasticsearch`:

```
./elasticsearch/bin/elasticsearch
```

2. Setup the mappings (**WARNING**:this removes all data from the data store!):

```
node scripts/setup.js
```

3. Start the server:

```
node .
```
