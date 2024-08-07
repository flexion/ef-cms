# VPC Configuration
resource "aws_vpc" "vpc" {
  cidr_block           = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true
}

# Private Subnet A (No Public IPs)
resource "aws_subnet" "subnet_a" {
  vpc_id                  = aws_vpc.vpc.id 
  cidr_block              = var.subnet_a_block
  availability_zone       = var.zone_a
  map_public_ip_on_launch = false
}

# Private Subnet B (No Public IPs)
resource "aws_subnet" "subnet_b" {
  vpc_id                  = aws_vpc.vpc.id 
  cidr_block              = var.subnet_b_block
  availability_zone       = var.zone_b
  map_public_ip_on_launch = false
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat_eip" {
  vpc = true
}

# NAT Gateway in Subnet B
resource "aws_nat_gateway" "nat" {
  subnet_id     = aws_subnet.subnet_b.id
  allocation_id = aws_eip.nat_eip.id
}

# Route Table for Private Subnets
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }
}

# Associate Private Subnet A with Route Table
resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.subnet_a.id
  route_table_id = aws_route_table.private.id
}

# Associate Private Subnet B with Route Table
resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.subnet_b.id
  route_table_id = aws_route_table.private.id
}