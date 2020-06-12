resource "aws_lambda_layer_version" "puppeteer_layer" {
  filename   = "../../runtimes/puppeteer/puppeteer_lambda_layer.tar.gz"
  layer_name = "puppeteer-${var.environment}"

  compatible_runtimes = ["nodejs12.x"]
}

resource "aws_s3_bucket" "layer_bucket" {
  bucket = "${var.dns_domain}.efcms.${var.environment}.us-east-1.layers"
  acl = "private"
  provider = "aws.us-east-1"
  region = "us-east-1"

  tags {
    environment = "${var.environment}"
  }
}

resource "aws_s3_bucket_object" "clamav_layer_object" {
  bucket = "${aws_s3_bucket.layer_bucket.id}"
  key    = "${var.environment}_clamav_lambda_layer.tar.gz"
  source = "../../runtimes/clamav/clamav_lambda_layer.tar.gz"
}

resource "aws_lambda_layer_version" "clamav_layer" {
  s3_bucket = "${aws_s3_bucket.layer_bucket.id}"
  s3_key = "${aws_s3_bucket_object.clamav_layer_object.key}"
  layer_name = "clamav-${var.environment}"

  compatible_runtimes = ["nodejs12.x"]
}