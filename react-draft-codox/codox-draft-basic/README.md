# Codox + DraftJS Basic Editor

Demo for draftjs basic editor with Codox sync <br/>

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
