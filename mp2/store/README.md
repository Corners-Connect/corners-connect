# MP2 Store · Haru and Morgan

Start from the repository root with Node 24.

```powershell
node mp2/store/demo.mjs
```

Open [Lead archive](http://127.0.0.1:4174/). The demo uses fictional records and simulated enrichment. The default file is `mp2/store/demo.sqlite`. For a fresh rehearsal database, set `$env:MP2_DB = ':memory:'` before starting the server.

1. Submit the student fixture. Follow `mp2-demo-001` through the Audience tags, Product needs and Operations route.
2. Click the same button again. The page reports the existing row with the original `stored_at`.
3. Submit the partner fixture. Find `mp2-demo-002` in Operations, enter a reviewer name and approve it. The row shows the decision and timestamp, and the same lead becomes ready for Notify.
4. Run the tests to show how Store handles a failed SQLite write and a successful retry.

```powershell
node --test mp2/store/store.test.mjs mp2/store/demo.test.mjs
```

## Handoff for the shared backend

- Enrich calls `store.store(enrichedLead)` inside the backend after validating the model response. The demo's student fixture preserves the shared brief's ID and provenance. The partner fixture represents the stated need as `needs: string[]`. Confirm that representation and the enrichment fields with Jenna and Rylan.
- Notify gets the committed server-side `handoff` with its `lead_id`, `stored_at` and effective `enrichment.status: "ready"`. Pending review returns `handoff: null`. `store.approve(leadId, reviewer)` releases a held lead and records `review.decision`, `review.reviewer` and `review.decided_at`. Approval retains the original AI result in SQLite.
- A retry can retrieve a committed ready record with `store.readyLead(leadId)`. Finn and Daniele can use `lead_id` as the delivery idempotency key. A replay intentionally returns the same ready record so Notify can recover if a prior delivery attempt failed.
- The demo binds to loopback and uses a typed-in reviewer name. The shared backend needs its own authenticated operator identity and the class test destination. The browser receives only a limited handoff receipt.

## Evidence from 15 November 2026

| Check | Observed |
| --- | --- |
| Student submit and replay | `mp2-demo-001` was created once. The replay reported `created: false` with the same `stored_at` of `2026-11-15T14:51:52.958Z`. |
| Review gate | `mp2-demo-002` returned a null handoff before approval. Approval by Demo Reviewer released the same ID with the original `stored_at`. |
| Failure and recovery | A SQLite trigger aborted the write. No record or ready handoff existed. Removing the trigger let the retry commit, and reopening the database preserved the record. |
| Team views | HTTP returned two Audience rows, one Product row and two Operations rows. Fixtures' contact details were absent from views and browser receipts. |

Store uses a single SQLite table keyed by `lead_id`. An identical replay returns the stored record. A different payload under the same ID is rejected so an upstream retry cannot replace provenance or a review decision. Approval records a separate update timestamp.

Codex generated the Store module, demo and tests from the class brief and shared fixture. Morgan's Campaign Studio prototype supplied the queue and explicit human approval pattern. The Audience view currently maps the shared source, campaign and variant to a labelled demo creative reference. Confirm that mapping against Haru's Porto/Bilbao creative when the file is available.

