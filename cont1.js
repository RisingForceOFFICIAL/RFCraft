
const angle=Math.random()*Math.PI*2;const dist=20+Math.random()*15;
const sx=Math.floor(player.position.x+Math.cos(angle)*dist);
const sz=Math.floor(player.position.z+Math.sin(angle)*dist);
if(sx<1||sx>=WORLD_SIZE-1||sz<1||sz>=WORLD_SIZE-1)return;
let sy=-1;for(let y=WORLD_HEIGHT-1;y>=0;y--){if(isBlockSolid(sx,y,sz)){sy=y+1;break;}}
if(sy<2||sy>=WORLD_HEIGHT-2)return;
const mesh=createZombieMesh();mesh.position.set(sx+0.5,sy,sz+0.5);scene.add(mesh);
zombies.push({mesh,health:10,x:sx+0.5,y:sy,z:sz+0.5,vy:0,attackTimer:0,wanderAngle:Math.random()*Math.PI*2,wanderTimer:0});}

function damageZombie(z,dmg){z.health-=dmg;playSound('mobhurt');
spawnColorParticles(z.x,z.y+1,z.z,0x2d8c2d,5);
if(z.health<=0){playSound('mobdie');scene.remove(z.mesh);
const zi=zombies.indexOf(z);if(zi>=0)zombies.splice(zi,1);
playerStats.mobskilled++;
if(Math.random()<0.3)addItemToInventory(ITEM.RAW_BEEF,1);}}

function updateZombies(dt){
if(!isDaytime()&&Math.random()<0.008*dt&&zombies.length<MAX_ZOMBIES)spawnZombie();
if(isDaytime()){for(let i=zombies.length-1;i>=0;i--){if(Math.random()<0.2*dt){scene.remove(zombies[i].mesh);zombies.splice(i,1);}}}
for(const z of zombies){
const dx=player.position.x-z.x,dz2=player.position.z-z.z;
const dist=Math.sqrt(dx*dx+dz2*dz2);
if(dist<25&&!isDaytime()){
const a=Math.atan2(dz2,dx);const spd=ZOMBIE_SPEED*dt;
const nx=z.x+Math.cos(a)*spd,nz=z.z+Math.sin(a)*spd;
if(!isBlockSolid(Math.floor(nx),Math.floor(z.y),Math.floor(nz))){z.x=nx;z.z=nz;}
else if(isBlockSolid(Math.floor(nx),Math.floor(z.y),Math.floor(nz))&&!isBlockSolid(Math.floor(nx),Math.floor(z.y+1),Math.floor(nz))){z.vy=7;}
z.mesh.rotation.y=Math.atan2(-dx,-dz2);
}else{
z.wanderTimer-=dt;if(z.wanderTimer<=0){z.wanderAngle=Math.random()*Math.PI*2;z.wanderTimer=2+Math.random()*3;}
const nx=z.x+Math.cos(z.wanderAngle)*1.5*dt,nz=z.z+Math.sin(z.wanderAngle)*1.5*dt;
if(!isBlockSolid(Math.floor(nx),Math.floor(z.y),Math.floor(nz))){z.x=nx;z.z=nz;}}
z.vy-=GRAVITY*dt;z.y+=z.vy*dt;
const by=Math.floor(z.y);if(by>=0&&isBlockSolid(Math.floor(z.x),by,Math.floor(z.z))){z.y=by+1;z.vy=0;}
if(z.y<0){z.y=WORLD_HEIGHT;z.vy=0;}
z.x=Math.max(1,Math.min(WORLD_SIZE-2,z.x));z.z=Math.max(1,Math.min(WORLD_SIZE-2,z.z));
z.mesh.position.set(z.x,z.y,z.z);
const ws=dist<25&&!isDaytime()?8:4;const t=performance.now()/1000;
if(z.mesh.children[5])z.mesh.children[5].rotation.x=Math.sin(t*ws)*0.5;
if(z.mesh.children[6])z.mesh.children[6].rotation.x=Math.sin(t*ws+Math.PI)*0.5;
if(dist<1.8&&!player.isDead){z.attackTimer-=dt;if(z.attackTimer<=0){z.attackTimer=1;damagePlayer(1,'zombie');}}}}

// ═══════════════════════════════════════
// PASSIVE MOBS (Cows, Pigs, Chickens)
// ═══════════════════════════════════════
const passiveMobs=[];const MAX_PASSIVE_MOBS=12;
const MOB_TYPES={COW:0,PIG:1,CHICKEN:2};
const MOB_COLORS={
[MOB_TYPES.COW]:{body:0x6b4226,head:0x8b6240,spots:0xf5f5dc},
[MOB_TYPES.PIG]:{body:0xe8a0a0,head:0xf0b0b0,snout:0xd08080},
[MOB_TYPES.CHICKEN]:{body:0xf5f5f0,head:0xf0e0d0,beak:0xff8800,comb:0xdd2222}};

function createPassiveMobMesh(type){
const group=new THREE.Group();
if(type===MOB_TYPES.COW){
const body=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.6,1.0),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].body}));
body.position.y=0.6;group.add(body);
const head=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.45,0.45),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].head}));
head.position.set(0,0.85,0.55);group.add(head);
for(let i=0;i<4;i++){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.35,0.15),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].body}));
leg.position.set(i<2?-0.2:0.2,0.15,i%2===0?-0.3:0.3);group.add(leg);}
// spots
const spot=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.25,0.01),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].spots}));
spot.position.set(0.1,0.7,0.51);group.add(spot);
}else if(type===MOB_TYPES.PIG){
const body=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.8),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].body}));
body.position.y=0.45;group.add(body);
const head=new THREE.Mesh(new THREE.BoxGeometry(0.45,0.4,0.4),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].head}));
head.position.set(0,0.6,0.45);group.add(head);
const snout=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.15,0.1),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].snout}));
snout.position.set(0,0.55,0.65);group.add(snout);
for(let i=0;i<4;i++){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.25,0.12),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].body}));
leg.position.set(i<2?-0.18:0.18,0.1,i%2===0?-0.25:0.25);group.add(leg);}
}else{
const body=new THREE.Mesh(new THREE.BoxGeometry(0.35,0.3,0.45),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].body}));
body.position.y=0.35;group.add(body);
const head=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.25,0.25),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].head}));
head.position.set(0,0.55,0.2);group.add(head);
const beak=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.06,0.12),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].beak}));
beak.position.set(0,0.5,0.35);group.add(beak);
const comb=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.1,0.06),new THREE.MeshLambertMaterial({color:MOB_COLORS[type].comb}));
comb.position.set(0,0.7,0.18);group.add(comb);
for(let i=0;i<2;i++){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.2,0.05),new THREE.MeshLambertMaterial({color:0xddaa00}));
leg.position.set(i===0?-0.08:0.08,0.1,0);group.add(leg);}}
return group;}

function spawnPassiveMob(){if(passiveMobs.length>=MAX_PASSIVE_MOBS)return;
const type=[MOB_TYPES.COW,MOB_TYPES.PIG,MOB_TYPES.CHICKEN][Math.floor(Math.random()*3)];
const angle=Math.random()*Math.PI*2;const dist=15+Math.random()*25;
const sx=Math.floor(player.position.x+Math.cos(angle)*dist);
const sz=Math.floor(player.position.z+Math.sin(angle)*dist);
if(sx<1||sx>=WORLD_SIZE-1||sz<1||sz>=WORLD_SIZE-1)return;
let sy=-1;for(let y=WORLD_HEIGHT-1;y>=0;y--){const b=getBlock(sx,y,sz);if(b===BLOCK.GRASS){sy=y+1;break;}}
if(sy<2||sy>=WORLD_HEIGHT-2)return;
const mesh=createPassiveMobMesh(type);mesh.position.set(sx+0.5,sy,sz+0.5);scene.add(mesh);
passiveMobs.push({mesh,type,health:type===MOB_TYPES.CHICKEN?4:8,x:sx+0.5,y:sy,z:sz+0.5,vy:0,
wanderAngle:Math.random()*Math.PI*2,wanderTimer:1+Math.random()*4,fleeTimer:0,fleeAngle:0});}

function damagePassiveMob(m,dmg){m.health-=dmg;playSound('mobhurt');
const col=m.type===MOB_TYPES.COW?0x6b4226:m.type===MOB_TYPES.PIG?0xe8a0a0:0xf5f5f0;
spawnColorParticles(m.x,m.y+0.5,m.z,col,4);
if(m.health<=0){playSound('mobdie');scene.remove(m.mesh);
const mi=passiveMobs.indexOf(m);if(mi>=0)passiveMobs.splice(mi,1);
playerStats.mobskilled++;
if(m.type===MOB_TYPES.COW)addItemToInventory(ITEM.RAW_BEEF,1+Math.floor(Math.random()*2));
else if(m.type===MOB_TYPES.PIG)addItemToInventory(ITEM.RAW_PORK,1+Math.floor(Math.random()*2));
else addItemToInventory(ITEM.RAW_CHICKEN,1);}}

function updatePassiveMobs(dt){
if(isDaytime()&&Math.random()<0.005*dt&&passiveMobs.length<MAX_PASSIVE_MOBS)spawnPassiveMob();
for(const m of passiveMobs){
const dx=player.position.x-m.x,dz2=player.position.z-m.z;
const dist=Math.sqrt(dx*dx+dz2*dz2);
if(m.fleeTimer>0){m.fleeTimer-=dt;
const nx=m.x+Math.cos(m.fleeAngle)*4*dt,nz=m.z+Math.sin(m.fleeAngle)*4*dt;
if(!isBlockSolid(Math.floor(nx),Math.floor(m.y),Math.floor(nz))){m.x=nx;m.z=nz;}
m.mesh.rotation.y=m.fleeAngle+Math.PI;
}else{
m.wanderTimer-=dt;if(m.wanderTimer<=0){m.wanderAngle=Math.random()*Math.PI*2;m.wanderTimer=2+Math.random()*5;}
const spd=m.type===MOB_TYPES.CHICKEN?1.2:0.8;
const nx=m.x+Math.cos(m.wanderAngle)*spd*dt,nz=m.z+Math.sin(m.wanderAngle)*spd*dt;
if(!isBlockSolid(Math.floor(nx),Math.floor(m.y),Math.floor(nz))){m.x=nx;m.z=nz;}
m.mesh.rotation.y=m.wanderAngle+Math.PI;}
m.vy-=GRAVITY*dt;m.y+=m.vy*dt;
const by=Math.floor(m.y);if(by>=0&&isBlockSolid(Math.floor(m.x),by,Math.floor(m.z))){m.y=by+1;m.vy=0;}
if(m.y<0){m.y=WORLD_HEIGHT;m.vy=0;}
m.x=Math.max(1,Math.min(WORLD_SIZE-2,m.x));m.z=Math.max(1,Math.min(WORLD_SIZE-2,m.z));
m.mesh.position.set(m.x,m.y,m.z);
if(dist>60){scene.remove(m.mesh);const mi=passiveMobs.indexOf(m);if(mi>=0){passiveMobs.splice(mi,1);break;}}}}
