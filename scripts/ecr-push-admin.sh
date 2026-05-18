#!/usr/bin/env bash
set -euo pipefail

script_directory="$(cd "$(dirname "$0")" && pwd)"
project_directory="$(cd "$script_directory/.." && pwd)"

set -a
# shellcheck disable=SC1091
source "$project_directory/apps/admin/.env"
set +a

docker image build \
  -t 953334885917.dkr.ecr.ap-northeast-1.amazonaws.com/ask-ai/admin:latest \
  -f ./apps/admin/Dockerfile \
  --build-arg AWS_REGION \
  --build-arg NEXT_PUBLIC_USER_POOL_ID \
  --build-arg NEXT_PUBLIC_USER_POOL_CLIENT_ID \
  .

docker push 953334885917.dkr.ecr.ap-northeast-1.amazonaws.com/ask-ai/admin:latest
