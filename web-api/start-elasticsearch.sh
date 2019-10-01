#!/bin/bash

# download the elasticsearch archive if needed
if [ -f /.dockerenv ]; then
  ES_DOWNLOAD="https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.4.0-linux-x86_64.tar.gz"
else 
  ES_DOWNLOAD="https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.4.0-darwin-x86_64.tar.gz"
fi

ES_DESTINATION=".elasticsearch"

if [ ! -f "./.elasticsearch/bin/elasticsearch" ]; then
  mkdir -p .elasticsearch/
  curl $ES_DOWNLOAD --output "./.elasticsearch/elasticsearch.tar.gz" --create-dirs
  cd .elasticsearch && tar -xvf "elasticsearch.tar.gz" --strip-components=1 && cd ..
fi

# start elasticsearch
if [ -f /.dockerenv ]; then
  useradd elasticsearch
  chown elasticsearch:elasticsearch -R /home/app/.elasticsearch
  su -c /home/app/.elasticsearch/bin/elasticsearch elasticsearch
else
  ./.elasticsearch/bin/elasticsearch
fi
