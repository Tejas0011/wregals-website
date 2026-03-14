const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const newContent = content.replace(/>Current Bid</g, '>Next Bid<');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Done renaming Current Bid to Next Bid.');
