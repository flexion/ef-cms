#!/bin/bash -e
docker build -t cypress -f Dockerfile .
set +e
docker run --name "${CONTAINER_NAME}" -e SLS_DEBUG=* -e AWS_ACCESS_KEY_ID=noop -e AWS_SECRET_ACCESS_KEY=noop cypress /bin/sh -c 'npm run install:dynamodb && (npm run start:api &) && ./wait-until.sh http://localhost:3000/api/swagger && (npm run start:client:cypress &) && ./wait-until.sh http://localhost:1234 && npm run cypress'
CODE="$?"
set -e
mkdir -p cypress
docker cp "${CONTAINER_NAME}:/home/app/cypress/videos" cypress || true
docker cp "${CONTAINER_NAME}:/home/app/cypress/screenshots" cypress || true
docker rm "${CONTAINER_NAME}"
exit "${CODE}"
