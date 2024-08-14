
variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "public_key_name" {
  type = string
}

variable "instance_type" {
  type = string 
  default = "t2.micro"
}

variable "instance_root_block_device_volume_size" {
  type = string
  default = "8"
}

variable "openvpn_install_script_location" {
  description = "The location of an OpenVPN installation script compatible with https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh"
  default     = "https://raw.githubusercontent.com/dumrauf/openvpn-install/master/openvpn-install.sh"
}

variable "ovpn_users" {
  type        = list(string)
  description = "The list of users to automatically provision with OpenVPN access"
  default = [
    "cody"
  ]
}

variable "ec2_username" {
  type = string
  default = "ec2-user"
}

variable "ssh_private_key_file" {
  type = string
  default = "cody-test.pem"
}

variable "ovpn_config_directory" {
  description = "The name of the directory to eventually download the OVPN configuration files to"
  default     = "generated/ovpn-config"
}