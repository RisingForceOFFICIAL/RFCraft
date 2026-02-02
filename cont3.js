
// ═══════════════════════════════════════
// PLAYER DAMAGE & DEATH
// ═══════════════════════════════════════
const damageFlash=document.getElementById('damage-flash');
function damagePlayer(amt,cause){if(player.isDead)return;
player.health=Math.max(0,player.health-amt);player.lastDamageCause=cause;
damageFlash.style.background='rgba(255,0,0,0.35)';setTimeout(()=>{damageFlash.style.background='rgba(255,0,0,0)';},200);
if(player.health<=0)killPlayer();}

function killPlayer(){player.isDead=true;
const deathScreen=document.getElementById('death-screen');deathScreen.style.display='flex';
let causeText='You died!';
if(player.lastDamageCause==='fall')causeText='Hit the ground too hard';
else if(player.lastDamageCause==='zombie')causeText='Was slain by a zombie';
else if(player.lastDamageCause==='void')causeText='Fell out of the world';
else if(player.lastDamageCause==='lava')causeText='Tried to swim in lava';
document.getElementById('death-cause').textContent=causeText;
document.getElementById('death-score').innerHTML=`Blocks broken: ${playerStats.blocksbroken}<br>Mobs killed: ${playerStats.mobskilled}`;
document.exitPointerLock();}

document.getElementById('respawn-btn').onclick=()=>{
player.isDead=false;player.health=10;player.hunger=10;player.velocity.set(0,0,0);
player.fallStartY=null;
const spawnPos=findSpawnPoint();player.position.set(spawnPos.x,spawnPos.y,spawnPos.z);
document.getElementById('death-screen').style.display='none';
renderer.domElement.requestPointerLock();};

// ═══════════════════════════════════════
// PLAYER PHYSICS UPDATE
// ═══════════════════════════════════════
let stepTimer=0;

function updatePlayer(dt){
if(player.isDead)return;
player.attackCooldown=Math.max(0,player.attackCooldown-dt);

// Eating
if(player.isEating){const currentSlot=hotbarSlots[player.selectedSlot];
if(isSlotFood(currentSlot)&&player.hunger<10){player.eatTimer+=dt;
if(player.eatTimer>=1){player.eatTimer=0;const data=ITEM_DATA[currentSlot.item];
player.hunger=Math.min(10,player.hunger+data.hunger);playSound('eat');
currentSlot.count--;if(currentSlot.count<=0)hotbarSlots[player.selectedSlot]=null;renderHotbar();
player.isEating=false;}}else{player.isEating=false;player.eatTimer=0;}}

// Hunger drain
if(Math.random()<0.001*dt){player.hunger=Math.max(0,player.hunger-0.15);}
if(player.hunger<=0&&Math.random()<0.005*dt){damagePlayer(1,'starvation');}
if(player.hunger>8&&player.health<10&&Math.random()<0.01*dt){player.health=Math.min(10,player.health+0.5);}

// Movement
const moveDir=new THREE.Vector3();const fwd=new THREE.Vector3();camera.getWorldDirection(fwd);fwd.y=0;fwd.normalize();
const right=new THREE.Vector3().crossVectors(fwd,new THREE.Vector3(0,1,0)).normalize();
if(keys['KeyW'])moveDir.add(fwd);if(keys['KeyS'])moveDir.sub(fwd);
if(keys['KeyA'])moveDir.sub(right);if(keys['KeyD'])moveDir.add(right);
if(moveDir.length()>0)moveDir.normalize();

player.isSprinting=!!keys['ControlLeft']&&moveDir.length()>0&&player.hunger>2;
const speed=player.isSprinting?SPRINT_SPEED:MOVE_SPEED;
if(player.isSprinting&&Math.random()<0.02*dt)player.hunger=Math.max(0,player.hunger-0.1);

// Water detection
const headBlock=getBlock(Math.floor(player.position.x),Math.floor(player.position.y+1.5),Math.floor(player.position.z));
const feetBlock=getBlock(Math.floor(player.position.x),Math.floor(player.position.y),Math.floor(player.position.z));
player.inWater=headBlock===BLOCK.WATER||feetBlock===BLOCK.WATER;

// Lava damage
if(feetBlock===BLOCK.LAVA||headBlock===BLOCK.LAVA){if(Math.random()<2*dt)damagePlayer(1,'lava');}

const waterSpeedMul=player.inWater?0.5:1;
const vx=moveDir.x*speed*waterSpeedMul,vz=moveDir.z*speed*waterSpeedMul;

// Horizontal collision
const newX=player.position.x+vx*dt;const newZ=player.position.z+vz*dt;
if(!checkCollision(newX,player.position.y,player.position.z))player.position.x=newX;
if(!checkCollision(player.position.x,player.position.y,newZ))player.position.z=newZ;

// Gravity & Jumping
if(player.inWater){
player.velocity.y*=0.9;
if(keys['Space'])player.velocity.y=3.5;
else if(!keys['ShiftLeft'])player.velocity.y=Math.max(player.velocity.y,-2);
}else{
player.velocity.y-=GRAVITY*dt;
if(keys['Space']&&player.onGround){player.velocity.y=JUMP_FORCE;player.onGround=false;playSound('jump');}}

const newY=player.position.y+player.velocity.y*dt;
if(!checkCollision(player.position.x,newY,player.position.z)){
player.position.y=newY;player.onGround=false;
}else{
if(player.velocity.y<0){
player.onGround=true;
// Fall damage
if(player.fallStartY!==null){const fallDist=player.fallStartY-player.position.y;
if(fallDist>4.5){const dmg=Math.ceil((fallDist-4.5)*1.2);damagePlayer(dmg,'fall');}}
player.fallStartY=null;
}else{player.onGround=false;}
player.velocity.y=0;}

if(!player.onGround&&player.velocity.y<0&&player.fallStartY===null)player.fallStartY=player.position.y;

// Clamp to world
player.position.x=Math.max(0.5,Math.min(WORLD_SIZE-0.5,player.position.x));
player.position.z=Math.max(0.5,Math.min(WORLD_SIZE-0.5,player.position.z));
if(player.position.y<-10){damagePlayer(99,'void');player.position.y=WORLD_HEIGHT;}

// Step sounds
if(player.onGround&&moveDir.length()>0){stepTimer+=dt*(player.isSprinting?2:1);
if(stepTimer>0.45){stepTimer=0;playSound('step');}}

// Camera
camera.position.set(player.position.x,player.position.y+PLAYER_HEIGHT-0.1,player.position.z);
camera.rotation.order='YXZ';camera.rotation.y=player.yaw;camera.rotation.x=player.pitch;

// FOV
const targetFov=player.isSprinting?100:player.baseFov;
camera.fov+=(targetFov-camera.fov)*dt*8;camera.updateProjectionMatrix();}

// ═══════════════════════════════════════
// HAND RENDERING
// ═══════════════════════════════════════
const handCanvas=document.getElementById('hand-canvas');
const handCtx=handCanvas.getContext('2d');
let handSwing=0;let handBob=0;

function renderHand(dt){
handBob+=dt*(player.onGround&&(keys['KeyW']||keys['KeyS']||keys['KeyA']||keys['KeyD'])?(player.isSprinting?12:8):0);
if(handSwing>0)handSwing=Math.max(0,handSwing-dt*5);
const bobX=Math.sin(handBob)*8;const bobY=Math.abs(Math.cos(handBob))*6;
const swingRot=handSwing*0.8;
handCtx.clearRect(0,0,450,600);handCtx.save();
handCtx.translate(270+bobX,420+bobY);handCtx.rotate(-swingRot);

const currentSlot=hotbarSlots[player.selectedSlot];
if(isSlotSword(currentSlot)){
const data=ITEM_DATA[currentSlot.item];
handCtx.save();handCtx.rotate(-0.6);
handCtx.fillStyle=data.color;handCtx.fillRect(-8,-120,16,100);
handCtx.fillStyle='#654321';handCtx.fillRect(-12,-20,24,14);
handCtx.fillRect(-6,-6,12,35);handCtx.restore();
}
// Arm
handCtx.fillStyle='#d4a574';
handCtx.fillRect(-30,0,80,140);
handCtx.fillStyle='#c49464';
handCtx.fillRect(-30,0,80,6);
if(currentSlot&&currentSlot.type==='block'){
const tm=BLOCK_TEX_MAP[currentSlot.block];
if(tm){const img=getTexImg(tm.side);if(img){const tmp=document.createElement('canvas');
tmp.width=tmp.height=16;tmp.getContext('2d').putImageData(img,0,0);
handCtx.imageSmoothingEnabled=false;handCtx.drawImage(tmp,-45,-65,55,55);}}}
handCtx.restore();}

// ═══════════════════════════════════════
// MINIMAP
// ═══════════════════════════════════════
const minimapCanvas=document.getElementById('minimap');
const minimapCtx=minimapCanvas.getContext('2d');

function renderMinimap(){
const mc=minimapCtx;mc.fillStyle='#1a1a2e';mc.fillRect(0,0,120,120);
const cx=Math.floor(player.position.x),cz=Math.floor(player.position.z);
const r=30;
for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){
const wx=cx+dx,wz=cz+dz;if(wx<0||wx>=WORLD_SIZE||wz<0||wz>=WORLD_SIZE)continue;
let topBlock=BLOCK.AIR;for(let y=WORLD_HEIGHT-1;y>=0;y--){const b=getBlock(wx,y,wz);if(b!==BLOCK.AIR){topBlock=b;break;}}
let col='#333';
if(topBlock===BLOCK.GRASS)col='#4a8';else if(topBlock===BLOCK.WATER||topBlock===BLOCK.ICE)col='#36c';
else if(topBlock===BLOCK.SAND)col='#da4';else if(topBlock===BLOCK.SNOW)col='#eef';
else if(topBlock===BLOCK.STONE)col='#888';else if(topBlock===BLOCK.WOOD)col='#642';
else if(topBlock===BLOCK.LEAVES)col='#2a6';else if(topBlock===BLOCK.DIRT)col='#864';
else if(topBlock===BLOCK.LAVA)col='#f40';else if(topBlock!==BLOCK.AIR)col='#666';
const mx=60+(dx*2),mz=60+(dz*2);mc.fillStyle=col;mc.fillRect(mx,mz,2,2);}
mc.fillStyle='#fff';mc.fillRect(59,59,3,3);
for(const z of zombies){const zx=60+(z.x-cx)*2,zz=60+(z.z-cz)*2;if(zx>0&&zx<120&&zz>0&&zz<120){mc.fillStyle='#f00';mc.fillRect(zx,zz,2,2);}}
for(const m of passiveMobs){const mx=60+(m.x-cx)*2,mz=60+(m.z-cz)*2;if(mx>0&&mx<120&&mz>0&&mz<120){mc.fillStyle='#0f0';mc.fillRect(mx,mz,2,2);}}}

// ═══════════════════════════════════════
// HUD UPDATES
// ═══════════════════════════════════════
const debugEl=document.getElementById('debug');
const healthBar=document.getElementById('health-bar');
const hungerBar=document.getElementById('hunger-bar');
const timeIndicator=document.getElementById('time-indicator');

function updateHUD(){
const px=player.position.x.toFixed(1),py=player.position.y.toFixed(1),pz=player.position.z.toFixed(1);
const biome=BIOME_NAMES[getBiome(Math.floor(player.position.x),Math.floor(player.position.z))];
const fps=Math.round(1/Math.max(0.001,lastDt));
debugEl.textContent=`XYZ: ${px} / ${py} / ${pz}\nBiome: ${biome}\nFPS: ${fps}\nMobs: ${zombies.length}z ${passiveMobs.length}a\nPage: ${hotbarPage+1}/4`;

let hh='';for(let i=0;i<10;i++){const full=player.health>i;
hh+=`<span class="heart" style="color:${full?'#e33':'#444'}">${full?'❤':'♡'}</span>`;}
healthBar.innerHTML=hh;

let hn='';for(let i=0;i<10;i++){const full=player.hunger>i;
hn+=`<span class="hunger" style="color:${full?'#c80':'#444'}">${full?'🍗':'🍖'}</span>`;}
hungerBar.innerHTML=hn;

const hours=Math.floor(dayTime*24);const mins=Math.floor((dayTime*24-hours)*60);
const ampm=hours>=12?'PM':'AM';const h12=hours%12||12;
const dayNight=isDaytime()?'☀️ Day':'🌙 Night';
const weatherText=weatherState==='clear'?'':weatherState==='rain'?' 🌧️ Rain':' 🌨️ Snow';
timeIndicator.textContent=`${dayNight} ${h12}:${mins.toString().padStart(2,'0')} ${ampm}${weatherText}`;}
