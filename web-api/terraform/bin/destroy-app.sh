#!/bin/bash

ENVIRONMENT=$1

BUCKET="${EFCMS_DOMAIN}.terraform.deploys"
KEY="documents-${ENVIRONMENT}.tfstate"
LOCK_TABLE=efcms-terraform-lock
REGION=us-east-1

rm -rf .terraform

# export any outputs that serverless needs first from terraform
# run serverless remove before running terraform destroy?

terraform init -backend=true -backend-config=bucket="${BUCKET}" -backend-config=key="${KEY}" -backend-config=dynamodb_table="${LOCK_TABLE}" -backend-config=region="${REGION}"
TF_VAR_my_s3_state_bucket="${BUCKET}" TF_VAR_my_s3_state_key="${KEY}" terraform destroy -auto-approve -var "dns_domain=${EFCMS_DOMAIN}" -var "environment=${ENVIRONMENT}" -var "cognito_suffix=${COGNITO_SUFFIX}" -var "ses_dmarc_rua=${SES_DMARC_EMAIL}" -var "cloudwatch_role_arn=${CLOUDWATCH_ROLE_ARN}" -var "post_confirmation_role_arn=${POST_CONFIRMATION_ROLE_ARN}" -var "es_instance_count=${ES_INSTANCE_COUNT}"
