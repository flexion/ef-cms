data "aws_caller_identity" "current" {}

resource "aws_iam_role" "lambda_role" {
  name = var.role_name

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
  name = "lambda_policy_${var.environment}"
  role = aws_iam_role.lambda_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": [
                "arn:aws:logs:*:*:*"
            ]
        },
        {
            "Action": [
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "arn:aws:lambda:us-east-1:${data.aws_caller_identity.current.account_id}:function:*",
                "arn:aws:lambda:us-west-1:${data.aws_caller_identity.current.account_id}:function:*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "cognito-idp:AdminCreateUser",
                "cognito-idp:AdminDisableUser",
                "cognito-idp:AdminGetUser",
                "cognito-idp:DescribeUserPool",
                "cognito-idp:AdminUpdateUserAttributes",
                "cognito-idp:AdminConfirmSignUp",
                "cognito-idp:AdminSetUserPassword",
                "cognito-idp:ListUserPoolClients",
                "cognito-idp:ListUsers"
            ],
            "Resource": [
                "arn:aws:cognito-idp:us-east-1:${data.aws_caller_identity.current.account_id}:userpool/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "ec2:DescribeInstances",
                "ec2:CreateNetworkInterface",
                "ec2:AttachNetworkInterface",
                "ec2:DescribeNetworkInterfaces",
                "autoscaling:CompleteLifecycleAction",
                "ec2:DeleteNetworkInterface"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:DeleteObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:PutObject",
                "s3:PutObjectTagging"
            ],
            "Resource": [
                "arn:aws:s3:::${var.dns_domain}-documents-*",
                "arn:aws:s3:::${var.dns_domain}-temp-documents-*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::*.${var.dns_domain}"
            ],
            "Effect": "Allow"
        },
        {
            "Sid": "RdsConnect",
            "Effect": "Allow",
            "Action": [
                "rds-db:connect"
            ],
            "Resource": [
                "arn:aws:rds-db:*:${data.aws_caller_identity.current.account_id}:dbuser:*/${var.postgres_user}",
            ]
        },
        {
            "Action": [
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:DeleteItem",
                "dynamodb:DescribeStream",
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:ListStreams",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:UpdateItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*",
                "arn:aws:dynamodb:us-west-1:${data.aws_caller_identity.current.account_id}:table/efcms-${var.environment}-*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:DescribeTable",
                "dynamodb:UpdateItem",
                "dynamodb:PutItem"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:${data.aws_caller_identity.current.account_id}:table/efcms-deploy-${var.environment}",
            "Effect": "Allow"
        },
        {
            "Action": [
                "ses:SendBulkTemplatedEmail",
                "ses:SendEmail"
            ],
            "Resource": [
                "arn:aws:ses:us-east-1:${data.aws_caller_identity.current.account_id}:identity/noreply@${var.dns_domain}"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "ses:GetSendStatistics"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "es:ESHttpDelete",
                "es:ESHttpGet",
                "es:ESHttpPost",
                "es:ESHttpPut"
            ],
            "Resource": [
                "arn:aws:es:us-east-1:${data.aws_caller_identity.current.account_id}:domain/efcms-search-${var.environment}-*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "execute-api:Invoke",
                "execute-api:ManageConnections"
            ],
            "Resource": [
                "arn:aws:execute-api:us-east-1:${data.aws_caller_identity.current.account_id}:*",
                "arn:aws:execute-api:us-west-1:${data.aws_caller_identity.current.account_id}:*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": "sns:Publish",
            "Resource": "arn:aws:sns:us-east-1:${data.aws_caller_identity.current.account_id}:seal_notifier",
            "Effect": "Allow"
        },
        {
            "Action": "sns:Subscribe",
            "Resource": "arn:aws:sns:us-east-1:${data.aws_caller_identity.current.account_id}:bounced_service_emails_${var.environment}",
            "Effect": "Allow"
        },
        {
            "Action": [
                "sqs:GetQueueAttributes",
                "sqs:ListQueueTags",
                "sqs:CreateQueue",
                "sqs:SetQueueAttributes",
                "sqs:SendMessage",
                "sqs:ReceiveMessage",
                "sqs:DeleteMessage"
            ],
            "Resource": [
                "arn:aws:sqs:us-east-1:${data.aws_caller_identity.current.account_id}:*",
                "arn:aws:sqs:us-west-1:${data.aws_caller_identity.current.account_id}:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}
