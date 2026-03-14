const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The old gradient: `absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent pointer-events-none`
// Let's replace `inset-0` with `bottom-0 left-0 right-0 h-1/3` to only cover the bottom third, and make it smoothly fade up.
const regex = /className="absolute inset-0 bg-gradient-to-t from-\[#080808\] via-\[#080808\]\/40 to-transparent pointer-events-none"/g;
const newClass = 'className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent pointer-events-none z-10"';

const newContent = content.replace(regex, newClass);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Adjusted gradients. Occurrences matched:', (content.match(regex) || []).length);
