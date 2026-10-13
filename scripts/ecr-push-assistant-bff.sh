#!/usr/bin/env bash
set -euo pipefail

docker image build \
  -t 953334885917.dkr.ecr.ap-northeast-1.amazonaws.com/ask-ai/assistant-bff:latest \
  -f ./apps/assistant-bff/Dockerfile \
  .

docker image push 953334885917.dkr.ecr.ap-northeast-1.amazonaws.com/ask-ai/assistant-bff:latest
