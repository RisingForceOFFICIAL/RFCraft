const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');
const idx = code.indexOf('if(inLava)');
console.log('inLava at byte:', idx);
if (idx >= 0) {
    const context = code.substring(Math.max(0,idx-200), idx+200);
    console.log('Context around inLava:');
    console.log(context);
}
console.log('---');
// Also find spawnZombie function 
const idx2 = code.indexOf('function spawnZombie');
console.log('spawnZombie at byte:', idx2);
if (idx2 >= 0) {
    const context2 = code.substring(Math.max(0,idx2-100), Math.min(code.length, idx2+300));
    console.log('Context around spawnZombie:');
    console.log(context2);
}
