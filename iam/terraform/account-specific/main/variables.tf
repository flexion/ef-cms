variable "aws_region" {
  default = "us-east-1"
}

variable "zone_name" {
  type = string
}

variable "es_logs_instance_count" {
  type    = string
  default = "1"
}

variable "log_group_environments" {
  description = "deployment environments"
  type        = list(string)
  default     = ["dev", "stg"]
}

variable "cognito_suffix" {
  type = string
}
