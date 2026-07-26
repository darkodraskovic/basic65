"use strict";

const assert = require("assert");
const referenceDocs = require("../docs/basic65-reference.json");
const symbols = require("../basic65-symbols");

const keywords = symbols.buildKeywordSet(Object.keys(referenceDocs));
const source = [
  "10 dim zzarr(10)",
  "20 xyfoo=1",
  "30 xy=xy+1",
  "40 xyfoo%=2",
  "50 zzarr(xy)=xyfoo",
  "60 print \"xyfoo xy zzarr\"",
  "70 rem xyfoo=99",
  "80 data xyfoo,xy,zzarr",
  "90 for i=0 to xyfoo",
  "100 print zzarr(i)",
  "110 next i",
  "120 qz=1",
  "130 poke $d060,1",
  "140 font c",
  ""
].join("\n");

const occurrences = symbols.analyze(source, keywords);
const speed = occurrences.find((occurrence) => occurrence.raw === "xyfoo");
const speedReferences = symbols.occurrencesFor(occurrences, speed);
const speedDefinition = symbols.definitionFor(occurrences, speed);

assert.strictEqual(speedReferences.length, 6);
assert.strictEqual(speedDefinition.line, 1);
assert.strictEqual(speedDefinition.raw, "xyfoo");
assert.strictEqual(
  speedReferences.some((occurrence) => occurrence.raw === "xy"),
  true
);

const integerSpeed = occurrences.find(
  (occurrence) => occurrence.raw.toLowerCase() === "xyfoo%"
);
assert.strictEqual(
  symbols.occurrencesFor(occurrences, integerSpeed).length,
  1
);

const tiles = occurrences.find(
  (occurrence) => occurrence.raw.toLowerCase() === "zzarr"
);
assert.strictEqual(tiles.isArray, true);
assert.strictEqual(symbols.definitionFor(occurrences, tiles).line, 0);
assert.strictEqual(symbols.occurrencesFor(occurrences, tiles).length, 3);

assert.strictEqual(
  occurrences.some((occurrence) => occurrence.line === 5),
  false,
  "strings must not contain references"
);
assert.strictEqual(
  occurrences.some((occurrence) => occurrence.line === 6),
  false,
  "REM comments must not contain references"
);
assert.strictEqual(
  occurrences.some((occurrence) => occurrence.line === 7),
  false,
  "DATA payloads must not contain references"
);
assert.strictEqual(
  occurrences.some((occurrence) => occurrence.line === 12),
  false,
  "hexadecimal addresses must not contain references"
);
assert.strictEqual(
  occurrences.some((occurrence) => occurrence.line === 13),
  false,
  "FONT option letters must not contain references"
);

assert.match(
  symbols.validateNewName("screenValue", speed, occurrences, keywords),
  /keyword/i
);
assert.match(
  symbols.validateNewName("xyfoo%", speed, occurrences, keywords),
  /suffix/i
);
assert.match(
  symbols.validateNewName("qzabc", speed, occurrences, keywords),
  /collides/i
);
assert.strictEqual(
  symbols.validateNewName("uvabc", speed, occurrences, keywords),
  undefined
);

console.log("BASIC 65 symbol tests passed");
