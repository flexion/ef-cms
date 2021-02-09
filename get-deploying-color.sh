#!/bin/bash

# Returns the next color to deploy (blue or green) for the environment

# Usage
#   ./get-deploying-color.sh dev

# Arguments
#   - $1 - the environment to check

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The environment to check must be provided as the \$1 argument." && exit 1
[ -z "${USTC_ADMIN_PASS}" ] && echo "You must have USTC_ADMIN_PASS set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

ENV=$1

EXISTS=$(aws dynamodb list-tables --region us-east-1 | grep efcms-deploy-${ENV} | wc -l)

if [ "${EXISTS}" -eq "1" ]; then

  CURRENT_COLOR=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"current-color"},"sk":{"S":"current-color"}}' | jq -r ".Item.current.S")
  [ -z "$CURRENT_COLOR" ] && CURRENT_COLOR="green"

  if  [[ $CURRENT_COLOR == "green" ]] ; then
    echo "blue"
  else
    echo "green"
  fi
else 
  echo "green"
fi

