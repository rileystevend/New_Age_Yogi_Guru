/**
 * Expo API Route — proxies Claude requests server-side.
 * This runs in the Expo server context, so it goes through the same tunnel.
 * 
 * POST /api/claude
 * Body: { model?, system?, messages, max_tokens?, stream? }
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: Request): Promise<Response> {
  if (!ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY not configured on server' },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    model = 'claude-sonnet-4-20250514',
    system,
    messages,
    max_tokens = 4096,
  } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: 'messages array is required' },
      { status: 400 }
    );
  }

  const anthropicBody: Record<string, unknown> = {
    model,
    messages,
    max_tokens,
    stream: false,
  };
  if (system) {
    anthropicBody.system = system;
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicBody),
    });

    if (!anthropicRes.ok) {
      const errorBody = await anthropicRes.text();
      return Response.json(
        { error: 'Anthropic API error', status: anthropicRes.status, details: errorBody },
        { status: anthropicRes.status }
      );
    }

    const data = await anthropicRes.json();
    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: 'Failed to reach Anthropic API', message: String(err) },
      { status: 502 }
    );
  }
}
