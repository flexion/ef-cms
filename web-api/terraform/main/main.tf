provider "aws" {
  region = var.aws_region
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}

terraform {
  backend "s3" {
  }

  required_providers {
    aws = "3.70.0"
  }
}

data "aws_secretsmanager_secret_version" "secrets" {
  secret_id = "${var.environment}_deploy"
}

locals {
  deploy_vars = jsondecode(
    data.aws_secretsmanager_secret_version.secrets.secret_string
  )
}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

module "ef-cms_apis" {
  source                     = "../template/"
  environment                = var.environment
  zone_name                  = local.deploy_vars.ZONE_NAME
  dns_domain                 = local.deploy_vars.EFCMS_DOMAIN
  cognito_suffix             = local.deploy_vars.COGNITO_SUFFIX
  email_dmarc_policy         = local.deploy_vars.EMAIL_DMARC_POLICY
  es_instance_count          = local.deploy_vars.ES_INSTANCE_COUNT
  es_instance_type           = local.deploy_vars.ES_INSTANCE_TYPE
  irs_superuser_email        = local.deploy_vars.IRS_SUPERUSER_EMAIL
  deploying_color            = var.deploying_color
  blue_table_name            = var.blue_table_name
  green_table_name           = var.green_table_name
  blue_elasticsearch_domain  = var.blue_elasticsearch_domain
  green_elasticsearch_domain = var.green_elasticsearch_domain
  destination_table          = var.destination_table
  disable_emails             = local.deploy_vars.DISABLE_EMAILS
  es_volume_size             = local.deploy_vars.ES_VOLUME_SIZE
  alert_sns_topic_arn        = data.aws_sns_topic.system_health_alarms.arn
  bounced_email_recipient    = local.deploy_vars.BOUNCED_EMAIL_RECIPIENT
  scanner_resource_uri       = var.scanner_resource_uri
  cognito_table_name         = var.cognito_table_name
  prod_env_account_id        = var.prod_env_account_id
  lower_env_account_id       = var.lower_env_account_id
}
