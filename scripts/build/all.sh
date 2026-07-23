#!/bin/bash
set -euo pipefail

BUILD_DIR="build"

RUN_XEMU=0
RUN_MEGA65=0

usage() {
  echo "usage: ./scripts/build/all.sh [--xemu] [--mega65] program"
}

ARGS=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    -x|--xemu)
      RUN_XEMU=1
      ;;
    -m|--mega65)
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

CHARDEF="$BUILD_DIR/chardef.bin"
CHARMAP="$BUILD_DIR/charmap.bin"
SPRITEDEF="$BUILD_DIR/spritedef.bin"

echo "building assets"
./scripts/build/assets.sh

mkdir -p "$BUILD_DIR"

NAME_BASE=$(basename "$NAME")
CHARDEF_BASE=$(basename "$CHARDEF")
CHARMAP_BASE=$(basename "$CHARMAP")
SPRITEDEF_BASE=$(basename "$SPRITEDEF")

BAS="${NAME}.bas"
PRG="$BUILD_DIR/${NAME_BASE}.prg"

DISK="autoboot"
D81="$BUILD_DIR/${DISK}.d81"

if [ "$(uname -s)" != "Linux" ]; then
  echo "unsupported operating system: $(uname -s)"
  exit 1
fi

MEGA65_TOOLS="${MEGA65_TOOLS:-/home/darkod/dev/mega65/tools/m65tools/}"
MEGA65_FTP="${MEGA65_FTP:-$MEGA65_TOOLS/mega65_ftp}"
ETHERLOAD="${ETHERLOAD:-$MEGA65_TOOLS/etherload}"
XEMU="${XEMU:-/home/darkod/Documents/xemu/build/bin/xmega65.native}"

[ -f "$BAS" ] || { echo "missing BASIC file: $BAS"; exit 1; }
[ -f "$CHARDEF" ] || { echo "missing chardef file: $CHARDEF"; exit 1; }
[ -f "$CHARMAP" ] || { echo "missing charmap file: $CHARMAP"; exit 1; }
[ -f "$SPRITEDEF" ] || { echo "missing spritedef file: $SPRITEDEF"; exit 1; }

echo "compiling $BAS -> $PRG"
petcat -w65 -o "$PRG" -- "$BAS"

echo "creating $D81"
rm -f "$D81"
c1541 -format "autoboot",01 d81 "$D81"

echo "writing $PRG to $D81 as AUTOBOOT.C65"
c1541 "$D81" -write "$PRG" "autoboot.c65"

echo "writing $CHARDEF to $D81 as $CHARDEF_BASE"
c1541 "$D81" -write "$CHARDEF" "$CHARDEF_BASE"

echo "writing $CHARMAP to $D81 as $CHARMAP_BASE"
c1541 "$D81" -write "$CHARMAP" "$CHARMAP_BASE"

echo "writing $SPRITEDEF to $D81 as $SPRITEDEF_BASE"
c1541 "$D81" -write "$SPRITEDEF" "$SPRITEDEF_BASE"

if [ "$RUN_XEMU" -eq 1 ]; then
  echo "running $D81 in xemu"
  "$XEMU" -8 "$D81" &
fi

if [ "$RUN_MEGA65" -eq 1 ]; then
  D81_BASE=$(basename "$D81")

  echo "uploading $D81 to the MEGA65 SD card as $D81_BASE"
  "$MEGA65_FTP" -e -y -c "put $D81 $D81_BASE" -c exit

  echo "mounting $D81_BASE on MEGA65 drive 8 and running $PRG"
  "$ETHERLOAD" --mount "$D81_BASE" -5
fi
