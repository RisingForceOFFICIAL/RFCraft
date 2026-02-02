const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');
// Show byte 69800-72200 to see the transition
console.log('=== Bytes 69800-72200 ===');
console.log(code.substring(69800, 72200));
