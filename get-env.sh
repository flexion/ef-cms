#!/bin/bash

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo 'dev'
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo 'exp1'
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo 'exp2'
elif [[ $BRANCH == 'test' ]] ; then
  echo 'test'
elif [[ $BRANCH == 'staging' ]] ; then
  echo 'stg'
elif [[ $BRANCH == 'master' ]] ; then
  echo 'prod'
else
  exit 1;
fi
