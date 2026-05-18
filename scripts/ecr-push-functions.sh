#!/usr/bin/env bash
set -euo pipefail

docker image build \
  -t 953334885917.dkr.ecr.ap-northeast-1.amazonaws.com/ask-ai/functions:latest \
  -f ./apps/functions/Dockerfile \
  .

docker push 953334885917.dkr.ecr.ap-northeast-1.amazonaws.com/ask-ai/functions:latest
