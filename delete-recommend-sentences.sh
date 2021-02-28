#!/bin/bash

#crontab
#0 21 * * * /home/ubuntu/momo-server/delete-recommend-sentences.sh >> /var/log/delete-recommend-sentences.log 2>&1

echo 'start delete recommend sentences.';
curl -X DELETE http://localhost:3000/sentences/recommend
echo 'success...';
