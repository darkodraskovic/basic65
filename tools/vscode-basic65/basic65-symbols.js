"use strict";

function baseAndSuffix(name) {
  const match = /^([A-Za-z][A-Za-z0-9]*)([$%&]?)$/.exec(name);
  if (!match) {
    return undefined;
  }
  return {
    base: match[1].toUpperCase(),
    suffix: match[2]
  };
}

function canonicalName(name, isArray) {
  const parts = baseAndSuffix(name);
  if (!parts) {
    return undefined;
  }
  return `${parts.base.slice(0, 2)}:${parts.suffix}:${isArray ? "array" : "scalar"}`;
}

function buildKeywordSet(referenceKeys) {
  const keywords = new Set();
  for (const key of referenceKeys) {
    for (const word of key.toUpperCase().split(/\s+/)) {
      if (/^[A-Z][A-Z0-9]*[$]?$/.test(word)) {
        keywords.add(word.replace(/#$/, ""));
      }
    }
  }
  return keywords;
}

function findClosingParen(text, open) {
  let depth = 0;
  let quoted = false;
  for (let index = open; index < text.length; index += 1) {
    const char = text[index];
    if (char === "\"") {
      quoted = !quoted;
    } else if (!quoted && char === "(") {
      depth += 1;
    } else if (!quoted && char === ")") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }
  return open;
}

function nextNonSpace(text, index) {
  while (index < text.length && /\s/.test(text[index])) {
    index += 1;
  }
  return index;
}

function markDefinitions(text, occurrences) {
  for (const occurrence of occurrences) {
    const prefix = text
      .slice(occurrence.statementStart, occurrence.start)
      .trim()
      .toUpperCase()
      .replace(/^\d+\s*/, "");

    if (occurrence.isArray && /^DIM(?:\s|$)/.test(prefix)) {
      occurrence.isDefinition = true;
      continue;
    }

    if (!(prefix === "" || prefix === "LET" || prefix === "FOR")) {
      continue;
    }

    let after = nextNonSpace(text, occurrence.end);
    if (occurrence.isArray && text[after] === "(") {
      after = nextNonSpace(text, findClosingParen(text, after) + 1);
    }
    occurrence.isDefinition = text[after] === "=";
  }
}

function analyze(text, keywords) {
  const occurrences = [];
  let line = 0;
  let lineStart = 0;
  let statementStart = 0;
  let previousToken = "";
  let index = 0;

  while (index < text.length) {
    const char = text[index];

    if (char === "\n") {
      line += 1;
      index += 1;
      lineStart = index;
      statementStart = index;
      previousToken = "";
      continue;
    }

    if (char === ":") {
      index += 1;
      statementStart = index;
      previousToken = "";
      continue;
    }

    if (char === "\"") {
      index += 1;
      while (index < text.length && text[index] !== "\"" && text[index] !== "\n") {
        index += 1;
      }
      if (text[index] === "\"") {
        index += 1;
      }
      continue;
    }

    if (char === "$" && /[0-9A-Fa-f]/.test(text[index + 1] || "")) {
      index += 2;
      while (index < text.length && /[0-9A-Fa-f]/.test(text[index])) {
        index += 1;
      }
      previousToken = "NUMBER";
      continue;
    }

    if (!/[A-Za-z]/.test(char)) {
      index += 1;
      continue;
    }

    const start = index;
    index += 1;
    while (index < text.length && /[A-Za-z0-9]/.test(text[index])) {
      index += 1;
    }
    if (index < text.length && /[$%&]/.test(text[index])) {
      index += 1;
    }

    const raw = text.slice(start, index);
    const upper = raw.toUpperCase();

    if (upper === "REM") {
      while (index < text.length && text[index] !== "\n") {
        index += 1;
      }
      continue;
    }

    if (upper === "DATA") {
      let quoted = false;
      while (index < text.length && text[index] !== "\n") {
        if (text[index] === "\"") {
          quoted = !quoted;
        } else if (!quoted && text[index] === ":") {
          index += 1;
          statementStart = index;
          previousToken = "";
          break;
        }
        index += 1;
      }
      continue;
    }

    if (upper === "T" && text.slice(index, index + 2) === "@&") {
      index += 2;
      previousToken = "T@&";
      continue;
    }
    if (upper === "C" && text.slice(index, index + 2) === "@&") {
      index += 2;
      previousToken = "C@&";
      continue;
    }

    if (previousToken === "FONT" && /^[A-F]$/.test(upper)) {
      previousToken = upper;
      continue;
    }

    if (keywords.has(upper)) {
      previousToken = upper;
      continue;
    }

    const after = nextNonSpace(text, index);
    const isArray = text[after] === "(";
    occurrences.push({
      raw,
      start,
      end: index,
      line,
      column: start - lineStart,
      statementStart,
      isArray,
      canonical: canonicalName(raw, isArray),
      isDefinition: false
    });
    previousToken = upper;
  }

  markDefinitions(text, occurrences);
  return occurrences;
}

function occurrenceAt(occurrences, offset) {
  return occurrences.find(
    (occurrence) => offset >= occurrence.start && offset <= occurrence.end
  );
}

function occurrencesFor(occurrences, occurrence) {
  return occurrences.filter(
    (candidate) => candidate.canonical === occurrence.canonical
  );
}

function definitionFor(occurrences, occurrence) {
  const references = occurrencesFor(occurrences, occurrence);
  return (
    references.find((candidate) => candidate.isDefinition) ||
    references[0]
  );
}

function validateNewName(newName, occurrence, occurrences, keywords) {
  const parts = baseAndSuffix(newName);
  if (!parts) {
    return "A BASIC 65 variable must start with a letter and contain only letters, numbers, and an optional type suffix.";
  }

  const oldParts = baseAndSuffix(occurrence.raw);
  if (parts.suffix !== oldParts.suffix) {
    return `Keep the variable type suffix '${oldParts.suffix || "(none)"}'.`;
  }

  for (const keyword of keywords) {
    const plainKeyword = keyword.replace(/[$]$/, "");
    if (plainKeyword.length > 1 && parts.base.includes(plainKeyword)) {
      return `'${newName}' contains the BASIC 65 keyword '${keyword}'.`;
    }
  }

  const newCanonical = canonicalName(newName, occurrence.isArray);
  if (newCanonical !== occurrence.canonical) {
    const collision = occurrences.find(
      (candidate) => candidate.canonical === newCanonical
    );
    if (collision) {
      return `'${newName}' collides with '${collision.raw}' because BASIC 65 recognizes only the first two letters.`;
    }
  }

  return undefined;
}

module.exports = {
  analyze,
  buildKeywordSet,
  canonicalName,
  definitionFor,
  occurrenceAt,
  occurrencesFor,
  validateNewName
};
