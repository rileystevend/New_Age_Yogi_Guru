#!/usr/bin/env python3
"""
Simple reverse proxy to expose Metro bundler on LAN.
Workaround for corporate firewall blocking Node.js incoming connections.
Proxies 0.0.0.0:8082 -> localhost:8081
"""
import http.server
import urllib.request
import sys

METRO_PORT = 8081
PROXY_PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8082

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self._proxy()

    def do_POST(self):
        self._proxy()

    def do_PUT(self):
        self._proxy()

    def do_HEAD(self):
        self._proxy()

    def do_OPTIONS(self):
        self._proxy()

    def _proxy(self):
        url = f'http://127.0.0.1:{METRO_PORT}{self.path}'
        try:
            body = None
            content_length = self.headers.get('Content-Length')
            if content_length:
                body = self.rfile.read(int(content_length))

            headers = {k: v for k, v in self.headers.items()
                      if k.lower() not in ('host', 'connection')}
            headers['Host'] = f'127.0.0.1:{METRO_PORT}'

            req = urllib.request.Request(url, data=body, headers=headers, method=self.command)
            with urllib.request.urlopen(req, timeout=120) as resp:
                self.send_response(resp.status)
                for key, val in resp.getheaders():
                    if key.lower() not in ('transfer-encoding', 'connection'):
                        self.send_header(key, val)
                self.end_headers()
                while True:
                    chunk = resp.read(65536)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(f'Proxy error: {e}'.encode())

    def log_message(self, format, *args):
        # Quiet logging — only errors
        if args and '502' in str(args[0]):
            super().log_message(format, *args)

if __name__ == '__main__':
    server = http.server.HTTPServer(('0.0.0.0', PROXY_PORT), ProxyHandler)
    print(f'LAN proxy listening on 0.0.0.0:{PROXY_PORT} -> localhost:{METRO_PORT}')
    print(f'Connect Expo Go to: exp://192.168.1.184:{PROXY_PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nProxy stopped.')
        server.shutdown()
