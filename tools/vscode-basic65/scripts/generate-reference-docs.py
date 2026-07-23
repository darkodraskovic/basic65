#!/usr/bin/env python3

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path


ENTRY_PATTERN = re.compile(
    r"\f([^\n]+)\nToken:\s+([^\n]+)\n",
    re.MULTILINE,
)


def compact(text):
    text = re.sub(r"([A-Za-z])-\s*\n\s*([a-z])", r"\1\2", text)
    return re.sub(r"\s+", " ", text).strip()


def first_sentence(text):
    text = compact(text)
    match = re.search(r"(?<=[.!?])\s+", text)
    if match:
        return text[: match.start()].strip()
    return text


def extract_entries(text):
    matches = list(ENTRY_PATTERN.finditer(text))
    entries = {}

    for index, match in enumerate(matches):
        name = compact(match.group(1))
        token = compact(match.group(2))
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        section = text[match.end() : end]

        format_match = re.search(
            r"Format:\s+(.*?)(?=\n(?:Usage|Returns|Remarks|Examples?):\s*)",
            section,
            re.DOTALL,
        )
        description_match = re.search(
            r"(?:Usage|Returns):\s+(.*?)(?=\n(?:Remarks|Examples?):\s*)",
            section,
            re.DOTALL,
        )
        remarks_match = re.search(
            r"Remarks:\s+(.*?)(?=\nExamples?:\s*)",
            section,
            re.DOTALL,
        )

        if not format_match or not description_match:
            raise RuntimeError(f"Could not parse reference entry: {name}")

        syntax_lines = [
            compact(line)
            for line in format_match.group(1).splitlines()
            if compact(line)
        ]
        summary = first_sentence(description_match.group(1))
        details = first_sentence(remarks_match.group(1)) if remarks_match else ""

        entry = {
            "syntax": "\n".join(syntax_lines),
            "summary": summary,
            "reference": "MEGA65 BASIC 65 Reference (2026 edition)",
            "token": token,
        }
        if details and details != summary:
            entry["details"] = details

        entries[name.upper()] = entry

    return dict(sorted(entries.items()))


def main():
    parser = argparse.ArgumentParser(
        description="Generate VS Code hover documentation from the BASIC 65 reference."
    )
    parser.add_argument("pdf", type=Path, help="Path to mega65-basic65-reference.pdf")
    parser.add_argument("output", type=Path, help="Destination JSON file")
    args = parser.parse_args()

    with tempfile.TemporaryDirectory() as temp_dir:
        text_path = Path(temp_dir) / "basic65-reference.txt"
        subprocess.run(
            ["pdftotext", "-layout", str(args.pdf), str(text_path)],
            check=True,
        )
        text = text_path.read_text(encoding="utf-8")

    entries = extract_entries(text)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(entries, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"generated {len(entries)} entries in {args.output}")


if __name__ == "__main__":
    main()
