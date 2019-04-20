#!/bin/bash

cd ../../

docker rm -f front
docker build -f Dockerfile.front -t front .
docker run --name front -d -p 80:80 front
