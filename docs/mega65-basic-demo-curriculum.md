# Learning MEGA65 BASIC Through Demo Programming

## Curriculum and Working Book Outline

This curriculum teaches MEGA65-native programming with BASIC 65 through small,
self-contained programs. It assumes that the reader already understands ordinary
BASIC syntax and wants to learn what makes the MEGA65 unique.

The long-term project is a complete MEGA65 demo built from character graphics,
sprites, raster effects, palettes, memory operations, transitions, and synchronized
sound.

Bitmap graphics are intentionally outside the scope of this curriculum. The focus is
the MEGA65's text, character, sprite, memory, DMA, palette, and audio architecture.

The MEGA65 is always the subject. C64 and C65 concepts are included only where the
MEGA65 inherits a compatibility mechanism that helps explain its native operation,
such as the 16-bit CPU view, I/O mappings, VIC register ancestry, or compatibility
aliases. They are supporting context, not separate programming targets. Every such
discussion should return to the corresponding MEGA65 address, feature, or practical
use.

## Learning principles

Each lesson should:

1. Introduce one closely related set of ideas.
2. Provide a self-contained `.bas` program.
3. Produce an observable result on the MEGA65 or Xemu.
4. Explain the BASIC commands being used.
5. Connect those commands to the underlying memory or hardware.
6. Use exact addresses and register names where they improve understanding.
7. Preserve or restore machine state when practical.
8. Avoid unexplained magic values.
9. Distinguish compatibility mappings from native physical addresses.
10. Build knowledge that will be reused in the final demo.
11. Introduce C64 or C65 behavior only to clarify a MEGA65 mechanism, then state
    the native MEGA65 interpretation explicitly.

Source files use a three-digit lesson prefix:

```text
000_lesson_name.bas
001_lesson_name.bas
002_lesson_name.bas
...
```

## Primary references

The curriculum is grounded in the official MEGA65 documentation:

- *MEGA65 BASIC 65 Reference* for exact command and function behavior.
- *MEGA65 Chipset Reference* for memory maps, VIC-IV registers, palettes, sprites,
  colour RAM, DMA, and I/O architecture.
- *MEGA65 Developer Guide* for practical development techniques.
- *MEGA65 Book* for extended explanations and tutorials.
- *MEGA65 User Guide* for system operation and introductory context.
- *BASIC 65 Quick Reference Card* for functional command groupings.

When documentation and observed behavior differ, the lesson should identify the ROM,
core, and emulator versions involved instead of silently assuming one is correct.

## Completed foundation

### 000 — Screen-code and colour arrays

Introduces:

- `T@&()` and `C@&()`
- Screen codes versus PETSCII
- Zero-based screen coordinates
- `RWINDOW()`
- The separation between character selection and colour

Source: `projects/edu/000_screen_arrays.bas`

### 001 — Custom glyphs

Introduces:

- `FONT`
- `CHARDEF`
- Eight-byte, 8×8 character definitions
- Binary constants
- The relationship between a screen code and its shared glyph
- Volatile character-set changes

Source: `projects/edu/001_custom_glyphs.bas`

### 002 — Palette entries

Introduces:

- Colour RAM as a palette-index map
- `PALETTE COLOR`
- Four-bit RGB components
- Palette animation
- `PALETTE RESTORE`
- Changing many visible cells without rewriting colour RAM

Source: `projects/edu/002_palette_entries.bas`

### 003 — Text windows

Introduces:

- `WINDOW`
- Window dimensions versus complete screen dimensions
- Window-local printing, clearing, cursor movement, and scrolling
- Direct screen-array access outside the current text window

Source: `projects/edu/003_text_windows.bas`

### 004 — VIC-IV memory pointers

Introduces:

- `BANK 128`
- Memory-mapped I/O
- `PEEK`, `WPEEK`, and little-endian register values
- `SCRNPTR`, `COLPTR`, `CHARPTR`, and `LINESTEP`
- Calculating a screen-code address
- Colour RAM's physical address and compatibility aliases
- Comparing system arrays with raw memory access

Source: `projects/edu/004_memory_pointers.bas`

---

# Phase 1 — MEGA65 Memory Architecture

This phase establishes the memory model required by every later demo effect.

## 005 — The 28-bit address space

Topics:

- The difference between CPU-visible and physical addresses
- Fast chip RAM
- ROM-backed regions
- Dedicated colour RAM
- Attic RAM
- I/O regions
- Which hardware devices can access each region

Outcome: the reader can classify an address and explain what kind of memory or device
it represents.

Source: `projects/edu/005_address_space.bas`

## 006 — The CPU's 16-bit view

Topics:

- The 45GS02's `$0000–$FFFF` CPU-visible window
- `BANK`
- Banked addresses versus flat addresses
- Compatibility mappings only as background to the MEGA65's 16-bit view
- The corresponding native MEGA65 flat addresses
- Why `$D000–$DFFF` can expose RAM, ROM, or I/O
- I/O personalities and `$D02F`

Outcome: the reader understands why a 16-bit address does not always identify one
physical location.

Source: `projects/edu/006_cpu_view.bas`

## 007 — Bytes, words, and address arithmetic

Topics:

- `PEEK` and `POKE`
- `WPEEK` and `WPOKE`
- Unsigned bytes
- 16-bit words
- Little-endian storage
- Building 24-bit addresses from register bytes
- Calculating table, row, and structure offsets

Outcome: the reader can inspect and update simple memory structures safely.

## 008 — Register bit manipulation

Topics:

- Binary and hexadecimal notation
- `AND`, `OR`, `XOR`, and `NOT`
- `HASBIT`, `SETBIT`, and `CLRBIT`
- Bit masks
- Preserving unrelated register fields
- Read-modify-write operations

Outcome: the reader can change one hardware option without corrupting other bits in
the same register.

## 009 — BASIC's own memory

Topics:

- Program storage
- Scalar variables
- Arrays
- Strings
- `CLR`
- `DIM`
- `FRE()`
- `MEM`
- `POINTER()`
- Safe and unsafe regions for custom data

Outcome: the reader can plan memory use without overwriting BASIC or system state.

## 010 — Binary assets in memory

Topics:

- `BLOAD`
- `BSAVE`
- `BVERIFY`
- Explicit load addresses
- Character, colour-map, screen-map, sprite, and lookup-table assets
- Separating source assets from generated binaries

Outcome: the reader can move generated host-side assets into predictable MEGA65
memory locations.

## 011 — DMA fundamentals

Topics:

- Why DMA is useful
- `DMA`
- `EDMA`
- Copy operations
- Fill operations
- Source and destination banks
- DMA-safe memory regions
- When BASIC loops remain preferable

Outcome: the reader can perform fast memory clears, copies, and transfers for demo
effects.

---

# Phase 2 — Character-Mode Architecture

This phase develops a complete mental model of VIC-IV text and character display.

## 012 — Character memory in depth

Topics:

- Eight-byte monochrome glyphs
- Pixel-row bit layout
- Screen-code groups
- Uppercase/graphics and lowercase groups
- PETSCII conversion
- Reversed characters

## 013 — Direct glyph-memory editing

Topics:

- Calculating `character_base + screen_code × 8`
- Writing glyph rows with `POKE`
- Reading glyph data where supported
- `CHARDEF` versus direct memory editing
- Animating a shared glyph

## 014 — Relocating character memory

Topics:

- `CHARPTR` at `$D068–$D06A`
- 24-bit character addresses
- Built-in character data versus custom character RAM
- Switching character sets
- Restoring the original pointer

## 015 — Screen-memory organization

Topics:

- `SCRNPTR` at `$D060–$D063`
- Screen-code bytes
- Visible columns
- Virtual row width
- `LINESTEP`
- Off-screen cells
- One-byte and two-byte character cells

## 016 — Colour-memory organization

Topics:

- Physical colour RAM at `$FF80000`
- Flat compatibility alias at `$1F800`
- Legacy I/O window at `$D800`
- `CRAM2K`
- `COLPTR` at `$D064–$D065`
- Colour indices and attributes

## 017 — Relocating screen and colour buffers

Topics:

- Allocating matching screen and colour buffers
- Pointer alignment
- Changing `SCRNPTR` and `COLPTR`
- Maintaining compatible row strides
- Avoiding overlap with other assets

## 018 — Character-screen swapping

Topics:

- Preparing an off-screen text display
- Instant pointer-based transitions
- Character-mode double buffering
- Synchronizing pointer swaps with the display

Outcome of Phase 2: the reader can build and switch complete custom character-mode
displays without relying solely on the default KERNAL screen.

---

# Phase 3 — Character-Based Demo Effects

## 019 — Character-map assets

- Screen-code maps
- Colour maps
- Host-side conversion
- Loading maps with `BLOAD`
- Displaying a complete prepared scene

## 020 — Animated characters

- Updating glyph memory instead of screen memory
- Shared animation frames
- Frame tables
- Multi-glyph animation

## 021 — Palette cycling

- VIC-IV palette component registers
- Palette banks
- `MAPEDPAL`
- Bitmap/text and sprite palette selection
- Cyclic colour tables
- Palette fades

Although the VIC-IV calls one selector the bitmap/text palette, this curriculum uses
it only for character/text modes.

## 022 — Text scrollers

- Character-at-a-time scrolling
- Smooth pixel scrolling
- Virtual row width
- Off-screen columns
- Recycling screen cells

## 023 — Sine-wave text

- `SIN()` and `SIND()`
- Phase
- Amplitude
- Per-column or per-character offsets
- Lookup tables

## 024 — Colour waves

- Generated colour-RAM patterns
- Phase offsets
- Palette-index waves
- Combining colour RAM changes with palette animation

## 025 — Character distortion

- Character horizontal and vertical scaling
- Text display position
- Fine movement registers
- Register changes synchronized to raster positions

## 026 — Extended VIC-IV character modes

- Text attributes
- More than 256 glyphs
- Two-byte character cells
- Extended colour selection
- Full-colour character concepts
- Additional memory and stride requirements

Outcome of Phase 3: the reader can construct several independent demo effects using
only character, colour, and palette hardware.

---

# Phase 4 — Sprites

## 027 — Sprite memory format

- Legacy 24×21 sprite geometry
- Three bytes per pixel row
- 63-byte image data and 64-byte alignment
- Transparency
- Monochrome and multicolour encoding

## 028 — BASIC sprite commands

- `SPRITE`
- `MOVSPR`
- `SPRCOLOR`
- `SPRSAV`
- Sprite initialization and cleanup

## 029 — Reading sprite state

- `RSPRITE()`
- `RSPPOS()`
- `RSPCOLOR()`
- `RSPEED()`
- `RSPRSYS()`

## 030 — Direct sprite registers

- Enable flags
- X and Y coordinates
- Most-significant X bits
- Sprite colours
- Expansion and priority

## 031 — Sprite pointer tables

- Legacy sprite pointers
- `SPRPTRADR` at `$D06C–$D06E`
- Relocating the pointer table
- 16-bit sprite pointers
- Organizing multiple sprite sets

## 032 — Extended VIC-IV sprites

- Full-colour sprite mode
- Extended width
- Variable height
- Sprite palette banks
- Increased memory requirements

## 033 — Coordinated sprite motion

- Sine paths
- Circular paths
- Phase-separated movement
- Sprite groups
- Frame synchronization

## 034 — Sprite reuse and raster multiplexing

- Repositioning sprites during one frame
- Raster scheduling
- Sprite data reuse
- BASIC performance limits
- Deciding when a technique requires machine-language assistance

Outcome of Phase 4: the reader can load, configure, animate, and synchronize legacy
and extended sprites.

---

# Phase 5 — Raster Timing and Synchronization

## 035 — Video timing

- PAL and NTSC frames
- Raster lines
- Physical pixel rows
- Character rows
- Vertical blanking

## 036 — `VSYNC`

- Waiting for a raster line
- Frame synchronization
- Avoiding tearing
- Timing work across frames

## 037 — Raster colour effects

- Border colour changes
- Background colour changes
- Palette changes during a frame
- Horizontal colour bands

## 038 — Raster splits

- Different display settings in different screen regions
- Text-position splits
- Palette-bank splits
- Character-set or screen-pointer splits
- Safe register-update windows

## 039 — `WAIT` and hardware polling

- Waiting for register bit patterns
- Masks
- Conditions that can hang
- `WAIT` versus `VSYNC`

## 040 — Stable frame loops

- Frame counters
- Fixed update rates
- Separating update and display work
- Measuring BASIC performance

## 041 — PAL and NTSC behavior

- 50 Hz versus 60 Hz
- Raster-count differences
- Timing-independent movement
- Designing portable demo parts

Outcome of Phase 5: the reader can synchronize visual effects with the physical
display and reason about timing limitations.

---

# Phase 6 — Mathematics for Demo Effects

## 042 — Angles and trigonometry

- `SIN()`, `COS()`, `SIND()`, and `COSD()`
- Radians and degrees
- Phase and amplitude

## 043 — Lookup tables

- Precalculation
- Array-based tables
- Binary lookup-table assets
- Trading memory for speed

## 044 — Fixed-point techniques

- Integer and fractional components
- Subpixel movement
- Phase accumulators
- Avoiding unnecessary floating-point work

## 045 — Bitwise visual patterns

- Masks
- Shifts
- Repeated structures
- Pattern generation
- Combining counters with boolean operators

## 046 — Pseudorandom effects

- `RND()`
- Noise
- Sparkles and particles
- Repeatable versus non-repeatable sequences

---

# Phase 7 — Sound and Synchronization

## 047 — SID architecture

- Voices
- Frequency
- Waveforms
- Pulse width
- Envelopes
- Filters
- Volume

## 048 — BASIC sound commands

- `SOUND`
- `ENVELOPE`
- `VOL`

## 049 — Music commands

- `PLAY`
- `TEMPO`
- `FILTER`
- `RPLAY()`

## 050 — Sound effects

- Frequency sweeps
- Noise
- Short envelopes
- Layering effects with music

## 051 — Synchronizing visuals with sound

- Frame counters
- Musical cues
- Event tables
- Visual phase changes
- Practical synchronization limits in BASIC

---

# Phase 8 — Demo Data, Transitions, and Sequencing

## 052 — Asset-memory planning

- A complete memory map for the demo
- Character sets
- Screen maps
- Colour maps
- Sprites
- Lookup tables
- Audio data
- Temporary buffers

## 053 — Loading demo parts

- Predictable `BLOAD` destinations
- Disk-image organization
- Preloading versus loading between parts
- Verifying asset sizes

## 054 — Transition techniques

- Palette fades
- Character dissolves
- Screen swaps
- Wipes
- Colour reveals

## 055 — DMA transitions

- Fast clears
- Screen copies
- Colour copies
- Incremental reveals
- Moving prepared buffers

## 056 — Part sequencing

- Demo states
- Part initialization
- Main effect loop
- Exit conditions
- Transition state

## 057 — Cleanup between parts

- Restore pointers
- Restore palettes
- Disable sprites
- Restore display position and scaling
- Release or reuse buffers
- Document persistent shared state

---

# Final Demo Project

## 058 — Design the demo memory map

Decide where every asset, table, screen, sprite set, and temporary buffer will live.

## 059 — Intro screen

Create a custom-font title sequence with palette fades.

## 060 — Character animation part

Combine animated glyphs, colour patterns, and palette cycling.

## 061 — Scroller part

Build a smooth text scroller with sine-wave or colour-wave modulation.

## 062 — Sprite part

Present coordinated legacy or full-colour sprites following calculated paths.

## 063 — Raster part

Combine border, background, palette, and text-position changes within a frame.

## 064 — Transition system

Connect parts with pointer swaps, DMA copies, wipes, and palette fades.

## 065 — Soundtrack synchronization

Coordinate visual part changes with musical or frame-based cues.

## 066 — Assemble the complete sequence

Create a reliable initialization, part sequence, cleanup path, and ending.

## 067 — Package the demo

Build an `AUTOBOOT.D81` containing the program and all required assets.

## 068 — Test and refine

Test on:

- Xemu
- PAL timing
- NTSC timing where practical
- Real MEGA65 hardware

Record emulator, ROM, core, and hardware-version differences.

---

# Topics Deliberately Deferred

The following topics are not part of the main curriculum:

- Bitmap screens
- Bitmap drawing primitives
- Flood filling
- Bitmap image loading
- Game collision systems
- Joystick-driven gameplay
- Enemy and level logic
- Player-state persistence

They may become separate appendices or follow-up volumes in the future.

# Intended progression

```text
Memory architecture
        ↓
Character-mode hardware
        ↓
Character effects
        ↓
Sprites
        ↓
Raster timing
        ↓
Mathematical effect generation
        ↓
Sound synchronization
        ↓
Transitions and sequencing
        ↓
Complete MEGA65 demo
```

# From curriculum to book

Each completed lesson can eventually become a chapter containing:

1. The visible goal.
2. Required prior knowledge.
3. The complete program.
4. A guided code reading.
5. The underlying memory model.
6. Register diagrams and address tables.
7. Experiments for the reader.
8. Common mistakes.
9. Xemu and hardware notes.
10. A short challenge that extends the effect.

Keeping the examples small and self-contained now will make that future conversion
considerably easier.
