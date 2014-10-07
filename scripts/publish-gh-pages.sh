#!/bin/bash

set -e
cd "$(dirname "$0")/../gh-pages"
git push origin gh-pages:gh-pages
