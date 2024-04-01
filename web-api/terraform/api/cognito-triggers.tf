data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "allow_user_migration_trigger" {
  statement_id  = "AllowUserMigrationExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_user_migration_lambda[0].function_name
  principal     = "cognito-idp.amazonaws.com"
  count         = var.create_triggers
  source_arn    = var.pool_arn
}

resource "aws_lambda_function" "cognito_user_migration_lambda" {
  function_name    = "cognito_user_migration_lambda_${var.environment}_${var.current_color}"
  role             = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/iam_cognito_user_migration_lambda_role_${var.environment}"
  handler          = "cognito-triggers.handler"
  timeout          = "29"
  memory_size      = "3008"
  runtime          = var.node_version
  depends_on       = [var.triggers_object]
  s3_bucket        = var.lambda_bucket_id
  s3_key           = "triggers_${var.current_color}.js.zip"
  source_code_hash = var.triggers_object_hash
  count            = var.create_triggers

  environment {
    variables = var.lambda_environment
  }
}
