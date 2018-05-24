#!/bin/bash

/run.sh

sleep 15

curl -s -H "Content-Type: application/json" -X POST \
    --data '{"name": "myinfluxdb", "type": "influxdb", "access": "proxy", "url": "http://influxdb:8086", "database": "k6", "isDefault": true}' \
    http://admin:admin@localhost:3000/api/datasources

kill -SIGINT %%
