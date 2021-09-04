#!/bin/zsh
set -eu -o pipefail

ESBUILD=./node_modules/.bin/esbuild
TSC=./node_modules/.bin/tsc

"$TSC" -noEmit src/index.ts --target esnext
"$ESBUILD" --bundle src/index.ts --outfile=dist/bundle.js