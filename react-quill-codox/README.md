#### React-Quilljs demo

Demo of reactjs + quilljs <br/>

React(+quilljs) + Express + MongoDB

##### Configuring

Before starting, you need to configure envs for both client and server:

```bash
    cd ./server # navigate to server
    touch .env # create env file, check .env.example to see which envs are used

    cd ../client # navigate back to client
    touch .env # create .env file, check .env.example to see which envs are used

```

##### Development Mode

To run app in dev mode you can either run frontend and backend separately or use bash scripts:

```bash
    # starting separately
    cd ./server # navigate to server folder
    npm run start:dev # run server in dev mode

    cd ../client # navigate back to cleint
    npm run start # run client in dev mode
```
