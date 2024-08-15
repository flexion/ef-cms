variable "postgres_user" {
  type = string
}

variable "postgres_password" {
  type = string
}

variable "environment" {
  type = string
}

variable "instance_size" {
  type = string
  default = "db.t4g.micro"
}

variable "vpc_id" {
  type = string
}

variable "subnet_group_name" {
  type = string
}

variable "security_group_ids" {
  type = list(string)
}

variable "security_group_cidr_blocks" {
  type = list(string)
}

variable "replicate_source_db" {
  type = string
  default = null
}

variable "db_name" {
  type = string
  default = null
}