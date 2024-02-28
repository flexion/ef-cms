resource "aws_lambda_function" "pdf_generation_lambda" {
  depends_on       = [var.lambdas_object]
  function_name    = "pdf_generator_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${var.account_id}:role/lambda_role_${var.environment}"
  handler          = "handlers.pdfGenerationHandler"
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "lambdas_${var.current_color}.js.zip"
  source_code_hash = var.lambdas_object_hash
  timeout          = "29"
  memory_size      = "3008"

  # this one ALWAYS needs the puppeteer layer 
  layers = [
    aws_lambda_layer_version.puppeteer_layer.arn
  ]

  runtime = var.node_version

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = var.lambda_environment
  }
}

