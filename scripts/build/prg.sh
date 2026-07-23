#!/bin/bash

set -e

NAME="$1"

if [ -z "$NAME" ]; then
  echo "usage: ./build_prg.sh program"
  exit 1
fi

BAS="$NAME.bas"
BUILD_DIR="./build"
PRG="$BUILD_DIR/$(basename "$NAME").prg"

XEMU="/home/darkod/Documents/xemu/build/bin/xmega65.native"

mkdir -p "$BUILD_DIR"

echo "Compiling $BAS → $PRG"
petcat -w65 -o "$PRG" -- "$BAS"

echo "Running in xmega65"
"$XEMU" -prg "$PRG"
