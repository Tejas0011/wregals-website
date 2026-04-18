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
  if (content.includes('font-mono')) {
    content = content.replace(/\bfont-mono\b/g, ''); 
    // clean up double spaces inside classes
    content = content.replace(/className=\"\s+/g, 'className=\"').replace(/\s+\"/g, '\"').replace(/  +/g, ' ');
    fs.writeFileSync(file, content);
    changedCount++;
  }
});
console.log('Modified files:', changedCount);
