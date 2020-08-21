FROM ubuntu

WORKDIR /home/clamav

RUN echo "Prepping ClamAV"

COPY ./worker.js .

RUN apt update -y
RUN apt install curl -y
RUN apt install sudo -y
RUN apt install procps -y

RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt install -y nodejs
RUN npm init -y

RUN npm i aws-sdk tmp --save
RUN DEBIAN_FRONTEND=noninteractive sh -c 'apt install -y awscli'

COPY ./clamd.conf /etc/clamav/clamd.conf
RUN apt install -y clamav clamav-daemon
RUN freshclam
RUN clamd &

CMD AWS_REGION='us-east-1' CLEAN_DOCUMENTS_BUCKET=${documents_bucket_name} ENV=${environment} SQS_QUEUE_URL=${sqs_queue_url} QUARANTINE_BUCKET=${quarantine_bucket} node worker.js
