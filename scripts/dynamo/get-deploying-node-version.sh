#!/bin/bash

# Returns the migration destination table for the environment

# Usage
#   ./get-deploying-node-version.sh dev

# Arguments
#   - $1 - the environment to check

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The env to check must be provided as the \$1 argument." && exit 1

ENV=$1

DEPLOYING_NODE_VERSION=$(aws dynamodb get-item --region us-east-1 --table-name "efcms-deploy-${ENV}" --key '{"pk":{"S":"deploying-node-version"},"sk":{"S":"deploying-node-version"}}' | jq -r ".Item.current.S")

echo "${DEPLOYING_NODE_VERSION}"
