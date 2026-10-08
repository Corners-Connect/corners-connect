#!/usr/bin/env python3
"""import-activity.py — let the repository report what it already knows.

The repository knows who changed what and when. Typing that into the board a
second time is the reason nobody keeps a work log for more than three weeks.
So this reads `git log` and writes one activity entry per commit.

    python3 import-activity.py                 everything since the term began
    python3 import-activity.py --since 2026-10-01
    python3 import-activity.py --dry-run       show what it would add, write nothing

It never adds the same commit twice: every imported entry carries the short sha
in `ref`, and anything already there is skipped. Entries you typed yourself are
never touched.

WHO IS WHO. It matches the commit author against `git` in people.js, and then
against `name`. Add the line yourself:

    { "id": "p05", "name": "Maya", "git": "maya-r", ... }

⚠ A git handle, never an email. check.py refuses this file if an email address
  turns up in it, and that rule is the university's, not a preference.

WHAT THIS CANNOT SEE, and somebody still has to type:
  · every piece of work that did not end in a commit — the conversation, the
    shoot, the meeting, the thinking
  · how long anything took. Hours stay optional and stay human.
That division is the right one: the machine records what it can see, and you
record what it cannot.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
REPO = HERE.parent
TERM_START = "2026-09-08"

sys.path.insert(0, str(HERE))
from check import js_to_json  # the one parser, so both read the files the same way


def load(name):
    raw = (DATA / f"{name}.js").read_text(encoding="utf-8")
    body = js_to_json(raw)
    m = re.search(r'"?window"?\.DIP\.' + name + r'\s*=\s*', body)
    chunk = body[m.end():].rstrip().rstrip(";")
    return json.loads(chunk), raw


def pretty(v, ind=""):
    """Same shape the board writes, so a file edited in both places stays calm."""
    flat = json.dumps(v, ensure_ascii=False)
    if not isinstance(v, (dict, list)) or len(flat) <= 96:
        return flat
    inner = ind + "  "
    if isinstance(v, list):
        return "[]" if not v else "[\n" + ",\n".join(inner + pretty(x, inner) for x in v) + "\n" + ind + "]"
    return "{}" if not v else "{\n" + ",\n".join(
        inner + json.dumps(k, ensure_ascii=False) + ": " + pretty(x, inner)
        for k, x in v.items()) + "\n" + ind + "}"


def git_log(since):
    sep = "\x1f"
    out = subprocess.run(
        ["git", "-C", str(REPO), "log", f"--since={since}", "--no-merges",
         f"--pretty=format:%h{sep}%an{sep}%ad{sep}%s", "--date=short"],
        capture_output=True, text=True)
    if out.returncode != 0:
        print("git said: " + out.stderr.strip())
        print("Is this folder inside the company's repository yet? "
              "If the repo does not exist, that is the first thing to build.")
        sys.exit(1)
    rows = []
    for line in out.stdout.splitlines():
        parts = line.split(sep)
        if len(parts) == 4:
            rows.append(dict(zip(("sha", "author", "date", "subject"), parts)))
    return rows


def resolve(author, people):
    a = author.strip().lower()
    for p in people:
        if str(p.get("git", "")).strip().lower() == a:
            return p["id"]
    for p in people:
        if str(p.get("name", "")).strip().lower() == a:
            return p["id"]
    # "Maya Rodriguez" should still find "Maya"
    for p in people:
        n = str(p.get("name", "")).strip().lower()
        if n and n != "—" and a.split(" ")[0] == n:
            return p["id"]
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", default=TERM_START)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    people, _ = load("people")
    activity, raw = load("activity")

    have = {e.get("ref") for e in activity if e.get("ref")}
    commits = git_log(args.since)
    if not commits:
        print(f"No commits since {args.since}.")
        return

    added, unknown = [], {}
    for c in commits:
        if c["sha"] in have:
            continue
        pid = resolve(c["author"], people)
        if not pid:
            unknown[c["author"]] = unknown.get(c["author"], 0) + 1
            continue
        added.append({"date": c["date"], "person": pid, "what": c["subject"],
                      "action": None, "hours": 0, "source": "git", "ref": c["sha"]})

    for who, n in sorted(unknown.items(), key=lambda x: -x[1]):
        print(f"  skipped {n:3d} commit(s) by {who!r} — nobody in people.js has that "
              f"name or git handle. Add \"git\": \"{who}\" to their row.")

    if not added:
        print("Nothing new to import.")
        return

    print(f"\n{len(added)} new entr{'y' if len(added) == 1 else 'ies'}:")
    for e in added[:12]:
        name = next((p["name"] for p in people if p["id"] == e["person"]), e["person"])
        print(f"  {e['date']}  {name:<12} {e['what'][:64]}")
    if len(added) > 12:
        print(f"  … and {len(added) - 12} more")

    if args.dry_run:
        print("\n--dry-run: nothing written.")
        return

    activity.extend(added)
    activity.sort(key=lambda e: (e["date"], e["person"]))
    cut = raw.index("window.DIP.activity")
    (DATA / "activity.js").write_text(
        raw[:cut] + "window.DIP.activity = " + pretty(activity) + ";\n", encoding="utf-8")
    print(f"\nWritten to data/activity.js. Run check.py, then commit it.")
    print("The hours are still yours to add — the repository cannot see how long anything took.")


if __name__ == "__main__":
    main()
