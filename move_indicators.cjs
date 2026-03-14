const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Change "absolute top-8 left-1/2" to "absolute bottom-32 left-1/2"
// (because bottom-0 has the action bar, bottom-32 puts it nicely above it)
const newContent = content.replace(/className="absolute top-8 left-1\/2/g, 'className="absolute bottom-8 left-1/2');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Moved indicators to bottom. Occurrences matched:', (content.match(/className="absolute top-8 left-1\/2/g) || []).length);
