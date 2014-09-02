#!/bin/bash

set -e

cd "$(dirname "$0")/.."

if [ -z "$GH_TOKEN" ]; then
    GH_URL="${GH_REF:-$(git config --get remote.origin.url)}"
else
    GH_URL="${GH_TOKEN}@${GH_REF}"
fi

! test -e gh-pages || rm -rf gh-pages
git clone "$GH_URL" gh-pages --reference . --branch gh-pages --no-checkout
npm install
scripts/to_json.js
cp -a html/* gh-pages/
cp .git/config gh-pages/.git/config

cd gh-pages

git config user.email 'services-ops@mozilla.com'
git config user.name 'Travis Build'
git add --all .
git commit -m 'Github Pages Build'
