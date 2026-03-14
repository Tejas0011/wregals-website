const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The starting bid div looks like:
// <div className="text-neutral-400 font-mono text-sm">₹50,000</div>
// We want to replace `text-sm` with `text-xl font-light` on those specific elements.

const matchString = /<div className="text-neutral-400 font-mono text-sm">/g;
const replaceString = '<div className="text-neutral-400 font-mono text-xl font-light">';

const newContent = content.replace(matchString, replaceString);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Changed Starting Bid size. Occurrences matched:', (content.match(matchString) || []).length);
