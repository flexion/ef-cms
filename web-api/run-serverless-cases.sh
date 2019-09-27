#!/bin/bash -e

pushd ./web-api/terraform/main
  ../bin/deploy-init.sh "${1}"
  export ELASTICSEARCH_ENDPOINT=$(terraform output elasticsearch_endpoint)
popd

./web-api/run-serverless.sh "${1}" "${2}" "casesHandlers.js" "serverless-cases.yml" "build:api:cases"
