const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The new gradient added previously:
// className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-10"
// We want to completely remove this, leaving no tint at all.

const regex = /<div className="absolute bottom-0 left-0 right-0 h-[0-9a-z\/]+ bg-gradient-to-t from-\[#080808\] via-\[#080808\]\/80 to-transparent pointer-events-none z-10"><\/div>/g;
// Actually just target the exact class we used
const exactRegex = /<div className="absolute bottom-0 left-0 right-0 h-1\/2 bg-gradient-to-t from-\[#080808\] via-\[#080808\]\/80 to-transparent pointer-events-none z-10"><\/div>/g;

const newContent = content.replace(exactRegex, '');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Removed bottom gradient overlays. Occurrences matched:', (content.match(exactRegex) || []).length);
