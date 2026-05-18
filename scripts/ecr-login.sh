#!/usr/bin/env bash
set -euo pipefail

aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin 953334885917.dkr.ecr.ap-northeast-1.amazonaws.com
