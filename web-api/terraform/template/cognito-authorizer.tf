
module "cognito_authorizer_lambda_east" {
  source = "../api/lambda"
  handler = "./web-api/terraform/template/lambdas/cognito-authorizer.ts"
  file_name = "cognito-authorizer-east"
  function_name = "cognito_authorizer_lambda_${var.environment}"
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/authorizer_lambda_role_${var.environment}"
  environment = {
    USER_POOL_ID_MAIN = aws_cognito_user_pool.pool.id
    USER_POOL_ID_IRS  = aws_cognito_user_pool.irs_pool.id
    NODE_ENV          = "production"
    LOG_LEVEL         = "info"
    STAGE             = var.environment
  }

  providers = {
    aws = aws.us-east-1
  }
}

module "cognito_authorizer_lambda_west" {
  source = "../api/lambda"
  handler = "./web-api/terraform/template/lambdas/cognito-authorizer.ts"
  file_name = "cognito-authorizer-west"
  function_name = "cognito_authorizer_lambda_${var.environment}"
  role = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/authorizer_lambda_role_${var.environment}"
  environment = {
    USER_POOL_ID_MAIN = aws_cognito_user_pool.pool.id
    USER_POOL_ID_IRS  = aws_cognito_user_pool.irs_pool.id
    NODE_ENV          = "production"
    LOG_LEVEL         = "info"
    STAGE             = var.environment
  }

  providers = {
    aws = aws.us-west-1
  }
}

