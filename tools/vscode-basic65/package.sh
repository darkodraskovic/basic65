#!/bin/bash

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_DIR=$(cd "$ROOT_DIR/../.." && pwd)
STAGE_DIR=$(mktemp -d)
OUTPUT="$PROJECT_DIR/build/basic65-0.5.2.vsix"

trap 'rm -rf "$STAGE_DIR"' EXIT

mkdir -p "$STAGE_DIR/extension/syntaxes"
mkdir -p "$STAGE_DIR/extension/snippets"
mkdir -p "$STAGE_DIR/extension/docs"

cp "$ROOT_DIR/vsix/extension.vsixmanifest" "$STAGE_DIR/"
cp "$ROOT_DIR/vsix/[Content_Types].xml" "$STAGE_DIR/"
cp "$ROOT_DIR/package.json" "$STAGE_DIR/extension/"
cp "$ROOT_DIR/extension.js" "$STAGE_DIR/extension/"
cp "$ROOT_DIR/basic65-symbols.js" "$STAGE_DIR/extension/"
cp "$ROOT_DIR/language-configuration.json" "$STAGE_DIR/extension/"
cp "$ROOT_DIR/README.md" "$STAGE_DIR/extension/"
cp "$ROOT_DIR/docs/basic65-reference.json" "$STAGE_DIR/extension/docs/"
cp "$ROOT_DIR/docs/mega65-addresses.json" "$STAGE_DIR/extension/docs/"
cp "$ROOT_DIR/syntaxes/basic65.tmLanguage.json" "$STAGE_DIR/extension/syntaxes/"
cp "$ROOT_DIR/snippets/basic65.json" "$STAGE_DIR/extension/snippets/"

mkdir -p "$(dirname "$OUTPUT")"
rm -f "$OUTPUT"

(
  cd "$STAGE_DIR"
  zip -q -r "$OUTPUT" .
)

echo "created $OUTPUT"
