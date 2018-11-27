#!/bin/bash

dir="$(cd "$(dirname "$0")" && pwd -P)"
source "$dir/secrets.sh"

curl -s "http://x:${BCOIN_API_KEY}@${BCOIN_HTTP_HOST}:${BCOIN_NODE_PORT}"
