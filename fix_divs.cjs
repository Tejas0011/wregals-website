const fs = require('fs');

const filePath = 'd:\\Wregals\\Code\\src\\components\\HomeHero.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The stats block regex removed the grid but left an extra </div> 
// because of how the DOM was structured.
// The broken section looks like this:
// <p className="text-neutral-500 text-xs">@virat.kohli</p>
// </div>
// </div>
//
// </div>
// </div>

const regex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\*\s*Item Info\s*\*\/\}/g;

const newContent = content.replace(regex, '</div>\n                        </div>\n                    </div>\n\n                    {/* Item Info */}');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed extra div tags. Occurrences matched:', (content.match(regex) || []).length);
