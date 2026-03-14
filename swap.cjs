const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/HomeHero.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We have 4 lots, we can split by "/* LOT 0"
const lots = content.split(/\{\/\*\s*LOT\s*0[1-4]\s*\*\/\}/);

// lots[0] is the prefix before LOT 01
// lots[1..4] are the 4 lots

for (let i = 1; i <= 4; i++) {
    let lot = lots[i];

    // Extract Title, Description
    const titleRegex = /<h1[^>]*>([\s\S]*?)<\/h1>/;
    const titleMatch = lot.match(titleRegex);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descRegex = /<p className="text-neutral-400 text-sm md:text-base leading-relaxed hidden md:block">([\s\S]*?)<\/p>/;
    const descMatch = lot.match(descRegex);
    const desc = descMatch ? descMatch[1].trim() : '';

    // Extract Bids
    const currentBidRegex = /<div className="text-white font-mono text-4xl md:text-5xl font-light mb-1\.5">\s*([^\s<]+)\s*<\/div>/;
    const currentBidMatch = lot.match(currentBidRegex);
    const currentBid = currentBidMatch ? currentBidMatch[1].trim() : '';

    const startingBidRegex = /Starting Bid\s*([^\s<]+)\s*<\/p>/;
    const startingBidMatch = lot.match(startingBidRegex);
    const startingBid = startingBidMatch ? startingBidMatch[1].trim() : '';

    // Extract Bio - can be multiple paragraphs, so let's extract the whole inner HTML of Curator Bio
    const bioBlockRegex = /\{\/\*\s*Curator Bio\s*\*\/\}\s*<div className="px-6 py-4 border-b border-white\/5">\s*<h4[^>]*>About<\/h4>\s*([\s\S]*?)<\/div>/;
    const bioBlockMatch = lot.match(bioBlockRegex);
    
    // Some lots might have different About header, let's be more robust:
    const altBioBlockRegex = /\{\/\*\s*Curator Bio\s*\*\/\}\s*<div className="px-6 py-4 border-b border-white\/5">([\s\S]*?)<\/div>/;
    const altBioMatch = lot.match(altBioBlockRegex);
    
    let bioContent = '';
    if (altBioMatch) {
        bioContent = altBioMatch[1].trim();
        // remove the <h4>About</h4> if present
        bioContent = bioContent.replace(/<h4[^>]*>About<\/h4>/, '').trim();
    }

    // Now format the new Item Info for the sidebar
    const newItemInfo = `{/* Item Info */}
                    <div className="px-6 py-4 border-b border-white/5">
                        <h1 className="serif text-white text-xl tracking-tight leading-tight mb-2 uppercase">
                            ${title}
                        </h1>
                        <p className="text-neutral-400 text-[11px] leading-relaxed mb-4">
                            ${desc}
                        </p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-neutral-500 text-[9px] uppercase tracking-widest mb-1">Current Bid</p>
                                <div className="text-[#D4AF37] font-mono text-xl font-light">${currentBid}</div>
                            </div>
                            <div className="text-right">
                                <p className="text-neutral-500 text-[9px] uppercase tracking-widest mb-1">Starting Bid</p>
                                <div className="text-neutral-400 font-mono text-sm">${startingBid}</div>
                            </div>
                        </div>
                    </div>`;

    // Now format the new Curator Bio for the main image
    // Make text larger for the image overlay
    let largeBioContent = bioContent;
    largeBioContent = largeBioContent.replace(/text-\[12px\]/g, 'text-base md:text-lg text-white mb-4');
    largeBioContent = largeBioContent.replace(/text-\[10px\]/g, 'text-sm md:text-base hidden md:block');

    const newImageContent = `<div className="max-w-3xl">
                                <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3 block">About the Curator</h4>
                                ${largeBioContent}
                            </div>`;

    // Replace old Content block with newImageContent
    // The old block is inside <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8"> ... </div>
    const oldImageBlockRegex = /<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\*\s*Bottom Action Bar\s*\*\/\}/;
    // Actually the outer block is <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8"> ... <div className="text-left md:text-right shrink-0"> ... </div></div>
    // Let's replace precisely that flex block.
    
    const imageBlockRegex = /<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">[\s\S]*?Starting Bid [^<]+<\/p>\s*<\/div>\s*<\/div>/;
    
    lot = lot.replace(imageBlockRegex, `<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">\n${newImageContent}\n</div>`);

    // Replace old Curator Bio block with newItemInfo
    lot = lot.replace(altBioBlockRegex, newItemInfo);

    lots[i] = lot;
}

// Reassemble
let newContent = lots[0];
for (let i = 1; i <= 4; i++) {
    newContent += `{/* LOT 0${i} */}` + lots[i];
}

// Write back
// First check if matching worked
if (lots[1].indexOf('Item Info') === -1) {
    console.log("FAILED to replace Lot 1");
} else {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log("Successfully swapped text sections for 4 lots.");
}
