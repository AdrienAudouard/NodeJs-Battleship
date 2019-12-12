#!/bin/bash

git subtree push --prefix back heroku master
heroku logs --tail
