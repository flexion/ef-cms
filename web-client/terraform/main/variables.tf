variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type = string
}

variable "cloudfront_default_ttl" {
  type    = string
  default = "86400"
}

variable "cloudfront_max_ttl" {
  type    = string
  default = "31536000"
}

variable "statuspage_dns_record" {
  type = string
  default = ""
}
