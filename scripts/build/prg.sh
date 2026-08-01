#!/bin/bash

set -euo pipefail

BUILD_DIR="./build"
RUN_XEMU=0
RUN_MEGA65=0

usage() {
  echo "usage: ./scripts/build/prg.sh [--xemu] [--mega65] program"
  echo
  echo "  -x, --xemu       run the compiled program in xemu"
  echo "  -m, --mega65     transfer and run it on the real mega65"
  echo "      --etherload  alias for --mega65"
  echo "  -h, --help       display this help"
}

ARGS=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    -x|--xemu)
      RUN_XEMU=1
      ;;
    -m|--mega65|--etherload)
      RUN_MEGA65=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      while [ "$#" -gt 0 ]; do
        ARGS+=("$1")
        shift
      done
      break
      ;;
    -*)
      echo "unknown option: $1"
      usage
      exit 1
      ;;
    *)
      ARGS+=("$1")
      ;;
  esac
  shift
done

NAME="${ARGS[0]:-}"

if [ -z "$NAME" ]; then
  usage
  exit 1
fi

if [ "${#ARGS[@]}" -gt 1 ]; then
  echo "too many arguments"
  usage
  exit 1
fi

BAS="${NAME}.bas"
PRG="$BUILD_DIR/$(basename "$NAME").prg"

M65TOOLS="${M65TOOLS:-/home/darkod/dev/mega65/tools/m65tools-develo}"
ETHERLOAD="${ETHERLOAD:-$M65TOOLS/etherload}"
XEMU="${XEMU:-/home/darkod/Documents/xemu/build/bin/xmega65.native}"

[ -f "$BAS" ] || { echo "missing BASIC file: $BAS"; exit 1; }

if [ "$RUN_XEMU" -eq 1 ]; then
  [ -x "$XEMU" ] || { echo "xemu is not executable: $XEMU"; exit 1; }
fi

if [ "$RUN_MEGA65" -eq 1 ]; then
  [ -x "$ETHERLOAD" ] || { echo "etherload is not executable: $ETHERLOAD"; exit 1; }
fi

mkdir -p "$BUILD_DIR"

echo "compiling $BAS -> $PRG"
petcat -w65 -o "$PRG" -- "$BAS"

if [ "$RUN_XEMU" -eq 1 ]; then
  echo "running $PRG in xemu"
  "$XEMU" -prg "$PRG" &
fi

if [ "$RUN_MEGA65" -eq 1 ]; then
  echo "transferring $PRG to the mega65 and running it"
  "$ETHERLOAD" -5 -r "$PRG"
fi
