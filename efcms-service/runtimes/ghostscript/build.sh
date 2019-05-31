#!/usr/bin/env bash

set -e

echo "Prepping Ghostscript"

rm -rf bin
rm -rf lib

yum update -y
yum install -y wget make gcc gcc-c++ g++ autoconf autogen tar.x86_64 gzip

wget https://github.com/ArtifexSoftware/ghostpdl-downloads/releases/download/gs923/ghostscript-9.23.tar.gz
tar -xvzf ghostscript-9.23.tar.gz
rm ghostscript-9.23.tar.gz


mkdir -p lib
mkdir -p bin

cd ghostscript-9.23
./configure
make
make so

cp -r bin/* ../bin
cp -r sobin/* ../lib

cd ..

tar -czf ghostscript_lambda_layer.tar.gz bin lib

rm -rf ghostscript-9.23
