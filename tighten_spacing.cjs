const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The Curator profile div currently has pb-6 (padding bottom) and mb-6 (margin bottom)
// <div className="px-6 pb-6 border-b border-white/5">
//   <div className="flex items-center gap-3 mb-6">

const content1 = content.replace(/<div className="px-6 pb-6 border-b border-white\/5">/g, '<div className="px-6 pb-4 border-b border-white/5">');
const content2 = content1.replace(/<div className="flex items-center gap-3 mb-6">/g, '<div className="flex items-center gap-3 mb-4">');

// Also the pt-8 on the sidebar container could be reduced slightly to pt-6
const content3 = content2.replace(/<div className="w-full lg:w-\[400px\] xl:w-\[450px\] bg-\[#0A0A0A\] border-l border-white\/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">/g, '<div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0A0A0A] border-l border-white/5 flex flex-col pt-6 overflow-y-auto custom-scrollbar">');

fs.writeFileSync(filePath, content3, 'utf8');
console.log('Done adjusting padding.', (content.match(/pb-6 border-b/g) || []).length, 'occurrences matched.');
