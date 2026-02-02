const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');

const idx = code.indexOf('function spawnZombie');
console.log('=== spawnZombie area (byte', idx, ') ===');
console.log(code.substring(idx, idx + 2000));
