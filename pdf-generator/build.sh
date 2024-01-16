#!/bin/bash

# if this fails, uncomment this line
#docker logout public.ecr.aws

npx tsc src/index.ts

DOCKER_BUILDKIT=0 docker build -t docker-image:pdf-generator .