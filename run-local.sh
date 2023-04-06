#!/bin/bash
# Used for running the API and necessary services (dynamo, s3, elasticsearch) locally

# shellcheck disable=SC1091
. ./setup-local-env.sh

if [[ -z "$CI" ]]; then
  echo "Stopping dynamodb in case it's already running"
  pkill -f DynamoDBLocal

  echo "starting dynamo"
  ./web-api/start-dynamo.sh &

  echo "Stopping elasticsearch in case it's already running"
  pkill -f elasticsearch

  echo "Starting elasticsearch"
  ./web-api/start-elasticsearch.sh &
  URL=http://localhost:9200/ ./wait-until.sh
fi

npm run build:assets

echo "Seeding elasticsearch"
npm run seed:elasticsearch

# echo "Starting s3rver"
if ! docker ps | grep -q "localstack"; then
  echo "Starting localstack container..."
  docker run -d --rm \
    -p 4566:4566 \
    -e SERVICES=s3 \
    -e DEFAULT_REGION=us-east-1 \
    -e DATA_DIR=/tmp/localstack/data \
    -e LAMBDA_EXECUTOR=docker \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "${PWD}/localstack:/tmp/localstack" \
    --name localstack \
    localstack/localstack &
fi

URL=http://localhost:4566/ ./wait-until.sh

BUCKET_NAME="noop-documents-local-us-east-1"
aws --endpoint-url=http://localhost:4566 s3 mb s3://$BUCKET_NAME
aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://bucket-cors.json
UPLOAD_DIR="./web-api/storage/fixtures/s3/$BUCKET_NAME"
ENDPOINT_URL="http://localhost:4566"
for file in "$UPLOAD_DIR"/*_S3rver_object
do
  filename=$(basename "$file")
  new_filename="${filename%._S3rver_object}"
  aws --endpoint-url="$ENDPOINT_URL" s3 cp "$file" "s3://$BUCKET_NAME/$new_filename" &
  echo "Uploaded file $filename"
done

BUCKET_NAME="noop-temp-documents-local-us-east-1"
aws --endpoint-url=http://localhost:4566 s3 mb s3://$BUCKET_NAME
aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://bucket-cors.json
UPLOAD_DIR="./web-api/storage/fixtures/s3/$BUCKET_NAME"
ENDPOINT_URL="http://localhost:4566"
for file in "$UPLOAD_DIR"/*_S3rver_object
do
  filename=$(basename "$file")
  new_filename="${filename%_S3rver_object}"
  aws --endpoint-url="$ENDPOINT_URL" s3 cp "$file" "s3://$BUCKET_NAME/$new_filename" &
  echo "Uploaded file $filename"
done

# npm run seed:s3

if [ -n "${RESUME}" ]; then
  echo "Resuming operation with previous s3 and dynamo data"
else
  echo "Creating & seeding dynamodb tables"
  npm run seed:db
  exitCode=$?

  if [ "${exitCode}" != 0 ]; then                   
    echo "Seed data is invalid!". 1>&2 && exit 1
  fi
fi

nodemon --delay 1 -e js,ts --ignore web-client/ --ignore dist/ --ignore dist-public/ --ignore cypress-integration/ --ignore cypress-smoketests/ --ignore cypress-readonly --exec "npx ts-node --transpile-only web-api/src/app-local.ts"

if [[ -z "$CI" ]]; then
  echo "Stopping dynamodb, elasticsearch, and s3rver"
  pkill -P "${DYNAMO_PID}"
  pkill -P "${ESEARCH_PID}"
  pkill -P "${S3RVER_PID}"
fi