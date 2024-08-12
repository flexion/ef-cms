resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "16.3"
  instance_class       = var.instance_size
  db_name              = "${var.environment}_dawson"
  username             = var.postgres_user
  password             = var.postgres_password
  parameter_group_name = aws_db_parameter_group.postgres.name
  vpc_security_group_ids = [aws_security_group.postgres.id]
  db_subnet_group_name   = var.subnet_group_name
  skip_final_snapshot = true
  publicly_accessible = false
  apply_immediately = true
}

resource "aws_db_parameter_group" "postgres" {
  name   = "postgres"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_security_group" "postgres" {
  vpc_id = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = var.security_group_ids
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db-security-group"
  }
}