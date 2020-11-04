provider "aws" {
  region = var.aws_region
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

provider "aws" {
  region = "us-west-1"
  alias  = "us-west-1"
}

module "dynamo_table_1" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-1"

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "dynamo_table_2" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-2"

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "dynamo_table_3" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-3"

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "dynamo_table_4" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-4"

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "dynamo_table_alpha" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-alpha"

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "dynamo_table_beta" {
  source = "./dynamo-table"

  environment = var.environment
  table_name  = "efcms-${var.environment}-beta"

  providers = {
    aws.us-east-1 = aws.us-east-1
    aws.us-west-1 = aws.us-west-1
  }
}

module "elasticsearch_alpha" {
  source = "./elasticsearch"

  environment       = var.environment
  domain_name       = "efcms-search-${var.environment}-alpha"
  es_instance_count = var.es_instance_count
  es_instance_type  = var.es_instance_type
  es_volume_size    = var.es_volume_size

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "elasticsearch_beta" {
  source = "./elasticsearch"

  environment       = var.environment
  domain_name       = "efcms-search-${var.environment}-beta"
  es_instance_count = var.es_instance_count
  es_instance_type  = var.es_instance_type
  es_volume_size    = var.es_volume_size

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "elasticsearch_1" {
  source = "./elasticsearch"

  environment       = var.environment
  domain_name       = "efcms-search-${var.environment}-1"
  es_instance_count = var.es_instance_count
  es_instance_type  = var.es_instance_type
  es_volume_size    = var.es_volume_size

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "elasticsearch_2" {
  source = "./elasticsearch"

  environment       = var.environment
  domain_name       = "efcms-search-${var.environment}-2"
  es_instance_count = var.es_instance_count
  es_instance_type  = var.es_instance_type
  es_volume_size    = var.es_volume_size

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "elasticsearch_3" {
  source = "./elasticsearch"

  environment       = var.environment
  domain_name       = "efcms-search-${var.environment}-3"
  es_instance_count = var.es_instance_count
  es_instance_type  = var.es_instance_type
  es_volume_size    = var.es_volume_size

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}

module "elasticsearch_4" {
  source = "./elasticsearch"

  environment       = var.environment
  domain_name       = "efcms-search-${var.environment}-4"
  es_instance_count = var.es_instance_count
  es_instance_type  = var.es_instance_type
  es_volume_size    = var.es_volume_size

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}
