#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  echo "✅ - Build can proceed"
  exit 1;

else
  git diff --quiet HEAD main -- docs/ openapi/
  CHANGED=$?
  echo "git diff --quiet main HEAD -- docs/ openapi/: $CHANGED"

  if [[ $CHANGED == 0 ]]; then
    echo "🛑 - Build cancelled"
    exit 0;

  else
    echo "✅ - Build can proceed"
    exit 1;
  fi
fi
