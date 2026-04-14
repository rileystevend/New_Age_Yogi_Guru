/**
 * Generate yoga pose illustrations via DALL-E 3.
 *
 * Usage: OPENAI_API_KEY=... npx tsx scripts/generate-pose-images.ts
 *
 * Generates a consistent set of minimalist yoga pose illustrations
 * and saves them to assets/images/poses/{pose-id}.png
 */

import fs from 'fs';
import path from 'path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY not set');
  process.exit(1);
}

const POSES_DIR = path.join(__dirname, '..', 'assets', 'images', 'poses');
const BATCH_DELAY_MS = 1500; // Rate limit buffer

// Consistent style prompt prefix for all poses
const STYLE_PREFIX = `A clean, minimalist illustration of a person performing a yoga pose on a plain white background. The figure is rendered as a simple, elegant silhouette in warm terracotta/coral color (#C67B5C). No text, no mat, no props, no shadows, no background elements. The figure should be anatomically proportional and clearly demonstrate the pose. Vector art style, flat design.`;

interface PoseInfo {
  id: string;
  englishName: string;
  sanskritName: string;
  description: string;
}

async function generateImage(pose: PoseInfo): Promise<Buffer | null> {
  const prompt = `${STYLE_PREFIX} The pose is "${pose.englishName}" (${pose.sanskritName}): ${pose.description.slice(0, 150)}`;

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`  ✗ API error for ${pose.id}: ${res.status} — ${err.slice(0, 200)}`);
      return null;
    }

    const data = (await res.json()) as any;
    const b64 = data.data?.[0]?.b64_json;
    if (!b64) {
      console.error(`  ✗ No image data for ${pose.id}`);
      return null;
    }

    return Buffer.from(b64, 'base64');
  } catch (err) {
    console.error(`  ✗ Network error for ${pose.id}:`, err);
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Dynamic import of poses (ESM/CJS compat)
  const { poses } = await import('../data/poses');

  // Check which poses already have images
  const existing = new Set(
    fs.readdirSync(POSES_DIR)
      .filter((f) => f.endsWith('.png'))
      .map((f) => f.replace('.png', ''))
  );

  const toGenerate = (poses as PoseInfo[]).filter((p) => !existing.has(p.id));

  console.log(`\n🧘 Pose Image Generator`);
  console.log(`Total poses: ${poses.length}`);
  console.log(`Already generated: ${existing.size}`);
  console.log(`To generate: ${toGenerate.length}`);
  console.log(`Estimated cost: ~$${(toGenerate.length * 0.04).toFixed(2)}\n`);

  if (toGenerate.length === 0) {
    console.log('✅ All poses already have images!');
    return;
  }

  let generated = 0;
  let failed = 0;

  for (let i = 0; i < toGenerate.length; i++) {
    const pose = toGenerate[i];
    const progress = `[${i + 1}/${toGenerate.length}]`;

    console.log(`${progress} Generating ${pose.englishName}...`);

    const imageBuffer = await generateImage(pose);

    if (imageBuffer) {
      const filePath = path.join(POSES_DIR, `${pose.id}.png`);
      fs.writeFileSync(filePath, imageBuffer);
      console.log(`  ✓ Saved ${filePath} (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
      generated++;
    } else {
      failed++;
    }

    // Rate limit buffer between requests
    if (i < toGenerate.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total in directory: ${fs.readdirSync(POSES_DIR).filter(f => f.endsWith('.png')).length}`);
}

main().catch(console.error);
