const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Make the left column relative so absolute positioning works
content = content.replace(/<div className="flex-1 flex flex-col min-w-0 bg-\[#080808\]">/g, '<div className="relative flex-1 flex flex-col min-w-0 bg-[#080808]">');

// 2. Change the action bar container from a solid background block to an absolute transparent overlay
// The old class: `w-full px-8 py-5 md:px-12 md:py-5 bg-[#080808] pb-8 z-20 shrink-0`
// The new class: `absolute bottom-0 left-0 w-full px-8 py-5 md:px-12 md:py-8 z-20 pointer-events-none`
// Note: we add pointer-events-none so it doesn't block clicks on the image, and then add pointer-events-auto to its child.
// Wait, the action bar has buttons! If we make the container absolute, we can just let it sit on top. No need for pointer-events-none if it's just the bottom strip.
const regex = /<div className="w-full px-8 py-5 md:px-12 md:py-5 bg-\[#080808\] pb-8 z-20 shrink-0">/g;
const newClass = '<div className="absolute bottom-0 left-0 w-full px-8 py-5 md:px-12 md:py-8 z-30 shrink-0">'; // Made it z-30 so it's above the image

content = content.replace(regex, newClass);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Made action bar transparent overlay. Occurrences matched:', (content.match(/absolute bottom-0 left-0 w-full px-8 py-5/g) || []).length);
