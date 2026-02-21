const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'Animations');
const outputDir = path.join(__dirname, 'public', 'AnimationsWebP');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));

console.log(`Converting ${files.length} PNGs to WebP...`);

const BATCH = 10;
let done = 0;

async function convertBatch(batch) {
    await Promise.all(batch.map(async (file) => {
        const input = path.join(inputDir, file);
        const outName = file.replace('.png', '.webp');
        const output = path.join(outputDir, outName);
        await sharp(input).webp({ quality: 82 }).toFile(output);
        done++;
        if (done % 20 === 0) console.log(`  ${done}/${files.length} done...`);
    }));
}

(async () => {
    for (let i = 0; i < files.length; i += BATCH) {
        await convertBatch(files.slice(i, i + BATCH));
    }
    console.log(`Done! All ${files.length} files converted to WebP in ${outputDir}`);
})();
