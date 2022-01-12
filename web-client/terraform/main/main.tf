provider "aws" {
  region = var.aws_region
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

module "environment" {
  source = "../common"

  zone_name              = local.deploy_vars.ZONE_NAME
  environment            = var.environment
  dns_domain             = local.deploy_vars.EFCMS_DOMAIN
  cloudfront_default_ttl = var.cloudfront_default_ttl
  cloudfront_max_ttl     = var.cloudfront_max_ttl

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}

data "aws_route53_zone" "zone" {
  name = "${local.deploy_vars.ZONE_NAME}."
}

module "dynamsoft_us_east" {
  source = "../dynamsoft"

  environment = var.environment
  dns_domain  = local.deploy_vars.EFCMS_DOMAIN
  providers = {
    aws = aws.us-east-1
  }
  zone_name              = local.deploy_vars.ZONE_NAME
  ami                    = "ami-0a313d6098716f372"
  availability_zones     = ["us-east-1a"]
  is_dynamsoft_enabled   = local.deploy_vars.IS_DYNAMSOFT_ENABLED
  dynamsoft_s3_zip_path  = local.deploy_vars.DYNAMSOFT_S3_ZIP_PATH
  dynamsoft_url          = local.deploy_vars.DYNAMSOFT_URL
  dynamsoft_product_keys = local.deploy_vars.DYNAMSOFT_PRODUCT_KEYS
}

module "dynamsoft_us_west" {
  source = "../dynamsoft"

  environment = var.environment
  dns_domain  = local.deploy_vars.EFCMS_DOMAIN
  providers = {
    aws = aws.us-west-1
  }
  zone_name              = local.deploy_vars.ZONE_NAME
  ami                    = "ami-06397100adf427136"
  availability_zones     = ["us-west-1a"]
  is_dynamsoft_enabled   = local.deploy_vars.IS_DYNAMSOFT_ENABLED
  dynamsoft_s3_zip_path  = local.deploy_vars.DYNAMSOFT_S3_ZIP_PATH
  dynamsoft_url          = local.deploy_vars.DYNAMSOFT_URL
  dynamsoft_product_keys = local.deploy_vars.DYNAMSOFT_PRODUCT_KEYS
}


resource "aws_route53_record" "record_certs" {
  for_each = {
    for dvo in module.dynamsoft_us_east.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}


resource "aws_route53_record" "record_east_www" {
  name           = "dynamsoft-lib.${local.deploy_vars.EFCMS_DOMAIN}"
  type           = "CNAME"
  zone_id        = data.aws_route53_zone.zone.zone_id
  set_identifier = "us-east-1"
  count          = local.deploy_vars.IS_DYNAMSOFT_ENABLED
  records = [
    module.dynamsoft_us_east.dns_name,
  ]
  latency_routing_policy {
    region = "us-east-1"
  }
  ttl = 60
}

resource "aws_route53_record" "record_west_www" {
  name           = "dynamsoft-lib.${local.deploy_vars.EFCMS_DOMAIN}"
  type           = "CNAME"
  zone_id        = data.aws_route53_zone.zone.zone_id
  set_identifier = "us-west-1"
  count          = local.deploy_vars.IS_DYNAMSOFT_ENABLED
  records = [
    module.dynamsoft_us_west.dns_name
  ]
  latency_routing_policy {
    region = "us-west-1"
  }
  ttl = 60
}

resource "aws_acm_certificate_validation" "dns_validation_east" {
  certificate_arn         = module.dynamsoft_us_east.cert_arn
  validation_record_fqdns = [for record in aws_route53_record.record_certs : record.fqdn]
  provider                = aws.us-east-1
}

resource "aws_acm_certificate_validation" "dns_validation_west" {
  certificate_arn         = module.dynamsoft_us_west.cert_arn
  validation_record_fqdns = [for record in aws_route53_record.record_certs : record.fqdn]
  provider                = aws.us-west-1
}

resource "aws_route53_record" "statuspage" {
  count   = var.statuspage_dns_record != "" ? 1 : 0
  name    = "status.${local.deploy_vars.EFCMS_DOMAIN}"
  type    = "CNAME"
  zone_id = data.aws_route53_zone.zone.zone_id
  ttl     = 60
  records = [
    var.statuspage_dns_record
  ]
}

data "aws_sns_topic" "system_health_alarms" {
  // account-level resource
  name = "system_health_alarms"
}

resource "aws_cloudwatch_metric_alarm" "public_ui_health_check" {
  alarm_name          = "${local.deploy_vars.EFCMS_DOMAIN} is accessible over HTTPS"
  namespace           = "AWS/Route53"
  metric_name         = "HealthCheckStatus"
  comparison_operator = "LessThanThreshold"
  statistic           = "Minimum"
  threshold           = "1"
  evaluation_periods  = "2"
  period              = "60"
  count               = local.deploy_vars.ENABLE_HEALTH_CHECKS

  dimensions = {
    HealthCheckId = aws_route53_health_check.public_ui_health_check[0].id
  }

  alarm_actions             = [data.aws_sns_topic.system_health_alarms.arn]
  insufficient_data_actions = [data.aws_sns_topic.system_health_alarms.arn]
  ok_actions                = [data.aws_sns_topic.system_health_alarms.arn]
}

resource "aws_route53_health_check" "public_ui_health_check" {
  fqdn              = local.deploy_vars.EFCMS_DOMAIN
  port              = 443
  type              = "HTTPS"
  count             = local.deploy_vars.ENABLE_HEALTH_CHECKS
  resource_path     = "/"
  failure_threshold = "3"
  request_interval  = "30"
  regions           = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}

resource "aws_cloudwatch_metric_alarm" "ui_health_check" {
  alarm_name          = "app.${local.deploy_vars.EFCMS_DOMAIN} is accessible over HTTPS"
  namespace           = "AWS/Route53"
  metric_name         = "HealthCheckStatus"
  comparison_operator = "LessThanThreshold"
  statistic           = "Minimum"
  threshold           = "1"
  evaluation_periods  = "2"
  period              = "60"
  count               = local.deploy_vars.ENABLE_HEALTH_CHECKS
  dimensions = {
    HealthCheckId = aws_route53_health_check.ui_health_check[0].id
  }

  alarm_actions             = [data.aws_sns_topic.system_health_alarms.arn]
  insufficient_data_actions = [data.aws_sns_topic.system_health_alarms.arn]
  ok_actions                = [data.aws_sns_topic.system_health_alarms.arn]
}

resource "aws_route53_health_check" "ui_health_check" {
  fqdn              = "app.${local.deploy_vars.EFCMS_DOMAIN}"
  port              = 443
  count             = local.deploy_vars.ENABLE_HEALTH_CHECKS
  type              = "HTTPS"
  resource_path     = "/"
  failure_threshold = "3"
  request_interval  = "30"
  regions           = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}

resource "aws_cloudwatch_metric_alarm" "status_health_check" {
  alarm_name          = "${local.deploy_vars.EFCMS_DOMAIN} health check endpoint"
  namespace           = "AWS/Route53"
  metric_name         = "HealthCheckStatus"
  comparison_operator = "LessThanThreshold"
  statistic           = "Minimum"
  count               = local.deploy_vars.ENABLE_HEALTH_CHECKS
  threshold           = "1"
  evaluation_periods  = "2"
  period              = "60"

  dimensions = {
    HealthCheckId = aws_route53_health_check.status_health_check[0].id
  }

  alarm_actions             = [data.aws_sns_topic.system_health_alarms.arn]
  insufficient_data_actions = [data.aws_sns_topic.system_health_alarms.arn]
  ok_actions                = [data.aws_sns_topic.system_health_alarms.arn]
}

resource "aws_route53_health_check" "status_health_check" {
  fqdn               = "public-api.${local.deploy_vars.EFCMS_DOMAIN}"
  port               = 443
  type               = "HTTPS_STR_MATCH"
  resource_path      = "/public-api/health"
  failure_threshold  = "3"
  request_interval   = "30"
  count              = local.deploy_vars.ENABLE_HEALTH_CHECKS
  invert_healthcheck = true
  search_string      = "false"                                 # Search for any JSON property returning "false"
  regions            = ["us-east-1", "us-west-1", "us-west-2"] # Minimum of three regions required
}
