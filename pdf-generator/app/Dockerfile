
# # Define custom function directory
# ARG FUNCTION_DIR="/function"

# FROM node:20-buster

# # Include global arg in this stage of the build
# ARG FUNCTION_DIR

# # Install build dependencies
# RUN apt-get update && \
#     apt-get install -y \
#     g++ \
#     make \
#     cmake \
#     unzip \
#     libcurl4-openssl-dev

# RUN apt-get install -y gconf-service \
#   libasound2 \
#   libatk1.0-0 \
#   libc6 \
#   libcairo2 \
#   libcups2 \
#   libdbus-1-3 \
#   libexpat1 \
#   libfontconfig1 \
#   libgcc1 \
#   libgconf-2-4 \
#   libgdk-pixbuf2.0-0 \
#   libglib2.0-0 \
#   libgtk-3-0 \
#   libnspr4 \
#   libpango-1.0-0 \
#   libpangocairo-1.0-0 \
#   libstdc++6 \
#   libx11-6 \
#   libx11-xcb1 \
#   libxcb1 \
#   libxcomposite1 \
#   libxcursor1 \
#   libxdamage1 \
#   libxext6 \
#   libxfixes3 \
#   libxi6 \
#   libxrandr2 \
#   libxrender1 \
#   libxss1 \
#   libxtst6 \
#   ca-certificates \
#   fonts-liberation \
#   libappindicator1 \
#   libnss3 \
#   lsb-release \
#   xdg-utils \
#   wget

# # Copy function code
# RUN mkdir -p ${FUNCTION_DIR}
# COPY . ${FUNCTION_DIR}

# WORKDIR ${FUNCTION_DIR}

# # Install Node.js dependencies
# RUN npm ci

# # Install the runtime interface client
# RUN npm install aws-lambda-ric

# # Grab a fresh slim copy of the image to reduce the final size
# FROM node:20-buster-slim

# # Required for Node runtimes which use npm@8.6.0+ because
# # by default npm writes logs under /home/.npm and Lambda fs is read-only
# ENV NPM_CONFIG_CACHE=/tmp/.npm

# # Include global arg in this stage of the build
# ARG FUNCTION_DIR

# # Set working directory to function root directory
# # WORKDIR ${FUNCTION_DIR}

# # Copy in the built dependencies
# # COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

# RUN npx @puppeteer/browsers install chrome@119.0.6045.105

# ENV CHROME_PATH=/function/chrome/linux-119.0.6045.105/chrome-linux64/chrome

# # Set runtime interface client as default command for the container runtime
# ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]

# # Pass the name of the function handler as an argument to the runtime
# CMD ["dist/index.handler"]

FROM public.ecr.aws/lambda/nodejs:18

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json ${LAMBDA_TASK_ROOT}
COPY package-lock.json ${LAMBDA_TASK_ROOT}

RUN npm ci

COPY . ${LAMBDA_TASK_ROOT}

RUN npm run compile

ENV NODE_ENV=development
ENV AWS_REGION=us-east-1
ENV S3_ENDPOINT=http://0.0.0.0:9000
ENV TEMP_DOCUMENTS_BUCKET_NAME=noop-temp-documents-local-us-east-1

CMD [ "dist/index.handler" ]
