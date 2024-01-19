FROM public.ecr.aws/lambda/nodejs:18

WORKDIR ${LAMBDA_TASK_ROOT}

RUN echo "HELLO"
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
