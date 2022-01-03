#!/bin/bash
res=$(curl -k -s  http://101.32.192.132:3030/api/scan/block_height)
diff=$(echo ${res} | jq ".data.diff")
num=10
if [ $diff -gt $num ]
then
        # HOME=/usr/local/bin:/etc/.pm2:/www/server/nvm/versions/node/v14.16.0/bin
        pm2 restart 0 --update-env
        echo "Restart..."
else
        echo "Monitor checked done, current block diff: $diff"
fi