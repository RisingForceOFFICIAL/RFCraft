const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\temp_validate.js", 'utf8');
const lines = code.split('\n');
let depth = 0;
for (let i = 0; i < 720; i++) {
    const prevDepth = depth;
    for (const ch of lines[i]) {
        if (ch === '{') depth++;
        if (ch === '}') depth--;
    }
    if (i >= 690 || depth < 0) {
        if (depth !== prevDepth || i >= 695)
            console.log(`${i+1} [d:${prevDepth}->${depth}]: ${lines[i].substring(0, 100)}`);
    }
}
