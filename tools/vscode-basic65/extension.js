"use strict";

const vscode = require("vscode");
const referenceDocs = require("./docs/basic65-reference.json");
const symbols = require("./basic65-symbols");
const addressDocs = require("./docs/mega65-addresses.json").map((entry) => ({
  ...entry,
  startValue: Number.parseInt(entry.start, 16),
  endValue: Number.parseInt(entry.end || entry.start, 16)
}));

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
const basicKeywords = symbols.buildKeywordSet(Object.keys(referenceDocs));

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

function findAddressEntry(address) {
  let lookupAddress = address;
  let ioAlias;

  if (address >= 0xFFD3000 && address <= 0xFFD3FFF) {
    ioAlias = 0xD000 + (address - 0xFFD3000);
    lookupAddress = ioAlias;
  }

  const matches = addressDocs
    .filter(
      (entry) =>
        lookupAddress >= entry.startValue && lookupAddress <= entry.endValue
    )
    .sort(
      (left, right) =>
        left.endValue -
        left.startValue -
        (right.endValue - right.startValue)
    );

  return {
    entry: matches[0],
    ioAlias,
    lookupAddress
  };
}

function hex(value, width = 4) {
  return value.toString(16).toUpperCase().padStart(width, "0");
}

function symbolContext(document, position) {
  const occurrences = symbols.analyze(document.getText(), basicKeywords);
  const occurrence = symbols.occurrenceAt(
    occurrences,
    document.offsetAt(position)
  );
  return {
    occurrences,
    occurrence
  };
}

function occurrenceRange(document, occurrence) {
  return new vscode.Range(
    document.positionAt(occurrence.start),
    document.positionAt(occurrence.end)
  );
}

function occurrenceLocation(document, occurrence) {
  return new vscode.Location(
    document.uri,
    occurrenceRange(document, occurrence)
  );
}

async function showReferences(editor, analysis) {
  if (!analysis.occurrence) {
    return;
  }

  const definition = symbols.definitionFor(
    analysis.occurrences,
    analysis.occurrence
  );
  const references = symbols.occurrencesFor(
    analysis.occurrences,
    analysis.occurrence
  );
  const items = references.map((occurrence) => ({
    label: `Line ${occurrence.line + 1}: ${occurrence.raw}`,
    description:
      occurrence.start === definition.start ? "definition" : "reference",
    detail: editor.document.lineAt(occurrence.line).text.trim(),
    occurrence
  }));

  const selected = await vscode.window.showQuickPick(items, {
    title: `References to ${analysis.occurrence.raw}`,
    placeHolder: `${references.length} reference${
      references.length === 1 ? "" : "s"
    } in this document`,
    matchOnDescription: true,
    matchOnDetail: true
  });
  if (!selected) {
    return;
  }

  const target = editor.document.positionAt(selected.occurrence.start);
  editor.selection = new vscode.Selection(target, target);
  editor.revealRange(
    occurrenceRange(editor.document, selected.occurrence),
    vscode.TextEditorRevealType.InCenterIfOutsideViewport
  );
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

  const addressProvider = vscode.languages.registerHoverProvider(selector, {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(
        position,
        /\$[0-9A-Fa-f]+/
      );
      if (!range) {
        return undefined;
      }

      const literal = document.getText(range);
      const address = Number.parseInt(literal.slice(1), 16);
      const result = findAddressEntry(address);
      if (!result.entry) {
        return undefined;
      }

      const entry = result.entry;
      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(
        `**${literal.toUpperCase()} — ${entry.name}**\n\n${entry.description}`
      );

      if (entry.startValue !== entry.endValue) {
        markdown.appendMarkdown(
          `\n\nDocumented range: \`$${hex(
            entry.startValue,
            entry.start.length
          )}–$${hex(entry.endValue, (entry.end || entry.start).length)}\``
        );
      }

      if (result.ioAlias !== undefined) {
        markdown.appendMarkdown(
          `\n\nMEGA65 I/O-window alias: \`$${hex(result.ioAlias)}\``
        );
      }

      if (address >= 0xD000 && address <= 0xDFFF) {
        const absoluteIo = 0xFFD3000 + (address - 0xD000);
        markdown.appendMarkdown(
          `\n\nNormal MEGA65 I/O absolute address: \`$${hex(
            absoluteIo,
            7
          )}\``
        );
      }

      if (address >= 0x1F800 && address <= 0x1FFFF) {
        const colourOffset = address - 0x1F800;
        const physicalColour = 0xFF80000 + colourOffset;
        markdown.appendMarkdown(
          `\n\nUnderlying colour RAM address: \`$${hex(
            physicalColour,
            7
          )}\``
        );
        if (colourOffset < 0x400) {
          markdown.appendMarkdown(
            `\n\nLegacy I/O alias: \`$${hex(0xD800 + colourOffset)}\``
          );
        } else {
          markdown.appendMarkdown(
            `\n\nWith CRAM2K enabled, I/O alias: \`$${hex(
              0xD800 + colourOffset
            )}\``
          );
        }
      }

      if (address >= 0xD800 && address <= 0xDFFF) {
        const colourOffset = address - 0xD800;
        if (colourOffset < 0x400 || address >= 0xDC00) {
          const physicalColour = 0xFF80000 + colourOffset;
          const condition = colourOffset < 0x400 ? "" : " with CRAM2K enabled";
          markdown.appendMarkdown(
            `\n\nColour RAM target${condition}: \`$${hex(
              physicalColour,
              7
            )}\``
          );
        }
      }

      if (address >= 0xFF80000 && address <= 0xFF807FF) {
        const colourOffset = address - 0xFF80000;
        markdown.appendMarkdown(
          `\n\nFlat compatibility alias: \`$${hex(
            0x1F800 + colourOffset,
            5
          )}\``
        );
        const condition = colourOffset < 0x400 ? "" : " with CRAM2K enabled";
        markdown.appendMarkdown(
          `\n\nColour RAM I/O alias${condition}: \`$${hex(
            0xD800 + colourOffset
          )}\``
        );
      }

      if (
        result.lookupAddress >= 0xD100 &&
        result.lookupAddress <= 0xD3FF
      ) {
        markdown.appendMarkdown(
          `\n\nPalette entry: \`${result.lookupAddress & 0xFF}\``
        );
      }

      markdown.appendMarkdown(
        `\n\nDecimal address: \`${address}\`\n\n*MEGA65 Chipset Reference (2026 edition)*`
      );
      return new vscode.Hover(markdown, range);
    }
  });

  const referenceProvider = vscode.languages.registerReferenceProvider(selector, {
    provideReferences(document, position, options) {
      const analysis = symbolContext(document, position);
      if (!analysis.occurrence) {
        return [];
      }

      const definition = symbols.definitionFor(
        analysis.occurrences,
        analysis.occurrence
      );
      return symbols
        .occurrencesFor(analysis.occurrences, analysis.occurrence)
        .filter(
          (occurrence) =>
            options.includeDeclaration || occurrence.start !== definition.start
        )
        .map((occurrence) => occurrenceLocation(document, occurrence));
    }
  });

  const definitionProvider = vscode.languages.registerDefinitionProvider(selector, {
    provideDefinition(document, position) {
      const analysis = symbolContext(document, position);
      if (!analysis.occurrence) {
        return undefined;
      }
      const definition = symbols.definitionFor(
        analysis.occurrences,
        analysis.occurrence
      );
      return occurrenceLocation(document, definition);
    }
  });

  const renameProvider = vscode.languages.registerRenameProvider(selector, {
    prepareRename(document, position) {
      const analysis = symbolContext(document, position);
      if (!analysis.occurrence) {
        throw new Error("Place the cursor on a BASIC 65 variable.");
      }
      return {
        range: occurrenceRange(document, analysis.occurrence),
        placeholder: analysis.occurrence.raw
      };
    },

    provideRenameEdits(document, position, newName) {
      const analysis = symbolContext(document, position);
      if (!analysis.occurrence) {
        throw new Error("Place the cursor on a BASIC 65 variable.");
      }

      const problem = symbols.validateNewName(
        newName,
        analysis.occurrence,
        analysis.occurrences,
        basicKeywords
      );
      if (problem) {
        throw new Error(problem);
      }

      const edit = new vscode.WorkspaceEdit();
      for (const occurrence of symbols.occurrencesFor(
        analysis.occurrences,
        analysis.occurrence
      )) {
        edit.replace(document.uri, occurrenceRange(document, occurrence), newName);
      }
      return edit;
    }
  });

  const findReferences = vscode.commands.registerCommand(
    "basic65.findReferences",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "basic65") {
        return;
      }
      await showReferences(
        editor,
        symbolContext(editor.document, editor.selection.active)
      );
    }
  );

  const definitionOrReferences = vscode.commands.registerCommand(
    "basic65.goToDefinitionOrReferences",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== "basic65") {
        return;
      }

      const position = editor.selection.active;
      const analysis = symbolContext(editor.document, position);
      if (!analysis.occurrence) {
        await vscode.commands.executeCommand("editor.action.revealDefinition");
        return;
      }

      const definition = symbols.definitionFor(
        analysis.occurrences,
        analysis.occurrence
      );
      if (definition.start === analysis.occurrence.start) {
        return;
      }

      const target = editor.document.positionAt(definition.start);
      editor.selection = new vscode.Selection(target, target);
      editor.revealRange(
        occurrenceRange(editor.document, definition),
        vscode.TextEditorRevealType.InCenterIfOutsideViewport
      );
    }
  );

  context.subscriptions.push(
    provider,
    addressProvider,
    referenceProvider,
    definitionProvider,
    renameProvider,
    findReferences,
    definitionOrReferences
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
