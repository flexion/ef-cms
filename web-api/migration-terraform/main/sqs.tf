resource "aws_sqs_queue" "migration_segments_queue" {
  name                       = "migration_segments_queue_${var.environment}"
  visibility_timeout_seconds = "900"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.migration_segments_dl_queue.arn
    maxReceiveCount     = 10
  })

  kms_master_key_id = "alias/aws/sqs"
  kms_data_key_reuse_period_seconds = 300
}

resource "aws_sqs_queue" "migration_segments_dl_queue" {
  name = "migration_segments_dl_queue_${var.environment}"
  kms_master_key_id = "alias/aws/sqs"
  kms_data_key_reuse_period_seconds = 300
}

resource "aws_sqs_queue" "migration_failure_queue" {
  name = "migration_failure_queue_${var.environment}"
  kms_master_key_id = "alias/aws/sqs"
  kms_data_key_reuse_period_seconds = 300
}
