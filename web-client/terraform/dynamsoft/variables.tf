variable "environment" {
  type = "string"
}

variable "dns_domain" {
  type = "string"
}

variable "ami" {
  type = "string"
}

variable "availability_zones" {
  type = "list"
}

variable "dynamsoft_s3_zip_path" {
  type = "string"
}

variable "ec2_profile_name" {
  type = "string"
}