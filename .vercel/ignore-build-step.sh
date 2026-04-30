#!/bin/bash

# Only deploy if frontend files changed
git diff HEAD^ HEAD --quiet -- frontend/
if [ $? -eq 1 ]; then
  echo "Frontend changed - deploying"
  exit 1
else
  echo "No frontend changes - skipping deploy"
  exit 0
fi