#!/bin/bash -e

( ! command -v aws > /dev/null ) && echo "aws was not found on your path. Please install aws." && exit 1
( ! command -v node > /dev/null ) && echo "node was not found on your path. Please install node." && exit 1

[ -z "$1" ] && echo "The ENV to deploy to must be provided as the \$1 argument.  An example value of this includes [dev, stg, prod... ]" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

ENV=$1

ELASTICSEARCH_PERFOMANCE_ENDPOINT=$(aws es describe-elasticsearch-domain \
  --domain-name "performance-logs-${ENV}" \
  --region "us-east-1" \
  --query 'DomainStatus.Endpoint' \
  --output text)


if [[ -n "${ELASTICSEARCH_PERFOMANCE_ENDPOINT}" ]]; then
  echo " => Setting up Performance Cluster"
  npx ts-node --transpile-only ./web-api/elasticsearch/elasticsearch-performance-index-settings.ts "${ELASTICSEARCH_PERFOMANCE_ENDPOINT}"
else
  echo "!!! Did not calculate an ELASTICSEARCH_ENDPOINT"
  exit 1;
fi
