#!/bin/sh
echo Plugin being packaged and moved to ./$1
rm -r ../$1
rm -r ../$1.zip
mkdir ../$1
cp manifest.json ../$1
cp -r public ../$1
cp crewdriver-logo.png ../$1
cp agile_background.js ../$1
zip -r ../$1zipfile ../$1