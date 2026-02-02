const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');

// Find collideAxis
const idx = code.indexOf('collideAxis');
console.log('collideAxis at byte:', idx);

// Find createZombieMesh 
const idx2 = code.indexOf('createZombieMesh');
console.log('createZombieMesh at byte:', idx2);

// Show content between collideAxis end and my cont1.js content
// Find "return;}}" after collideAxis
const retIdx = code.indexOf('return;}}', idx);
if (retIdx >= 0) {
    const area = code.substring(retIdx, retIdx + 1500);
    console.log('\n=== After collideAxis return ===');
    console.log(area);
}
