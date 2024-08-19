module "sequence_performance_report_lambda_role" {
  source      = "../../modules/lambda-role"
  role_name   = "sequence_performance_report_lambda_role_${var.environment}"
  environment = var.environment
  dns_domain  = var.dns_domain
}

resource "terraform_data" "locals" {
  input = {
    STAGE = var.environment
  }
}

module "report_lambda_function" {
  source         = "../lambda"
  handler_file   = "./web-api/src/lambdas/SequencePerformanceReport/index.ts"
  handler_method = "handler"
  lambda_name    = "sequence_performance_report_lambda_${var.environment}"
  role           = module.sequence_performance_report_lambda_role.role_arn
  environment    = terraform_data.locals.output
  timeout        = "29"
  memory_size    = "3008"
}

resource "aws_cloudwatch_event_rule" "sequence_performance_report_schedule" {
  name                = "sequence_performance_report_schedule_${var.environment}"
  description         = "Scheduled Sequence Performance Report Lambda function"
  schedule_expression = "cron(0 16 ? * 2 *)"
}

resource "aws_cloudwatch_event_target" "sequence_performance_report_lambda_target" {
  rule      = aws_cloudwatch_event_rule.sequence_performance_report_schedule.name
  target_id = "sequence_performance_report_lambda_target"
  arn       = module.report_lambda_function.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_invoke_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = module.report_lambda_function.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.sequence_performance_report_schedule.arn
}
