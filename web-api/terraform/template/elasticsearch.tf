resource "aws_cloudwatch_log_group" "elasticsearch_application_logs" {
  name = "/aws/aes/debug_${var.environment}"
}
