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
    aws = "3.35.0"
  }
}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

module "ef-cms_apis" {
  source                     = "../template/"
  environment                = var.environment
  zone_name                  = var.zone_name
  dns_domain                 = var.dns_domain
  cognito_suffix             = var.cognito_suffix
  email_dmarc_policy         = var.email_dmarc_policy
  es_instance_count          = var.es_instance_count
  es_instance_type           = var.es_instance_type
  irs_superuser_email        = var.irs_superuser_email
  deploying_color            = var.deploying_color
  blue_table_name            = var.blue_table_name
  green_table_name           = var.green_table_name
  blue_elasticsearch_domain  = var.blue_elasticsearch_domain
  green_elasticsearch_domain = var.green_elasticsearch_domain
  destination_table          = var.destination_table
  disable_emails             = var.disable_emails
  es_volume_size             = var.es_volume_size
  alert_sns_topic_arn        = data.aws_sns_topic.system_health_alarms.arn
  bounced_email_recipient    = var.bounced_email_recipient
  scanner_resource_uri       = var.scanner_resource_uri
  cognito_table_name         = var.cognito_table_name
}



# ignoring rule because the log bucket shouldn'tneed to log writes
#tfsec:ignore:AWS002
resource "aws_s3_bucket" "web_api_log_bucket" {
  bucket = "${var.zone_name}-web-api-log-bucket"
  acl    = "log-delivery-write"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "aws:kms"
      }
    }
  }
  
}