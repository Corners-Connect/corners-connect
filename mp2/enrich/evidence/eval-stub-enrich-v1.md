# Enrich evaluation · stub-rules-v1 · enrich-v1

Synthetic data only: 20 fictional cases in fixtures/cases.csv. Labels were drafted with
Claude Code and must be reviewed and owned by Jenna & Rylan before the demo.

- Cases: **20**
- Correct: **20/20**
- Errors: **0**
- Referrals to human review: **4** (4 expected)
- Infrastructure failures held for replay (not sent to Store): **1**

## Errors

- none

## Referrals

- `mp2-eval-012`: low_confidence:0.3;intent_unclear
- `mp2-eval-013`: ambiguous
- `mp2-eval-014`: kind_conflict:student_vs_venue
- `mp2-eval-016`: invalid_model_output:model output is not valid JSON

## Main need among ready leads

- social: 4
- study: 3
- budget: 3
- partner_cohort: 3
- routine: 1
- partner_listing: 1

## Retry log

- [enrich] mp2-eval-017 attempt 1/3 failed: simulated timeout (test fault)
- [enrich] mp2-eval-018 attempt 1/3 failed: simulated timeout (test fault)
- [enrich] mp2-eval-018 attempt 2/3 failed: simulated timeout (test fault)
- [enrich] mp2-eval-018 attempt 3/3 failed: simulated timeout (test fault)
