const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\temp_validate.js", 'utf8');
const lines = code.split('\n');
// Show lines 680-700
for (let i = 679; i < 706 && i < lines.length; i++) {
    console.log(`${i+1}: ${lines[i].substring(0, 120)}`);
}
