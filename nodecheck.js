const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\temp_validate.js", 'utf8');
try {
    new Function(code);
    console.log('JS syntax OK');
} catch(e) {
    console.log('Syntax error:', e.message);
    // Find the line number
    const match = e.message.match(/Unexpected.*?(\d+)/);
    if (match) console.log('Near line:', match[1]);
}
