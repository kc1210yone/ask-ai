#!/usr/bin/env bash
set -euo pipefail

aws ssm start-session \
  --target i-0edca935731545f22 \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host": ["ask-ai-rdb.cze4ccqck4j1.ap-northeast-1.rds.amazonaws.com"], "portNumber":["3306"], "localPortNumber":["3306"]}'
