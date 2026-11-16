"""Run the 20 labelled fictional cases through enrich() and score them.

    python evaluate.py                    # stub model, offline
    python evaluate.py --model claude     # real model (needs ANTHROPIC_API_KEY)
    python evaluate.py --show mp2-demo-001,mp2-eval-013   # side-by-side detail

Writes evidence/eval-<model>-<prompt_version>.csv and a .md summary.

Scoring
- correct:  status matches the label, and for `ready` cases segment, persona,
            university and intent all match.
- error:    anything else. Kinds: wrong_label, missed_review (should have gone
            to a person but didn't), unneeded_review, wrong_status.
- referral: every case the code sent to `needs_review` (right or wrong).
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from collections import Counter
from pathlib import Path

import enrich as E

HERE = Path(__file__).parent
FIELDS = ["segment", "persona", "university", "intent"]


def lead_from_row(row: dict) -> dict:
    lead = {
        "lead_id": row["case_id"],
        "kind": row["kind"],
        "submitted_at": "2026-11-17T14:00:00Z",
        "source": "eval-fixture",
        "contact_email": "arrivals@example.invalid",
    }
    if row["case_id"] == "mp2-demo-001":
        lead.update(json.loads((HERE / "fixtures" / "demo-lead.json").read_text(encoding="utf-8")))
    for k in ("language", "arrival_window", "organization", "message"):
        if row[k]:
            lead[k] = row[k]
    if row["needs"]:
        lead["needs"] = row["needs"].split(";")
    return lead


def run(model_name: str, show: set[str]) -> int:
    rows = list(csv.DictReader(open(HERE / "fixtures" / "cases.csv", encoding="utf-8")))
    faults = {r["case_id"]: r["inject"] for r in rows if r["inject"]}
    model = E.default_model(model_name, faults)
    logs: list[str] = []

    results = []
    for row in rows:
        lead = lead_from_row(row)
        expected = {f: (row[f"expected_{f}"] or None) for f in FIELDS}
        exp_status = row["expected_status"]
        enr, raw = {}, None
        try:
            out = E.enrich(lead, model=model, log=logs.append)
            enr, raw = out["enrichment"], out["_model_raw"]
            status = enr["status"]
        except E.RetryableEnrichError:
            status = "retry_error"

        mismatch = []
        if status != exp_status:
            if exp_status == "needs_review" and status == "ready":
                mismatch.append("missed_review")
            elif exp_status == "ready" and status == "needs_review":
                mismatch.append("unneeded_review:" + ";".join(enr.get("review_reasons", [])))
            else:
                mismatch.append(f"wrong_status:{status}")
        elif status == "ready":
            for f in FIELDS:
                if enr.get(f) != expected[f]:
                    mismatch.append(f"wrong_label:{f} expected={expected[f]} got={enr.get(f)}")

        results.append({
            "case_id": row["case_id"],
            "expected_status": exp_status,
            "actual_status": status,
            **{f"expected_{f}": expected[f] or "" for f in FIELDS},
            **{f"actual_{f}": enr.get(f) or "" for f in FIELDS},
            "review_reasons": ";".join(enr.get("review_reasons", [])),
            "result": "correct" if not mismatch else "error",
            "mismatch_reason": " | ".join(mismatch),
            "prompt_version": E.PROMPT_VERSION,
            "model": getattr(model, "name", model_name),
            "label_note": row["label_note"],
        })

        if row["case_id"] in show:
            print(f"\n=== {row['case_id']}  ({row['label_note']})")
            print("INPUT  (sent to model):\n" + E.build_model_input(lead))
            print("MODEL RAW:\n  " + str(raw))
            print("VALIDATED:\n  " + json.dumps({k: enr.get(k) for k in FIELDS + ['arrival_wave', 'language', 'confidence']}, ensure_ascii=False))
            print(f"DECISION: {status}  reasons={enr.get('review_reasons')}")

    # ---- write evidence
    ev = HERE / "evidence"
    ev.mkdir(exist_ok=True)
    stem = f"eval-{model_name}-{E.PROMPT_VERSION}"
    with open(ev / f"{stem}.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(results[0]))
        w.writeheader()
        w.writerows(results)

    n = len(results)
    correct = sum(r["result"] == "correct" for r in results)
    errors = [r for r in results if r["result"] == "error"]
    referrals = [r for r in results if r["actual_status"] == "needs_review"]
    retries = [r for r in results if r["actual_status"] == "retry_error"]
    needs = Counter(r["actual_intent"] for r in results if r["actual_status"] == "ready")

    lines = [
        f"# Enrich evaluation · {getattr(model, 'name', model_name)} · {E.PROMPT_VERSION}",
        "",
        "Synthetic data only: 20 fictional cases in fixtures/cases.csv. Labels were drafted with",
        "Claude Code and must be reviewed and owned by Jenna & Rylan before the demo.",
        "",
        f"- Cases: **{n}**",
        f"- Correct: **{correct}/{n}**",
        f"- Errors: **{len(errors)}**",
        f"- Referrals to human review: **{len(referrals)}** "
        f"({sum(r['expected_status'] == 'needs_review' for r in referrals)} expected)",
        f"- Infrastructure failures held for replay (not sent to Store): **{len(retries)}**",
        "",
        "## Errors",
        "",
        *([f"- `{r['case_id']}`: {r['mismatch_reason']}" for r in errors] or ["- none"]),
        "",
        "## Referrals",
        "",
        *([f"- `{r['case_id']}`: {r['review_reasons']}" for r in referrals] or ["- none"]),
        "",
        "## Main need among ready leads",
        "",
        *[f"- {k}: {v}" for k, v in needs.most_common()],
        "",
        "## Retry log",
        "",
        *[f"- {l}" for l in logs],
    ]
    (ev / f"{stem}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"\n{n} cases | correct {correct} | errors {len(errors)} | referrals {len(referrals)} | "
          f"held for retry {len(retries)}")
    for r in errors:
        print(f"  ERROR {r['case_id']}: {r['mismatch_reason']}")
    print(f"Evidence: {ev / (stem + '.csv')}\n          {ev / (stem + '.md')}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser()
    p.add_argument("--model", default="stub", choices=["stub", "claude"])
    p.add_argument("--show", default="", help="comma-separated case ids to print in full")
    a = p.parse_args()
    sys.exit(run(a.model, set(filter(None, a.show.split(",")))))
