#!/bin/bash

# if this fails, uncomment this line
#docker logout public.ecr.aws

cd app

DOCKER_BUILDKIT=0 docker build --progress=plain --platform linux/amd64 -t docker-image:pdf-generator .