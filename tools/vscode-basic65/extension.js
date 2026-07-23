"use strict";

const vscode = require("vscode");
const referenceDocs = require("./docs/basic65-reference.json");

const curatedDocs = {
  "T@&": {
    syntax: "T@&(column, row)",
    summary: "Reads or writes the screen code at a text-screen position.",
    details: "This is a reserved BASIC 65 system array. Coordinates start at `(0, 0)`. Writing changes the character cell without moving the cursor or changing its colour."
  },
  "C@&": {
    syntax: "C@&(column, row)",
    summary: "Reads or writes the colour and attributes of a text-screen cell.",
    details: "This system array accesses the colour entry corresponding to `T@&()`. The value selects a system-palette entry; upper bits can represent text attributes in applicable modes."
  },
  BANK: {
    syntax: "BANK bank_number",
    summary: "Selects the memory configuration used by BASIC commands with 16-bit addresses.",
    details: "Addresses from `$0000` to `$FFFF` use this mapping. Flat addresses at or above `$10000` ignore `BANK`. Values greater than 127 select memory-mapped I/O; `BANK 128` is the normal system mapping."
  },
  PEEK: {
    syntax: "PEEK(address)",
    summary: "Reads one unsigned byte from memory or memory-mapped I/O.",
    details: "The result is from 0 to 255. For a 16-bit address, the active `BANK` applies. Larger addresses are treated as flat physical addresses."
  },
  POKE: {
    syntax: "POKE address, value [, value ...]",
    summary: "Writes one or more bytes to memory or memory-mapped I/O.",
    details: "Only the low eight bits of each value are written. Consecutive values go to consecutive addresses."
  },
  WPEEK: {
    syntax: "WPEEK(address)",
    summary: "Reads a 16-bit little-endian word from memory or I/O.",
    details: "The byte at `address` is the low byte; the byte at `address+1` is the high byte."
  },
  WPOKE: {
    syntax: "WPOKE address, word [, word ...]",
    summary: "Writes one or more 16-bit little-endian words to memory or I/O.",
    details: "Each word is stored low byte first and advances the destination address by two bytes."
  },
  RWINDOW: {
    syntax: "RWINDOW(n)",
    summary: "Returns a property of the current text window or screen mode.",
    details: "`0`: window width, `1`: window height, `2`: screen columns (40 or 80), `3`: screen rows (25 or 50)."
  },
  SCNCLR: {
    syntax: "SCNCLR [colour]",
    summary: "Clears the current text window, or clears the graphics screen with a colour.",
    details: "With no argument it clears text. With a colour argument it fills the graphics screen."
  },
  CURSOR: {
    syntax: "CURSOR [column] [, row]",
    summary: "Reads or changes the text cursor position.",
    details: "Text-screen coordinates are zero-based. Moving the cursor does not change screen memory until text is printed."
  },
  FONT: {
    syntax: "FONT <A | B | C>",
    summary: "Loads one of the built-in fonts into the VIC character-set buffer.",
    details: "`FONT C` restores the default PETSCII font. Loading a font discards volatile glyph changes made by `CHARDEF`. Fonts D, E, and F correspond to A, B, and C in lowercase mode."
  },
  CHARDEF: {
    syntax: "CHARDEF index, row0, row1, row2, row3, row4, row5, row6, row7",
    summary: "Replaces the 8×8 pixel bitmap for a screen-code glyph.",
    details: "Each row argument is one byte: bit 7 is the leftmost pixel and bit 0 the rightmost. The change is written to the volatile VIC character-set buffer and affects every cell using that screen code."
  },
  HEX$: {
    syntax: "HEX$(number)",
    summary: "Returns the hexadecimal representation of a number as a string.",
    details: "The returned text does not include a `$` prefix. For example, `HEX$(255)` returns `\"FF\"`."
  },
  DEC: {
    syntax: "DEC(hex_string)",
    summary: "Converts a hexadecimal string to a numeric value.",
    details: "For example, `DEC(\"D020\")` returns `53280`."
  },
  MOD: {
    syntax: "MOD(dividend, divisor)",
    summary: "Returns the remainder after integer division.",
    details: "The result has the same sign as the dividend. For example, `MOD(19, 16)` returns `3`."
  },
  GET: {
    syntax: "GET variable",
    summary: "Checks for keyboard input without waiting.",
    details: "If no key is available, execution continues immediately and a string variable receives an empty string."
  },
  GETKEY: {
    syntax: "GETKEY variable",
    summary: "Waits for a key press and stores it in a variable.",
    details: "Unlike `GET`, this command blocks until keyboard input is available."
  },
  VSYNC: {
    syntax: "VSYNC [raster_line]",
    summary: "Waits for a video raster position.",
    details: "Useful for synchronising animation and register changes with display generation to reduce tearing."
  },
  BORDER: {
    syntax: "BORDER colour",
    summary: "Sets the screen-border colour to a system-palette entry.",
    details: "This is the BASIC 65 abstraction for the VIC border colour."
  },
  BACKGROUND: {
    syntax: "BACKGROUND colour",
    summary: "Sets the text or graphics background colour.",
    details: "The value selects an entry from the active system palette."
  },
  PALETTE: {
    syntax: "PALETTE operation ...",
    summary: "Configures or restores palette entries used by graphics and text.",
    details: "The exact arguments depend on the operation. `PALETTE RESTORE` restores the system palette."
  },
  SCREEN: {
    syntax: "SCREEN operation ...",
    summary: "Defines, opens, selects, or closes a BASIC 65 graphics screen.",
    details: "This command manages bitmap graphics contexts; it is separate from the normal text screen accessed through `T@&()` and `C@&()`."
  },
  SPRITE: {
    syntax: "SPRITE operation ...",
    summary: "Configures VIC sprites or the BASIC sprite system.",
    details: "Sprite subcommands control visibility, position, image data, and system state. Consult the BASIC 65 reference for the selected operation."
  },
  BLOAD: {
    syntax: "BLOAD filename [, options]",
    summary: "Loads binary data into memory.",
    details: "Common MEGA65 uses include loading character sets, maps, sprites, and other generated assets at an explicit address."
  },
  BSAVE: {
    syntax: "BSAVE filename [, options]",
    summary: "Saves a memory range as a binary file.",
    details: "Useful for exporting generated character, sprite, map, or machine-code data."
  }
};

const docs = { ...referenceDocs };
for (const [key, entry] of Object.entries(curatedDocs)) {
  docs[key] = {
    ...referenceDocs[key],
    ...entry
  };
}

const docKeys = Object.keys(docs).sort((left, right) => right.length - left.length);

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findHoverTarget(document, position) {
  const line = document.lineAt(position.line).text;

  for (const key of docKeys) {
    const phrase = escapeRegex(key).replace(/ /g, "\\s+");
    const pattern = new RegExp(
      `(^|[^A-Za-z0-9@&$])(${phrase})(?=$|[^A-Za-z0-9@&$])`,
      "gi"
    );

    for (const match of line.matchAll(pattern)) {
      const start = match.index + match[1].length;
      const end = start + match[2].length;
      if (position.character >= start && position.character <= end) {
        return {
          key,
          range: new vscode.Range(position.line, start, position.line, end)
        };
      }
    }
  }

  return undefined;
}

function activate(context) {
  const selector = { language: "basic65" };

  const provider = vscode.languages.registerHoverProvider(selector, {
    provideHover(document, position) {
      const target = findHoverTarget(document, position);
      if (!target) {
        return undefined;
      }

      const entry = docs[target.key];

      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(entry.syntax, "basic");
      markdown.appendMarkdown(`\n${entry.summary}`);
      if (entry.details) {
        markdown.appendMarkdown(`\n\n${entry.details}`);
      }
      if (entry.token) {
        markdown.appendMarkdown(`\n\nToken: \`${entry.token}\``);
      }
      markdown.appendMarkdown(
        `\n\n*${entry.reference || "MEGA65 BASIC 65 Reference (2026 edition)"}*`
      );
      return new vscode.Hover(markdown, target.range);
    }
  });

  context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
