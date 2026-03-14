const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The stats block looks like this:
// <div className="grid grid-cols-3 gap-3 mb-2"> ... </div>
// It comes right after the Curator Profile, which ends with </div>
// Let's use a regex that matches this exact grid block

const regex = /<div className="grid grid-cols-3 gap-3 mb-2">\s*<div className="text-center">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;

// To be safe, let's just match the `<div className="grid grid-cols-3 gap-3 mb-2"> ... </div>` completely.
const safeRegex = /<div className="grid grid-cols-3 gap-3 mb-2">\s*<div className="text-center">[\s\S]*?<\/div>\s*<div className="text-center border-l border-white\/10">[\s\S]*?<\/div>\s*<div className="text-center border-l border-white\/10">[\s\S]*?<\/div>\s*<\/div>/g;

const newContent = content.replace(safeRegex, '');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Removed curator stats. Occurrences matched:', (content.match(safeRegex) || []).length);
