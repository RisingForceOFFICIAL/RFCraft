const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\temp_validate.js", 'utf8');
const lines = code.split('\n');
let depth = 0;
let maxDepthLine = 0;
let maxDepth = 0;
for (let i = 0; i < lines.length; i++) {
    for (const ch of lines[i]) {
        if (ch === '{') depth++;
        if (ch === '}') depth--;
    }
    if (depth > maxDepth) { maxDepth = depth; maxDepthLine = i; }
    // If we get to a top-level mismatch, flag it
    if (depth < 0) {
        console.log(`Negative depth at line ${i + 1}: ${lines[i].substring(0, 80)}`);
    }
}
console.log('Final depth:', depth);

// Find where the extra brace is by checking depth at key points
depth = 0;
for (let i = 0; i < lines.length; i++) {
    const prevDepth = depth;
    for (const ch of lines[i]) {
        if (ch === '{') depth++;
        if (ch === '}') depth--;
    }
    // Functions should start at depth 0 and end at depth 0
    if (lines[i].startsWith('function ') && prevDepth !== 0) {
        console.log(`WARNING: function at line ${i + 1} starts at depth ${prevDepth}: ${lines[i].substring(0, 60)}`);
    }
}
