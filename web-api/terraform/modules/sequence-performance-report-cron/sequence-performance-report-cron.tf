module "sequence_performance_report_lambda_role" {
  source      = "../../modules/lambda-role"
  role_name   = "sequence_performance_report_lambda_role_${var.environment}"
  environment = var.environment
  dns_domain  = var.dns_domain
}

module "report_lambda_function" {
  source         = "../lambda"
  handler_file   = "./aws/lambdas/SequencePerformanceReport/index.js"
  handler_method = "handler"
  lambda_name    = "sequence_performance_report_lambda_${var.environment}"
  role           = module.sequence_performance_report_lambda_role.role_arn
  environment    = {}
  timeout        = "29"
  memory_size    = "3008"
}