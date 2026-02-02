const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');
// Find the inLava area and show wider context
const idx = code.indexOf('if(inLava)');
console.log('=== Around inLava (byte', idx, ') ===');
console.log(code.substring(idx-50, idx+300));
console.log('\n=== Looking for spawnZombie ===');
// Check if spawnZombie exists in file
let si = 0;
while (true) {
    const found = code.indexOf('spawnZombie', si);
    if (found < 0) break;
    console.log(`Found 'spawnZombie' at byte ${found}: ...${code.substring(found, found+80)}...`);
    si = found + 1;
}
console.log('\n=== Byte 77000-78200 ===');
console.log(code.substring(77000, 78200));
