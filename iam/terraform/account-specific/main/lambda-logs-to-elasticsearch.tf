data "archive_file" "zip_logs_to_es_lambda" {
  type        = "zip"
  output_path = "${path.cwd}/../../../../aws/lambdas/LogsToElasticSearch_info.zip"
  source_file = "${path.cwd}/../../../../aws/lambdas/LogsToElasticSearch_info/index.js"
}

resource "aws_lambda_function" "logs_to_es" {
  filename = data.archive_file.zip_logs_to_es_lambda.output_path
  function_name = "LogsToElasticSearch_info"
  handler = "index.handler"
  role = aws_iam_role.lambda_elasticsearch_execution_role.arn
  runtime = "nodejs10.x"

  environment {
    variables = {
      es_endpoint = aws_elasticsearch_domain.efcms-logs.endpoint
    }
  }
}

resource "aws_cloudwatch_log_group" "logs_to_elasticsearch" {
  name              = "/aws/lambda/${aws_lambda_function.logs_to_es.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.logs_to_es.function_name
  principal     = "logs.amazonaws.com"
}

resource "aws_cloudwatch_log_subscription_filter" "api_filter" {
  count = length(var.environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern = ""
  name = "api_${element(var.environments, count.index)}_lambda_filter"
  log_group_name  = "/aws/lambda/api_${element(var.environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "streams_filter" {
  count = length(var.environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern = ""
  name = "streams_${element(var.environments, count.index)}_lambda_filter"
  log_group_name = "/aws/lambda/streams_${element(var.environments, count.index)}"
}

resource "aws_cloudwatch_log_subscription_filter" "cognito_authorizer_filter" {
  count = length(var.environments)
  destination_arn = aws_lambda_function.logs_to_es.arn
  filter_pattern = ""
  name = "cognito_authorizer_${element(var.environments, count.index)}_lambda_filter"
  log_group_name = "/aws/lambda/cognito_authorizer_lambda_${element(var.environments, count.index)}"
}

resource "aws_iam_role" "lambda_logs_role" {
  name = "lambda_role__account"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy__account" 
  role = aws_iam_role.lambda_logs_role.id

  policy = <<EOF

resource "aws_cloudwatch_log_resource_policy" "allow_elasticsearch_to_write_logs" {
  policy_name = "allow_logstream_lambda_to_write_logs"

  policy_document = <<CONFIG
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:PutLogEvents",
        "logs:PutLogEventsBatch",
        "logs:CreateLogStream"
      ],
      "Resource": "arn:aws:logs:*"
    }
  ]
}
EOF
}
