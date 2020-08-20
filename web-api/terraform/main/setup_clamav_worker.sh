#!/bin/bash
quarantine_bucket=${quarantine_bucket}
clean_documents_bucket=${documents_bucket_name}
sqs_queue_url=${sqs_queue_url}
environment=${environment}
monitor_script_s3_path=${monitor_script_s3_path}

export DEBIAN_FRONTEND=noninteractive
sudo apt update
sudo apt install -y awscli nodejs clamav clamav-daemon

sudo mkdir /var/run/clamav/

# TODO: config
sudo mkdir /usr/local/etc/clamav
sudo touch /usr/local/etc/clamav/freshclam.conf 
sudo cat <<< '
LocalSocket /tmp/clamd.socket
LocalSocketMode 660
' > /usr/local/etc/clamav/freshclam.conf

sudo chmod 775 /usr/local/etc/clamav

sudo chown -R clamav:clamav /var/run/clamav/

sudo freshclam # update definitions

sudo systemctl start clamav-daemon.service

sudo aws s3 cp "${monitor_script_s3_path}" monitor.js

npm i -g pm2

# start monitoring
sudo ENV=${environment} SQS_QUEUE_URL=${sqs_queue_url} QUARANTINE_BUCKET=${quarantine_bucket} pm2 monitor.js