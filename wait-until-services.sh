#!/bin/bash

./wait-until.sh http://localhost:4000/ 404
./wait-until.sh http://localhost:3011/ 400 true # notifications -- websocket port 3011
./wait-until.sh http://localhost:3012/ 404
