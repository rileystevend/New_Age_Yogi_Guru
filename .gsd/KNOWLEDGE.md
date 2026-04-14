# Knowledge

## K001: Mobile Device Testing via Expo Tunnel

**Problem:** Corporate macOS firewall blocks incoming connections on all interfaces (WiFi, Tailscale, etc.), so physical phones can't reach the Metro dev server directly.

**What works:** `npx expo start --tunnel`

This uses Expo's built-in ngrok integration with `.exp.direct` domains — no interstitial pages, no firewall issues, no separate tunnel setup needed.

**What doesn't work on this machine:**
- Direct LAN IP (`192.168.1.x:8081`) — blocked by corporate firewall
- Tailscale IP (`100.x.x.x:8081`) — firewall blocks node even on Tailscale interface
- Tailscale Serve — DNS/connectivity issues with Expo Go
- Cloudflare tunnel (`trycloudflare.com`) — DNS timeouts, flaky
- Standalone ngrok (`ngrok-free.app`) — browser interstitial blocks Expo Go bundle fetch

**Standard startup procedure for phone testing:**
```bash
# Terminal 1: Claude API proxy
npx tsx server/index.ts

# Terminal 2: Expo with tunnel (for phone access)
npx expo start --tunnel --port 8081

# Get the tunnel URL for QR code:
curl -s http://localhost:4040/api/tunnels | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['tunnels'][0]['public_url'])"
# Then: npx -y qrcode "exp://<tunnel-host>" -o /tmp/expo-qr.png && open /tmp/expo-qr.png
```

**For simulator only (no tunnel needed):**
```bash
npx expo start --port 8081
xcrun simctl openurl booted "exp://127.0.0.1:8081"
```

**Gotchas:**
- Expo's anonymous ngrok can get rate-limited after many restarts — wait 10-15 min or use your own ngrok authtoken (saved in `~/.expo/ngrok.yml`)
- Always kill stale ngrok processes before restarting: `pkill -9 -f ngrok`
- The `--clear` flag clears Metro cache but also resets the SQLite DB (re-triggers migration)
- AI features (Builder, Chat) on phone use the Expo API route (`/api/claude`) through the same tunnel — no separate proxy tunnel needed

**Added:** 2026-04-14
