#!/bin/bash

cd front
npm run build
cd ..
git add .
git commit -m "add build"
git subtree push --prefix back heroku master
heroku logs --tail
