import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PROXY_PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('[Proxy] ANTHROPIC_API_KEY not set. Create a .env file in the project root.');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/claude/messages
 *
 * Proxies requests to the Anthropic Messages API.
 * Supports both streaming and non-streaming modes.
 *
 * Body: { model?, system?, messages, max_tokens?, stream? }
 */
app.post('/api/claude/messages', async (req, res) => {
  const {
    model = 'claude-sonnet-4-20250514',
    system,
    messages,
    max_tokens = 4096,
    stream = true,
  } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required and must not be empty' });
    return;
  }

  const startTime = Date.now();
  console.log(`[Proxy] ${stream ? 'Stream' : 'Sync'} request — model: ${model}, messages: ${messages.length}`);

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens,
    stream,
  };
  if (system) {
    body.system = system;
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!anthropicRes.ok) {
      const errorBody = await anthropicRes.text();
      console.error(`[Proxy] Anthropic API error ${anthropicRes.status}: ${errorBody}`);
      res.status(anthropicRes.status).json({
        error: 'Anthropic API error',
        status: anthropicRes.status,
        details: errorBody,
      });
      return;
    }

    if (stream && anthropicRes.body) {
      // Stream SSE passthrough
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = anthropicRes.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } catch (streamErr) {
        console.error('[Proxy] Stream error:', streamErr);
      } finally {
        res.end();
      }
    } else {
      // Non-streaming: pass JSON response
      const data = await anthropicRes.json();
      res.json(data);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Proxy] Request completed in ${elapsed}ms`);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.error(`[Proxy] Network error after ${elapsed}ms:`, err);
    res.status(502).json({
      error: 'Failed to reach Anthropic API',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Proxy] Claude API proxy running on http://0.0.0.0:${PORT}`);
  console.log(`[Proxy] API key: ${ANTHROPIC_API_KEY.slice(0, 10)}...`);
});
