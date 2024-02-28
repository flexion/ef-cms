variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "authorizer_uri" {
  type = string
}

variable "websocket_authorizer_uri" {
  type = string
}
variable "public_authorizer_uri" {
  type = string
}

variable "account_id" {
  type = string
}

variable "zone_id" {
  type = string
}

variable "pool_arn" {
  type = string
}

variable "lambda_environment" {
  type = map(any)
}

variable "region" {
  type = string
}

variable "validate" {
  type = number
}

variable "deploying_color" {
  type = string
}

variable "current_color" {
  type = string
}

variable "lambda_bucket_id" {
  type = string
}

variable "lambdas_object" {
  type = any
}

variable "puppeteer_layer_object" {
  type = any
}

variable "puppeteer_layer_object_hash" {
  type = any
}

variable "lambdas_object_hash" {
  type = any
}


variable "create_health_check_cron" {
  type = number
}

variable "create_check_case_cron" {
  type = number
}

variable "create_streams" {
  type = number
}

variable "create_maintenance_notify" {
  type = number
}

variable "stream_arn" {
  type = string
}

variable "create_triggers" {
  type    = number
  default = 1
}

variable "web_acl_arn" {
  type = string
}

variable "create_seal_in_lower" {
  type = number
}


variable "prod_env_account_id" {
  type = string
}

variable "lower_env_account_id" {
  type = string
}

variable "create_bounce_handler" {
  type = number
}


variable "node_version" {
  type = string
}

variable "use_layers" {
  type    = bool
  default = true
}

variable "enable_health_checks" {
  // e.g. "1" or "0"
  type = string
}

variable "health_check_id" {
  type = string
}

variable "deployment_timestamp" {
  type = number
}
