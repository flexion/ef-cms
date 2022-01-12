#!/bin/bash -e

ENVIRONMENT=$1
ZONE_NAME=$2

[ -z "${ENVIRONMENT}" ] && echo "You must have ENVIRONMENT set in your environment" && exit 1

echo "Running terraform with the following environment configs:"
echo "  - ENVIRONMENT=${ENVIRONMENT}"

../../../scripts/verify-terraform-version.sh

BUCKET="${ZONE_NAME}.terraform.deploys"
KEY="ui-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform

echo "Initiating provisioning for environment [${ENVIRONMENT}] in AWS region [${REGION}]"
sh ../bin/create-bucket.sh "${BUCKET}" "${KEY}" "${REGION}"

echo "checking for the dynamodb lock table..."
aws dynamodb list-tables --output json --region "${REGION}" --query "contains(TableNames, '${LOCK_TABLE}')" | grep 'true'
result=$?
if [ ${result} -ne 0 ]; then
  echo "dynamodb lock does not exist, creating"
  sh ../bin/create-dynamodb.sh "${LOCK_TABLE}" "${REGION}"
else
  echo "dynamodb lock table already exists"
fi

set -eo pipefail

export TF_PLUGIN_CACHE_DIR=./terraform-cache
export TF_VAR_environment=$ENVIRONMENT
export TF_VAR_statuspage_dns_record=$STATUSPAGE_DNS_RECORD

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
terraform plan
terraform apply -auto-approve
