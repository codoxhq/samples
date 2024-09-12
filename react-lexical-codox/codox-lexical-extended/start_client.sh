#!/bin/bash

cd ./client

if [[ $1 == "local" ]]; then
    PORT=3334 npm run start:local
else
    npm run start
fi
