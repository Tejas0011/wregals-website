const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">\s*<div className="max-w-3xl">\s*<h4[^>]*>About the Curator<\/h4>[\s\S]*?<\/div>\s*<\/div>/g;

const newContent = content.replace(regex, '');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Removed text overlays. Occurrences matched:', (content.match(regex) || []).length);
