
module "zip_seal" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/cases/sealInLowerEnvironmentLambda.ts"
  handler_method = "sealInLowerEnvironmentLambda"
  lambda_name    = "seal_in_lower_${var.environment}_${var.current_color}"
  role           = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role_${var.environment}"
  environment    = var.lambda_environment
  timeout        = "60"
  memory_size    = "768"
}

resource "aws_lambda_permission" "allow_topic_to_seal" {
  count         = var.create_seal_in_lower
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = module.zip_seal.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = "arn:aws:sns:us-east-1:${var.prod_env_account_id}:seal_notifier"
}