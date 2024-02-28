
resource "aws_s3_bucket_object" "amended-petition-form-bucket-object-east" {
  bucket = aws_s3_bucket.documents_us_east_1.id
  key    = "amended-petition-form.pdf"
  source = "${path.module}/lambdas/dist/amended-petition-form.pdf"
}

resource "aws_acm_certificate" "api_gateway_cert_east" {
  domain_name       = "*.${var.dns_domain}"
  validation_method = "DNS"

  tags = {
    Name          = "wildcard.${var.dns_domain}"
    ProductDomain = "EFCMS API"
    Environment   = var.environment
    Description   = "Certificate for wildcard.${var.dns_domain}"
    ManagedBy     = "terraform"
  }
}

resource "aws_route53_record" "route53_record_east" {
  for_each = {
    for dvo in aws_acm_certificate.api_gateway_cert_east.domain_validation_options : dvo.domain_name => {
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

resource "aws_acm_certificate_validation" "wildcard_dns_validation_east" {
  certificate_arn         = aws_acm_certificate.api_gateway_cert_east.arn
  validation_record_fqdns = [for record in aws_route53_record.route53_record_east : record.fqdn]
  provider                = aws.us-east-1
}


data "aws_dynamodb_table" "green_dynamo_table" {
  depends_on = [
    module.dynamo_table_alpha,
    module.dynamo_table_beta,
  ]
  name = var.green_table_name
}

data "aws_dynamodb_table" "blue_dynamo_table" {
  depends_on = [
    module.dynamo_table_alpha,
    module.dynamo_table_beta,
  ]
  name = var.blue_table_name
}

resource "aws_api_gateway_domain_name" "public_api_custom_main_east" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_east]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_east.arn
  domain_name              = "public-api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_domain_name" "api_custom_main_east" {
  depends_on               = [aws_acm_certificate.api_gateway_cert_east]
  regional_certificate_arn = aws_acm_certificate.api_gateway_cert_east.arn
  domain_name              = "api.${var.dns_domain}"
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_route53_record" "api_route53_main_east_regional_record" {
  name           = aws_api_gateway_domain_name.api_custom_main_east.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "api_main_us_east_1"

  alias {
    name                   = aws_api_gateway_domain_name.api_custom_main_east.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.api_custom_main_east.regional_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

resource "aws_route53_record" "public_api_route53_main_east_regional_record" {
  name           = aws_api_gateway_domain_name.public_api_custom_main_east.domain_name
  type           = "A"
  zone_id        = data.aws_route53_zone.zone.id
  set_identifier = "public_api_main_us_east_1"

  alias {
    name                   = aws_api_gateway_domain_name.public_api_custom_main_east.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.public_api_custom_main_east.regional_zone_id
    evaluate_target_health = true
  }

  latency_routing_policy {
    region = "us-east-1"
  }
}

module "api-east-waf" {
  environment = var.environment
  providers = {
    aws = aws.us-east-1
  }
  source = "./waf/"
}

module "api-east-green" {
  source                    = "../api/"
  environment               = var.environment
  dns_domain                = var.dns_domain

  lambdas_object            = null_resource.lambdas_east_object
  lambdas_object_hash       =  data.aws_s3_bucket_object.lambdas_green_east_object.etag
  puppeteer_layer_object    = null_resource.puppeteer_layer_east_object
  puppeteer_layer_object_hash    = data.aws_s3_bucket_object.puppeteer_green_east_object.etag

  node_version              = var.green_node_version
  create_maintenance_notify = 1
  authorizer_uri            = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  websocket_authorizer_uri  = aws_lambda_function.websocket_authorizer_lambda.invoke_arn
  public_authorizer_uri     = aws_lambda_function.public_api_authorizer_lambda.invoke_arn
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  pool_arn                  = aws_cognito_user_pool.pool.arn
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "green"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.green_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.green_elasticsearch_domain)) > 0 ? module.elasticsearch_beta[0].endpoint : module.elasticsearch_alpha[0].endpoint
    REGION                 = "us-east-1"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws = aws.us-east-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color                  = "green"
  deploying_color                = var.deploying_color
  deployment_timestamp           = var.deployment_timestamp
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_east.id
  use_layers                     = var.green_use_layers
  create_check_case_cron         = 1
  create_health_check_cron       = 1
  create_streams                 = 1
  stream_arn                     = data.aws_dynamodb_table.green_dynamo_table.stream_arn
  web_acl_arn                    = module.api-east-waf.web_acl_arn
  enable_health_checks           = var.enable_health_checks
  health_check_id                = length(aws_route53_health_check.failover_health_check_east) > 0 ? aws_route53_health_check.failover_health_check_east[0].id : null


  # lambda to seal cases in lower environment (only deployed to lower environments)
  create_seal_in_lower      = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  lower_env_account_id      = var.lower_env_account_id
  prod_env_account_id       = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  create_bounce_handler      = 1
}

module "api-east-blue" {
  source                    = "../api/"
  environment               = var.environment
  dns_domain                = var.dns_domain

  lambdas_object            = null_resource.lambdas_east_object
  lambdas_object_hash       =  data.aws_s3_bucket_object.lambdas_green_east_object.etag
  puppeteer_layer_object    = null_resource.puppeteer_layer_east_object
  puppeteer_layer_object_hash    = data.aws_s3_bucket_object.puppeteer_green_east_object.etag

  create_maintenance_notify = 1
  pool_arn                  = aws_cognito_user_pool.pool.arn
  node_version              = var.blue_node_version
  authorizer_uri            = aws_lambda_function.cognito_authorizer_lambda.invoke_arn
  websocket_authorizer_uri  = aws_lambda_function.websocket_authorizer_lambda.invoke_arn
  public_authorizer_uri     = aws_lambda_function.public_api_authorizer_lambda.invoke_arn
  account_id                = data.aws_caller_identity.current.account_id
  zone_id                   = data.aws_route53_zone.zone.id
  lambda_environment = merge(data.null_data_source.locals.outputs, {
    CURRENT_COLOR          = "blue"
    DEPLOYMENT_TIMESTAMP   = var.deployment_timestamp
    DYNAMODB_ENDPOINT      = "dynamodb.us-east-1.amazonaws.com"
    DYNAMODB_TABLE_NAME    = var.blue_table_name
    ELASTICSEARCH_ENDPOINT = length(regexall(".*beta.*", var.blue_elasticsearch_domain)) > 0 ? module.elasticsearch_beta[0].endpoint : module.elasticsearch_alpha[0].endpoint
    REGION                 = "us-east-1"
  })
  region   = "us-east-1"
  validate = 1
  providers = {
    aws = aws.us-east-1
    aws.us-east-1 = aws.us-east-1
  }
  current_color                  = "blue"
  deploying_color                = var.deploying_color
  deployment_timestamp           = var.deployment_timestamp
  lambda_bucket_id               = aws_s3_bucket.api_lambdas_bucket_east.id
  use_layers                     = var.blue_use_layers
  create_check_case_cron         = 1
  create_health_check_cron       = 1
  create_streams                 = 1
  stream_arn                     = data.aws_dynamodb_table.blue_dynamo_table.stream_arn
  web_acl_arn                    = module.api-east-waf.web_acl_arn
  enable_health_checks           = var.enable_health_checks
  health_check_id                = length(aws_route53_health_check.failover_health_check_east) > 0 ? aws_route53_health_check.failover_health_check_east[0].id : null


  # lambda to seal cases in lower environment (only deployed to lower environments)
  create_seal_in_lower      = var.lower_env_account_id == data.aws_caller_identity.current.account_id ? 1 : 0
  lower_env_account_id      = var.lower_env_account_id
  prod_env_account_id       = var.prod_env_account_id

  # lambda to handle bounced service email notifications
  create_bounce_handler      = 1
}
