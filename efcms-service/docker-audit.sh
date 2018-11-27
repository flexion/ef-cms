#!/bin/bash
docker build -t efcms-build -f ../Dockerfile.build ..
docker run --rm efcms-build /bin/sh -c 'cd efcms-service && npm audit'