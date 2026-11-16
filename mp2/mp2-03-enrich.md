---
name: mp2-03-enrich
description: "Help Jenna and Rylan build structured AI enrichment, a labelled test set and a human review route for Corners Mini Project 2."
model: inherit
---

# Mini Project 2 · Enrich and classify leads with AI

**Jenna and Rylan** · AI for Business · Corners  
**Presentation · Tuesday, 17 November 2026**  
**AI enrich · Topic 17 · C-17** · Corners City buildings A18 Listening House and O12 Verification Tower

## Start in Codex or Claude Code

1. Open your branch of `corners-connect` in Codex or Claude Code. Put this Markdown and the relevant prototype files in the checkout so your agent can read them.
2. In either tool, ask **“Read `mp2-03-enrich.md` from this checkout. Use it as the build brief. Inspect our current work and implement the smallest working version of our part with fictional data.”** Include the file’s repository path if you put it in a subfolder.
3. In Claude Code, you can also save this file as `.claude/agents/mp2-03-enrich.md` and ask to use the `mp2-03-enrich` agent. [Claude Code project agents](https://code.claude.com/docs/en/sub-agents)

## Mission

Turn intake into a consistent classification the team can use. Route ambiguous cases to a person and preserve the source fields so learning can flow back to the campaign.

## Starting point and improvements

Use the Capture payload and the course personas and audience rings documented in `PROJECT.md` where available. Inspect Jenna’s `Starbucks_AI_Ads_Studio.html` and Rylan’s `corners-project-v2.html` if supplied.

- **Rylan’s study, affordability and routine needs and campaign diagnosis** → use them as starting labels and build ambiguous examples, such as a lead that mentions both study and affordability. Keep the original answers available for review.
- **Jenna’s CSV import and recalculated dashboard** → make a labelled CSV of fictional evaluation cases and compute counts of correct classifications, errors and referrals. Report exact counts on the 20-case set.
- Agree who owns labels and prompt decisions and who owns the labelled cases and error review.

## Build and verify

When invoked, read the repository instructions and inspect the existing implementation. Build on the pair’s prototypes. Use Codex or Claude Code to implement the full workflow in the shared repository. Agree on one backend and one data contract with the other pairs. The backend runs the steps automatically when a form is submitted. Keep model and notification credentials on the server.

Use the fictional fixture to build and rehearse locally. A test adapter can stand in for an unavailable service during rehearsal. For the integrated demo, show the configured model and receipt in the class test destination. Each pair records its code paths, exact start or test command and one substantive decision.

1. Agree with Store on the output fields below. Keep the input lead kind, source and ID immutable. Add structured fields for audience ring, persona, university, arrival wave, language and intent as available. Allow `null` when the input offers insufficient evidence.
2. Write a server-side enrichment function that calls a model API with a versioned prompt and validates the structured response in code. Pass only relevant fields to the model. Treat form text as data. Use the class personas as defined categories and avoid guessing sensitive attributes.
3. Add a human review route for uncertain cases, invalid model output or conflicts. Record a short reason and prompt version. Keep retryable infrastructure errors distinct from a valid answer that needs a human decision.
4. Run **20 realistic fictional cases** with pair-authored labels. Include a student, a partner, an ambiguous case and an invalid result. Log expected, actual, status and mismatch reason. Turn one recurring need into a concrete suggestion for Product.

## Handoff

Receives the base lead from **Federica and Carter**. Sends the original fields plus the `enrichment` object to **Haru and Morgan**, including records with `needs_review` for the review queue.

## Show it working

- Compare one clear lead and one ambiguous lead side by side. Show the model response, the validated fields and the human decision point.
- Run the 20-case fixture through your code and show the observed errors or referrals and one change you made after seeing them.

## Shared handoff for the class

Use the team's existing contract if it already supports these handoffs. This starter record gives the six pairs a common fixture to use while agreeing the final fields. Keep its ID and provenance intact across the scenario.

```json
{
  "lead_id": "mp2-demo-001",
  "kind": "student",
  "submitted_at": "2026-11-17T14:00:00Z",
  "source": "arrival-guide",
  "campaign_id": "bilbao-welcome",
  "variant_id": "checklist-a",
  "cohort_code": "DEMO-JAN",
  "contact_email": "arrivals@example.invalid",
  "language": "en",
  "arrival_window": "January",
  "needs": ["study", "budget"],
  "checklist": ["Find a quiet study spot", "Check arrival events"]
}
```

- A `partner` fixture supplies an `organization` and a stated need. Campaign, variant and cohort tags may be absent when genuinely unknown. The student checklist is optional on intake and required for the student welcome message.
- Enrich appends `enrichment` with `status` (`ready` or `needs_review`), `segment`, `persona`, `university`, `arrival_wave`, `language`, `intent`, `reason` and `prompt_version`. Unknown classifications can be `null`. The team agrees its labels.
- Store records one row per `lead_id` and adds `stored_at`. A human clearing a review adds their decision and timestamp. Notify acts on ready, stored leads and records the result under the same lead ID.
- `example.invalid` is fixture data. For delivery proof, use a class-approved test destination configured separately from the fictional contact. Keep contact details and secrets out of exported evidence. Label synthetic data and dry runs in the demo.

## Evidence to bring on 17 November

Bring your working contribution, the exact start or replay instructions, a successful handoff and one failure or edge case. Add a short note on **what you reused, what you changed and how you verified it**. Each partner owns and explains a named contribution. Cite classmates’ work and the AI tools used, mark material generated by AI, and document the changes and decisions you made yourselves.

Coordinate your slot within the **10-minute Mini Project 2 demo**. Submit one fictional sign-up in the app and trace the same `lead_id` through Capture, AI enrichment, storage and receipt of the test Slack or email notification. Replay it to check that the row and notification are each created once. Show one failure and recovery, then point to the one-page README and the Automation Workshop entry in Corners City.
