const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');

// Find script tags
let idx = 0;
while (true) {
    const found = code.indexOf('<script', idx);
    if (found < 0) break;
    console.log(`<script at byte ${found}: ${code.substring(found, found+100)}`);
    idx = found + 1;
}
idx = 0;
while (true) {
    const found = code.indexOf('</script', idx);
    if (found < 0) break;
    console.log(`</script at byte ${found}: ${code.substring(found, found+20)}`);
    idx = found + 1;
}

// Now extract just the game JS and check braces
const jsStart = code.indexOf("'use strict'");
const jsEnd = code.lastIndexOf('</script');
if (jsStart >= 0 && jsEnd >= 0) {
    const js = code.substring(jsStart, jsEnd);
    let open = 0, close = 0;
    for (const ch of js) {
        if (ch === '{') open++;
        if (ch === '}') close++;
    }
    console.log(`\nJS from 'use strict' to </script: Open=${open}, Close=${close}, Diff=${open-close}`);
    
    // Write this to temp for analysis
    fs.writeFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\temp_validate.js", js);
    console.log('Wrote temp_validate.js, length:', js.length);
}
