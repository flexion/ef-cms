#!/bin/bash

set -e

# get aws account id if it does not exist in env var
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query "Account" --output text)}

IMAGE_TAG=$(git rev-parse --short HEAD)
MANIFEST=$(aws ecr batch-get-image --repository-name ef-cms-us-east-1 --image-ids imageTag=latest --region us-east-1 --query 'images[].imageManifest' --output text)

if [[ -n $MANIFEST ]]; then
  aws ecr batch-delete-image --repository-name ef-cms-us-east-1 --image-ids imageTag="latest" --region us-east-1
  aws ecr put-image --repository-name ef-cms-us-east-1 --image-tag "SNAPSHOT-$IMAGE_TAG" --image-manifest "$MANIFEST" --region us-east-1
fi

# shellcheck disable=SC2091
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build --no-cache -t "ef-cms-us-east-1:latest" -f Dockerfile-CI .
docker tag "ef-cms-us-east-1:latest" "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest"
