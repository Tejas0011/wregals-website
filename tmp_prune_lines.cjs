const fs = require('fs');

const path = 'd:/Wregals/Code/src/pages/SellerDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');
let lines = content.split('\n');

// Arrays of (startLine, endLine) to remove (1-indexed)
const rangesToRemove = [
  [712, 752], // Section 6: Heatmap
  [681, 709], // Live Activity Feed
  [601, 632], // Active Promotions Table
  [501, 529], // Category Pie
  [476, 492], // Views vs Watchers
];

// Sort descending so splicing earlier indices doesn't affect later indices
rangesToRemove.sort((a, b) => b[0] - a[0]);

for (const [start, end] of rangesToRemove) {
  lines.splice(start - 1, end - start + 1);
}

fs.writeFileSync(path, lines.join('\n'));
console.log('Successfully pruned line ranges');
