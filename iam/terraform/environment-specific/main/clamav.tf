resource "aws_s3_bucket" "clamav_s3_download" {
  bucket = "${var.dns_domain}-monitor-script"
  acl = "private"
}

resource "aws_s3_bucket_object" "clamav_worker_object" {
  bucket = aws_s3_bucket.clamav_s3_download.id
  key    = "worker.js"
  source = "worker.js"
}

resource "aws_s3_bucket_public_access_block" "clamav" {
  bucket = aws_s3_bucket.clamav_s3_download.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_iam_role" "clamav_s3_download_role" {
  name = "clamav_s3_download_role_${var.environment}"
  assume_role_policy = "${data.aws_iam_policy_document.allow_ec2_to_assume_clamav_s3_download_role.json}"
}

data "aws_iam_policy_document" "allow_ec2_to_assume_clamav_s3_download_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "access_clamav_s3_bucket" {
  name = "AccessClamAVMonitorS3Bucket_${var.environment}"
  policy = "${data.aws_iam_policy_document.allow_read_access_to_clamav_s3_bucket.json}"
}

data "aws_iam_policy_document" "allow_read_access_to_clamav_s3_bucket" {
  statement {
    actions = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.clamav_s3_download.arn}/*"]
  }
}

resource "aws_iam_role_policy_attachment" "allow_clamav_role_access_to_clamav_s3_bucket" {
  role = "${aws_iam_role.clamav_s3_download_role.name}"
  policy_arn = "${aws_iam_policy.access_clamav_s3_bucket.arn}"
}
