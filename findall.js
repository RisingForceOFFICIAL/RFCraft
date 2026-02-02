const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');

// Find ALL occurrences of spawnZombie
let idx = 0;
while (true) {
    const found = code.indexOf('spawnZombie', idx);
    if (found < 0) break;
    console.log(`byte ${found}: ...${code.substring(Math.max(0,found-20), found+60)}...`);
    idx = found + 1;
}

// Find all "function " declarations and their byte positions
console.log('\n=== All function declarations between bytes 68000-78000 ===');
idx = 68000;
while (idx < 78000) {
    const found = code.indexOf('function ', idx);
    if (found < 0 || found >= 78000) break;
    console.log(`byte ${found}: ${code.substring(found, found + 60)}`);
    idx = found + 10;
}
