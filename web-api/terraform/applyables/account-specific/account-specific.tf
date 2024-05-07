provider "aws" {
  region = "us-east-1"
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
    bucket         = "ustc-case-mgmt.flexion.us.terraform.deploys"
    key            = "permissions-account.tfstate"
    region         = "us-east-1"
    dynamodb_table = "efcms-terraform-lock"
  }

  required_providers {
    aws = "5.47.0"
    opensearch = {
      source  = "opensearch-project/opensearch"
      version = "2.2.0"
    }
  }
}

provider "opensearch" {
  url = "https://${aws_opensearch_domain.efcms-logs.endpoint}"
}

module "health-alarms-east" {
  source = "../../modules/health-alarms"
  providers = {
    aws = aws.us-east-1
  }
}

module "health-alarms-west" {
  source = "../../modules/health-alarms"
  providers = {
    aws = aws.us-west-1
  }
}

module "api-gateway-global-logging-permissions" {
  source = "../../modules/api-gateway-global-logging-permissions"
}

module "ci-cd" {
  source = "../../modules/ci-cd"
}

module "kibana" {
  source = "../../modules/kibana"
  cognito_suffix = var.cognito_suffix
}

module "dawson-developer-permissions" {
  source = "../../modules/dawson-developer-permissions"
  dawson_dev_trusted_role_arns = var.dawson_dev_trusted_role_arns
}

module "dynamsoft" {
  source = "../../modules/dynamsoft"
  zone_name = var.zone_name
}
