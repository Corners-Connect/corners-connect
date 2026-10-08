#!/usr/bin/env python3
"""check.py — the board's own checker.

Run it before every session:   python3 check.py

It reads data/ the way the browser does and refuses anything that would make a
screen lie. It knows nothing about whether your company is doing well; it only
knows whether the board can be believed.

  python3 check.py              check the data, exit 1 if anything fails
  python3 check.py --stats      also print the numbers the board will show
  python3 check.py --selftest   break every rule on purpose and prove each one
                                catches it. A checker nobody has broken is a
                                checker nobody should trust.

WHAT THIS CANNOT SEE, and somebody still has to:
  · JavaScript escapes that JSON does not have (\\x41, \\0, a line continuation).
    Nothing the board writes produces them, but a hand-edit could
  · whether a name in people.js is a real person in the room
  · whether an evidence link actually opens
  · whether an hour logged in ledger.js was really worked
  · anything at all about how the board LOOKS — that is eyes on a screen
"""
import json
import re
import sys
import datetime as dt
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
FILES = ["company", "people", "actions", "activity"]

fails, warns = [], []


def fail(where, msg):
    fails.append(f"{where}: {msg}")


def warn(where, msg):
    warns.append(f"{where}: {msg}")


# ── reading the data files ───────────────────────────────────────────────────
# They are .js and not .json on purpose: a .js file opens by double-clicking
# index.html, and a .json file needs a web server. That buys one small parser.

def js_to_json(src: str) -> str:
    """Strip comments and quote bare keys, without touching string contents."""
    out, i, n = [], 0, len(src)
    while i < n:
        ch = src[i]
        if ch in '"\'':
            # Copy the string through verbatim, escapes and all. Re-escaping it
            # would turn an already-escaped \" into \\" and break the parse —
            # which is exactly what this used to do, and it took a round-trip
            # test with a quote in it to find.
            quote, j, buf = ch, i + 1, []
            while j < n:
                c = src[j]
                if c == "\\":
                    buf.append(src[j:j + 2])
                    j += 2
                    continue
                if c == quote:
                    break
                buf.append(c)
                j += 1
            body = "".join(buf)
            if quote == "'":
                body = body.replace("\\'", "'").replace('"', '\\"')
            out.append('"' + body + '"')
            i = j + 1
        elif src.startswith("/*", i):
            i = src.find("*/", i + 2)
            i = n if i < 0 else i + 2
        elif src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j
        else:
            out.append(ch)
            i += 1
    text = "".join(out)
    text = re.sub(r'([\{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:', r'\1"\2":', text)
    return text


def load(name):
    path = DATA / f"{name}.js"
    if not path.exists():
        fail(f"{name}.js", "file is missing")
        return None
    raw = path.read_text(encoding="utf-8")
    body = js_to_json(raw)
    m = re.search(r'"?window"?\.DIP\.' + name + r'\s*=\s*', body)
    if not m:
        fail(f"{name}.js", f"cannot find the line 'window.DIP.{name} = ...'")
        return None
    chunk = body[m.end():].rstrip()
    chunk = chunk[:-1] if chunk.endswith(";") else chunk
    try:
        return json.loads(chunk)
    except json.JSONDecodeError as e:
        fail(f"{name}.js", f"is not valid data — {e.msg} at line {e.lineno}. "
                           "Usually a missing comma, or a comma after the last item.")
        return None


# ── the rules ────────────────────────────────────────────────────────────────

ISO = re.compile(r"^\d{4}-\d{2}-\d{2}$")
STATES = {"planned", "doing", "check", "done", "dropped"}
OPEN = {"planned", "doing", "check"}
OWING = {"planned", "doing"}


def date_of(s):
    try:
        return dt.date.fromisoformat(s)
    except Exception:
        return None


def check(co, people, actions, activity):
    if not all([co, people is not None, actions is not None, activity is not None]):
        return

    teams = {t["id"] for t in co.get("teams", [])}
    comps = {c["id"] for c in co.get("competences", [])}
    sessions = {c["date"] for c in co.get("calendar", []) if c.get("n") is not None}
    pids = set()

    # Rule 1 — no personal data beyond a first name. This is a university rule,
    # not a preference: emails, phone numbers and student ids live in Teams.
    for name in FILES:
        text = (DATA / f"{name}.js").read_text(encoding="utf-8")
        for line_no, line in enumerate(text.splitlines(), 1):
            if line.lstrip().startswith(("*", "/*", "//")):
                continue
            if re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", line):
                fail(f"{name}.js:{line_no}", "looks like an email address. Those live in Teams, never here.")
            if re.search(r"(?<!\d)(?:\+\d[\d ]{8,}|\d{9,})(?!\d)", line):
                fail(f"{name}.js:{line_no}", "looks like a phone number or an id number. Those live in Teams.")

    # Rule 2 — people
    for p in people:
        w = f"people.js/{p.get('id')}"
        if p.get("id") in pids:
            fail(w, "duplicate id")
        pids.add(p.get("id"))
        if p.get("team") not in teams:
            fail(w, f"team {p.get('team')!r} is not one of {sorted(teams)}")
        if not isinstance(p.get("capacity"), (int, float)) or p["capacity"] <= 0:
            fail(w, "capacity must be a number above zero — it is what the whole Hours screen rests on")
        if p.get("hat") not in (None, "liaison", "record"):
            fail(w, f"hat {p.get('hat')!r} is not liaison, record or null")
        for a in p.get("away", []):
            if not ISO.match(str(a.get("week", ""))):
                fail(w, f"away week {a.get('week')!r} is not a YYYY-MM-DD date")
            elif date_of(a["week"]).weekday() != 0:
                warn(w, f"away week {a['week']} is not a Monday — weeks are named by their Monday")
        for m in p.get("mastery", []):
            if m.get("c") not in comps:
                fail(w, f"mastery claim for unknown competence {m.get('c')!r}")
            if not isinstance(m.get("level"), int) or not 0 <= m["level"] <= 3:
                fail(w, f"mastery level {m.get('level')!r} must be 0, 1, 2 or 3")
            if not ISO.match(str(m.get("on", ""))):
                fail(w, f"mastery claim for {m.get('c')} has no date")
            if int(m.get("level", 0)) >= 2 and not str(m.get("proof", "")).strip():
                fail(w, f"level {m['level']} on {m.get('c')} with no proof. Above level 1, a claim needs something behind it.")

    for t in co.get("teams", []):
        n = sum(1 for p in people if p.get("team") == t["id"])
        if n != t.get("seats"):
            warn("company.js/teams", f"{t['name']} has {n} people and {t.get('seats')} agreed seats")

    liaisons = [p for p in people if p.get("hat") == "liaison"]
    if len(liaisons) > 1:
        fail("people.js", "more than one liaison. It is one hat — two is the expensive rung nobody chose.")

    # Rule 3 — actions, and the loop they walk
    aids = set()
    for a in actions:
        w = f"actions.js/{a.get('id')}"
        if a.get("id") in aids:
            fail(w, "duplicate id")
        aids.add(a.get("id"))
        if not str(a.get("what", "")).strip():
            fail(w, "has no description")
        if a.get("owner") not in pids:
            fail(w, f"owner {a.get('owner')!r} is not in people.js. Every action has one name behind it.")
        if a.get("team") not in teams:
            fail(w, f"team {a.get('team')!r} is not one of {sorted(teams)}")
        if a.get("state") not in STATES:
            fail(w, f"state {a.get('state')!r} is not one of {sorted(STATES)}")
        for f_ in ("due", "opened", "touched"):
            if a.get(f_) and not ISO.match(str(a[f_])):
                fail(w, f"{f_} {a[f_]!r} is not a YYYY-MM-DD date")
        if not a.get("due"):
            fail(w, "has no due date. A commitment without a date is a wish.")
        elif a["due"] not in sessions and a.get("state") != "dropped":
            warn(w, f"due {a['due']} is not a session date — this company's clock is its sessions")
        if a.get("opened") and a.get("touched") and a["touched"] < a["opened"]:
            fail(w, "touched is before opened")
        if a.get("state") in OWING:
            if not isinstance(a.get("estimate"), (int, float)) or a["estimate"] <= 0:
                fail(w, "open action with no estimate. Guess — a wrong estimate written down beats a right one you did not.")
        if a.get("state") == "done" and not str(a.get("evidence", "")).strip():
            fail(w, "is done with no evidence. Done means somebody else can check it.")
        if a.get("shipped") is True and not str(a.get("evidence", "")).strip():
            fail(w, "is shipped with no evidence. Shipped means somebody outside this room can see it.")
        if a.get("shipped") is True and a.get("state") != "done":
            fail(w, "is shipped but not done")
        if a.get("state") == "dropped" and not (str(a.get("note", "")).strip() or str(a.get("result", "")).strip()):
            warn(w, "was dropped with no reason written. In three weeks nobody will remember it the same way.")

        # The loop only teaches anything if the check actually happens.
        expect = str(a.get("expect", "")).strip()
        if expect and "because" not in expect.lower():
            warn(w, "the expectation has no 'because'. Without it you wrote a plan, not a prediction.")
        if expect and a.get("state") in ("done", "dropped") and not str(a.get("result", "")).strip():
            fail(w, "was closed with an expectation written and no result next to it. "
                    "That comparison is the only reason the expectation was worth writing.")
        if str(a.get("result", "")).strip() and a.get("state") in ("planned", "doing"):
            warn(w, "has a result but has not reached check yet")

    # Rule 4 — activity: what people actually did
    for i, e in enumerate(activity, 1):
        w = f"activity.js #{i}"
        if e.get("person") not in pids:
            fail(w, f"person {e.get('person')!r} is not in people.js")
        if not str(e.get("what", "")).strip():
            fail(w, "has no description. 'Worked on it' is not an entry, and an empty one is not either.")
        if e.get("action") not in (None, "") and e.get("action") not in aids:
            fail(w, f"action {e.get('action')!r} is not in actions.js")
        if not ISO.match(str(e.get("date", ""))):
            fail(w, f"date {e.get('date')!r} is not a YYYY-MM-DD date")
        elif date_of(e["date"]) > dt.date.today():
            fail(w, f"reports work on {e['date']}, which has not happened yet")
        hrs = e.get("hours", 0)
        if hrs in (None, ""):
            hrs = 0
        if not isinstance(hrs, (int, float)) or hrs < 0:
            fail(w, "hours must be a number, zero or above. Leaving them out is allowed.")
        elif hrs > 12:
            warn(w, f"{hrs} hours in one entry — split it, or it is a week remembered as a day")
        if e.get("source") not in (None, "typed", "git"):
            fail(w, f"source {e.get('source')!r} is not typed or git")

    # Rule 6 — the calendar is USAC's and must stay USAC's
    for c in co.get("calendar", []):
        d = date_of(str(c.get("date", "")))
        if d is None:
            fail("company.js/calendar", f"{c.get('date')!r} is not a date")
        elif d.weekday() not in (1, 3):
            fail("company.js/calendar", f"{c['date']} is a {d.strftime('%A')} — this class meets Tuesdays and Thursdays")
    for m in co.get("milestones", []):
        if m.get("date") not in sessions:
            fail("company.js/milestones", f"{m.get('name')} falls on {m.get('date')}, which is not a session")


# ── the palette, measured rather than assumed ────────────────────────────────

def contrast(a, b):
    def lum(h):
        h = h.lstrip("#")
        ch = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
        ch = [(u / 12.92 if u <= 0.04045 else ((u + 0.055) / 1.055) ** 2.4) for u in ch]
        return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def check_palette():
    """The palette is measured here, not trusted. Change a hex in theme.css and
    this fails before anybody has to squint at a screen to find out."""
    css = (HERE / "theme.css").read_text(encoding="utf-8")

    def var(name):
        m = re.search(r"--" + name + r":\s*(#[0-9A-Fa-f]{6})", css)
        if not m:
            fail("theme.css", f"--{name} is missing from the palette")
            return None
        return m.group(1)

    paper = var("paper-2")
    choc = var("choc")
    if not paper or not choc:
        return

    # text that sits on the page
    for name, floor in [("ink", 7), ("ink-2", 7), ("ink-3", 4.5), ("ink-4", 4.5),
                        ("choc", 4.5), ("ok", 4.5), ("warn", 4.5), ("bad", 4.5), ("info", 4.5)]:
        hexv = var(name)
        if not hexv:
            continue
        r = contrast(hexv, paper)
        if r < floor:
            fail("theme.css", f"--{name} {hexv} reads at {r:.2f} on the page and needs {floor}. "
                              "Nobody should have to squint at a board.")

    # white and the mark on the rail
    for name, hexv in [("white", "#FFFFFF"), ("blue", var("blue"))]:
        if not hexv:
            continue
        r = contrast(hexv, choc)
        if r < 4.5:
            fail("theme.css", f"{name} on the rail reads at {r:.2f}, under 4.5")

    # each state tint has to carry its own text
    for name in ("ok", "warn", "bad", "info"):
        fg, bg = var(name), var(name + "-bg")
        if not fg or not bg:
            continue
        r = contrast(fg, bg)
        if r < 4.5:
            fail("theme.css", f"--{name} on --{name}-bg reads at {r:.2f}, under 4.5")

    # the eleven person tones carry text on this page, so they are measured too
    for i in range(1, 12):
        hexv = var(f"p{i}")
        if not hexv:
            continue
        r = contrast(hexv, paper)
        if r < 4.5:
            fail("theme.css", f"--p{i} {hexv} reads at {r:.2f} on the page, under 4.5")

    # And the rule that makes a panel honest: the brand colour is not a datum.
    # Chocolate and baby blue are identity and primary action. If one of them
    # turns up as a state colour, good and bad start looking like the logo.
    blue = var("blue")
    for name in ("ok", "warn", "bad", "info"):
        if var(name) in (choc, blue):
            fail("theme.css", f"--{name} is a brand colour. A datum in the brand colour does not exist "
                              "(ADR-020): identity and alarm cannot be the same ink.")


# ── selftest: break each rule and prove it is caught ─────────────────────────

def selftest():
    global fails, warns
    good = {n: load(n) for n in FILES}
    if fails:
        print("Cannot self-test: the real data does not pass.\n")
        return 1

    import copy
    cases = [
        ("an action owned by nobody",
         lambda d: d["actions"][0].update(owner="ghost")),
        ("an action done with no evidence",
         lambda d: d["actions"][0].update(state="done", evidence="")),
        ("an action shipped with no evidence",
         lambda d: d["actions"][0].update(state="done", evidence="", shipped=True)),
        ("an open action with no estimate",
         lambda d: d["actions"][0].update(state="doing", estimate=0)),
        ("an action with no due date",
         lambda d: d["actions"][0].update(due=None)),
        ("a person with no capacity",
         lambda d: d["people"][0].update(capacity=0)),
        ("two liaisons",
         lambda d: d["people"][1].update(hat="liaison")),
        ("a level 3 claim with no proof",
         lambda d: d["people"][0]["mastery"].append({"c": "C-01", "level": 3, "on": "2026-09-15", "proof": ""})),
        ("a mastery claim on a competence that does not exist",
         lambda d: d["people"][0]["mastery"].append({"c": "C-99", "level": 2, "on": "2026-09-15", "proof": "x"})),
        ("an action closed with an expectation and no result",
         lambda d: d["actions"][2].update(state="done", evidence="x", result="")),
        ("an invented step of the loop",
         lambda d: d["actions"][0].update(state="reviewing")),
        ("activity reported by nobody",
         lambda d: d["activity"][0].update(person="ghost")),
        ("activity with no description",
         lambda d: d["activity"][0].update(what="")),
        ("activity against an action that does not exist",
         lambda d: d["activity"][0].update(action="A-999")),
        ("work reported in the future",
         lambda d: d["activity"][0].update(date="2099-01-01")),
        ("a milestone that is not a session",
         lambda d: d["company"]["milestones"][0].update(date="2026-09-23")),
        ("a class on a Wednesday",
         lambda d: d["company"]["calendar"][0].update(date="2026-09-09")),
    ]

    ok = True
    print("Reading back what the board writes:\n")
    # Not a rule — a parser test. These characters are what the board writes
    # when somebody types a quote into a form, and they used to break the read.
    fails, warns = [], []
    probe = DATA / "probe.js"
    probe.write_text(
        'window.DIP.probe = [ { "what": "a \\"quoted\\" thing, an em dash \u2014 '
        'and a backslash \\\\", "n": 1 } ];\n', encoding="utf-8")
    try:
        parsed = load("probe")
        ok_parse = isinstance(parsed, list) and parsed[0]["n"] == 1 \
            and '"quoted"' in parsed[0]["what"] and "\\" in parsed[0]["what"]
        print(f"  {'reads  ' if ok_parse else 'CANNOT '} a row containing quotes and backslashes")
        ok = ok and ok_parse
    finally:
        probe.unlink(missing_ok=True)

    print()
    print("Breaking each rule on purpose:\n")
    for label, mutate in cases:
        fails, warns = [], []
        d = copy.deepcopy(good)
        mutate(d)
        check(d["company"], d["people"], d["actions"], d["activity"])
        caught = bool(fails)
        print(f"  {'caught ' if caught else 'MISSED '} {label}")
        if not caught:
            ok = False

    # And the one that matters most: a real email address anywhere in the data.
    fails, warns = [], []
    probe = DATA / "probe.js"
    probe.write_text('window.DIP.probe = [ { note: "someone@example.com" } ];\n', encoding="utf-8")
    try:
        FILES.append("probe")
        check(good["company"], good["people"], good["actions"], good["activity"])
        caught = any("email" in f for f in fails)
        print(f"  {'caught ' if caught else 'MISSED '} an email address in the data")
        ok = ok and caught
    finally:
        FILES.remove("probe")
        probe.unlink(missing_ok=True)

    print("\nEvery rule caught its own breakage, and the writer round-trips." if ok else
          "\nSomething did not fire. Fix the checker before trusting it.")
    return 0 if ok else 1


# ── stats, so the numbers can be read without a browser ──────────────────────

def stats(co, people, actions, activity):
    today = dt.date.fromisoformat(co["today"]) if co.get("today") else dt.date.today()
    spent = {}
    for e in activity:
        if e.get("action"):
            spent[e["action"]] = spent.get(e["action"], 0) + (e.get("hours") or 0)
    sessions = sorted(c["date"] for c in co["calendar"] if c.get("n") is not None)
    nxt = next((m for m in co["milestones"] if dt.date.fromisoformat(m["date"]) >= today), None)
    print(f"\n  today                 {today}")
    if nxt:
        left = sum(1 for s in sessions if today < dt.date.fromisoformat(s) <= dt.date.fromisoformat(nxt["date"]))
        weeks = {dt.date.fromisoformat(s) - dt.timedelta(days=dt.date.fromisoformat(s).weekday())
                 for s in sessions if today < dt.date.fromisoformat(s) <= dt.date.fromisoformat(nxt["date"])}
        this_week = today - dt.timedelta(days=today.weekday())
        avail = 0
        for p in people:
            for w in weeks:
                away = next((a for a in p.get("away", []) if a["week"] == w.isoformat()), None)
                cap = away["capacity"] if away else p["capacity"]
                avail += cap * ((7 - today.weekday()) / 7 if w == this_week else 1)
        owed = sum(max(0, a.get("estimate", 0) - spent.get(a["id"], 0))
                   for a in actions if a["state"] in OWING
                   and a.get("due") and dt.date.fromisoformat(a["due"]) <= dt.date.fromisoformat(nxt["date"]))
        print(f"  next date             {nxt['name']} — {nxt['date']}, {left} sessions away")
        print(f"  hours available       {avail:g}")
        print(f"  hours promised        {owed:g}")
        print(f"  {'slack' if avail >= owed else 'OVERDRAWN BY':21s} {abs(avail - owed):g}")
    print(f"  people                {len(people)}")
    lanes = {k: sum(1 for a in actions if a["state"] == k) for k in
             ("planned", "doing", "check", "done", "dropped")}
    print(f"  the loop              {lanes['planned']} planned · {lanes['doing']} doing · "
          f"{lanes['check']} in check · {lanes['done']} done · {lanes['dropped']} dropped")
    print(f"  activity              {len(activity)} entries, "
          f"{sum(1 for e in activity if e.get('source') == 'git')} from git")
    print(f"  hours attached        {sum(e.get('hours') or 0 for e in activity):g}")
    print()


def main():
    if "--selftest" in sys.argv:
        sys.exit(selftest())
    data = {n: load(n) for n in FILES}
    check_palette()
    check(data["company"], data["people"], data["actions"], data["activity"])

    for w in warns:
        print(f"  warn   {w}")
    for f in fails:
        print(f"  FAIL   {f}")

    if "--stats" in sys.argv and not fails:
        stats(data["company"], data["people"], data["actions"], data["activity"])

    if fails:
        print(f"\n{len(fails)} problem(s). The board would lie until these are fixed.")
        sys.exit(1)
    print(f"\nThe board can be believed. {len(warns)} warning(s), which are yours to judge.")


if __name__ == "__main__":
    main()
