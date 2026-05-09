import sharp from 'sharp';
import { mkdir } from 'fs/promises';

const sizes = [72, 96, 128, 144, 152, 192, 384];
const inputPath = './public/icons/icon-512.png';
const outputDir = './public/icons';

await mkdir(outputDir, { recursive: true });

for (const size of sizes) {
  await sharp(inputPath)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(`${outputDir}/icon-${size}.png`);
  console.log(`Generated icon-${size}.png`);
}

console.log('All icons generated!');
