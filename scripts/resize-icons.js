import sharp from 'sharp';
import { readFile } from 'fs/promises';

const sizes = [72, 96, 128, 144, 152, 192, 384];

// Read the source icon as a buffer
const inputBuffer = await readFile('./public/icons/icon-512.png');

for (const size of sizes) {
  const outputBuffer = await sharp(inputBuffer)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toBuffer();
  // Write to current directory so we can move them after
  const fs = await import('fs/promises');
  await fs.writeFile(`./icon-${size}.png`, outputBuffer);
  console.log(`Generated icon-${size}.png (${outputBuffer.length} bytes)`);
}

console.log('All icons generated!');
