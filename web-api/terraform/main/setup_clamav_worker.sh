#!/bin/bash
export quarantine_bucket=${quarantine_bucket}
export clean_documents_bucket=${documents_bucket_name}
export sqs_queue_url=${sqs_queue_url}
export environment=${environment}
export monitor_script_s3_path=${monitor_script_s3_path}

echo $quarantine_bucket
echo $clean_documents_bucket
echo $sqs_queue_url
echo $environment
echo $monitor_script_s3_path

export DEBIAN_FRONTEND=noninteractive
sudo apt update

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo DEBIAN_FRONTEND=noninteractive sh -c 'apt install -y nodejs'

sudo cat <<< '
LocalSocket /tmp/clamd.socket
LocalSocketMode 660
' > /etc/clamav/clamd.conf
sudo chown clamav:clamav /etc/clamav/clamd.conf

sudo apt install -y awscli

sudo apt install -y clamav

sudo pkill freshclam

sudo freshclam

sudo apt install -y clamav-daemon

sudo aws s3 cp "s3://${monitor_script_s3_path}/worker.js" worker.js

sudo npm i -g pm2

sudo mkdir /home/clamav
sudo chown clamav:clamav /home/clamav
 # for some reason, even though we run pm2 with the clamav user, 
 # pm2 (more specifically the tmp module in our worker.js script) 
 # can't write to /home/clamav...
sudo chmod 777 /home/clamav

# we run this as the clamav user so that clamdscan have access to scan the file
sudo -u clamav bash -c "AWS_REGION='us-east-1' CLEAN_DOCUMENTS_BUCKET=${documents_bucket_name} ENV=${environment} SQS_QUEUE_URL=${sqs_queue_url} QUARANTINE_BUCKET=${quarantine_bucket} pm2 start worker.js"

