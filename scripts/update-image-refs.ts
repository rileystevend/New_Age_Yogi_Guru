/**
 * Updates data/poses.ts to replace null imageUrl with the actual asset paths.
 */
import fs from 'fs';
import path from 'path';

const posesFile = path.join(__dirname, '..', 'data', 'poses.ts');
let content = fs.readFileSync(posesFile, 'utf-8');

// Find all pose IDs that have images
const imagesDir = path.join(__dirname, '..', 'assets', 'images', 'poses');
const images = new Set(
  fs.readdirSync(imagesDir)
    .filter(f => f.endsWith('.png'))
    .map(f => f.replace('.png', ''))
);

let updated = 0;

// For each pose, replace imageUrl: null with require() call
// Match pattern: id: 'pose-id', ... imageUrl: null,
for (const id of images) {
  // Find the pattern: this pose's imageUrl: null
  const regex = new RegExp(
    `(id: '${id}'[\\s\\S]*?)imageUrl: null`,
    'g'
  );
  
  const newContent = content.replace(regex, (match, prefix) => {
    updated++;
    return `${prefix}imageUrl: require('@/assets/images/poses/${id}.png')`;
  });
  
  if (newContent !== content) {
    content = newContent;
  }
}

// Update the Pose type to allow require() return type
// imageUrl is currently string | null, needs to also accept number (require returns number in RN)

fs.writeFileSync(posesFile, content);
console.log(`Updated ${updated} imageUrl references`);
