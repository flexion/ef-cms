resource "aws_s3_bucket" "frontend" {
  bucket = "ui-${var.environment}.${var.dns_domain}"

  policy = "${data.aws_iam_policy_document.allow_public.json}"

  tags {
    environment = "${var.environment}"
  }
}

resource "aws_s3_bucket" "failover" {
  bucket = "failover-ui-${var.environment}.${var.dns_domain}"

  policy = "${data.aws_iam_policy_document.allow_public_failover.json}"

  region = "us-west-1"

  tags {
    environment = "${var.environment}"
  }

  provider = "aws.us-west-1"
}

data "aws_iam_policy_document" "allow_public" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions   = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::ui-${var.environment}.${var.dns_domain}/*"
    ]
  }
}



data "aws_iam_policy_document" "allow_public_failover" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"

    principals {
      identifiers = ["*"]
      type        = "AWS"
    }

    actions   = ["s3:GetObject"]

    resources = [
      "arn:aws:s3:::failover-ui-${var.environment}.${var.dns_domain}/*"
    ]
  }
}


module "ui-certificate" {
  source = "github.com/traveloka/terraform-aws-acm-certificate?ref=v0.1.2"

  domain_name            = "ui-${var.environment}.${var.dns_domain}"
  hosted_zone_name       = "${var.dns_domain}."
  is_hosted_zone_private = "false"
  validation_method      = "DNS"
  certificate_name       = "ui-${var.environment}.${var.dns_domain}"
  environment            = "${var.environment}"
  description            = "Certificate for ui-${var.environment}.${var.dns_domain}"
  product_domain         = "EFCMS"
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "origin used for cloudfront group origins"
}

resource "aws_cloudfront_distribution" "distribution" {
  origin_group {
    origin_id = "group-${var.environment}.${var.dns_domain}"

    failover_criteria {
      status_codes = [403, 404, 500, 502, 503, 504]
    }

    member {
      origin_id = "primary-${var.environment}.${var.dns_domain}"
    }

    member {
      origin_id = "failover-${var.environment}.${var.dns_domain}"
    }
  }
  
  origin {
    domain_name = "${aws_s3_bucket.frontend.bucket_regional_domain_name}"
    origin_id   = "primary-${var.environment}.${var.dns_domain}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path}"
    }
  }


  origin {
    domain_name = "${aws_s3_bucket.failover.bucket_regional_domain_name}"
    origin_id   = "failover-${var.environment}.${var.dns_domain}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path}"
    }
  }

  custom_error_response = [
    {
      error_caching_min_ttl = 0
      error_code            = 404
      response_code         = 200
      response_page_path    = "/index.html"
    },
  ]

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "group-${var.environment}.${var.dns_domain}"
    min_ttl                = 0
    default_ttl            = "${var.cloudfront_default_ttl}"
    max_ttl                = "${var.cloudfront_max_ttl}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  aliases = ["ui-${var.environment}.${var.dns_domain}"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "${module.ui-certificate.acm_certificate_arn}"
    ssl_support_method  = "sni-only"
  }
}

data "aws_route53_zone" "zone" {
  name = "${var.dns_domain}."
}

resource "aws_route53_record" "www" {
  zone_id = "${data.aws_route53_zone.zone.zone_id}"
  name    = "ui-${var.environment}.${var.dns_domain}"
  type    = "A"

  alias = {
    name                   = "${aws_cloudfront_distribution.distribution.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}
