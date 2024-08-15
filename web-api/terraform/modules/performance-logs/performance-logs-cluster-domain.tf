data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

provider "aws" {
  region = "us-east-1"
}

resource "aws_opensearch_domain" "performance_logs" {
  domain_name = "performance-logs-${var.environment}"

  engine_version = "OpenSearch_2.11"

  cluster_config {
    instance_type = var.es_instance_type
    instance_count = var.es_instance_count
  }

  ebs_options {
    ebs_enabled = true
    volume_size = var.es_volume_size
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }
}
