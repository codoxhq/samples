# Codox + DraftJS Extended Editor

Demo for Codox sync with Draftjs exptended editor including rich text styling, undo/redo features and plugins from @draft-js-plugins npm lib

Stack: React(+draftjs) + Express + MongoDB

## Configuring

Before starting, need to configure envs for both client and server:

```bash
    cd ./server # navigate to server
    touch .env # create env file, check .env.example to see which envs are used

    cd ./client # navigate back to client
    touch .env # create .env file, check .env.example to see which envs are used
```

## Scripts

### Cleint

```bash
    cd ./client
    npm run start # start in dev mode

    npm run build # build client app
```

### Server

```bash
    cd ./server
    npm run start:dev # run server in dev mode
```
