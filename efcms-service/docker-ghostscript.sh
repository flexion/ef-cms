
#!/usr/bin/env bash

set -e
docker pull amazonlinux:2
docker run --rm -ti -v "$(pwd)/runtimes/ghostscript:/opt/app" amazonlinux:2 /bin/bash -c 'cd /opt/app && chmod +x ./build.sh && ./build.sh'
