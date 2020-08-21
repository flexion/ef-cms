#!/bin/bash

freshclam -d &
clamd &

echo "waiting for the daemon to spin up"

sleep 60

echo "done waiting for daemon"

AWS_REGION='us-east-1' CLEAN_DOCUMENTS_BUCKET=${documents_bucket_name} ENV=${environment} SQS_QUEUE_URL=${sqs_queue_url} QUARANTINE_BUCKET=${quarantine_bucket} node worker.js
