#!/bin/bash
clamav_bucket=${clamav_bucket}
clean_documents_bucket=${documents_bucket_name}
sqs_queue=${sqs_queue}
sqs_queue_url=${sqs_queue_url}
environment=${environment}
monitor_script_s3_path=${monitor_script_s3_path}

export DEBIAN_FRONTEND=noninteractive
sudo apt update
sudo apt install -y awscli nodejs clamav-base clamav clamav-daemon clamav-freshclam

# TODO: config
# TODO: double check clamav daemon autostarts

sudo freshclam # update definitions
sudo clamd # start daemon

sudo aws s3 cp "${monitor_script_s3_path}" monitor.js

npm i -g pm2

# start monitoring
sudo ENV=${environment} SQS_QUEUE=${sqs_queue} CLAMAV_BUCKET=${clamav_bucket} pm2 monitor.js