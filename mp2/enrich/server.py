"""Tiny HTTP wrapper so Capture can call Enrich when a form is submitted.

POST /enrich   body = base lead JSON
  200 -> lead + enrichment (status ready or needs_review)  -> forward to Store
  400 -> contract error in the lead (Capture must fix)      -> do not forward
  503 -> model service down after retries, {"retryable": true} -> replay later
GET  /health   -> {"ok": true, "model": ..., "prompt_version": ...}

Standard library only. Binds to 127.0.0.1. The model key, if any, stays in
this process's environment and is never returned in a response.

Run:  python server.py            (stub model, port 8098)
      ENRICH_MODEL=claude python server.py
"""

from __future__ import annotations

import argparse
import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import enrich as E

MODEL = None


class Handler(BaseHTTPRequestHandler):
    def _send(self, code: int, body: dict):
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/health":
            return self._send(200, {"ok": True, "model": MODEL.name, "prompt_version": E.PROMPT_VERSION})
        self._send(404, {"error": "not_found"})

    def do_POST(self):
        if self.path != "/enrich":
            return self._send(404, {"error": "not_found"})
        try:
            length = int(self.headers.get("Content-Length", 0))
            if length > 64_000:
                return self._send(413, {"error": "too_large"})
            lead = json.loads(self.rfile.read(length) or b"null")
            result = E.enrich(lead, model=MODEL)
        except (json.JSONDecodeError, E.LeadInputError) as e:
            return self._send(400, {"error": "bad_input", "detail": str(e)})
        except E.RetryableEnrichError as e:
            return self._send(503, {"error": "model_unavailable", "retryable": True,
                                    "lead_id": lead.get("lead_id"), "detail": str(e)})
        except E.ModelConfigError as e:
            return self._send(500, {"error": "server_misconfigured", "retryable": False, "detail": str(e)})
        rec = E.handoff_record(result)
        print(f"[enrich] {rec['lead_id']} -> {rec['enrichment']['status']} "
              f"{rec['enrichment']['review_reasons'] or ''}", file=sys.stderr)
        self._send(200, rec)

    def log_message(self, fmt, *args):  # quieter default logging
        pass


def main():
    global MODEL
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=8098)
    args = p.parse_args()
    MODEL = E.default_model()
    srv = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Enrich listening on http://127.0.0.1:{args.port}  model={MODEL.name}  prompt={E.PROMPT_VERSION}",
          file=sys.stderr)
    srv.serve_forever()


if __name__ == "__main__":
    main()
