#!/bin/bash

cd  /Users/olivercooper/Dropbox/Documents/Projects/Carl
while true; do
	JEKYLL_ENV=development jekyll serve --incremental
	echo "Server closed. Starting again..."
done

