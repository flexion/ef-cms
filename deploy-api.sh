#!/bin/bash

pushd web-api/runtimes/puppeteer
  ./build.sh
popd

pushd web-api/runtimes/clamav
  ./build.sh
popd

ENVIRONMENT="${ENV}"

[ -z "${ENV}" ] && echo "You must have ENV set in your environment" && exit 1
[ -z "${CIRCLE_BRANCH}" ] && echo "You must have CIRCLE_BRANCH set in your environment" && exit 1
[ -z "${MIGRATE_FLAG}" ] && echo "You must have MIGRATE_FLAG set in your environment" && exit 1
[ -z "${DEPLOYING_COLOR}" ] && echo "You must have DEPLOYING_COLOR set in your environment" && exit 1
[ -z "${ZONE_NAME}" ] && echo "You must have ZONE_NAME set in your environment" && exit 1
[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${COGNITO_SUFFIX}" ] && echo "You must have COGNITO_SUFFIX set in your environment" && exit 1
[ -z "${EMAIL_DMARC_POLICY}" ] && echo "You must have EMAIL_DMARC_POLICY set in your environment" && exit 1
[ -z "${IRS_SUPERUSER_EMAIL}" ] && echo "You must have IRS_SUPERUSER_EMAIL set in your environment" && exit 1
[ -z "${ES_INSTANCE_TYPE}" ] && echo "You must have ES_INSTANCE_TYPE set in your environment" && exit 1
[ -z "${DISABLE_EMAILS}" ] && echo "You must have DISABLE_EMAILS set in your environment" && exit 1
[ -z "${ES_VOLUME_SIZE}" ] && echo "You must have ES_VOLUME_SIZE set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"
echo "  - CIRCLE_BRANCH=${CIRCLE_BRANCH}"
echo "  - MIGRATE_FLAG=${MIGRATE_FLAG}"
echo "  - DEPLOYING_COLOR=${DEPLOYING_COLOR}"
echo "  - ZONE_NAME=${ZONE_NAME}"
echo "  - EFCMS_DOMAIN=${EFCMS_DOMAIN}"
echo "  - COGNITO_SUFFIX=${COGNITO_SUFFIX}"
echo "  - EMAIL_DMARC_POLICY=${EMAIL_DMARC_POLICY}"
echo "  - IRS_SUPERUSER_EMAIL=${IRS_SUPERUSER_EMAIL}"
echo "  - ES_INSTANCE_TYPE=${ES_INSTANCE_TYPE}"
echo "  - DISABLE_EMAILS=${DISABLE_EMAILS}"
echo "  - ES_VOLUME_SIZE=${ES_VOLUME_SIZE}"
echo "  - BOUNCED_EMAIL_RECIPIENT=${BOUNCED_EMAIL_RECIPIENT}"

docker build -t efcms -f Dockerfile-Terraform .

  # --env-file <(env) \

  # -e TF_LOG="trace" \
  # -e TF_LOG_PATH="terraform.txt" \

docker run \
  -e ENVIRONMENT="${ENVIRONMENT}" \
  -e CIRCLE_BRANCH="${CIRCLE_BRANCH}" \
  -e MIGRATE_FLAG="${MIGRATE_FLAG}" \
  -e DEPLOYING_COLOR="${DEPLOYING_COLOR}" \
  -e ZONE_NAME="${ZONE_NAME}" \
  -e EFCMS_DOMAIN="${EFCMS_DOMAIN}" \
  -e COGNITO_SUFFIX="${COGNITO_SUFFIX}" \
  -e EMAIL_DMARC_POLICY="${EMAIL_DMARC_POLICY}" \
  -e IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL}" \
  -e ES_INSTANCE_TYPE="${ES_INSTANCE_TYPE}" \
  -e DISABLE_EMAILS="${DISABLE_EMAILS}" \
  -e ES_VOLUME_SIZE="${ES_VOLUME_SIZE}" \
  -e BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT}" \
  -e CIRCLE_BRANCH="${CIRCLE_BRANCH}" \
  -e AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
  -e AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
  -e AWS_SESSION_TOKEN="${AWS_SESSION_TOKEN}" \
  --rm efcms /bin/sh \
  -c "npm run deploy:api -- ${ENVIRONMENT}"
