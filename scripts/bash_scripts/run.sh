#!/bin/bash

network=$(docker network ls | grep pureButton)
if [ "$network" ]
then
    echo "Network already exists"
else
    docker network create --attachable pureButton
fi

docker rm -f $(docker ps -a -q)

# redis
docker pull neojt/mredis
docker run --name redis -d -p 6379:6379 --network=pureButton neojt/mredis
envRedis=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis)

cd ../../

if [ "$(ls telegram  | grep node_modules)" ]
then
    echo "in telegram dir node_modules already exists"
else
    cd telegram && npm i && cd ..
fi

if [ "$(ls api  | grep node_modules)" ]
then
    echo "in api dir node_modules already exists"
else
    cd api && npm i && cd ..
fi

if [ "$(ls shared  | grep node_modules)" ]
then
    echo "in shared dir node_modules already exists"
else
    cd shared && npm i && cd ..
fi

# bot
docker build -f Dockerfile.bot -t bot .
ngrok=$(curl -s  http://localhost:4040/api/tunnels | jq '.tunnels[1].public_url'| sed 's/\"//g')
docker run --name bot -e REDIS_HOST=$envRedis -e NGROK=$ngrok -p 8080:8080 --network=pureButton -d bot

# api
docker build -f Dockerfile.api -t api .
docker run --name api -e REDIS_HOST=$envRedis -d -p 3000:3000 --network=pureButton api

# frontend
docker build -f Dockerfile.front -t front .
docker run --name front -d -p 80:80 --network=pureButton front
