const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\temp_validate.js", 'utf8');
const lines = code.split('\n');
// Try progressively to find where the error is
let lastGoodLine = 0;
for (let i = 1; i <= lines.length; i++) {
    const chunk = lines.slice(0, i).join('\n');
    try {
        new Function(chunk);
        lastGoodLine = i;
    } catch(e) {
        // Keep going - some errors are because of incomplete code
    }
}
console.log('Last fully parseable up to line:', lastGoodLine, '/', lines.length);
console.log('Line:', lines[lastGoodLine]);

// Binary search for the error
let lo = 0, hi = lines.length;
while (lo < hi) {
    const mid = (lo + hi) >> 1;
    try {
        new Function(lines.slice(0, mid + 1).join('\n'));
        lo = mid + 1;
    } catch(e) {
        hi = mid;
    }
}
console.log('First error at line:', lo + 1);
console.log('Context:');
for (let i = Math.max(0, lo - 3); i <= Math.min(lines.length - 1, lo + 3); i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}
