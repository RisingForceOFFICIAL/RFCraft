const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\temp_validate.js", 'utf8');
const lines = code.split('\n');
// Show lines 725-740
for (let i = 724; i < 745 && i < lines.length; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
