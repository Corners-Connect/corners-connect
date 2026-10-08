#!/bin/bash
# Double-click to open the existing workspace at Corners City.
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is missing. Install a supported Python from https://www.python.org/downloads/"
  echo "Then run this file again. Nothing has been installed automatically."
  read -r -p "Press Return to close. "
  exit 1
fi
python3 start.py
