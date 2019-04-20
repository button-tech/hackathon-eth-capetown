#!/bin/bash

cd ../../

docker rm -f api
docker build -f Dockerfile.api -t api .
envRedis=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis)
docker run --name api -e REDIS_HOST=$envRedis -d -p 3000:3000 --network=pureButton api
