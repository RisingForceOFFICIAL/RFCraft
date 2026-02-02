const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');

// Count occurrences of key unique strings
const checks = ['init();', '</html>', '</script>', 'function animate()', 'function init()', 
                'function updatePlayer', 'function renderHand'];
for (const c of checks) {
    let count = 0, idx = 0;
    while (true) {
        const found = code.indexOf(c, idx);
        if (found < 0) break;
        count++;
        console.log(`  "${c}" at byte ${found}`);
        idx = found + 1;
    }
    console.log(`"${c}": ${count} occurrence(s)\n`);
}

console.log('File size:', code.length);

// Check around byte 107000
console.log('\n=== Bytes 107000-108000 ===');
console.log(code.substring(107000, 108000));
