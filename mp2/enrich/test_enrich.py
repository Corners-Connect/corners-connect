"""Unit tests for the enrich step. Run: python -m unittest -v test_enrich.py"""

import copy
import json
import unittest
from pathlib import Path

import enrich as E

DEMO = json.loads((Path(__file__).parent / "fixtures" / "demo-lead.json").read_text(encoding="utf-8"))


class FixedModel:
    """Returns a fixed raw string, to test validation in isolation."""
    name = "fixed"
    retry_delay = 0

    def __init__(self, raw):
        self.raw = raw

    def classify(self, model_input):
        self.seen = model_input
        return self.raw


def answer(**over):
    base = {"segment": "core", "persona": None, "university": None, "intent": "study",
            "ambiguous": False, "confidence": 0.9, "reason": "test"}
    base.update(over)
    return json.dumps(base)


class EnrichTests(unittest.TestCase):
    def test_original_fields_preserved_and_input_not_mutated(self):
        before = copy.deepcopy(DEMO)
        out = E.enrich(DEMO, model=E.StubModel(), log=lambda m: None)
        self.assertEqual(DEMO, before)
        for k, v in before.items():
            self.assertEqual(out[k], v)
        self.assertEqual(out["enrichment"]["status"], "ready")
        self.assertEqual(out["enrichment"]["prompt_version"], E.PROMPT_VERSION)

    def test_email_and_id_not_sent_to_model(self):
        m = FixedModel(answer())
        E.enrich(DEMO, model=m, log=lambda m: None)
        self.assertNotIn("example.invalid", m.seen)
        self.assertNotIn("mp2-demo-001", m.seen)
        self.assertIn("<form_data>", m.seen)

    def test_handoff_has_no_debug_fields(self):
        out = E.handoff_record(E.enrich(DEMO, model=E.StubModel(), log=lambda m: None))
        self.assertFalse([k for k in out if k.startswith("_")])

    def test_invalid_json_goes_to_review(self):
        out = E.enrich(DEMO, model=FixedModel("{not json"), log=lambda m: None)
        self.assertEqual(out["enrichment"]["status"], "needs_review")
        self.assertTrue(out["enrichment"]["review_reasons"][0].startswith("invalid_model_output"))
        self.assertIsNone(out["enrichment"]["segment"])

    def test_unknown_label_goes_to_review(self):
        out = E.enrich(DEMO, model=FixedModel(answer(segment="vip")), log=lambda m: None)
        self.assertEqual(out["enrichment"]["status"], "needs_review")

    def test_low_confidence_goes_to_review(self):
        out = E.enrich(DEMO, model=FixedModel(answer(confidence=0.4)), log=lambda m: None)
        self.assertIn("low_confidence:0.4", out["enrichment"]["review_reasons"])

    def test_kind_conflict_goes_to_review(self):
        out = E.enrich(DEMO, model=FixedModel(answer(segment="venue", intent="partner_listing")),
                       log=lambda m: None)
        self.assertTrue(any(r.startswith("kind_conflict") for r in out["enrichment"]["review_reasons"]))

    def test_null_labels_allowed(self):
        out = E.enrich(DEMO, model=FixedModel(answer(segment="core", persona=None, university=None)),
                       log=lambda m: None)
        self.assertEqual(out["enrichment"]["status"], "ready")
        self.assertIsNone(out["enrichment"]["persona"])

    def test_timeout_once_recovers(self):
        m = E.StubModel({"mp2-demo-001": "timeout_once"})
        logs = []
        out = E.enrich(DEMO, model=m, log=logs.append)
        self.assertEqual(out["enrichment"]["status"], "ready")
        self.assertEqual(len(logs), 1)

    def test_infra_failure_is_not_a_review(self):
        m = E.StubModel({"mp2-demo-001": "timeout_always"})
        with self.assertRaises(E.RetryableEnrichError):
            E.enrich(DEMO, model=m, log=lambda m: None)

    def test_bad_input_rejected(self):
        bad = dict(DEMO)
        del bad["lead_id"]
        with self.assertRaises(E.LeadInputError):
            E.enrich(bad, model=E.StubModel())
        with self.assertRaises(E.LeadInputError):
            E.enrich({**DEMO, "kind": "robot"}, model=E.StubModel())

    def test_arrival_wave_and_language_from_code(self):
        self.assertEqual(E.arrival_wave("January"), "spring")
        self.assertEqual(E.arrival_wave("September"), "autumn")
        self.assertIsNone(E.arrival_wave("whenever"))
        self.assertEqual(E.language_code("EN"), "en")
        self.assertIsNone(E.language_code("english"))


if __name__ == "__main__":
    unittest.main()
