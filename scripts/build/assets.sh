#!/bin/bash
set -euo pipefail

CHARDEF_SRC="${1:-assets/gfx/chars_hires_16x8.png}"
CHARMAP_SRC="${2:-assets/maps/char_map_1.tmj}"

SPRITEDEF_SRC="${3:-assets/gfx/sprites_hires_4x4.png}"

BUILD_DIR="build"

CHARDEF_BIN="$BUILD_DIR/chardef.bin"
CHARDEF_ASM="$BUILD_DIR/chardef.asm"

CHARMAP_BIN="$BUILD_DIR/charmap.bin"
CHARMAP_ASM="$BUILD_DIR/charmap.asm"

SPRITEDEF_BIN="$BUILD_DIR/spritedef.bin"
SPRITEDEF_ASM="$BUILD_DIR/spritedef.asm"

mkdir -p "$BUILD_DIR"

echo "converting chardef"
./scripts/convert/chardef.py \
  -o "$CHARDEF_BIN" \
  --asm "$CHARDEF_ASM" \
  "$CHARDEF_SRC"

echo "converting charmap"
./scripts/convert/charmap.py \
  -o "$CHARMAP_BIN" \
  --asm "$CHARMAP_ASM" \
  "$CHARMAP_SRC" \

echo "converting spritedef"
./scripts/convert/spritedef.py \
  -o "$SPRITEDEF_BIN" \
  --asm "$SPRITEDEF_ASM" \
  "$SPRITEDEF_SRC"

echo "done"
echo "wrote:"
echo "  $CHARDEF_BIN"
echo "  $CHARDEF_ASM"
echo "  $CHARMAP_BIN"
echo "  $CHARMAP_ASM"
echo "  $SPRITEDEF_BIN"
echo "  $SPRITEDEF_ASM"