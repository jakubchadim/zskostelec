#!/usr/bin/env bash

# Clean gatsby public folder
gatsby clean

cd ../
# Create an orphan branch named gh-pages
git checkout --orphan gh-pages
# Remove all files from staging
git rm -rf .
# Create an empty commit so that you will be able to push on the branch next
git commit --allow-empty -m "Init empty branch"
# Push the branch
git push origin gh-pages

# Come back to master
git checkout master

git worktree add web/public gh-pages
