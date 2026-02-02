const fs = require('fs');
const code = fs.readFileSync("C:\\Users\\RisingForce\\Documents\\atom's worst templates\\minecraft\\index.html", 'utf8');

// Find all occurrences of key functions
const funcs = ['function checkCollision', 'function canPlaceBlock', 'function createZombieMesh', 
               'function raycast', 'function getForwardDir', 'const zombies=', 'function collideAxis',
               'function spawnZombie', 'const ZOMBIE_SPEED'];

for (const f of funcs) {
    let idx = 0;
    const positions = [];
    while (true) {
        const found = code.indexOf(f, idx);
        if (found < 0) break;
        positions.push(found);
        idx = found + 1;
    }
    console.log(`${f}: found ${positions.length} time(s) at bytes [${positions.join(', ')}]`);
}

// Show what's between byte 69000-72000 (the transition area)
console.log('\n=== Bytes 66000-67000 ===');
console.log(code.substring(66000, 67000));
