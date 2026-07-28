# MEGA65 BASIC Project Guidelines

- Use the official MEGA65 BASIC 65, Chipset, and Developer references in
  `/home/darkod/Retrogaming/MEGA65/books/`. Do not guess hardware behavior.
- Educational programs belong in `projects/edu/` and use three-digit names such as
  `005_address_space.bas`. Keep every lesson self-contained and focused.
- Write BASIC 65 source in the existing lowercase style.
- Use exactly two meaningful letters for variable names because BASIC 65 considers
  only the first two letters significant. Prefer domain abbreviations for important
  values and role-plus-object names for temporary or saved values.
- At an important variable's first assignment, use an inline `REM` to connect its
  abbreviation to the full name, such as `sb&=peek($d020) : rem sb = saved border`.
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
- Treat the MEGA65 native memory map and hardware as the subject. Mention C64 or
  C65 behavior only when an inherited compatibility mechanism helps explain MEGA65
  operation; always return the explanation to its MEGA65 meaning and practical use.
- Preserve user edits and build on the curriculum in
  `docs/mega65-basic-demo-curriculum.md`.
- Validate changed `.bas` lessons with `petcat -w65` and keep generated files in
  `build/`.
