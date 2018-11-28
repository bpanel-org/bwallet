#!/bin/bash

dir="$(cd "$(dirname "$0")" && pwd -P)"
source "$dir/secrets.sh"

walletid=${1:-primary}

walleturl="http://x:${BCOIN_API_KEY}@${BCOIN_HTTP_HOST}:${BCOIN_WALLET_PORT}"

curl -s "$walleturl/wallet/$walletid/tx/history?token=$BCOIN_ADMIN_TOKEN"
