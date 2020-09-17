variable "environment" {
  type = string
}

variable "dns_domain" {
  type = string
}

variable "authorizer_uri" {
  type = string
}

variable "account_id" {
  type = string
}

variable "zone_id" {
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

variable "api_object" {
  type = any
}

variable "api_public_object" {
  type = any
}

variable "websockets_object" {
  type = any
}

variable "puppeteer_layer_object" {
  type = any
}

variable "public_object_hash" {
  type = string
}