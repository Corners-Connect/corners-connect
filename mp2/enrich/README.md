# MP2 · Step 3 · Enrich and classify (Jenna & Rylan)

Brief: [`../mp2-03-enrich.md`](../mp2-03-enrich.md). All data here is **fictional**.

**What it does:** takes one sign-up from Capture and adds an `enrichment` object
(student or partner type, persona, university, arrival wave, language, main
need). Unclear, contradictory or broken cases are marked `needs_review` for a
person to decide. If the AI service is down, the lead is held for replay. It is
never passed on half-classified.

```
Capture (Federica & Carter) ──POST /enrich──▶ Enrich ──lead + enrichment──▶ Store (Haru & Morgan)
                                              │
                                              ├─ 200 ready         → Store → Notify
                                              ├─ 200 needs_review  → Store review queue (no notification)
                                              ├─ 400 bad_input     → Capture fixes its payload
                                              └─ 503 retryable     → replay the same lead later
```

## Run it

Needs Python 3.10+. The offline stub needs no install and no API key.

```bash
python -m unittest -v test_enrich.py           # 12 unit tests
python evaluate.py                             # 20 labelled cases, offline stub
python evaluate.py --show mp2-demo-001,mp2-eval-013   # clear vs ambiguous, side by side
python enrich.py fixtures/demo-lead.json       # one lead, prints the handoff record
python server.py                               # http://127.0.0.1:8098/enrich
```

To use the real model, set `ANTHROPIC_API_KEY` **on the server only**, then:

```bash
pip install -r requirements.txt
ENRICH_MODEL=claude python evaluate.py --model claude
ENRICH_MODEL=claude python server.py
```

To rehearse a failure live: `ENRICH_FAULT="mp2-demo-001=timeout_once" python server.py`
(the first call fails, the retry succeeds). Use `timeout_always` to show a 503 being held for replay.

## Contract with Store (to confirm with Haru & Morgan)

Every original field is copied through unchanged, including `lead_id`, `kind`
and `source`. We add:

| Field | Values | Who decides |
|---|---|---|
| `status` | `ready` · `needs_review` | code |
| `segment` | `core` · `next` · `later` · `buyer` · `venue` · `null` | model, validated |
| `persona` | `chiara` · `aiyana` · `marta` · `null` | model, validated |
| `university` | `UPV/EHU` · `Deusto` · `other` · `null` | model, validated |
| `arrival_wave` | `autumn` · `spring` · `null` | code, from `arrival_window` |
| `language` | 2-letter code · `null` | code, from `language` |
| `intent` | `study` · `budget` · `routine` · `social` · `partner_cohort` · `partner_listing` · `unclear` | model, validated |
| `confidence` | 0–1 | model |
| `reason` | one sentence, no personal data | model |
| `review_reasons` | list, e.g. `ambiguous`, `low_confidence:0.3`, `kind_conflict:…`, `invalid_model_output:…` | code |
| `prompt_version`, `model`, `enriched_at` | provenance | code |

The segment labels follow the audience rings in `PROJECT.md` §5. We added `venue`
for places that want to be listed. Persona labels are categories (EU Erasmus,
US study abroad, Spanish first-year), not real people.

**From Capture we need:** `lead_id`, `kind` (`student`|`partner`), `submitted_at`,
`source`. Optional: `language`, `arrival_window`, `needs[]`, `checklist[]`,
`organization`, `message`. Capture's checks don't have to match ours exactly.
Enrich returns 400 on a broken lead instead of guessing.

## Decisions we made

1. **Infrastructure failure ≠ human review.** A timeout is retried 3 times (2s,
   4s backoff), then returned as 503 with `retryable: true`. A person reviewing
   a lead the AI never saw would be wasted work.
2. **Code does lookups, the model does judgement.** Arrival wave and language
   are worked out in code, so they can't be hallucinated.
3. **Multiple ticked needs are not ambiguous.** The first ticked need is the
   main one, and all of them stay in `needs`. *Ambiguous* means the ticks and
   the free text disagree (case 013). This keeps the shared demo lead `ready`.
4. **Only relevant fields go to the model.** No email and no `lead_id`. Form
   text is wrapped in `<form_data>`, and the prompt says it is data, not
   instructions (case 015).

## Evidence (offline stub run)

`evidence/eval-stub-enrich-v1.md` and `.csv`: **20/20 correct, 0 errors, 4
referrals (all expected), 1 lead held for retry.**

⚠️ **Be honest about what this proves.** The stub is a keyword stand-in written
alongside these cases, so 20/20 shows the *workflow* (validation, review
route, retry, handoff) works. It does **not** show AI accuracy. Before the 17th,
run `evaluate.py --model claude` and report those numbers. Then make **one change
after seeing the errors** (prompt or labels), bump `PROMPT_VERSION` to
`enrich-v2`, rerun, and show both files.

## Product suggestion (draft, update after the Claude run)

`social` is the most common main need among ready leads (4 of 15). Each persona's
stated fear is not meeting anyone outside their own group. **Suggestion for
Product:** add a "meet people" filter or weekly newcomer meetup to the welcome
checklist, next to study spots and budget places.

## Still to agree

- [ ] Who owns labels and prompt decisions (suggest: Rylan, from the MP1 needs work).
- [ ] Who owns the labelled cases and error review (suggest: Jenna, from the CSV and dashboard work).
- [ ] Jenna & Rylan review every label in `fixtures/cases.csv` and change any you disagree with.
- [ ] Confirm the contract above with Haru & Morgan (Store) and Federica & Carter (Capture).
- [ ] One shared backend: if the class picks one server, `enrich()` can be imported into it as is.

## Credits

Code, cases and this README were drafted with Claude Code (Claude Opus 5.5).
Jenna & Rylan should review them and note their own changes here. The study, budget and routine needs come from
Rylan's Mini Project 1 (`corners-project-v2.html`). The rings and personas come
from `PROJECT.md`.
