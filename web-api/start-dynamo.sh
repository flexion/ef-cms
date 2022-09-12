#!/bin/bash

# Usage
#   downloads and starts the dynamodb local service

# download the dynamo jar file if needed
if [ ! -e ".dynamodb/dynamo.tar.gz" ]; then
  mkdir -p .dynamodb
  curl --create-dirs -o .dynamodb/dynamo.tar.gz http://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_2021-04-27.tar.gz
  cd .dynamodb && tar -xvf dynamo.tar.gz
  if [[ -n "${ARM64}" ]]; then
    cd DynamoDBLocal_lib
    curl -o 'libsqlite4java-osx-arm64.dylib' 'https://repo1.maven.org/maven2/io/github/ganadist/sqlite4java/libsqlite4java-osx-arm64/1.0.392/libsqlite4java-osx-arm64-1.0.392.dylib'
    lipo -create -output libsqlite4java-osx.dylib.fat libsqlite4java-osx.dylib libsqlite4java-osx-arm64.dylib
    mv libsqlite4java-osx.dylib.fat libsqlite4java-osx.dylib
    cd ..
  fi
  cd ..
fi
# start dynamo 
export AWS_ACCESS_KEY_ID=S3RVER
export AWS_SECRET_ACCESS_KEY=S3RVER

if [[ -n "${ARM64}" ]]; then
  echo "--------------- we are here ---------------------------"
  cd .dynamodb && arch -x86_64 /usr/bin/java -Djava.library.path=.dynamodb/DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory
else
  cd .dynamodb && java -Djava.library.path=.dynamodb/DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory
fi
