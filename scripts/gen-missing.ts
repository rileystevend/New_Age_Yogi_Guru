import fs from 'fs';
import path from 'path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const POSES_DIR = path.join(__dirname, '..', 'assets', 'images', 'poses');

async function gen(id: string, prompt: string) {
  console.log('Generating', id, '...');
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + OPENAI_API_KEY },
    body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', quality: 'standard', response_format: 'b64_json' }),
  });
  if (!res.ok) { console.error('  Error:', res.status, await res.text()); return; }
  const data: any = await res.json();
  const buf = Buffer.from(data.data[0].b64_json, 'base64');
  fs.writeFileSync(path.join(POSES_DIR, id + '.png'), buf);
  console.log('  ✓ Saved', id + '.png', (buf.length / 1024).toFixed(0) + 'KB');
}

async function main() {
  await gen('superman-pose', 'A clean, minimalist illustration of a person lying face down performing a prone back extension exercise with both arms extended forward and both legs lifted off the ground. Plain white background. The figure is a simple elegant silhouette in warm terracotta color (#C67B5C). No text, no background elements. Vector art style, flat design.');
  await new Promise(r => setTimeout(r, 2000));
  await gen('cat-pose', 'A clean, minimalist illustration of a person on hands and knees performing a yoga pose with their spine arched upward into a dome shape, chin tucked toward chest, in a tabletop kneeling position. Plain white background. The figure is a simple elegant silhouette in warm terracotta color (#C67B5C). No text, no background elements. Vector art style, flat design.');
}

main().catch(console.error);
