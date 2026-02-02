
// ═══════════════════════════════════════
// WEATHER SYSTEM
// ═══════════════════════════════════════
let weatherState='clear';let weatherTimer=60+Math.random()*120;
const weatherParticles=[];const MAX_WEATHER_PARTICLES=400;
const weatherOverlay=document.getElementById('weather-overlay');

function startWeather(){
const biome=getBiome(Math.floor(player.position.x),Math.floor(player.position.z));
weatherState=biome===BIOME.SNOW?'snow':'rain';weatherTimer=30+Math.random()*60;
weatherOverlay.style.background=weatherState==='rain'?'rgba(0,0,0,0.15)':'rgba(200,200,220,0.1)';}

function stopWeather(){weatherState='clear';weatherTimer=60+Math.random()*120;weatherOverlay.style.background='transparent';}

function updateWeather(dt){
weatherTimer-=dt;if(weatherTimer<=0){if(weatherState==='clear')startWeather();else stopWeather();}
if(weatherState==='clear'){
for(let i=weatherParticles.length-1;i>=0;i--){scene.remove(weatherParticles[i]);weatherParticles[i].geometry.dispose();
weatherParticles[i].material.dispose();weatherParticles.splice(i,1);}return;}
// Spawn particles
const spawnCount=weatherState==='rain'?3:2;
for(let i=0;i<spawnCount&&weatherParticles.length<MAX_WEATHER_PARTICLES;i++){
const px2=player.position.x+(Math.random()-0.5)*30;
const py2=player.position.y+15+Math.random()*10;
const pz2=player.position.z+(Math.random()-0.5)*30;
let geo,mat;
if(weatherState==='rain'){geo=new THREE.BoxGeometry(0.03,0.4,0.03);mat=new THREE.MeshBasicMaterial({color:0x6688cc,transparent:true,opacity:0.4});}
else{geo=new THREE.BoxGeometry(0.08,0.08,0.08);mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.7});}
const mesh=new THREE.Mesh(geo,mat);mesh.position.set(px2,py2,pz2);
mesh.userData.vy=weatherState==='rain'?-12-Math.random()*4:-1.5-Math.random()*1;
mesh.userData.vx=weatherState==='snow'?(Math.random()-0.5)*1.5:0;
scene.add(mesh);weatherParticles.push(mesh);}
// Update particles
for(let i=weatherParticles.length-1;i>=0;i--){const p=weatherParticles[i];
p.position.y+=p.userData.vy*dt;p.position.x+=p.userData.vx*dt;
if(p.position.y<0||p.position.y<player.position.y-10||isBlockSolid(Math.floor(p.position.x),Math.floor(p.position.y),Math.floor(p.position.z))){
scene.remove(p);p.geometry.dispose();p.material.dispose();weatherParticles.splice(i,1);}}}

// ═══════════════════════════════════════
// CHEST SYSTEM
// ═══════════════════════════════════════
let chestOpen=false;let openChestPos=null;
const chestOverlay=document.getElementById('chest-overlay');
const chestGrid=document.getElementById('chest-grid');
const chestPlayerGrid=document.getElementById('chest-player-grid');

function getChestInv(x,y,z){const key=`${x},${y},${z}`;
if(!chestInventories.has(key)){chestInventories.set(key,new Array(27).fill(null));}
return chestInventories.get(key);}

function openChestUI(x,y,z){chestOpen=true;openChestPos={x,y,z};
chestOverlay.style.display='flex';document.exitPointerLock();
renderChestUI();}

function renderChestUI(){
if(!openChestPos)return;
const inv=getChestInv(openChestPos.x,openChestPos.y,openChestPos.z);
chestGrid.innerHTML='';chestPlayerGrid.innerHTML='';
for(let i=0;i<27;i++){const div=document.createElement('div');div.className='chest-slot';
const slot=inv[i];if(slot){const preview=drawSlotPreview(slot,32);div.appendChild(preview);
if(slot.count>1){const cnt=document.createElement('span');cnt.className='cs-count';cnt.textContent=slot.count;div.appendChild(cnt);}}
div.onclick=(()=>{const idx=i;return()=>{
const held=hotbarSlots[player.selectedSlot];const chest=inv[idx];
inv[idx]=held?{...held}:null;hotbarSlots[player.selectedSlot]=chest?{...chest}:null;
renderHotbar();renderChestUI();};})();
chestGrid.appendChild(div);}
for(let i=0;i<9;i++){const div=document.createElement('div');div.className='chest-slot';
const slot=hotbarSlots[i];if(slot){const preview=drawSlotPreview(slot,32);div.appendChild(preview);
if(slot.count>1){const cnt=document.createElement('span');cnt.className='cs-count';cnt.textContent=slot.count;div.appendChild(cnt);}}
div.onclick=(()=>{const idx=i;return()=>{player.selectedSlot=idx;renderHotbar();renderChestUI();};})();
chestPlayerGrid.appendChild(div);}}

function closeChest(){chestOpen=false;openChestPos=null;chestOverlay.style.display='none';renderer.domElement.requestPointerLock();}

// ═══════════════════════════════════════
// SAVE / LOAD SYSTEM
// ═══════════════════════════════════════
const SAVE_KEY='voxelcraft_save';let autoSaveTimer=60;

function saveWorld(){
try{const data={
seeds:{a:worldSeed,b:worldSeedB,c:worldSeedC},
world:btoa(String.fromCharCode(...world)),
blockChanges:Array.from(blockChanges.entries()),
doorStates:Array.from(doorStates.entries()),
chestInventories:Array.from(chestInventories.entries()).map(([k,v])=>[k,v]),
player:{x:player.position.x,y:player.position.y,z:player.position.z,
health:player.health,hunger:player.hunger,yaw:player.yaw,pitch:player.pitch},
hotbarSlots:hotbarSlots,hotbarPage:hotbarPage,
hotbarPages:HOTBAR_PAGES,
stats:playerStats,dayTime:dayTime,
weatherState,weatherTimer};
localStorage.setItem(SAVE_KEY,JSON.stringify(data));
localStorage.setItem('voxelcraft_seeds',JSON.stringify(data.seeds));
}catch(e){console.warn('Save failed:',e);}}

function loadWorld(){
try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
const data=JSON.parse(raw);
if(data.seeds){worldSeed=data.seeds.a;worldSeedB=data.seeds.b;worldSeedC=data.seeds.c;}
if(data.world){const bin=atob(data.world);for(let i=0;i<bin.length&&i<world.length;i++)world[i]=bin.charCodeAt(i);}
if(data.blockChanges){blockChanges.clear();for(const[k,v]of data.blockChanges)blockChanges.set(k,v);}
if(data.doorStates){doorStates.clear();for(const[k,v]of data.doorStates)doorStates.set(k,v);}
if(data.chestInventories){chestInventories.clear();for(const[k,v]of data.chestInventories)chestInventories.set(k,v);}
if(data.player){player.position.set(data.player.x,data.player.y,data.player.z);
player.health=data.player.health;player.hunger=data.player.hunger;
player.yaw=data.player.yaw||0;player.pitch=data.player.pitch||0;}
if(data.hotbarSlots)hotbarSlots=data.hotbarSlots;
if(data.hotbarPage!==undefined)hotbarPage=data.hotbarPage;
if(data.hotbarPages){for(let i=0;i<HOTBAR_PAGES.length&&i<data.hotbarPages.length;i++)HOTBAR_PAGES[i]=data.hotbarPages[i];}
if(data.stats){Object.assign(playerStats,data.stats);}
if(data.dayTime!==undefined)dayTime=data.dayTime;
if(data.weatherState)weatherState=data.weatherState;
if(data.weatherTimer!==undefined)weatherTimer=data.weatherTimer;
return true;}catch(e){console.warn('Load failed:',e);return false;}}

function newWorld(){
localStorage.removeItem(SAVE_KEY);localStorage.removeItem('voxelcraft_seeds');
location.reload();}

document.getElementById('new-world-btn').onclick=function(e){e.stopPropagation();newWorld();};
if(localStorage.getItem(SAVE_KEY)){document.getElementById('new-world-btn').style.display='inline-block';}

// ═══════════════════════════════════════
// DAY/NIGHT CYCLE
// ═══════════════════════════════════════
let dayTime=0.25;
function isDaytime(){return dayTime>0.05&&dayTime<0.55;}
function getDayBrightness(){if(dayTime>0.1&&dayTime<0.5)return 1;if(dayTime<=0.1)return dayTime/0.1;if(dayTime>=0.5)return Math.max(0,1-(dayTime-0.5)/0.1);return 0;}

function updateDayNight(dt){
dayTime+=dt/DAY_CYCLE;if(dayTime>1)dayTime-=1;
const brightness=getDayBrightness();const angle2=dayTime*Math.PI*2;
const sx=Math.cos(angle2)*80,sy=Math.sin(angle2)*80;
sunMesh.position.set(player.position.x+sx,sy+20,player.position.z);
moonMesh.position.set(player.position.x-sx,-sy+20,player.position.z);
sunMesh.visible=sy>-10;moonMesh.visible=sy<10;
dirLight.intensity=brightness*0.85;dirLight.position.set(sx,Math.abs(sy)+10,30);
ambientLight.intensity=0.08+brightness*0.5;hemiLight.intensity=brightness*0.25;
const skyBr=Math.max(0.05,brightness);
const dayTop=new THREE.Color(0x0055bb);const nightTop=new THREE.Color(0x000520);
const dayBot=new THREE.Color(0x87ceeb);const nightBot=new THREE.Color(0x0a0a20);
skyUniforms.topColor.value.copy(nightTop).lerp(dayTop,skyBr);
skyUniforms.bottomColor.value.copy(nightBot).lerp(dayBot,skyBr);
skyUniforms.sunDir.value.set(sx,sy,0).normalize();
const bgCol=new THREE.Color().copy(skyUniforms.bottomColor.value);
scene.background=bgCol;
if(scene.fog)scene.fog.color.copy(bgCol);
if(weatherState!=='clear'){
const darkFactor=0.7;
scene.background.multiplyScalar(darkFactor);
if(scene.fog)scene.fog.color.multiplyScalar(darkFactor);}}

// ═══════════════════════════════════════
// INPUT HANDLING
// ═══════════════════════════════════════
const keys={};let isLocked=false;
document.addEventListener('keydown',e=>{keys[e.code]=true;
if(e.code==='KeyE'&&isLocked&&!craftingOpen&&!chestOpen){if(inventoryOpen)closeInventory();else openInventory();e.preventDefault();}
if(e.code==='KeyC'&&isLocked&&!inventoryOpen&&!chestOpen){if(craftingOpen)closeCrafting();else openCrafting();e.preventDefault();}
if(e.code==='Escape'){if(inventoryOpen)closeInventory();if(craftingOpen)closeCrafting();if(chestOpen)closeChest();}
if(e.code.startsWith('Digit')&&isLocked){const n=parseInt(e.code.charAt(5))-1;if(n>=0&&n<9)player.selectedSlot=n;renderHotbar();}});
document.addEventListener('keyup',e=>{keys[e.code]=false;});

const blocker=document.getElementById('blocker');
blocker.addEventListener('click',e=>{if(e.target.id==='new-world-btn')return;renderer.domElement.requestPointerLock();});
document.addEventListener('pointerlockchange',()=>{isLocked=!!document.pointerLockElement;blocker.style.display=isLocked?'none':'flex';
if(isLocked)initAudio();});

document.addEventListener('mousemove',e=>{if(!isLocked||inventoryOpen||craftingOpen||chestOpen)return;
player.yaw-=e.movementX*0.002;player.pitch-=e.movementY*0.002;
player.pitch=Math.max(-Math.PI/2+0.01,Math.min(Math.PI/2-0.01,player.pitch));});

document.addEventListener('mousedown',e=>{if(!isLocked)return;
if(e.button===0){breakingState.mouseDown=true;
const currentSlot=hotbarSlots[player.selectedSlot];
if(isSlotSword(currentSlot)&&player.attackCooldown<=0){
player.attackCooldown=0.4;handSwing=1;playSound('hit');
const dir=getForwardDir();
for(const z of [...zombies]){const dx=z.x-camera.position.x,dy=z.y+0.8-camera.position.y,dz2=z.z-camera.position.z;
const dist=Math.sqrt(dx*dx+dy*dy+dz2*dz2);if(dist<ATTACK_REACH){const dot=dx*dir.x+dy*dir.y+dz2*dir.z;
if(dot>0&&dot/dist>0.6){damageZombie(z,getSwordDamage(currentSlot));break;}}}
for(const m of [...passiveMobs]){const dx=m.x-camera.position.x,dy=m.y+0.5-camera.position.y,dz2=m.z-camera.position.z;
const dist=Math.sqrt(dx*dx+dy*dy+dz2*dz2);if(dist<ATTACK_REACH){const dot=dx*dir.x+dy*dir.y+dz2*dir.z;
if(dot>0&&dot/dist>0.5){damagePassiveMob(m,getSwordDamage(currentSlot));
m.fleeTimer=3;m.fleeAngle=Math.atan2(m.z-player.position.z,m.x-player.position.x);break;}}}}}
if(e.button===2){e.preventDefault();
const currentSlot=hotbarSlots[player.selectedSlot];
if(isSlotFood(currentSlot)&&player.hunger<10){player.isEating=true;return;}
const dir=getForwardDir();const hit=raycast(camera.position,dir,REACH);
if(hit){
// Door interaction
if(hit.block===BLOCK.DOOR_BOTTOM||hit.block===BLOCK.DOOR_TOP){
let doorY=hit.y;if(hit.block===BLOCK.DOOR_TOP)doorY=hit.y-1;
const key=`${hit.x},${doorY},${hit.z}`;doorStates.set(key,!doorStates.get(key));
rebuildChunkAt(hit.x,hit.z);playSound('place');return;}
// Chest interaction
if(hit.block===BLOCK.CHEST){openChestUI(hit.x,hit.y,hit.z);return;}
// Place block
if(currentSlot&&currentSlot.type==='block'){const px2=hit.prevX,py=hit.prevY,pz=hit.prevZ;
if(py>=0&&py<WORLD_HEIGHT&&canPlaceBlock(px2,py,pz)&&getBlock(px2,py,pz)===BLOCK.AIR){
if(currentSlot.block===BLOCK.DOOR_BOTTOM){
if(py+1<WORLD_HEIGHT&&getBlock(px2,py+1,pz)===BLOCK.AIR&&canPlaceBlock(px2,py+1,pz)){
setBlock(px2,py,pz,BLOCK.DOOR_BOTTOM);setBlock(px2,py+1,pz,BLOCK.DOOR_TOP);
}else return;
}else{setBlock(px2,py,pz,currentSlot.block);}
if(currentSlot.block===BLOCK.TORCH)addTorchLight(px2,py,pz);
playSound('place');handSwing=1;
currentSlot.count--;if(currentSlot.count<=0)hotbarSlots[player.selectedSlot]=null;renderHotbar();}}}
}});

document.addEventListener('mouseup',e=>{if(e.button===0){breakingState.mouseDown=false;}
if(e.button===2){player.isEating=false;player.eatTimer=0;}});
document.addEventListener('contextmenu',e=>e.preventDefault());

document.addEventListener('wheel',e=>{if(!isLocked)return;
if(e.shiftKey){switchHotbarPage(hotbarPage+(e.deltaY>0?1:-1));}
else{player.selectedSlot=(player.selectedSlot+(e.deltaY>0?1:-1)+9)%9;renderHotbar();}});
