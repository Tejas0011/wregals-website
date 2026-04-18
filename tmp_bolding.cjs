const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (file.includes('node_modules') || file.includes('.git')) return;
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('d:/Wregals/Code/src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/text-2xl font-light text-white/g, 'text-2xl font-semibold tracking-tight text-white');
  content = content.replace(/text-xl font-light text-white tracking-tight/g, 'text-xl font-semibold tracking-tight text-white');
  content = content.replace(/text-xl text-white font-light/g, 'text-xl font-semibold tracking-tight text-white');
  content = content.replace(/text-5xl font-light/g, 'text-5xl font-semibold tracking-tight');
  
  // Specific patterns from mygrep
  content = content.replace(/className=\"text-xl text-white mb-1\"/g, 'className=\"text-xl font-semibold tracking-tight text-white mb-1\"');
  content = content.replace(/className=\"text-2xl text-blue-400\"/g, 'className=\"text-2xl font-semibold tracking-tight text-blue-400\"');
  content = content.replace(/className=\"text-2xl md:text-3xl text-white mb-1\"/g, 'className=\"text-2xl md:text-3xl font-semibold tracking-tight text-white mb-1\"');
  
  content = content.replace(/text-xs tabular-nums font-semibold/g, 'text-xs tabular-nums font-bold tracking-tight');
  content = content.replace(/text-lg tracking-widest text-white\/90/g, 'text-lg font-medium tracking-widest text-white/90');
  content = content.replace(/text-xl text-white tracking-tight/g, 'text-xl font-semibold text-white tracking-tight');
  
  // Catch remaining font-light where text-xl or larger is present as KPI often uses it
  content = content.replace(/(text-[2-5]xl|text-xl)\s+font-light/g, '$1 font-semibold tracking-tight');
  content = content.replace(/font-light\s+font-mono/g, 'font-semibold tracking-tight');
  
  if(original !== content) {
      fs.writeFileSync(file, content);
      changedCount++;
  }
});
console.log('Modified files:', changedCount);
