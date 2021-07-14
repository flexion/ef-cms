#!/bin/bash

echo "Starting Services"
service clamav-freshclam start
service clamav-daemon start

echo "Services started. Running worker."

printenv

node worker.js
