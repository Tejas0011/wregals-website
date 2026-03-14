const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /\{\/\*\s*Uploader Profile\s*\*\/\}\s*<div className="flex items-center gap-3 cursor-pointer">\s*<img[^>]*>\s*<span[^>]*>[^<]*<\/span>\s*<\/div>/g;

const newContent = content.replace(regex, '');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Removed profile overlays. Occurrences matched:', (content.match(regex) || []).length);
