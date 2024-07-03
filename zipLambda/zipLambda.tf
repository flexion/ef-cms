provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}

module "api_async_lambda" {
  source         = "../web-api/terraform/modules/lambda"
  handler_file   = "zipLambda/testLambda.ts"
  handler_method = "handler"
  lambda_name    = "zip_lambda_delete_me"
  role           = "arn:aws:iam::350455059537:role/lambda_role_test_blue"
  environment = {
    STAGE = "test"
    EFCMS_DOMAIN = "test.ef-cms.ustaxcourt.gov"
  }
  timeout     = "900"
  memory_size = "7000"
}
