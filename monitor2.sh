#!/bin/bash
# 在宝塔中配置计划任务，将此文件复制入脚本。然后修改crontab中对应任务，将 PATH定义以及export PATH注释掉
res=$(curl -k -s  https://tool.xxnetwork.asia:3040/api/scan/block_height)
diff=$(echo ${res} | jq ".data.diff")
num=10
if [ $diff -gt $num ]
then
        # HOME=/usr/local/bin:/root/.pm2:/www/server/nvm/versions/node/v14.16.0/bin
        export PM2_HOME=/root/.pm2
        pm2 restart 14 --update-env
        echo "Restart..."
else
        echo "Monitor checked done, current block diff: $diff"
fi