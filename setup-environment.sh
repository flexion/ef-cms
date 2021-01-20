#!/bin/bash

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if [[ $BRANCH == 'develop' ]] ; then
  
  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_DEV}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="${CIRCLE_HONEYBADGER_API_KEY_DEV}" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_DEV}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="10" >> $BASH_ENV
  echo export ENV="dev" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_DEV}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_DEV}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_DEV}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_DEV}" >> $BASH_ENV

elif [[ $BRANCH == 'experimental1' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_EXP}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_EXP1}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="10" >> $BASH_ENV
  echo export ENV="exp1" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_EXP1}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_EXP1}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_EXP1}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_EXP1}" >> $BASH_ENV

elif [[ $BRANCH == 'experimental2' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_EXP}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_EXP2}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="10" >> $BASH_ENV
  echo export ENV="exp2" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_EXP2}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_EXP2}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_EXP2}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_EXP2}" >> $BASH_ENV

elif [[ $BRANCH == 'experimental3' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_EXP}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="${CIRCLE_HONEYBADGER_API_KEY_EXP3}" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_EXP3}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="10" >> $BASH_ENV
  echo export ENV="exp3" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_EXP3}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_EXP3}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_EXP3}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_EXP3}" >> $BASH_ENV

elif [[ $BRANCH == 'irs' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_IRS}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_IRS}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="10" >> $BASH_ENV
  echo export ENV="irs" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_IRS}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_IRS}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_IRS}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_IRS}" >> $BASH_ENV

elif [[ $BRANCH == 'staging' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_STG}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="t2.medium.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="${CIRCLE_HONEYBADGER_API_KEY_STG}" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_STG}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="10" >> $BASH_ENV
  echo export ENV="stg" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_STG}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_STG}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_STG}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_STG}" >> $BASH_ENV

elif [[ $BRANCH == 'test' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_TEST}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="m5.large.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_TEST}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="350" >> $BASH_ENV
  echo export ENV="test" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_TEST}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_TEST}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_TEST}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_TEST}" >> $BASH_ENV

elif [[ $BRANCH == 'migration' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_MIG}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="m5.large.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_MIG}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="350" >> $BASH_ENV
  echo export ENV="mig" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_MIG}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_MIG}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_MIG}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_MIG}" >> $BASH_ENV

elif [[ $BRANCH == 'master' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_PROD}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="m5.large.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_MASTER}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="100" >> $BASH_ENV
  echo export ENV="prod" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_PROD}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_PROD}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_PROD}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_PROD}" >> $BASH_ENV

elif [[ $BRANCH == 'dawson' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_DAWSON}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="t2.small.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_DAWSON}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="100" >> $BASH_ENV
  echo export ENV="daw" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_PROD}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_PROD}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_PROD}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_PROD}" >> $BASH_ENV

elif [[ $BRANCH == 'prod' ]] ; then

  echo export ES_INSTANCE_COUNT="3" >> $BASH_ENV
  echo export DYNAMSOFT_PRODUCT_KEYS="${DYNAMSOFT_PRODUCT_KEYS_PROD}" >> $BASH_ENV
  echo export ES_INSTANCE_TYPE="m5.xlarge.elasticsearch" >> $BASH_ENV
  echo export CIRCLE_HONEYBADGER_API_KEY="" >> $BASH_ENV
  echo export DISABLE_EMAILS="${DISABLE_EMAILS_PROD}" >> $BASH_ENV
  echo export ES_VOLUME_SIZE="350" >> $BASH_ENV
  echo export ENV="prod" >> $BASH_ENV
  echo export EFCMS_DOMAIN="${EFCMS_DOMAIN_PROD}" >> $BASH_ENV
  echo export ZONE_NAME="${ZONE_NAME_PROD}" >> $BASH_ENV
  echo export IRS_SUPERUSER_EMAIL="${IRS_SUPERUSER_EMAIL_PROD}" >> $BASH_ENV
  echo export BOUNCED_EMAIL_RECIPIENT="${BOUNCED_EMAIL_RECIPIENT_PROD}" >> $BASH_ENV

else
  exit 1;
fi
