locals {
  timeout_time = "90"
}

resource "aws_lambda_function" "change_of_address_lambda" {
  depends_on       = [var.lambdas_object]
  function_name    = "change_of_address_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "handlers.changeOfAddressHandler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "lambdas_${var.current_color}.js.zip"
  source_code_hash = var.lambdas_object_hash
  timeout          = local.timeout_time
  memory_size      = "3008"

  runtime = var.node_version

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = var.lambda_environment
  }
}

resource "aws_lambda_event_source_mapping" "change_of_address_mapping" {
  event_source_arn = aws_sqs_queue.change_of_address_queue.arn
  function_name    = aws_lambda_function.change_of_address_lambda.arn
  batch_size       = 1
  
  scaling_config {
    maximum_concurrency = 5
  }
  
}

resource "aws_sqs_queue" "change_of_address_queue" {
  name                       = "change_of_address_queue_${var.environment}_${var.current_color}"
  visibility_timeout_seconds = local.timeout_time

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.change_of_address_dl_queue.arn
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "change_of_address_dl_queue" {
  name = "change_of_address_dl_queue_${var.environment}_${var.current_color}"
}


