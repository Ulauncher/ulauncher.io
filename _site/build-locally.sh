#!/bin/bash

docker run --rm -v $(pwd):/usr/src/app starefossen/github-pages jekyll build
