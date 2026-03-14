const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Match everything from the comment {/* Navigation Arrows ... */} 
// down to the two </button> tags and the closing </div>
const regex = /\{\/\*\s*Navigation Arrows[\s\S]*?<\/button>\s*<\/div>/;

const newContent = content.replace(regex, '');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Removed navigation arrows. Found?', regex.test(content));
