#!/bin/bash

set -xe

docker build --no-cache -t todo-app-final . && \
docker rm -f todo-app && \
docker run -d -p 20001:8080 --restart unless-stopped --name todo-app todo-app-final && \
docker builder prune -f && \
docker image prune -f
