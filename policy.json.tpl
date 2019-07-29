{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Route53",
      "Effect": "Allow",
      "Action": [
        "route53:GetChange",
        "route53:GetHostedZone",
        "route53:ListResourceRecordSets",
        "route53:ListHostedZones",
        "route53:ChangeResourceRecordSets"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DynamoDb",
      "Effect": "Allow",
      "Action": [
        "dynamodb:ListTables",
        "dynamodb:ListTagsOfResource",
        "dynamodb:TagResource",
        "dynamodb:DescribeTimeToLive",
        "dynamodb:UpdateContinuousBackups"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Cognito",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:UpdateUserPoolClient",
        "cognito-idp:CreateUserPool",
        "cognito-idp:AdminRespondToAuthChallenge",
        "cognito-idp:AdminConfirmSignUp",
        "cognito-idp:DescribeUserPool",
        "cognito-idp:CreateUserPoolDomain",
        "cognito-idp:DescribeUserPoolClient",
        "cognito-idp:AdminInitiateAuth",
        "cognito-idp:SignUp",
        "cognito-idp:ListUserPools",
        "cognito-idp:ListUserPoolClients",
        "cognito-idp:CreateUserPoolClient",
        "cognito-idp:DescribeUserPoolDomain",
        "cognito-idp:SetUICustomization",
        "cognito-idp:DeleteUserPoolDomain"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ApiGateway",
      "Effect": "Allow",
      "Action": [
        "apigateway:DELETE",
        "apigateway:UpdateRestApiPolicy",
        "apigateway:UpdateStage",
        "apigateway:PATCH",
        "apigateway:GET",
        "apigateway:PUT",
        "apigateway:POST"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Acm",
      "Effect": "Allow",
      "Action": [
        "acm:RequestCertificate",
        "acm:ListCertificates",
        "acm:AddTagsToCertificate",
        "acm:ListTagsForCertificate",
        "acm:DescribeCertificate"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFront",
      "Effect": "Allow",
      "Action": [
        "cloudfront:GetDistribution",
        "cloudfront:TagResource",
        "cloudfront:CreateDistribution",
        "cloudfront:ListTagsForResource",
        "cloudfront:UpdateDistribution",
        "cloudfront:CreateCloudFrontOriginAccessIdentity",
        "cloudfront:GetCloudFrontOriginAccessIdentity",
        "cloudfront:DeleteCloudFrontOriginAccessIdentity"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Other",
      "Effect": "Allow",
      "Action": [
        "logs:*",
        "events:*",
        "sns:*",
        "ses:*",
        "s3:*",
        "cloudformation:*",
        "cloudwatch:*",
        "lambda:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DynamoGranular",
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:BatchGetItem",
        "dynamodb:UpdateTable",
        "dynamodb:DescribeContinuousBackups",
        "dynamodb:DescribeGlobalTable"
      ],
      "Resource": [
        "arn:aws:dynamodb::ACCOUNT_ID:global-table/efcms-dev",
        "arn:aws:dynamodb::ACCOUNT_ID:global-table/efcms-prod",
        "arn:aws:dynamodb::ACCOUNT_ID:global-table/efcms-stg",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/efcms-dev",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/efcms-prod",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/efcms-stg",
        "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/efcms-terraform-lock",
        "arn:aws:dynamodb:us-west-1:ACCOUNT_ID:table/efcms-dev",
        "arn:aws:dynamodb:us-west-1:ACCOUNT_ID:table/efcms-prod",
        "arn:aws:dynamodb:us-west-1:ACCOUNT_ID:table/efcms-stg"
      ]
    },
    {
      "Sid": "IamGranular",
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:PutRolePolicy",
        "iam:PassRole",
        "iam:DeleteRolePolicy",
        "iam:GetRolePolicy"
      ],
      "Resource": [
        "arn:aws:iam::ACCOUNT_ID:role/api_gateway_cloudwatch_global_*",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-cases-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-documents-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-users-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/ef-cms-work-items-*-lambdaRole",
        "arn:aws:iam::ACCOUNT_ID:role/s3_replication_role_*"
      ]
    }
  ]
}
