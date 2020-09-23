#!/bin/bash

# Sets up the s3 deploy bucket with blue and green files for each API

# Usage
#   ./setup-s3-deploy-files.sh dev

# Arguments
#   - $1 - the environment to check

[ -z "$1" ] && echo "The environment to check must be provided as the \$1 argument." && exit 1
[ -z "${USTC_ADMIN_PASS}" ] && echo "You must have USTC_ADMIN_PASS set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1

ENV=$1
BUCKET_NAME="${ENV}.${ZONE_NAME}.efcms.${ENV}.us-east-1.lambdas"

# aws s3 cp s3://${BUCKET_NAME}/api_blue.js.zip s3://${BUCKET_NAME}/api_green.js.zip
# aws s3 cp s3://${BUCKET_NAME}/api_public_blue.js.zip s3://${BUCKET_NAME}/api_public_green.js.zip
# aws s3 cp s3://${BUCKET_NAME}/websockets_blue.js.zip s3://${BUCKET_NAME}/websockets_green.js.zip
# aws s3 cp s3://${BUCKET_NAME}/blue_puppeteer_lambda_layer.zip s3://${BUCKET_NAME}/green_puppeteer_lambda_layer.zip
# aws s3 cp s3://${BUCKET_NAME}/cron_blue.zip s3://${BUCKET_NAME}/cron_green.zip
aws s3 cp s3://${BUCKET_NAME}/streams_blue.zip s3://${BUCKET_NAME}/streams_green.zip

# BUCKET_NAME="${ENV}.${ZONE_NAME}.efcms.${ENV}.us-west-1.lambdas"

# aws s3 cp s3://${BUCKET_NAME}/api_blue.js.zip s3://${BUCKET_NAME}/api_green.js.zip
# aws s3 cp s3://${BUCKET_NAME}/api_public_blue.js.zip s3://${BUCKET_NAME}/api_public_green.js.zip
# aws s3 cp s3://${BUCKET_NAME}/websockets_blue.js.zip s3://${BUCKET_NAME}/websockets_green.js.zip
# aws s3 cp s3://${BUCKET_NAME}/blue_puppeteer_lambda_layer.zip s3://${BUCKET_NAME}/green_puppeteer_lambda_layer.zip
