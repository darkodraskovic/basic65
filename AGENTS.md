# MEGA65 BASIC Project Guidelines

- Use the official MEGA65 BASIC 65, Chipset, and Developer references in
  `/home/darkod/Retrogaming/MEGA65/books/`. Do not guess hardware behavior.
- Educational programs belong in `projects/edu/` and use three-digit names such as
  `005_address_space.bas`. Keep every lesson self-contained and focused.
- Write BASIC 65 source in the existing lowercase style.
- Add inline `REM` comments to important addresses, pointers, register values, memory
  calculations, and state changes.
- Add short standalone `REM` comments before logic that is not immediately obvious.
  Explain why it works; do not comment trivial syntax.
- Clearly distinguish absolute addresses, offsets, banked addresses, compatibility
  aliases, and memory-mapped I/O.
- Preserve or restore palettes, pointers, registers, sprites, and screen state when
  practical. Avoid unexplained magic values.
- Keep the curriculum character-, sprite-, memory-, DMA-, raster-, and demo-focused.
  Bitmap graphics are deferred unless explicitly requested.
- Preserve user edits and build on the curriculum in
  `docs/mega65-basic-demo-curriculum.md`.
- Validate changed `.bas` lessons with `petcat -w65` and keep generated files in
  `build/`.
