#!/bin/bash
set -e
TAG=$1
REGION=us-east-1
REPO=026818612227.dkr.ecr.us-east-1.amazonaws.com

SECRET=$(aws secretsmanager get-secret-value --region $REGION \
  --secret-id ecomstore/app --query SecretString --output text)

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REPO
docker pull $REPO/ecomstore-backend:$TAG

docker rm -f ecomstore-backend || true
docker run -d --name ecomstore-backend --restart unless-stopped -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=aws \
  -e DB_HOST=$(echo $SECRET | jq -r .DB_HOST) \
  -e DB_USERNAME=$(echo $SECRET | jq -r .DB_USERNAME) \
  -e DB_PASSWORD=$(echo $SECRET | jq -r .DB_PASSWORD) \
  -e JWT_SECRET=$(echo $SECRET | jq -r .JWT_SECRET) \
  $REPO/ecomstore-backend:$TAG

docker image prune -f
