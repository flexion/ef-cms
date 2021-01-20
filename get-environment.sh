#!/bin/bash

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  
  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_DEV}"
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY="${CIRCLE_HONEYBADGER_API_KEY_DEV}"
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_DEV}"
  echo export ES_VOLUME_SIZE="10"
  echo export ENV="dev"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_DEV}"
  echo export ZONE_NAME="${ZONE_NAME_DEV}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_DEV}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_DEV}"

elif [[ $BRANCH == 'experimental1' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_EXP}"
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_EXP1}"
  echo export ES_VOLUME_SIZE="10"
  echo export ENV="exp1"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_EXP1}"
  echo export ZONE_NAME="${ZONE_NAME_EXP1}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_EXP1}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_EXP1}"

elif [[ $BRANCH == 'experimental2' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_EXP}"
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_EXP2}"
  echo export ES_VOLUME_SIZE="10"
  echo export ENV="exp2"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_EXP2}"
  echo export ZONE_NAME="${ZONE_NAME_EXP2}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_EXP2}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_EXP2}"

elif [[ $BRANCH == 'experimental3' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_EXP}"
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY="${CIRCLE_HONEYBADGER_API_KEY_EXP3}"
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_EXP3}"
  echo export ES_VOLUME_SIZE="10"
  echo export ENV="exp3"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_EXP3}"
  echo export ZONE_NAME="${ZONE_NAME_EXP3}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_EXP3}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_EXP3}"

elif [[ $BRANCH == 'irs' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_IRS}"
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_IRS}"
  echo export ES_VOLUME_SIZE="10"
  echo export ENV="irs"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_IRS}"
  echo export ZONE_NAME="${ZONE_NAME_IRS}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_IRS}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_IRS}"

elif [[ $BRANCH == 'staging' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_STG}"
  echo export ES_INSTANCE_TYPE="t2.medium.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY="${CIRCLE_HONEYBADGER_API_KEY_STG}"
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_STG}"
  echo export ES_VOLUME_SIZE="10"
  echo export ENV="stg"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_STG}"
  echo export ZONE_NAME="${ZONE_NAME_STG}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_STG}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_STG}"

elif [[ $BRANCH == 'test' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_TEST}"
  echo export ES_INSTANCE_TYPE="m5.large.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_TEST}"
  echo export ES_VOLUME_SIZE="350"
  echo export ENV="test"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_TEST}"
  echo export ZONE_NAME="${ZONE_NAME_TEST}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_TEST}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_TEST}"

elif [[ $BRANCH == 'migration' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_MIG}"
  echo export ES_INSTANCE_TYPE="m5.large.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_MIG}"
  echo export ES_VOLUME_SIZE="350"
  echo export ENV="mig"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_MIG}"
  echo export ZONE_NAME="${ZONE_NAME_MIG}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_MIG}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_MIG}"

elif [[ $BRANCH == 'master' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_PROD}"
  echo export ES_INSTANCE_TYPE="m5.large.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_MASTER}"
  echo export ES_VOLUME_SIZE="100"
  echo export ENV="prod"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_PROD}"
  echo export ZONE_NAME="${ZONE_NAME_PROD}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_PROD}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_PROD}"

elif [[ $BRANCH == 'dawson' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_DAWSON}"
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_DAWSON}"
  echo export ES_VOLUME_SIZE="100"
  echo export ENV="daw"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_PROD}"
  echo export ZONE_NAME="${ZONE_NAME_PROD}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_PROD}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_PROD}"

elif [[ $BRANCH == 'prod' ]] ; then

  echo export ES_INSTANCE_COUNT="3"
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_PROD}"
  echo export ES_INSTANCE_TYPE="m5.xlarge.elasticsearch"
  echo export CIRCLE_HONEYBADGER_API_KEY=""
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_PROD}"
  echo export ES_VOLUME_SIZE="350"
  echo export ENV="prod"
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_PROD}"
  echo export ZONE_NAME="${ZONE_NAME_PROD}"
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_PROD}"
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_PROD}"

else
  exit 1;
fi
