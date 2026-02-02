
// ═══════════════════════════════════════
// CLOUD UPDATE
// ═══════════════════════════════════════
function updateClouds(dt){
for(const cloud of cloudGroup.children){
cloud.position.x+=cloud.userData.speed*dt;
if(cloud.position.x>WORLD_SIZE*1.5)cloud.position.x=-WORLD_SIZE*0.5;
// Darken clouds in weather
const targetOp=weatherState==='clear'?0.7:0.4;
cloud.children.forEach(m=>{m.material.opacity+=(targetOp-m.material.opacity)*dt;});}}

// ═══════════════════════════════════════
// FIND SPAWN POINT
// ═══════════════════════════════════════
function findSpawnPoint(){
const cx=Math.floor(WORLD_SIZE/2),cz=Math.floor(WORLD_SIZE/2);
for(let r=0;r<20;r++){for(let a=0;a<8;a++){
const x=cx+Math.floor(Math.cos(a*Math.PI/4)*r*3);
const z=cz+Math.floor(Math.sin(a*Math.PI/4)*r*3);
if(x<1||x>=WORLD_SIZE-1||z<1||z>=WORLD_SIZE-1)continue;
for(let y=WORLD_HEIGHT-2;y>SEA_LEVEL;y--){
const b=getBlock(x,y,z);if(b!==BLOCK.AIR&&b!==BLOCK.WATER&&b!==BLOCK.LAVA&&getBlock(x,y+1,z)===BLOCK.AIR&&getBlock(x,y+2,z)===BLOCK.AIR){
return{x:x+0.5,y:y+1,z:z+0.5};}}}}
return{x:WORLD_SIZE/2,y:WORLD_HEIGHT-5,z:WORLD_SIZE/2};}

// ═══════════════════════════════════════
// GAME LOOP
// ═══════════════════════════════════════
let lastDt=0.016;let lastTime=performance.now();
let minimapTimer=0;let hudTimer=0;let autoSaveTimerVal=60;
let initialized=false;

function init(){
const loaded=loadWorld();
if(!loaded){
generateWorld();
const spawn=findSpawnPoint();
player.position.set(spawn.x,spawn.y,spawn.z);
}
buildAllChunks();
// Rebuild torches
for(let x=0;x<WORLD_SIZE;x++)for(let z=0;z<WORLD_SIZE;z++)for(let y=0;y<WORLD_HEIGHT;y++){
if(getBlock(x,y,z)===BLOCK.TORCH)addTorchLight(x,y,z);}
renderHotbar();
initialized=true;
animate();}

function animate(){
requestAnimationFrame(animate);
const now=performance.now();const dt=Math.min(0.1,(now-lastTime)/1000);lastTime=now;lastDt=dt;

if(!isLocked&&!player.isDead){renderer.render(scene,camera);return;}

updatePlayer(dt);
updateBreaking(dt);
updateDayNight(dt);
updateParticles(dt);
updateZombies(dt);
updatePassiveMobs(dt);
updateWeather(dt);
updateClouds(dt);
updateAmbientSounds(dt);
renderHand(dt);

// Block highlight
const dir=getForwardDir();const hit=raycast(camera.position,dir,REACH);
if(hit&&!inventoryOpen&&!craftingOpen&&!chestOpen){
highlightMesh.position.set(hit.x+0.5,hit.y+0.5,hit.z+0.5);highlightMesh.visible=true;
}else{highlightMesh.visible=false;}

// Minimap (every 0.5s)
minimapTimer+=dt;if(minimapTimer>0.5){minimapTimer=0;renderMinimap();}

// HUD (every 0.2s)
hudTimer+=dt;if(hudTimer>0.2){hudTimer=0;updateHUD();}

// Auto-save (every 60s)
autoSaveTimerVal-=dt;if(autoSaveTimerVal<=0){autoSaveTimerVal=60;saveWorld();}

renderer.render(scene,camera);}

// ═══════════════════════════════════════
// WINDOW RESIZE
// ═══════════════════════════════════════
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
renderer.setSize(innerWidth,innerHeight);});

// Save before unload
window.addEventListener('beforeunload',()=>{if(initialized)saveWorld();});

// ═══════════════════════════════════════
// START
// ═══════════════════════════════════════
init();

</script>
</body>
</html>
