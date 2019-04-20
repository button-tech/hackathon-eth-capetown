#!/bin/bash

cd ../../

docker rm -f bot
sudo docker build -f Dockerfile.bot -t bot .
envRedis=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis)

ngrok=$(curl -s  http://localhost:4040/api/tunnels | jq '.tunnels[1].public_url'| sed 's/\"//g')
docker run --name bot -e REDIS_HOST=$envRedis -e NGROK=$ngrok -p 8080:8080 --network=pureButton -d bot
