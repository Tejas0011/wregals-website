const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /border-t border-white\/10 pt-6/g;
const newContent = content.replace(regex, 'pt-6');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Removed horizontal lines. Occurrences matched:', (content.match(regex) || []).length);
