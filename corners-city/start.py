#!/usr/bin/env python3
"""Serve the existing board locally and open Corners City. Standard library only."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port', type=int, default=8097)
parser.add_argument('--no-open', action='store_true', help='Do not open a browser')
args = parser.parse_args()
root = Path(__file__).resolve().parent / 'board'
handler = partial(SimpleHTTPRequestHandler, directory=str(root))
port = args.port
while port < args.port + 20:
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), handler)
        break
    except OSError as error:
        if error.errno not in (48, 98, 10048):
            raise
        port += 1
else:
    raise SystemExit('Ports are busy. Try: python3 start.py --port 8100')
url = f'http://127.0.0.1:{port}/city.html'
print(f'Corners City: {url}', flush=True)
print(f'Company board: http://127.0.0.1:{port}/index.html', flush=True)
print('Keep this terminal open. Ctrl+C stops the local server.', flush=True)
if not args.no_open:
    threading.Timer(.5, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    print('\nLocal server stopped.')
finally:
    server.server_close()
