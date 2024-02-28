resource "aws_s3_bucket" "api_lambdas_bucket_east" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.lambdas"
  acl    = "private"

  tags = {
    environment = var.environment
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket" "api_lambdas_bucket_west" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-west-1.lambdas"
  acl    = "private"

  provider = aws.us-west-1
  tags = {
    environment = var.environment
  }

  server_side_encryption_configuration {
    rule {
      bucket_key_enabled = false
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}


data "archive_file" "zip_lambdas" {
  type        = "zip"
  output_path = "${path.module}/../template/lambdas/lambdas.js.zip"
  source_dir  = "${path.module}/../template/lambdas/dist/"
}


resource "null_resource" "lambdas_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_lambdas.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/lambdas_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "null_resource" "lambdas_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ${data.archive_file.zip_lambdas.output_path} s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/lambdas_${var.deploying_color}.js.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "null_resource" "puppeteer_layer_east_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_east]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_east.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


resource "null_resource" "puppeteer_layer_west_object" {
  depends_on = [aws_s3_bucket.api_lambdas_bucket_west]
  provisioner "local-exec" {
    command = "aws s3 cp ../../runtimes/puppeteer/puppeteer_lambda_layer.zip s3://${aws_s3_bucket.api_lambdas_bucket_west.id}/${var.deploying_color}_puppeteer_lambda_layer.zip"
  }

  triggers = {
    always_run = timestamp()
  }
}


data "aws_s3_bucket_object" "lambdas_blue_east_object" {
  depends_on = [null_resource.lambdas_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "lambdas_blue.js.zip"
}

data "aws_s3_bucket_object" "lambdas_green_east_object" {
  depends_on = [null_resource.lambdas_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "lambdas_green.js.zip"
}

data "aws_s3_bucket_object" "puppeteer_blue_east_object" {
  depends_on = [null_resource.puppeteer_layer_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "blue_puppeteer_lambda_layer.zip"
}

data "aws_s3_bucket_object" "puppeteer_green_east_object" {
  depends_on = [null_resource.puppeteer_layer_east_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_east.id
  key        = "green_puppeteer_lambda_layer.zip"
}

data "aws_s3_bucket_object" "lambdas_blue_west_object" {
  depends_on = [null_resource.lambdas_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "lambdas_blue.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "lambdas_green_west_object" {
  depends_on = [null_resource.lambdas_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "lambdas_green.js.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "puppeteer_blue_west_object" {
  depends_on = [null_resource.puppeteer_layer_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "blue_puppeteer_lambda_layer.zip"
  provider   = aws.us-west-1
}

data "aws_s3_bucket_object" "puppeteer_green_west_object" {
  depends_on = [null_resource.puppeteer_layer_west_object]
  bucket     = aws_s3_bucket.api_lambdas_bucket_west.id
  key        = "green_puppeteer_lambda_layer.zip"
  provider   = aws.us-west-1
}