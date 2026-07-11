#!/usr/bin/env bash
#
# Vercel "Ignored Build Step" — the cost scalpel, versioned in-repo.
#
# Production for usecircuitos.com is the droplet docker container, NOT Vercel.
# If a Vercel project is connected to this repo it exists for previews at
# most — and previews are what ran the bill to $200. Operator law
# (2026-07-11): only `main` builds, and only when real code changed.
#   exit 0 → SKIP the build (no deploy, no cost)
#   exit 1 → BUILD
set -u

REF="${VERCEL_GIT_COMMIT_REF:-}"

# 1) Any non-main branch → SKIP.
if [ "$REF" != "main" ]; then
  echo "vercel-ignore: skip — branch '$REF' is not main"
  exit 0
fi

# 2) On main → build only if something other than docs/markdown changed.
#    Fail OPEN to a build if the diff can't be computed.
if git rev-parse HEAD^ >/dev/null 2>&1; then
  NON_DOC="$(git diff --name-only HEAD^ HEAD 2>/dev/null | grep -vE '(\.md$|^docs/)' | head -1)"
  if [ -z "$NON_DOC" ]; then
    echo "vercel-ignore: skip — main commit touches only docs/markdown"
    exit 0
  fi
fi

echo "vercel-ignore: build — main + real code"
exit 1
