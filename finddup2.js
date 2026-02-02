const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');

// Search for the version of checkCollision with (px,py,pz)
let idx = code.indexOf('checkCollision(px');
console.log('checkCollision(px...) at:', idx);

// Search for isSolid
idx = code.indexOf('function isSolid');
console.log('function isSolid at:', idx);

// Find the SECOND script tag and show from there to spawnZombie
const s1 = code.indexOf("<script>");
const s2 = code.indexOf("<script>", s1 + 1);
console.log('Script tags at:', s1, s2);

// Show bytes around 68000-68600 (just before raycasting)
console.log('\n=== Bytes 67500-68600 (before raycast) ===');
console.log(code.substring(67500, 68600));
