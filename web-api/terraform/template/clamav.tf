resource "aws_s3_bucket" "quarantine_bucket" {
  bucket = "${var.dns_domain}-quarantine"
}

resource "aws_sqs_queue" "clamav_event_queue" {
  name = "s3_clamav_event_${var.environment}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:*:*:s3_clamav_event_${var.environment}",
      "Condition": {
        "ArnEquals": { "aws:SourceArn": "${aws_s3_bucket.quarantine_bucket.arn}" }
      }
    }
  ]
}
POLICY
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.bucket.id

  queue {
    queue_arn     = aws_sqs_queue.queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_suffix = ".log"
  }
}

resource "aws_instance" "clamav_worker" {
  ami           = var.ami
  instance_type = "t2.small"

  availability_zone = var.availability_zones[0]
  # security_groups   = [aws_security_group.clamav.name]

  tags = {
    Name        = "clamav-${var.environment}"
    environment = var.environment
  }

  user_data = data.template_file.setup_clamav.rendered

  iam_instance_profile = "clamav_s3_download_role"
}

data "template_file" "setup_clamav" {
  template = file("setup_clamav_worker.sh")
}