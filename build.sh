#!/bin/zsh

ESBUILD=./node_modules/.bin/esbuild

"$ESBUILD" --bundle src/index.ts --outfile=dist/bundle.js