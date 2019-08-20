#!/bin/bash -e
ENV=$1
REGIONS=$2
docker build -t efcms-build -f ../Dockerfile ..
docker run --rm efcms-build /bin/sh -c "node web-api/setup-global-tables.js efcms-$ENV $REGIONS $REGIONS"
