#!/bin/bash
set -euo pipefail

IMAGE="docker.io/starefossen/github-pages"
TTY_ARGS=()

if [ -t 0 ] && [ -t 1 ]; then
  TTY_ARGS=(-it)
fi

podman run "${TTY_ARGS[@]}" --rm -v "$(pwd)":/usr/src/app -p 4000:4000 "$IMAGE"
