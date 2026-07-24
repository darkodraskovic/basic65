# MEGA65 BASIC 65 for VS Code

Repository-local language support for BASIC 65 source files.

## Features

- BASIC 65 and MEGA65 keyword highlighting
- Hexadecimal (`$D020`) and binary (`%11000011`) constants
- System arrays such as `T@&()` and `C@&()`
- Typed BASIC variables (`A$`, `I%`, `C&`)
- `REM` comments and BASIC string handling
- Snippets for structured control flow, screen cells, VIC-IV I/O, and `CHARDEF`
- Hover documentation for core BASIC 65, memory, text, and VIC-IV commands
- Address hovers for documented MEGA65 memory ranges and VIC registers

The keyword list is based on the *MEGA65 BASIC 65 Reference*, edition dated
February 2, 2026.

## Refresh reference documentation

To regenerate all hover entries from a newer official reference:

```sh
./tools/vscode-basic65/scripts/generate-reference-docs.py \
  /path/to/mega65-basic65-reference.pdf \
  tools/vscode-basic65/docs/basic65-reference.json
```

## Run during development

1. Open this directory in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. Open a `.bas` file in the new window.

## Package and install locally

From the repository root:

```sh
./tools/vscode-basic65/package.sh
code --install-extension build/basic65-0.4.1.vsix
```

This extension provides editing support only. Project build and Xemu launch commands
remain in the repository's `scripts/build` directory.
