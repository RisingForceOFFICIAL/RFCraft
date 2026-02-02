'use strict';
const SimplexNoise=(()=>{const F2=0.5*(Math.sqrt(3)-1),G2=(3-Math.sqrt(3))/6,F3=1/3,G3=1/6;
const grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
class SN{constructor(seed){this.p=new Uint8Array(512);const p=new Uint8Array(256);for(let i=0;i<256;i++)p[i]=i;
let s=seed||42;for(let i=255;i>0;i--){s=(s*16807+0)%2147483647;const j=s%(i+1);[p[i],p[j]]=[p[j],p[i]];}
for(let i=0;i<512;i++)this.p[i]=p[i&255];}
noise2D(xin,yin){const p=this.p,s=(xin+yin)*F2,i=Math.floor(xin+s),j=Math.floor(yin+s),t=(i+j)*G2,
x0=xin-(i-t),y0=yin-(j-t),i1=x0>y0?1:0,j1=x0>y0?0:1,
x1=x0-i1+G2,y1=y0-j1+G2,x2=x0-1+2*G2,y2=y0-1+2*G2,ii=i&255,jj=j&255;
let n0=0,n1=0,n2=0,t0=0.5-x0*x0-y0*y0;
if(t0>0){t0*=t0;const gi=p[ii+p[jj]]%12;n0=t0*t0*(grad3[gi][0]*x0+grad3[gi][1]*y0);}
let t1=0.5-x1*x1-y1*y1;if(t1>0){t1*=t1;const gi=p[ii+i1+p[jj+j1]]%12;n1=t1*t1*(grad3[gi][0]*x1+grad3[gi][1]*y1);}
let t2=0.5-x2*x2-y2*y2;if(t2>0){t2*=t2;const gi=p[ii+1+p[jj+1]]%12;n2=t2*t2*(grad3[gi][0]*x2+grad3[gi][1]*y2);}
return 70*(n0+n1+n2);}
noise3D(xin,yin,zin){const p=this.p,s=(xin+yin+zin)*F3,i=Math.floor(xin+s),j=Math.floor(yin+s),k=Math.floor(zin+s),
t=(i+j+k)*G3,x0=xin-(i-t),y0=yin-(j-t),z0=zin-(k-t);let i1,j1,k1,i2,j2,k2;
if(x0>=y0){if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;}else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;}
else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;}}else{if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;}
else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;}else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;}}
const x1=x0-i1+G3,y1=y0-j1+G3,z1=z0-k1+G3,x2=x0-i2+2*G3,y2=y0-j2+2*G3,z2=z0-k2+2*G3,
x3=x0-1+3*G3,y3=y0-1+3*G3,z3=z0-1+3*G3,ii=i&255,jj=j&255,kk=k&255;let n0=0,n1=0,n2=0,n3=0,tt;
tt=0.6-x0*x0-y0*y0-z0*z0;if(tt>0){tt*=tt;const gi=p[ii+p[jj+p[kk]]]%12;n0=tt*tt*(grad3[gi][0]*x0+grad3[gi][1]*y0+grad3[gi][2]*z0);}
tt=0.6-x1*x1-y1*y1-z1*z1;if(tt>0){tt*=tt;const gi=p[ii+i1+p[jj+j1+p[kk+k1]]]%12;n1=tt*tt*(grad3[gi][0]*x1+grad3[gi][1]*y1+grad3[gi][2]*z1);}
tt=0.6-x2*x2-y2*y2-z2*z2;if(tt>0){tt*=tt;const gi=p[ii+i2+p[jj+j2+p[kk+k2]]]%12;n2=tt*tt*(grad3[gi][0]*x2+grad3[gi][1]*y2+grad3[gi][2]*z2);}
tt=0.6-x3*x3-y3*y3-z3*z3;if(tt>0){tt*=tt;const gi=p[ii+1+p[jj+1+p[kk+1]]]%12;n3=tt*tt*(grad3[gi][0]*x3+grad3[gi][1]*y3+grad3[gi][2]*z3);}
return 32*(n0+n1+n2+n3);}
octave2D(x,y,o,p,l,s){let v=0,a=1,f=s,m=0;for(let i=0;i<o;i++){v+=this.noise2D(x*f,y*f)*a;m+=a;a*=p;f*=l;}return v/m;}
octave3D(x,y,z,o,p,l,s){let v=0,a=1,f=s,m=0;for(let i=0;i<o;i++){v+=this.noise3D(x*f,y*f,z*f)*a;m+=a;a*=p;f*=l;}return v/m;}}
return SN;})();

let worldSeed=Math.random()*65536|0,worldSeedB=Math.random()*65536|0,worldSeedC=Math.random()*65536|0;
try{const ss=localStorage.getItem('voxelcraft_seeds');if(ss){const s=JSON.parse(ss);worldSeed=s.a;worldSeedB=s.b;worldSeedC=s.c;}}catch(e){}
const noise=new SimplexNoise(worldSeed),noiseB=new SimplexNoise(worldSeedB),noiseC=new SimplexNoise(worldSeedC);

const BLOCK={AIR:0,GRASS:1,DIRT:2,STONE:3,WOOD:4,SAND:5,WATER:6,COBBLESTONE:7,GLASS:8,LEAVES:9,PLANKS:10,BRICK:11,
SNOW:12,COAL_ORE:13,IRON_ORE:14,GOLD_ORE:15,DIAMOND_ORE:16,BEDROCK:17,GRAVEL:18,CLAY:19,OBSIDIAN:20,TNT:21,
TORCH:22,ICE:23,BOOKSHELF:24,MOSSY_COBBLESTONE:25,LAVA:26,GLOWSTONE:27,NETHERRACK:28,REDSTONE_ORE:29,
DOOR_BOTTOM:30,DOOR_TOP:31,CHEST:32,RED_FLOWER:33,YELLOW_FLOWER:34,TALL_GRASS:35};
const BLOCK_NAMES=['Air','Grass','Dirt','Stone','Wood','Sand','Water','Cobblestone','Glass','Leaves','Planks','Brick',
'Snow','Coal Ore','Iron Ore','Gold Ore','Diamond Ore','Bedrock','Gravel','Clay','Obsidian','TNT','Torch',
'Ice','Bookshelf','Mossy Cobble','Lava','Glowstone','Netherrack','Redstone Ore','Door','Door Top','Chest',
'Red Flower','Yellow Flower','Tall Grass'];
const CROSS_BLOCKS=new Set([BLOCK.RED_FLOWER,BLOCK.YELLOW_FLOWER,BLOCK.TALL_GRASS]);

const ITEM={STICK:'stick',WOODEN_SWORD:'wooden_sword',STONE_SWORD:'stone_sword',IRON_SWORD:'iron_sword',
DIAMOND_SWORD:'diamond_sword',RAW_BEEF:'raw_beef',BREAD:'bread',APPLE:'apple',IRON_INGOT:'iron_ingot',DIAMOND:'diamond',
PORKCHOP:'porkchop',RAW_CHICKEN:'raw_chicken',FEATHER:'feather',SEEDS:'seeds',BONE:'bone',
WOODEN_PICKAXE:'wooden_pickaxe',STONE_PICKAXE:'stone_pickaxe',IRON_PICKAXE:'iron_pickaxe',DIAMOND_PICKAXE:'diamond_pickaxe',
WOODEN_AXE:'wooden_axe',STONE_AXE:'stone_axe',IRON_AXE:'iron_axe',DIAMOND_AXE:'diamond_axe',
WOODEN_SHOVEL:'wooden_shovel',STONE_SHOVEL:'stone_shovel',IRON_SHOVEL:'iron_shovel',DIAMOND_SHOVEL:'diamond_shovel'};
const ITEM_DATA={
[ITEM.STICK]:{name:'Stick',stackable:true,maxStack:64,type:'material',color:'#b89458'},
[ITEM.WOODEN_SWORD]:{name:'Wooden Sword',stackable:false,maxStack:1,type:'sword',damage:4,color:'#b89458'},
[ITEM.STONE_SWORD]:{name:'Stone Sword',stackable:false,maxStack:1,type:'sword',damage:6,color:'#888'},
[ITEM.IRON_SWORD]:{name:'Iron Sword',stackable:false,maxStack:1,type:'sword',damage:8,color:'#ccc'},
[ITEM.DIAMOND_SWORD]:{name:'Diamond Sword',stackable:false,maxStack:1,type:'sword',damage:10,color:'#5dd'},
[ITEM.RAW_BEEF]:{name:'Raw Beef',stackable:true,maxStack:64,type:'food',hunger:3,color:'#c44'},
[ITEM.PORKCHOP]:{name:'Porkchop',stackable:true,maxStack:64,type:'food',hunger:3,color:'#d76'},
[ITEM.RAW_CHICKEN]:{name:'Raw Chicken',stackable:true,maxStack:64,type:'food',hunger:2,color:'#eb9'},
[ITEM.BREAD]:{name:'Bread',stackable:true,maxStack:64,type:'food',hunger:5,color:'#d4a030'},
[ITEM.APPLE]:{name:'Apple',stackable:true,maxStack:64,type:'food',hunger:4,color:'#d33'},
[ITEM.IRON_INGOT]:{name:'Iron Ingot',stackable:true,maxStack:64,type:'material',color:'#ccc'},
[ITEM.DIAMOND]:{name:'Diamond',stackable:true,maxStack:64,type:'material',color:'#5dd'},
[ITEM.FEATHER]:{name:'Feather',stackable:true,maxStack:64,type:'material',color:'#eee'},
[ITEM.SEEDS]:{name:'Seeds',stackable:true,maxStack:64,type:'material',color:'#8a3'},
[ITEM.BONE]:{name:'Bone',stackable:true,maxStack:64,type:'material',color:'#e8e4d4'},
[ITEM.WOODEN_PICKAXE]:{name:'Wood Pickaxe',stackable:false,maxStack:1,type:'pickaxe',tier:1.5,color:'#b89458'},
[ITEM.STONE_PICKAXE]:{name:'Stone Pickaxe',stackable:false,maxStack:1,type:'pickaxe',tier:2,color:'#888'},
[ITEM.IRON_PICKAXE]:{name:'Iron Pickaxe',stackable:false,maxStack:1,type:'pickaxe',tier:3,color:'#ccc'},
[ITEM.DIAMOND_PICKAXE]:{name:'Diamond Pickaxe',stackable:false,maxStack:1,type:'pickaxe',tier:4,color:'#5dd'},
[ITEM.WOODEN_AXE]:{name:'Wood Axe',stackable:false,maxStack:1,type:'axe',tier:1.5,color:'#b89458'},
[ITEM.STONE_AXE]:{name:'Stone Axe',stackable:false,maxStack:1,type:'axe',tier:2,color:'#888'},
[ITEM.IRON_AXE]:{name:'Iron Axe',stackable:false,maxStack:1,type:'axe',tier:3,color:'#ccc'},
[ITEM.DIAMOND_AXE]:{name:'Diamond Axe',stackable:false,maxStack:1,type:'axe',tier:4,color:'#5dd'},
[ITEM.WOODEN_SHOVEL]:{name:'Wood Shovel',stackable:false,maxStack:1,type:'shovel',tier:1.5,color:'#b89458'},
[ITEM.STONE_SHOVEL]:{name:'Stone Shovel',stackable:false,maxStack:1,type:'shovel',tier:2,color:'#888'},
[ITEM.IRON_SHOVEL]:{name:'Iron Shovel',stackable:false,maxStack:1,type:'shovel',tier:3,color:'#ccc'},
[ITEM.DIAMOND_SHOVEL]:{name:'Diamond Shovel',stackable:false,maxStack:1,type:'shovel',tier:4,color:'#5dd'},
};

function makeBlockSlot(b){return{type:'block',block:b,count:1};}
function makeItemSlot(i,c){return{type:'item',item:i,count:c||1};}
function getSlotName(s){if(!s)return'Empty';if(s.type==='block')return BLOCK_NAMES[s.block];if(s.type==='item')return ITEM_DATA[s.item]?.name||'?';return'?';}
function isSlotSword(s){return s&&s.type==='item'&&ITEM_DATA[s.item]?.type==='sword';}
function isSlotFood(s){return s&&s.type==='item'&&ITEM_DATA[s.item]?.type==='food';}
function getSwordDamage(s){if(!isSlotSword(s))return 1;return ITEM_DATA[s.item].damage;}
function isSlotTool(s){return s&&s.type==='item'&&['pickaxe','axe','shovel'].includes(ITEM_DATA[s.item]?.type);}
const STONE_BLOCKS=new Set([BLOCK.STONE,BLOCK.COBBLESTONE,BLOCK.MOSSY_COBBLESTONE,BLOCK.COAL_ORE,BLOCK.IRON_ORE,BLOCK.GOLD_ORE,BLOCK.DIAMOND_ORE,BLOCK.REDSTONE_ORE,BLOCK.OBSIDIAN,BLOCK.NETHERRACK,BLOCK.BRICK]);
const WOOD_BLOCKS=new Set([BLOCK.WOOD,BLOCK.PLANKS,BLOCK.BOOKSHELF,BLOCK.CHEST]);
const DIRT_BLOCKS=new Set([BLOCK.DIRT,BLOCK.GRASS,BLOCK.SAND,BLOCK.GRAVEL,BLOCK.CLAY,BLOCK.SNOW]);
function getToolSpeedMul(slot,blockType){if(!isSlotTool(slot))return 1;const d=ITEM_DATA[slot.item];
if(d.type==='pickaxe'&&STONE_BLOCKS.has(blockType))return d.tier;
if(d.type==='axe'&&WOOD_BLOCKS.has(blockType))return d.tier;
if(d.type==='shovel'&&DIRT_BLOCKS.has(blockType))return d.tier;return 1;}

const BLOCK_HARDNESS={[BLOCK.LEAVES]:0.2,[BLOCK.TORCH]:0.2,[BLOCK.DIRT]:0.5,[BLOCK.SAND]:0.5,[BLOCK.GRAVEL]:0.5,[BLOCK.CLAY]:0.5,[BLOCK.SNOW]:0.5,
[BLOCK.WOOD]:1,[BLOCK.PLANKS]:1,[BLOCK.NETHERRACK]:1,[BLOCK.BOOKSHELF]:1,[BLOCK.STONE]:1.5,[BLOCK.COBBLESTONE]:1.5,
[BLOCK.MOSSY_COBBLESTONE]:1.5,[BLOCK.BRICK]:1.5,[BLOCK.COAL_ORE]:1.5,[BLOCK.IRON_ORE]:2,[BLOCK.GOLD_ORE]:2,[BLOCK.REDSTONE_ORE]:2,
[BLOCK.LAVA]:2,[BLOCK.GLOWSTONE]:2,[BLOCK.DIAMOND_ORE]:3,[BLOCK.OBSIDIAN]:3,[BLOCK.ICE]:3,[BLOCK.BEDROCK]:Infinity,
[BLOCK.GRASS]:0.5,[BLOCK.WATER]:0.5,[BLOCK.GLASS]:0.3,[BLOCK.TNT]:0.5,
[BLOCK.DOOR_BOTTOM]:0.8,[BLOCK.DOOR_TOP]:0.8,[BLOCK.CHEST]:1,
[BLOCK.RED_FLOWER]:0,[BLOCK.YELLOW_FLOWER]:0,[BLOCK.TALL_GRASS]:0};
function getBlockHardness(bt){return BLOCK_HARDNESS[bt]!==undefined?BLOCK_HARDNESS[bt]:1;}

const TRANSPARENT_BLOCKS=new Set([BLOCK.AIR,BLOCK.WATER,BLOCK.GLASS,BLOCK.TORCH,BLOCK.ICE,BLOCK.LAVA,BLOCK.DOOR_BOTTOM,BLOCK.DOOR_TOP,
BLOCK.RED_FLOWER,BLOCK.YELLOW_FLOWER,BLOCK.TALL_GRASS]);
const SOLID_BLOCKS_SET=new Set();
for(let i=1;i<=35;i++)if(i!==BLOCK.WATER&&i!==BLOCK.TORCH&&i!==BLOCK.LAVA&&!CROSS_BLOCKS.has(i))SOLID_BLOCKS_SET.add(i);

const doorStates=new Map(),chestInventories=new Map(),blockChanges=new Map();
function isDoorOpen(x,y,z){const b=getBlock(x,y,z);if(b===BLOCK.DOOR_TOP)y--;if(b!==BLOCK.DOOR_BOTTOM&&getBlock(x,y,z)!==BLOCK.DOOR_BOTTOM)return false;return doorStates.get(`${x},${y},${z}`)===true;}
function isBlockSolid(x,y,z){const bx=Math.floor(x),by=Math.floor(y),bz=Math.floor(z);const b=getBlock(bx,by,bz);if(!SOLID_BLOCKS_SET.has(b))return false;if(b===BLOCK.DOOR_BOTTOM||b===BLOCK.DOOR_TOP)return!isDoorOpen(bx,by,bz);return true;}

const CHUNK_SIZE=16,WORLD_CHUNKS=6,WORLD_SIZE=CHUNK_SIZE*WORLD_CHUNKS,WORLD_HEIGHT=48,SEA_LEVEL=12;
const GRAVITY=25,JUMP_FORCE=9,MOVE_SPEED=5.5,SPRINT_SPEED=8.5,PLAYER_HEIGHT=1.7,PLAYER_WIDTH=0.3;
const REACH=7,ATTACK_REACH=4,DAY_CYCLE=600;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x87ceeb);
scene.fog=new THREE.Fog(0x87ceeb,60,110);
const camera=new THREE.PerspectiveCamera(90,innerWidth/innerHeight,0.1,250);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=false;document.body.appendChild(renderer.domElement);renderer.domElement.id='gameCanvas';

const skyUniforms={topColor:{value:new THREE.Color(0x0055bb)},bottomColor:{value:new THREE.Color(0x87ceeb)},sunDir:{value:new THREE.Vector3(0,1,0)}};
const skyMesh=new THREE.Mesh(new THREE.SphereGeometry(200,16,16),new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:skyUniforms,depthWrite:false,
vertexShader:`varying vec3 vWorldPos;void main(){vec4 wp=modelMatrix*vec4(position,1.0);vWorldPos=wp.xyz;gl_Position=projectionMatrix*viewMatrix*wp;}`,
fragmentShader:`uniform vec3 topColor;uniform vec3 bottomColor;uniform vec3 sunDir;varying vec3 vWorldPos;
void main(){float h=normalize(vWorldPos).y*0.5+0.5;vec3 col=mix(bottomColor,topColor,h);float sun=max(0.0,dot(normalize(vWorldPos),sunDir));
col+=vec3(1.0,0.9,0.6)*pow(sun,64.0)*0.6;col+=vec3(1.0,0.95,0.8)*pow(sun,8.0)*0.15;gl_FragColor=vec4(col,1.0);}`}));
scene.add(skyMesh);

const ambientLight=new THREE.AmbientLight(0xffffff,0.55);scene.add(ambientLight);
const dirLight=new THREE.DirectionalLight(0xfff4e0,0.85);dirLight.position.set(50,80,30);scene.add(dirLight);
const hemiLight=new THREE.HemisphereLight(0x87ceeb,0x6b4c2a,0.25);scene.add(hemiLight);
const sunMesh=new THREE.Mesh(new THREE.SphereGeometry(4,8,8),new THREE.MeshBasicMaterial({color:0xffee88}));scene.add(sunMesh);
const moonMesh=new THREE.Mesh(new THREE.SphereGeometry(3,8,8),new THREE.MeshBasicMaterial({color:0xccccdd}));scene.add(moonMesh);

const cloudGroup=new THREE.Group();scene.add(cloudGroup);
const cloudMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.75,depthWrite:false});
for(let i=0;i<25;i++){const cg=new THREE.Group();const bW=15+Math.random()*30,bD=10+Math.random()*20;
const main=new THREE.Mesh(new THREE.BoxGeometry(bW,1.2,bD),cloudMat);cg.add(main);
for(let b=0;b<3+Math.floor(Math.random()*5);b++){const bump=new THREE.Mesh(new THREE.BoxGeometry(4+Math.random()*8,1,3+Math.random()*6),cloudMat);
bump.position.set((Math.random()-0.5)*bW*0.6,0.6+Math.random()*0.3,(Math.random()-0.5)*bD*0.5);cg.add(bump);}
cg.position.set(Math.random()*WORLD_SIZE*2.5-WORLD_SIZE*0.5,WORLD_HEIGHT+10+Math.random()*8,Math.random()*WORLD_SIZE*2.5-WORLD_SIZE*0.5);
cg.userData.speed=0.15+Math.random()*0.35;cloudGroup.add(cg);}

function texRNG(seed){let s=seed;return function(){s=(s*16807+11)%2147483647;return(s&0x7fffffff)/0x7fffffff;};}
function px(img,x,y,r,g,b,a){if(x<0||x>=16||y<0||y>=16)return;const i=(y*16+x)*4;img.data[i]=r;img.data[i+1]=g;img.data[i+2]=b;img.data[i+3]=a===undefined?255:a;}
function pxRect(img,x0,y0,w,h,r,g,b,a){for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)px(img,x,y,r,g,b,a);}
function gpx(img,x,y){if(x<0||x>=16||y<0||y>=16)return[0,0,0,0];const i=(y*16+x)*4;return[img.data[i],img.data[i+1],img.data[i+2],img.data[i+3]];}
function addNoise(img,rng,amt){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const[r,g,b,a]=gpx(img,x,y);if(a===0)continue;const v=((rng()-0.5)*amt)|0;
px(img,x,y,Math.max(0,Math.min(255,r+v)),Math.max(0,Math.min(255,g+v)),Math.max(0,Math.min(255,b+v)),a);}}
function fillRandColors(img,rng,colors){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=colors[(rng()*colors.length)|0];px(img,x,y,c[0],c[1],c[2]);}}

function tex_grass_top(){const img=new ImageData(16,16);fillRandColors(img,texRNG(101),[[89,168,40],[95,174,44],[82,160,36],[100,180,48],[76,152,32]]);return img;}
function tex_dirt_base(){const img=new ImageData(16,16);fillRandColors(img,texRNG(201),[[134,96,67],[121,85,58],[140,101,71],[114,80,53],[128,91,63],[145,106,76]]);return img;}
function tex_grass_side(){const img=tex_dirt_base();const rng=texRNG(102);const gc=[[89,168,40],[82,160,36],[95,174,44]];
for(let x=0;x<16;x++){const d=2+((rng()*2)|0);for(let y=0;y<d;y++){const c=gc[(rng()*gc.length)|0];px(img,x,y,c[0],c[1],c[2]);}}return img;}
function tex_stone(){const img=new ImageData(16,16);const rng=texRNG(301);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=125+((rng()-0.5)*20)|0;px(img,x,y,v,v,v);}
for(let i=0;i<15;i++){const cx=(rng()*16)|0,cy=(rng()*16)|0,v=95+((rng()*15)|0);px(img,cx,cy,v,v,v);}return img;}
function tex_cobblestone(){const img=new ImageData(16,16);const rng=texRNG(701);pxRect(img,0,0,16,16,120,120,120);
const stones=[{x:0,y:0,w:5,h:4,v:140},{x:5,y:0,w:6,h:5,v:130},{x:11,y:0,w:5,h:4,v:145},{x:0,y:4,w:4,h:5,v:135},
{x:4,y:5,w:5,h:4,v:150},{x:9,y:4,w:4,h:4,v:125},{x:0,y:9,w:6,h:4,v:142},{x:6,y:9,w:5,h:4,v:128},
{x:11,y:9,w:5,h:4,v:148},{x:0,y:13,w:4,h:3,v:132},{x:4,y:13,w:5,h:3,v:144},{x:9,y:13,w:7,h:3,v:136}];
for(const s of stones)for(let y=s.y;y<s.y+s.h&&y<16;y++)for(let x=s.x;x<s.x+s.w&&x<16;x++){const n=((rng()-0.5)*12)|0;px(img,x,y,s.v+n,s.v+n,s.v+n);}
return img;}
function tex_sand(){const img=new ImageData(16,16);fillRandColors(img,texRNG(501),[[219,207,140],[214,201,133],[224,212,147],[210,197,128]]);return img;}
function tex_wood_side(){const img=new ImageData(16,16);const rng=texRNG(401);const bk=[[104,83,50],[98,77,45],[110,88,55],[93,72,40]];
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=bk[((x+(rng()*2|0))*3+y)%bk.length];px(img,x,y,c[0],c[1],c[2]);}
for(const gx of[2,5,9,12,15])for(let y=0;y<16;y++)if(rng()>0.2)px(img,gx,y,78,60,34);return img;}
function tex_wood_top(){const img=new ImageData(16,16);const rng=texRNG(402);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const dx=x-7.5,dy=y-7.5,d=Math.sqrt(dx*dx+dy*dy);
if(d<2)px(img,x,y,180,148,96);else if(d<5)px(img,x,y,((d|0)%2)?168:140,((d|0)%2)?135:112,((d|0)%2)?84:68);
else px(img,x,y,104,83,50);}addNoise(img,texRNG(403),10);return img;}
function tex_planks(){const img=new ImageData(16,16);const rng=texRNG(1001);const pc=[[188,152,98],[180,145,90],[195,158,105],[174,140,85]];
for(let b=0;b<4;b++){const c=pc[b];for(let y=b*4;y<b*4+4&&y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*8)|0;px(img,x,y,c[0]+v,c[1]+v,c[2]+v);}
if(b*4+3<16)for(let x=0;x<16;x++)px(img,x,b*4+3,140,112,70);}return img;}
function tex_leaves(){const img=new ImageData(16,16);fillRandColors(img,texRNG(901),[[58,142,31],[48,128,25],[66,155,38],[40,118,20],[54,136,28]]);return img;}
function tex_glass(){const img=new ImageData(16,16);for(let y=0;y<16;y++)for(let x=0;x<16;x++)px(img,x,y,200,230,255,40);
for(let i=0;i<16;i++){px(img,i,0,180,210,235,180);px(img,i,15,180,210,235,180);px(img,0,i,180,210,235,180);px(img,15,i,180,210,235,180);}
px(img,2,2,255,255,255,120);px(img,3,3,255,255,255,100);return img;}
function tex_water(){const img=new ImageData(16,16);const rng=texRNG(601);
fillRandColors(img,rng,[[37,98,196],[32,88,180],[42,108,210],[28,82,170]]);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const[r,g,b]=gpx(img,x,y);px(img,x,y,r,g,b,180);}return img;}
function tex_brick(){const img=new ImageData(16,16);const rng=texRNG(1101);pxRect(img,0,0,16,16,188,180,170);
const bc=[[156,74,60],[148,68,54],[164,80,66]];
const rows=[{y:0,h:3,bx:[0,8]},{y:4,h:3,bx:[0,4,12]},{y:8,h:3,bx:[0,8]},{y:12,h:3,bx:[0,4,12]}];
for(const row of rows)for(let bi=0;bi<row.bx.length;bi++){const bx=row.bx[bi],bw=(bi<row.bx.length-1?row.bx[bi+1]-bx:16-bx)-1;
const c=bc[(rng()*bc.length)|0];for(let y=row.y;y<row.y+row.h&&y<16;y++)for(let x=bx;x<bx+bw&&x<16;x++){const v=((rng()-0.5)*10)|0;
px(img,x,y,c[0]+v,c[1]+v,c[2]+v);}}return img;}
function tex_ore(oc,seed){const img=tex_stone();const rng=texRNG(seed);
for(let i=0;i<18;i++){const sx=(rng()*16)|0,sy=(rng()*16)|0,v=((rng()-0.5)*20)|0;
px(img,sx,sy,Math.max(0,Math.min(255,oc[0]+v)),Math.max(0,Math.min(255,oc[1]+v)),Math.max(0,Math.min(255,oc[2]+v)));}return img;}
function tex_snow(){const img=new ImageData(16,16);const rng=texRNG(1200);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*8)|0;px(img,x,y,240+v,Math.min(255,251+v),255);}return img;}
function tex_snow_side(){const img=tex_dirt_base();const rng=texRNG(1205);
for(let x=0;x<16;x++){const d=2+((rng()*2)|0);for(let y=0;y<d;y++){const v=((rng()-0.5)*6)|0;px(img,x,y,240+v,Math.min(255,248+v),255);}}return img;}
function tex_obsidian(){const img=new ImageData(16,16);const rng=texRNG(2001);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*12)|0;px(img,x,y,20+v,12+Math.max(0,v),30+v);}return img;}
function tex_tnt_side(){const img=new ImageData(16,16);pxRect(img,0,0,16,16,200,30,20);pxRect(img,0,5,16,6,220,220,210);
pxRect(img,1,6,3,1,40,40,40);pxRect(img,5,6,1,4,40,40,40);pxRect(img,8,6,1,4,40,40,40);return img;}
function tex_tnt_top(){const img=new ImageData(16,16);const rng=texRNG(2102);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*10)|0;px(img,x,y,180+v,155+v,100+v);}
for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(dx*dx+dy*dy<=4)px(img,7+dx,7+dy,60,50,35);return img;}
function tex_torch(){const img=new ImageData(16,16);pxRect(img,7,5,2,10,139,101,49);
px(img,7,2,255,200,50);px(img,8,2,255,200,50);px(img,7,3,255,170,30);px(img,8,3,255,170,30);
px(img,7,4,255,140,20);px(img,8,4,255,140,20);return img;}
function tex_ice(){const img=new ImageData(16,16);const rng=texRNG(2301);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*15)|0;px(img,x,y,160+v,Math.min(255,210+v),Math.min(255,245+v),190);}return img;}
function tex_bookshelf(){const img=tex_planks();const rng=texRNG(2401);
const bc=[[180,40,40],[40,60,160],[50,140,50],[180,180,40],[180,100,40],[120,40,160]];let bx=1;
for(let i=0;bx<15;i++){const bw=2+((rng()*1.5)|0);const c=bc[i%bc.length];
for(let y=1;y<7;y++)for(let x=bx;x<bx+bw&&x<15;x++)px(img,x,y,c[0],c[1],c[2]);bx+=bw+1;}
bx=1;for(let i=3;bx<15;i++){const bw=2+((rng()*1.5)|0);const c=bc[i%bc.length];
for(let y=9;y<15;y++)for(let x=bx;x<bx+bw&&x<15;x++)px(img,x,y,c[0],c[1],c[2]);bx+=bw+1;}return img;}
function tex_mossy_cobblestone(){const img=tex_cobblestone();const rng=texRNG(2501);const mc=[[58,140,32],[48,125,24],[66,152,38]];
for(let i=0;i<40;i++){const mx=(rng()*16)|0,my=(rng()*16)|0;const c=mc[(rng()*mc.length)|0];const[r,g,b]=gpx(img,mx,my);
px(img,mx,my,(r*0.3+c[0]*0.7)|0,(g*0.3+c[1]*0.7)|0,(b*0.3+c[2]*0.7)|0);}return img;}
function tex_lava(){const img=new ImageData(16,16);const rng=texRNG(2601);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*20)|0;px(img,x,y,200+v,80+((rng()-0.5)*20|0),10+((rng()-0.5)*10|0));}
for(let i=0;i<10;i++){const hx=(rng()*16)|0,hy=(rng()*16)|0;px(img,hx,hy,255,180+((rng()*40)|0),30+((rng()*30)|0));}return img;}
function tex_glowstone(){const img=new ImageData(16,16);const rng=texRNG(2701);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*15)|0;px(img,x,y,180+v,160+v,90+v);}
for(let i=0;i<10;i++){const hx=(rng()*16)|0,hy=(rng()*16)|0;px(img,hx,hy,255,245,180);}return img;}
function tex_netherrack(){const img=new ImageData(16,16);fillRandColors(img,texRNG(2801),[[110,32,32],[100,28,28],[120,36,36],[90,24,24]]);return img;}
function tex_door_bottom(){const img=new ImageData(16,16);const rng=texRNG(3001);
pxRect(img,0,0,16,16,160,120,72);for(let b=0;b<4;b++){const c=170+((rng()-0.5)*16|0);
for(let y=b*4;y<b*4+4;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*8)|0;px(img,x,y,c+v,c*0.75+v|0,c*0.45+v|0);}}
pxRect(img,11,5,3,3,80,60,30);px(img,12,6,200,180,60);
for(let x=0;x<16;x++){px(img,x,0,100,75,40);px(img,x,15,100,75,40);}
for(let y=0;y<16;y++){px(img,0,y,100,75,40);px(img,15,y,100,75,40);}return img;}
function tex_door_top(){const img=new ImageData(16,16);const rng=texRNG(3101);
pxRect(img,0,0,16,16,160,120,72);for(let b=0;b<4;b++){const c=170+((rng()-0.5)*16|0);
for(let y=b*4;y<b*4+4;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*8)|0;px(img,x,y,c+v,c*0.75+v|0,c*0.45+v|0);}}
pxRect(img,3,3,4,5,120,160,200,160);pxRect(img,9,3,4,5,120,160,200,160);
for(let x=0;x<16;x++){px(img,x,0,100,75,40);px(img,x,15,100,75,40);}
for(let y=0;y<16;y++){px(img,0,y,100,75,40);px(img,15,y,100,75,40);}return img;}
function tex_chest_side(){const img=new ImageData(16,16);const rng=texRNG(3201);
pxRect(img,0,0,16,16,140,100,48);addNoise(img,rng,10);
for(let x=0;x<16;x++){px(img,x,0,100,70,30);px(img,x,15,100,70,30);px(img,x,7,110,78,35);}
for(let y=0;y<16;y++){px(img,0,y,100,70,30);px(img,15,y,100,70,30);}
pxRect(img,6,6,4,3,60,60,60);px(img,7,7,200,180,40);px(img,8,7,200,180,40);return img;}
function tex_chest_top(){const img=new ImageData(16,16);const rng=texRNG(3202);
pxRect(img,0,0,16,16,130,92,42);addNoise(img,rng,8);
for(let x=0;x<16;x++){px(img,x,0,100,70,30);px(img,x,15,100,70,30);}
for(let y=0;y<16;y++){px(img,0,y,100,70,30);px(img,15,y,100,70,30);}
pxRect(img,6,7,4,2,60,60,60);return img;}
function tex_red_flower(){const img=new ImageData(16,16);
pxRect(img,6,10,2,6,40,120,20);px(img,7,4,220,30,30);px(img,8,4,220,30,30);px(img,6,5,220,30,30);px(img,9,5,220,30,30);
px(img,7,5,240,60,60);px(img,8,5,240,60,60);px(img,7,6,220,30,30);px(img,8,6,220,30,30);return img;}
function tex_yellow_flower(){const img=new ImageData(16,16);
pxRect(img,6,10,2,6,40,120,20);px(img,7,4,240,220,30);px(img,8,4,240,220,30);px(img,6,5,240,220,30);px(img,9,5,240,220,30);
px(img,7,5,255,240,60);px(img,8,5,255,240,60);px(img,7,6,240,220,30);px(img,8,6,240,220,30);return img;}
function tex_tall_grass(){const img=new ImageData(16,16);const rng=texRNG(3501);
const gc=[[60,140,30],[50,130,25],[70,150,35],[55,135,28]];
for(let y=4;y<16;y++){const spread=Math.max(1,(16-y)/3|0);for(let x=8-spread;x<8+spread;x++){
if(x>=0&&x<16&&rng()>0.3){const c=gc[(rng()*gc.length)|0];px(img,x,y,c[0],c[1],c[2]);}}}return img;}

const TEX_CACHE={};
function getTexImg(name){if(TEX_CACHE[name])return TEX_CACHE[name];const g={
'grass_top':tex_grass_top,'grass_side':tex_grass_side,'dirt':tex_dirt_base,'stone':tex_stone,'cobblestone':tex_cobblestone,
'sand':tex_sand,'wood_side':tex_wood_side,'wood_top':tex_wood_top,'planks':tex_planks,'leaves':tex_leaves,'glass':tex_glass,
'water':tex_water,'brick':tex_brick,'coal_ore':()=>tex_ore([40,40,40],1301),'iron_ore':()=>tex_ore([200,178,150],1401),
'gold_ore':()=>tex_ore([255,224,80],1501),'diamond_ore':()=>tex_ore([90,220,220],1601),'redstone_ore':()=>tex_ore([220,40,40],2901),
'bedrock':()=>{const img=new ImageData(16,16);fillRandColors(img,texRNG(1701),[[52,52,52],[40,40,40],[64,64,64],[34,34,34],[46,46,46]]);return img;},
'gravel':()=>{const img=new ImageData(16,16);fillRandColors(img,texRNG(1801),[[136,126,118],[126,116,108],[146,136,128],[116,106,98]]);return img;},
'clay':()=>{const img=new ImageData(16,16);const rng=texRNG(1901);
for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*10)|0;px(img,x,y,160+v,166+v,180+v);}return img;},
'snow':tex_snow,'snow_side':tex_snow_side,'obsidian':tex_obsidian,'tnt_side':tex_tnt_side,'tnt_top':tex_tnt_top,
'tnt_bottom':()=>{const img=new ImageData(16,16);const rng=texRNG(2103);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=((rng()-0.5)*10)|0;px(img,x,y,180+v,155+v,100+v);}return img;},
'torch':tex_torch,'ice':tex_ice,'bookshelf':tex_bookshelf,'mossy_cobblestone':tex_mossy_cobblestone,
'lava':tex_lava,'glowstone':tex_glowstone,'netherrack':tex_netherrack,
'door_bottom':tex_door_bottom,'door_top':tex_door_top,'chest_side':tex_chest_side,'chest_top':tex_chest_top,
'red_flower':tex_red_flower,'yellow_flower':tex_yellow_flower,'tall_grass':tex_tall_grass};
if(g[name])TEX_CACHE[name]=typeof g[name]==='function'?g[name]():g[name];return TEX_CACHE[name];}

function imgToTexture(img){const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').putImageData(img,0,0);
const tex=new THREE.CanvasTexture(c);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;return tex;}
function makeTexFromName(name){const d=getTexImg(name);return d?imgToTexture(d):null;}

const BLOCK_TEX_MAP={
[BLOCK.GRASS]:{top:'grass_top',side:'grass_side',bottom:'dirt'},[BLOCK.DIRT]:{top:'dirt',side:'dirt',bottom:'dirt'},
[BLOCK.STONE]:{top:'stone',side:'stone',bottom:'stone'},[BLOCK.WOOD]:{top:'wood_top',side:'wood_side',bottom:'wood_top'},
[BLOCK.SAND]:{top:'sand',side:'sand',bottom:'sand'},[BLOCK.WATER]:{top:'water',side:'water',bottom:'water'},
[BLOCK.COBBLESTONE]:{top:'cobblestone',side:'cobblestone',bottom:'cobblestone'},[BLOCK.GLASS]:{top:'glass',side:'glass',bottom:'glass'},
[BLOCK.LEAVES]:{top:'leaves',side:'leaves',bottom:'leaves'},[BLOCK.PLANKS]:{top:'planks',side:'planks',bottom:'planks'},
[BLOCK.BRICK]:{top:'brick',side:'brick',bottom:'brick'},[BLOCK.SNOW]:{top:'snow',side:'snow_side',bottom:'dirt'},
[BLOCK.COAL_ORE]:{top:'coal_ore',side:'coal_ore',bottom:'coal_ore'},[BLOCK.IRON_ORE]:{top:'iron_ore',side:'iron_ore',bottom:'iron_ore'},
[BLOCK.GOLD_ORE]:{top:'gold_ore',side:'gold_ore',bottom:'gold_ore'},[BLOCK.DIAMOND_ORE]:{top:'diamond_ore',side:'diamond_ore',bottom:'diamond_ore'},
[BLOCK.BEDROCK]:{top:'bedrock',side:'bedrock',bottom:'bedrock'},[BLOCK.GRAVEL]:{top:'gravel',side:'gravel',bottom:'gravel'},
[BLOCK.CLAY]:{top:'clay',side:'clay',bottom:'clay'},[BLOCK.OBSIDIAN]:{top:'obsidian',side:'obsidian',bottom:'obsidian'},
[BLOCK.TNT]:{top:'tnt_top',side:'tnt_side',bottom:'tnt_bottom'},[BLOCK.TORCH]:{top:'torch',side:'torch',bottom:'torch'},
[BLOCK.ICE]:{top:'ice',side:'ice',bottom:'ice'},[BLOCK.BOOKSHELF]:{top:'planks',side:'bookshelf',bottom:'planks'},
[BLOCK.MOSSY_COBBLESTONE]:{top:'mossy_cobblestone',side:'mossy_cobblestone',bottom:'mossy_cobblestone'},
[BLOCK.LAVA]:{top:'lava',side:'lava',bottom:'lava'},[BLOCK.GLOWSTONE]:{top:'glowstone',side:'glowstone',bottom:'glowstone'},
[BLOCK.NETHERRACK]:{top:'netherrack',side:'netherrack',bottom:'netherrack'},[BLOCK.REDSTONE_ORE]:{top:'redstone_ore',side:'redstone_ore',bottom:'redstone_ore'},
[BLOCK.DOOR_BOTTOM]:{top:'door_bottom',side:'door_bottom',bottom:'door_bottom'},[BLOCK.DOOR_TOP]:{top:'door_top',side:'door_top',bottom:'door_top'},
[BLOCK.CHEST]:{top:'chest_top',side:'chest_side',bottom:'chest_top'},
[BLOCK.RED_FLOWER]:{top:'red_flower',side:'red_flower',bottom:'red_flower'},
[BLOCK.YELLOW_FLOWER]:{top:'yellow_flower',side:'yellow_flower',bottom:'yellow_flower'},
[BLOCK.TALL_GRASS]:{top:'tall_grass',side:'tall_grass',bottom:'tall_grass'}};

const blockMaterials={};
function buildMaterialsForBlock(bt){const texMap=BLOCK_TEX_MAP[bt];if(!texMap)return;
const isTr=bt===BLOCK.WATER||bt===BLOCK.GLASS||bt===BLOCK.ICE||bt===BLOCK.LAVA||CROSS_BLOCKS.has(bt);
const op=bt===BLOCK.WATER?0.55:bt===BLOCK.GLASS?0.3:bt===BLOCK.ICE?0.75:bt===BLOCK.LAVA?0.9:1;
const sT=makeTexFromName(texMap.side),tT=makeTexFromName(texMap.top),bT=makeTexFromName(texMap.bottom);
const o={transparent:isTr,opacity:op,side:CROSS_BLOCKS.has(bt)?THREE.DoubleSide:(isTr?THREE.DoubleSide:THREE.FrontSide),depthWrite:!isTr,alphaTest:CROSS_BLOCKS.has(bt)?0.1:0};
blockMaterials[bt]=[new THREE.MeshLambertMaterial({map:sT,...o}),new THREE.MeshLambertMaterial({map:sT,...o}),
new THREE.MeshLambertMaterial({map:tT,...o}),new THREE.MeshLambertMaterial({map:bT,...o}),
new THREE.MeshLambertMaterial({map:sT,...o}),new THREE.MeshLambertMaterial({map:sT,...o})];}
for(let bt=1;bt<=35;bt++)buildMaterialsForBlock(bt);
if(blockMaterials[BLOCK.LAVA])blockMaterials[BLOCK.LAVA].forEach(m=>{m.emissive=new THREE.Color(0xff4400);m.emissiveIntensity=0.8;});
if(blockMaterials[BLOCK.GLOWSTONE])blockMaterials[BLOCK.GLOWSTONE].forEach(m=>{m.emissive=new THREE.Color(0xddaa40);m.emissiveIntensity=0.6;});
if(blockMaterials[BLOCK.TORCH])blockMaterials[BLOCK.TORCH].forEach(m=>{m.emissive=new THREE.Color(0xffaa22);m.emissiveIntensity=0.5;});

const world=new Uint8Array(WORLD_SIZE*WORLD_HEIGHT*WORLD_SIZE);
function idx(x,y,z){if(x<0||x>=WORLD_SIZE||y<0||y>=WORLD_HEIGHT||z<0||z>=WORLD_SIZE)return-1;return x+y*WORLD_SIZE+z*WORLD_SIZE*WORLD_HEIGHT;}
function getBlock(x,y,z){const i=idx(x,y,z);return i<0?BLOCK.AIR:world[i];}
function setBlock(x,y,z,type){const i=idx(x,y,z);if(i>=0){world[i]=type;blockChanges.set(`${x},${y},${z}`,type);rebuildChunkAt(x,z);}}
function setBlockDirect(x,y,z,type){const i=idx(x,y,z);if(i>=0)world[i]=type;}

const BIOME={PLAINS:0,DESERT:1,FOREST:2,MOUNTAINS:3,SNOW:4};
const BIOME_NAMES=['Plains','Desert','Forest','Mountains','Snow'];
function getBiome(x,z){const t=noise.octave2D(x,z,3,0.5,2,0.005),m=noiseB.octave2D(x,z,3,0.5,2,0.007);
if(t>0.3)return BIOME.DESERT;if(t<-0.3)return BIOME.SNOW;if(m>0.2)return BIOME.FOREST;if(m<-0.25)return BIOME.MOUNTAINS;return BIOME.PLAINS;}
function getTerrainHeight(x,z){const b=getBiome(x,z);let h=noise.octave2D(x,z,5,0.5,2,0.015)*12+14;
switch(b){case BIOME.PLAINS:h=h*0.6+10;break;case BIOME.DESERT:h=h*0.4+11;break;case BIOME.FOREST:h=h*0.7+12;break;
case BIOME.MOUNTAINS:h=h*1.5+16;break;case BIOME.SNOW:h=h*0.8+14;break;}
return Math.max(3,Math.min(WORLD_HEIGHT-6,Math.floor(h)));}

function generateWorld(){
for(let x=0;x<WORLD_SIZE;x++)for(let z=0;z<WORLD_SIZE;z++){const h=getTerrainHeight(x,z);const biome=getBiome(x,z);
for(let y=0;y<WORLD_HEIGHT;y++){const i=idx(x,y,z);
if(y===0){world[i]=BLOCK.BEDROCK;continue;}
if(y>h&&y<=SEA_LEVEL){world[i]=BLOCK.WATER;continue;}
if(y>h){world[i]=BLOCK.AIR;continue;}
if(y<h-4){world[i]=BLOCK.STONE;
if(y<10&&Math.random()<0.008)world[i]=BLOCK.DIAMOND_ORE;
else if(y<20&&Math.random()<0.012)world[i]=BLOCK.GOLD_ORE;
else if(y<32&&Math.random()<0.018)world[i]=BLOCK.IRON_ORE;
else if(y<40&&Math.random()<0.02)world[i]=BLOCK.COAL_ORE;
else if(y<16&&Math.random()<0.012)world[i]=BLOCK.REDSTONE_ORE;
else if(Math.random()<0.015)world[i]=BLOCK.GRAVEL;
else if(y<5&&Math.random()<0.01)world[i]=BLOCK.OBSIDIAN;
else if(y<4&&Math.random()<0.008)world[i]=BLOCK.LAVA;
}else if(y<h){world[i]=biome===BIOME.DESERT?BLOCK.SAND:BLOCK.DIRT;}
else{if(h<=SEA_LEVEL+1)world[i]=BLOCK.SAND;
else if(biome===BIOME.DESERT)world[i]=BLOCK.SAND;
else if(biome===BIOME.SNOW)world[i]=BLOCK.SNOW;
else world[i]=BLOCK.GRASS;}}
if(biome===BIOME.SNOW&&getTerrainHeight(x,z)<SEA_LEVEL){const wi=idx(x,SEA_LEVEL,z);if(wi>=0&&world[wi]===BLOCK.WATER)world[wi]=BLOCK.ICE;}}
for(let x=0;x<WORLD_SIZE;x++)for(let z=0;z<WORLD_SIZE;z++){const sH=getTerrainHeight(x,z);
for(let y=2;y<sH-1;y++){const c1=noiseC.octave3D(x,y,z,2,0.5,2,0.06),c2=noise.octave3D(x,y*1.5,z,2,0.5,2,0.08);
if(c1>0.35||c2>0.4){const i=idx(x,y,z);if(i>=0&&world[i]!==BLOCK.WATER&&world[i]!==BLOCK.BEDROCK)world[i]=BLOCK.AIR;}}}
for(let x=3;x<WORLD_SIZE-3;x++)for(let z=3;z<WORLD_SIZE-3;z++){const biome=getBiome(x,z);
let tc=0;if(biome===BIOME.FOREST)tc=0.025;else if(biome===BIOME.PLAINS)tc=0.004;else if(biome===BIOME.SNOW)tc=0.006;else if(biome===BIOME.MOUNTAINS)tc=0.003;
if(Math.random()>tc)continue;let sY=-1;for(let y=WORLD_HEIGHT-1;y>=0;y--){const b=getBlock(x,y,z);if(b===BLOCK.GRASS||b===BLOCK.SNOW){sY=y;break;}}
if(sY<SEA_LEVEL+2||sY>WORLD_HEIGHT-10)continue;const tH=4+(Math.random()*3|0);
for(let y=1;y<=tH;y++)setBlockDirect(x,sY+y,z,BLOCK.WOOD);
for(let dx=-2;dx<=2;dx++)for(let dy=-1;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){
if(dx*dx+dy*dy+dz*dz>6)continue;const lx=x+dx,ly=sY+tH+dy,lz=z+dz;
if(lx>=0&&lx<WORLD_SIZE&&lz>=0&&lz<WORLD_SIZE&&ly<WORLD_HEIGHT&&getBlock(lx,ly,lz)===BLOCK.AIR)
setBlockDirect(lx,ly,lz,biome===BIOME.SNOW?BLOCK.SNOW:BLOCK.LEAVES);}}
for(let x=0;x<WORLD_SIZE;x++)for(let z=0;z<WORLD_SIZE;z++){const biome=getBiome(x,z);
if(biome===BIOME.DESERT||biome===BIOME.SNOW)continue;
const h=getTerrainHeight(x,z);if(h<=SEA_LEVEL)continue;
const surf=getBlock(x,h,z);if(surf!==BLOCK.GRASS)continue;
if(getBlock(x,h+1,z)!==BLOCK.AIR)continue;
const r=Math.random();
if(biome===BIOME.FOREST||biome===BIOME.PLAINS){
if(r<0.06)setBlockDirect(x,h+1,z,BLOCK.TALL_GRASS);
else if(r<0.075)setBlockDirect(x,h+1,z,Math.random()<0.5?BLOCK.RED_FLOWER:BLOCK.YELLOW_FLOWER);}}}

const chunkMeshes={},chunkGroup=new THREE.Group();scene.add(chunkGroup);
const faceData=[{dir:[1,0,0],corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},{dir:[-1,0,0],corners:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},
{dir:[0,1,0],corners:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]},{dir:[0,-1,0],corners:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]},
{dir:[0,0,1],corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]},{dir:[0,0,-1],corners:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]}];
const crossFaces=[{corners:[[0,0,0],[1,0,1],[1,1,1],[0,1,0]],normal:[0.707,0,0.707]},
{corners:[[1,0,0],[0,0,1],[0,1,1],[1,1,0]],normal:[-0.707,0,0.707]}];

function buildChunkMesh(cx,cz){const key=`${cx},${cz}`;
if(chunkMeshes[key]){chunkMeshes[key].forEach(m=>{chunkGroup.remove(m);m.geometry.dispose();});}
const facesByMat={};const sx=cx*CHUNK_SIZE,sz=cz*CHUNK_SIZE;
for(let x=sx;x<sx+CHUNK_SIZE;x++)for(let z=sz;z<sz+CHUNK_SIZE;z++)for(let y=0;y<WORLD_HEIGHT;y++){
const block=getBlock(x,y,z);if(block===BLOCK.AIR)continue;
if(CROSS_BLOCKS.has(block)){const mk=`${block}_cross`;if(!facesByMat[mk])facesByMat[mk]={positions:[],normals:[],uvs:[],indices:[],isCross:true,block};
const b=facesByMat[mk];
for(const cf of crossFaces){const vi=b.positions.length/3;
for(const c of cf.corners){b.positions.push(x+c[0],y+c[1],z+c[2]);b.normals.push(cf.normal[0],cf.normal[1],cf.normal[2]);}
b.uvs.push(0,0,1,0,1,1,0,1);b.indices.push(vi,vi+1,vi+2,vi,vi+2,vi+3);
const vi2=b.positions.length/3;
for(let i=cf.corners.length-1;i>=0;i--){const c=cf.corners[i];b.positions.push(x+c[0],y+c[1],z+c[2]);b.normals.push(-cf.normal[0],-cf.normal[1],-cf.normal[2]);}
b.uvs.push(0,1,1,1,1,0,0,0);b.indices.push(vi2,vi2+1,vi2+2,vi2,vi2+2,vi2+3);}continue;}
for(let fi=0;fi<6;fi++){const f=faceData[fi];const nx=x+f.dir[0],ny=y+f.dir[1],nz=z+f.dir[2];
const nb=getBlock(nx,ny,nz);if(!TRANSPARENT_BLOCKS.has(nb))continue;if(block===nb)continue;
const mk=`${block}_${fi}`;if(!facesByMat[mk])facesByMat[mk]={positions:[],normals:[],uvs:[],indices:[]};
const b=facesByMat[mk],vi=b.positions.length/3;
for(const c of f.corners){let cy=c[1];if(block===BLOCK.WATER&&cy===1)cy=0.875;
b.positions.push(x+c[0],y+cy,z+c[2]);b.normals.push(f.dir[0],f.dir[1],f.dir[2]);}
if(fi===0||fi===1)b.uvs.push(0,0,0,1,1,1,1,0);else b.uvs.push(0,0,1,0,1,1,0,1);
b.indices.push(vi,vi+1,vi+2,vi,vi+2,vi+3);}}
const meshes=[];for(const[mk,b]of Object.entries(facesByMat)){if(b.positions.length===0)continue;
let mat;if(b.isCross){if(!blockMaterials[b.block])continue;mat=blockMaterials[b.block][0];}
else{const[bt,fi]=mk.split('_').map(Number);if(!blockMaterials[bt])continue;mat=blockMaterials[bt][fi];}
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(b.positions,3));
geo.setAttribute('normal',new THREE.Float32BufferAttribute(b.normals,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(b.uvs,2));
geo.setIndex(b.indices);const mesh=new THREE.Mesh(geo,mat);mesh.matrixAutoUpdate=false;
const bt=b.isCross?b.block:parseInt(mk);if(TRANSPARENT_BLOCKS.has(bt))mesh.renderOrder=1;chunkGroup.add(mesh);meshes.push(mesh);}
chunkMeshes[key]=meshes;}

function rebuildChunkAt(x,z){const cx=Math.floor(x/CHUNK_SIZE),cz=Math.floor(z/CHUNK_SIZE);buildChunkMesh(cx,cz);
const lx=x%CHUNK_SIZE,lz=z%CHUNK_SIZE;
if(lx===0&&cx>0)buildChunkMesh(cx-1,cz);if(lx===CHUNK_SIZE-1&&cx<WORLD_CHUNKS-1)buildChunkMesh(cx+1,cz);
if(lz===0&&cz>0)buildChunkMesh(cx,cz-1);if(lz===CHUNK_SIZE-1&&cz<WORLD_CHUNKS-1)buildChunkMesh(cx,cz+1);}
function buildAllChunks(){for(let cx=0;cx<WORLD_CHUNKS;cx++)for(let cz=0;cz<WORLD_CHUNKS;cz++)buildChunkMesh(cx,cz);}

const torchLights=[];const MAX_TORCH_LIGHTS=20;
function addTorchLight(x,y,z){if(torchLights.length>=MAX_TORCH_LIGHTS)return;const l=new THREE.PointLight(0xffaa44,1.2,12);
l.position.set(x+0.5,y+0.8,z+0.5);scene.add(l);torchLights.push({x,y,z,light:l});}
function removeTorchLight(x,y,z){const i=torchLights.findIndex(t=>t.x===x&&t.y===y&&t.z===z);
if(i>=0){scene.remove(torchLights[i].light);torchLights.splice(i,1);}}

const highlightMesh=new THREE.Mesh(new THREE.BoxGeometry(1.005,1.005,1.005),
new THREE.MeshBasicMaterial({color:0x000000,wireframe:true,transparent:true,opacity:0.5}));
highlightMesh.visible=false;scene.add(highlightMesh);
const crackMesh=new THREE.Mesh(new THREE.BoxGeometry(1.008,1.008,1.008),
new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0,depthTest:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
crackMesh.visible=false;crackMesh.renderOrder=2;scene.add(crackMesh);

const breakingState={active:false,x:0,y:0,z:0,block:0,progress:0,hardness:0,mouseDown:false};
function resetBreaking(){breakingState.active=false;breakingState.progress=0;crackMesh.visible=false;crackMesh.material.opacity=0;}

function updateBreaking(dt){
if(!breakingState.mouseDown||!isLocked||inventoryOpen||craftingOpen||chestOpen||player.isDead){if(breakingState.active)resetBreaking();return;}
const currentSlot=hotbarSlots[player.selectedSlot];if(isSlotSword(currentSlot))return;
const dir=getForwardDir();const hit=raycast(camera.position,dir,REACH);
if(!hit){if(breakingState.active)resetBreaking();return;}
if(!breakingState.active||hit.x!==breakingState.x||hit.y!==breakingState.y||hit.z!==breakingState.z){
breakingState.active=true;breakingState.x=hit.x;breakingState.y=hit.y;breakingState.z=hit.z;
breakingState.block=hit.block;breakingState.hardness=getBlockHardness(hit.block);breakingState.progress=0;}
if(breakingState.hardness===Infinity){crackMesh.visible=false;return;}
if(breakingState.hardness===0)breakingState.progress=1;
else{const toolMul=getToolSpeedMul(hotbarSlots[player.selectedSlot],breakingState.block);breakingState.progress+=dt*toolMul/breakingState.hardness;}
crackMesh.position.set(breakingState.x+0.5,breakingState.y+0.5,breakingState.z+0.5);
crackMesh.visible=true;crackMesh.material.opacity=Math.min(0.48,breakingState.progress*0.48);
if(breakingState.progress>=1){const bx=breakingState.x,by=breakingState.y,bz=breakingState.z,bt=breakingState.block;
if(bt===BLOCK.TORCH)removeTorchLight(bx,by,bz);
if(bt===BLOCK.LEAVES&&Math.random()<0.08)addItemToInventory(ITEM.APPLE,1);
if(bt===BLOCK.TALL_GRASS&&Math.random()<0.3)addItemToInventory(ITEM.SEEDS,1);
if(bt===BLOCK.DOOR_BOTTOM){setBlock(bx,by+1,bz,BLOCK.AIR);doorStates.delete(`${bx},${by},${bz}`);}
if(bt===BLOCK.DOOR_TOP){setBlock(bx,by-1,bz,BLOCK.AIR);doorStates.delete(`${bx},${by-1},${bz}`);}
if(bt===BLOCK.CHEST)chestInventories.delete(`${bx},${by},${bz}`);
setBlock(bx,by,bz,BLOCK.AIR);spawnParticles(bx,by,bz,bt);playSound('break');playerStats.blocksbroken++;resetBreaking();}}

let audioCtx;function initAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();}
function playSound(type){initAudio();const ctx=audioCtx,now=ctx.currentTime;
if(type==='break'){const dur=0.15,buf=ctx.createBuffer(1,ctx.sampleRate*dur,ctx.sampleRate),d=buf.getChannelData(0);
for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/ctx.sampleRate*20)*0.3;
const src=ctx.createBufferSource();src.buffer=buf;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=2000;
src.connect(f).connect(ctx.destination);src.start();}
else if(type==='place'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
o.frequency.setValueAtTime(150,now);o.frequency.exponentialRampToValueAtTime(60,now+0.1);
g.gain.setValueAtTime(0.3,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.12);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.12);}
else if(type==='step'){const dur=0.06,buf=ctx.createBuffer(1,ctx.sampleRate*dur,ctx.sampleRate),d=buf.getChannelData(0);
for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/ctx.sampleRate*40)*0.08;
const src=ctx.createBufferSource();src.buffer=buf;src.connect(ctx.destination);src.start();}
else if(type==='jump'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';
o.frequency.setValueAtTime(200,now);o.frequency.exponentialRampToValueAtTime(400,now+0.1);
g.gain.setValueAtTime(0.15,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.15);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.15);}
else if(type==='hit'){const dur=0.1,buf=ctx.createBuffer(1,ctx.sampleRate*dur,ctx.sampleRate),d=buf.getChannelData(0);
for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/ctx.sampleRate*25)*0.4;
const src=ctx.createBufferSource();src.buffer=buf;const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=3000;
src.connect(f).connect(ctx.destination);src.start();}
else if(type==='eat'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
o.frequency.setValueAtTime(80,now);o.frequency.setValueAtTime(120,now+0.05);
g.gain.setValueAtTime(0.1,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.15);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.15);}
else if(type==='mobhurt'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
o.frequency.setValueAtTime(300,now);o.frequency.exponentialRampToValueAtTime(100,now+0.15);
g.gain.setValueAtTime(0.2,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.18);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.18);}
else if(type==='mobdie'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
o.frequency.setValueAtTime(400,now);o.frequency.exponentialRampToValueAtTime(50,now+0.4);
g.gain.setValueAtTime(0.25,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.4);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.4);}
else if(type==='door'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';
o.frequency.setValueAtTime(200,now);o.frequency.exponentialRampToValueAtTime(100,now+0.15);
g.gain.setValueAtTime(0.2,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.2);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.2);}
else if(type==='moo'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sawtooth';
o.frequency.setValueAtTime(120,now);o.frequency.linearRampToValueAtTime(90,now+0.3);
g.gain.setValueAtTime(0.08,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.4);
const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=400;
o.connect(f).connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.4);}
else if(type==='oink'){const o=ctx.createOscillator(),g=ctx.createGain();o.type='square';
o.frequency.setValueAtTime(250,now);o.frequency.linearRampToValueAtTime(200,now+0.12);
g.gain.setValueAtTime(0.07,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.15);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.15);}}

let ambientWindNode=null,birdTimer=0,caveTimer=0;
function startAmbientWind(){if(ambientWindNode||!audioCtx)return;
const buf=audioCtx.createBuffer(1,audioCtx.sampleRate*4,audioCtx.sampleRate);const d=buf.getChannelData(0);
for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1);
const src=audioCtx.createBufferSource();src.buffer=buf;src.loop=true;
const f=audioCtx.createBiquadFilter();f.type='lowpass';f.frequency.value=200;
const g=audioCtx.createGain();g.gain.value=0.015;
src.connect(f).connect(g).connect(audioCtx.destination);src.start();ambientWindNode={src,gain:g,filter:f};}

function playBirdChirp(){if(!audioCtx)return;const ctx=audioCtx,now=ctx.currentTime;
const freq=2000+Math.random()*2000;const o=ctx.createOscillator(),g=ctx.createGain();
o.type='sine';o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(freq*0.7,now+0.08);
g.gain.setValueAtTime(0.03,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.1);
o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+0.1);
if(Math.random()<0.6){const o2=ctx.createOscillator(),g2=ctx.createGain();o2.type='sine';
o2.frequency.setValueAtTime(freq*1.2,now+0.12);o2.frequency.exponentialRampToValueAtTime(freq*0.8,now+0.2);
g2.gain.setValueAtTime(0.025,now+0.12);g2.gain.exponentialRampToValueAtTime(0.001,now+0.22);
o2.connect(g2).connect(ctx.destination);o2.start(now+0.12);o2.stop(now+0.22);}}

function updateAmbientSounds(dt){if(!audioCtx)return;startAmbientWind();
const py=player.position.y;const isUG=py<40&&getBlock(Math.floor(player.position.x),Math.floor(py)+4,Math.floor(player.position.z))!==BLOCK.AIR;
if(isUG){caveTimer+=dt;if(caveTimer>8+Math.random()*15){caveTimer=0;
const ctx=audioCtx,now=ctx.currentTime,freq=40+Math.random()*60;const o=ctx.createOscillator(),g=ctx.createGain();
o.type='sine';o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(0.04,now+0.5);
g.gain.linearRampToValueAtTime(0,now+2.5);const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=300;
o.connect(f).connect(g).connect(ctx.destination);o.start(now);o.stop(now+3);}}
else{caveTimer=0;if(isDaytime()){birdTimer+=dt;if(birdTimer>3+Math.random()*8){birdTimer=0;playBirdChirp();}}}
if(ambientWindNode){const h=Math.min(1,Math.max(0,(py-SEA_LEVEL)/30));ambientWindNode.gain.gain.value=0.01+h*0.02;}}

const particles=[];
function getAvgColor(imgData){let r=0,g=0,b=0,c=0;for(let i=0;i<imgData.data.length;i+=4){if(imgData.data[i+3]<50)continue;
r+=imgData.data[i];g+=imgData.data[i+1];b+=imgData.data[i+2];c++;}if(c===0)return[128,128,128];return[(r/c)|0,(g/c)|0,(b/c)|0];}

function spawnParticles(x,y,z,bt){const tm=BLOCK_TEX_MAP[bt];if(!tm)return;const avg=getAvgColor(getTexImg(tm.side));
const col=new THREE.Color(avg[0]/255,avg[1]/255,avg[2]/255);
for(let i=0;i<8;i++){const geo=new THREE.BoxGeometry(0.1,0.1,0.1);
const mat=new THREE.MeshBasicMaterial({color:col.clone().offsetHSL(0,0,(Math.random()-0.5)*0.2)});
const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x+0.5+(Math.random()-0.5)*0.6,y+0.5+(Math.random()-0.5)*0.6,z+0.5+(Math.random()-0.5)*0.6);
scene.add(mesh);particles.push({mesh,vx:(Math.random()-0.5)*4,vy:Math.random()*5+2,vz:(Math.random()-0.5)*4,life:0.5+Math.random()*0.5});}}

function spawnColorParticles(x,y,z,color,count){for(let i=0;i<count;i++){const geo=new THREE.BoxGeometry(0.08,0.08,0.08);
const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(color).offsetHSL(0,0,(Math.random()-0.5)*0.3)});
const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x+(Math.random()-0.5)*0.8,y+(Math.random()-0.5)*0.8,z+(Math.random()-0.5)*0.8);
scene.add(mesh);particles.push({mesh,vx:(Math.random()-0.5)*3,vy:Math.random()*4+1,vz:(Math.random()-0.5)*3,life:0.4+Math.random()*0.4});}}

function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];
p.vy-=15*dt;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.position.z+=p.vz*dt;
p.life-=dt;p.mesh.material.opacity=Math.max(0,p.life*2);p.mesh.material.transparent=true;
if(p.life<=0){scene.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose();particles.splice(i,1);}}}

const player={position:new THREE.Vector3(),velocity:new THREE.Vector3(),onGround:false,pitch:0,yaw:0,
selectedSlot:0,isSprinting:false,inWater:false,health:10,hunger:10,baseFov:90,
fallStartY:null,isDead:false,lastDamageCause:'',attackCooldown:0,eatTimer:0,isEating:false};
const playerStats={blocksbroken:0,mobskilled:0};

const HOTBAR_PAGES=[
[makeBlockSlot(BLOCK.GRASS),makeBlockSlot(BLOCK.DIRT),makeBlockSlot(BLOCK.STONE),makeBlockSlot(BLOCK.WOOD),makeBlockSlot(BLOCK.PLANKS),makeBlockSlot(BLOCK.COBBLESTONE),makeBlockSlot(BLOCK.GLASS),makeBlockSlot(BLOCK.TORCH),makeBlockSlot(BLOCK.TNT)],
[makeBlockSlot(BLOCK.SAND),makeBlockSlot(BLOCK.SNOW),makeBlockSlot(BLOCK.ICE),makeBlockSlot(BLOCK.BRICK),makeBlockSlot(BLOCK.LEAVES),makeBlockSlot(BLOCK.BOOKSHELF),makeBlockSlot(BLOCK.MOSSY_COBBLESTONE),makeBlockSlot(BLOCK.GRAVEL),makeBlockSlot(BLOCK.CLAY)],
[makeBlockSlot(BLOCK.COAL_ORE),makeBlockSlot(BLOCK.IRON_ORE),makeBlockSlot(BLOCK.GOLD_ORE),makeBlockSlot(BLOCK.DIAMOND_ORE),makeBlockSlot(BLOCK.REDSTONE_ORE),makeBlockSlot(BLOCK.OBSIDIAN),makeBlockSlot(BLOCK.LAVA),makeBlockSlot(BLOCK.GLOWSTONE),makeBlockSlot(BLOCK.NETHERRACK)],
[makeItemSlot(ITEM.WOODEN_SWORD),makeItemSlot(ITEM.STONE_SWORD),makeItemSlot(ITEM.IRON_SWORD),makeItemSlot(ITEM.DIAMOND_SWORD),makeItemSlot(ITEM.STICK,1),makeItemSlot(ITEM.RAW_BEEF,1),makeItemSlot(ITEM.BREAD,1),makeItemSlot(ITEM.APPLE,1),makeBlockSlot(BLOCK.DOOR_BOTTOM)]];
let hotbarPage=0;
let hotbarSlots=HOTBAR_PAGES[0].map(s=>({...s}));
const hotbarEl=document.getElementById('hotbar');

function addItemToInventory(itemId,count){
for(let i=0;i<hotbarSlots.length;i++){const s=hotbarSlots[i];
if(s&&s.type==='item'&&s.item===itemId&&ITEM_DATA[itemId].stackable&&s.count<ITEM_DATA[itemId].maxStack){
s.count=Math.min(s.count+count,ITEM_DATA[itemId].maxStack);renderHotbar();return true;}}
for(let i=0;i<hotbarSlots.length;i++){if(!hotbarSlots[i]){hotbarSlots[i]=makeItemSlot(itemId,count);renderHotbar();return true;}}
return false;}

function drawSlotPreview(slot,size){const c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');
if(!slot)return c;
if(slot.type==='block'){const tm=BLOCK_TEX_MAP[slot.block];if(tm){const img=getTexImg(tm.side);if(img){const tmp=document.createElement('canvas');
tmp.width=tmp.height=16;tmp.getContext('2d').putImageData(img,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(tmp,0,0,size,size);}}}
else if(slot.type==='item'){const data=ITEM_DATA[slot.item];if(data){ctx.fillStyle=data.color||'#aaa';
if(data.type==='sword'){ctx.save();ctx.translate(size/2,size/2);ctx.rotate(-Math.PI/4);
ctx.fillRect(-size*0.08,-size*0.4,size*0.16,size*0.55);ctx.fillStyle='#8b6531';ctx.fillRect(-size*0.12,size*0.15,size*0.24,size*0.12);
ctx.fillRect(-size*0.06,size*0.27,size*0.12,size*0.18);ctx.restore();}
else if(data.type==='food'){if(slot.item===ITEM.APPLE){ctx.fillStyle='#d33';ctx.beginPath();ctx.arc(size/2,size*0.55,size*0.3,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#282';ctx.fillRect(size*0.45,size*0.15,size*0.1,size*0.2);}
else if(slot.item===ITEM.BREAD){ctx.fillStyle='#d4a030';ctx.beginPath();ctx.ellipse(size/2,size/2,size*0.4,size*0.25,0,0,Math.PI*2);ctx.fill();}
else{ctx.fillRect(size*0.2,size*0.2,size*0.6,size*0.6);}}
else{ctx.fillRect(size*0.25,size*0.25,size*0.5,size*0.5);}}}
return c;}

function renderHotbar(){hotbarEl.innerHTML='';
for(let i=0;i<9;i++){const div=document.createElement('div');div.className='hotbar-slot'+(i===player.selectedSlot?' selected':'');
const slot=hotbarSlots[i];const preview=drawSlotPreview(slot,34);preview.className='block-preview';div.appendChild(preview);
const num=document.createElement('span');num.className='slot-num';num.textContent=i+1;div.appendChild(num);
if(slot&&slot.count>1){const cnt=document.createElement('span');cnt.className='stack-count';cnt.textContent=slot.count;div.appendChild(cnt);}
if(i===player.selectedSlot){const nm=document.createElement('span');nm.className='slot-name';nm.textContent=getSlotName(slot);div.appendChild(nm);}
hotbarEl.appendChild(div);}}

function switchHotbarPage(p){HOTBAR_PAGES[hotbarPage]=hotbarSlots.map(s=>s?{...s}:null);
hotbarPage=((p%HOTBAR_PAGES.length)+HOTBAR_PAGES.length)%HOTBAR_PAGES.length;
hotbarSlots=HOTBAR_PAGES[hotbarPage].map(s=>s?{...s}:null);renderHotbar();}

let inventoryOpen=false;const invOverlay=document.getElementById('inventory-overlay');const invGrid=document.getElementById('inv-grid');
const ALL_BLOCKS=[BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE,BLOCK.WOOD,BLOCK.SAND,BLOCK.COBBLESTONE,BLOCK.PLANKS,BLOCK.BRICK,BLOCK.GLASS,BLOCK.LEAVES,
BLOCK.SNOW,BLOCK.COAL_ORE,BLOCK.IRON_ORE,BLOCK.GOLD_ORE,BLOCK.DIAMOND_ORE,BLOCK.BEDROCK,BLOCK.GRAVEL,BLOCK.CLAY,BLOCK.OBSIDIAN,BLOCK.TNT,
BLOCK.WATER,BLOCK.TORCH,BLOCK.ICE,BLOCK.BOOKSHELF,BLOCK.MOSSY_COBBLESTONE,BLOCK.LAVA,BLOCK.GLOWSTONE,BLOCK.NETHERRACK,BLOCK.REDSTONE_ORE,
BLOCK.DOOR_BOTTOM,BLOCK.CHEST];
const ALL_ITEMS=[ITEM.STICK,ITEM.WOODEN_SWORD,ITEM.STONE_SWORD,ITEM.IRON_SWORD,ITEM.DIAMOND_SWORD,
ITEM.WOODEN_PICKAXE,ITEM.STONE_PICKAXE,ITEM.IRON_PICKAXE,ITEM.DIAMOND_PICKAXE,
ITEM.WOODEN_AXE,ITEM.STONE_AXE,ITEM.IRON_AXE,ITEM.DIAMOND_AXE,
ITEM.WOODEN_SHOVEL,ITEM.STONE_SHOVEL,ITEM.IRON_SHOVEL,ITEM.DIAMOND_SHOVEL,
ITEM.RAW_BEEF,ITEM.PORKCHOP,ITEM.RAW_CHICKEN,ITEM.BREAD,ITEM.APPLE,ITEM.IRON_INGOT,ITEM.DIAMOND,ITEM.FEATHER,ITEM.SEEDS,ITEM.BONE];

function openInventory(){inventoryOpen=true;invOverlay.style.display='flex';document.exitPointerLock();
invGrid.innerHTML='';
const allSlots=[...ALL_BLOCKS.map(b=>makeBlockSlot(b)),...ALL_ITEMS.map(i=>makeItemSlot(i,1))];
for(const slot of allSlots){const div=document.createElement('div');div.className='inv-slot';
const c=drawSlotPreview(slot,32);div.appendChild(c);
const nm=document.createElement('span');nm.className='inv-name';nm.textContent=getSlotName(slot);div.appendChild(nm);
div.onclick=()=>{hotbarSlots[player.selectedSlot]=slot.type==='block'?makeBlockSlot(slot.block):makeItemSlot(slot.item,1);renderHotbar();closeInventory();};
invGrid.appendChild(div);}}
function closeInventory(){inventoryOpen=false;invOverlay.style.display='none';renderer.domElement.requestPointerLock();}

let craftingOpen=false;const craftOverlay=document.getElementById('crafting-overlay');const recipeList=document.getElementById('recipe-list');
const RECIPES=[
{inputs:[{type:'block',block:BLOCK.PLANKS,count:2}],output:{type:'item',item:ITEM.STICK,count:4},name:'Sticks'},
{inputs:[{type:'item',item:ITEM.STICK,count:1},{type:'block',block:BLOCK.PLANKS,count:2}],output:{type:'item',item:ITEM.WOODEN_SWORD,count:1},name:'Wooden Sword'},
{inputs:[{type:'item',item:ITEM.STICK,count:1},{type:'block',block:BLOCK.COBBLESTONE,count:2}],output:{type:'item',item:ITEM.STONE_SWORD,count:1},name:'Stone Sword'},
{inputs:[{type:'item',item:ITEM.STICK,count:1},{type:'item',item:ITEM.IRON_INGOT,count:2}],output:{type:'item',item:ITEM.IRON_SWORD,count:1},name:'Iron Sword'},
{inputs:[{type:'item',item:ITEM.STICK,count:1},{type:'item',item:ITEM.DIAMOND,count:2}],output:{type:'item',item:ITEM.DIAMOND_SWORD,count:1},name:'Diamond Sword'},
{inputs:[{type:'block',block:BLOCK.PLANKS,count:3}],output:{type:'item',item:ITEM.BREAD,count:1},name:'Bread'},
{inputs:[{type:'block',block:BLOCK.WOOD,count:1}],output:{type:'block',block:BLOCK.PLANKS,count:4},name:'Planks'},
{inputs:[{type:'block',block:BLOCK.COBBLESTONE,count:4}],output:{type:'block',block:BLOCK.BRICK,count:1},name:'Brick'},
{inputs:[{type:'block',block:BLOCK.STONE,count:4}],output:{type:'block',block:BLOCK.COBBLESTONE,count:4},name:'Cobblestone'},
{inputs:[{type:'block',block:BLOCK.PLANKS,count:6}],output:{type:'block',block:BLOCK.DOOR_BOTTOM,count:1},name:'Door'},
{inputs:[{type:'block',block:BLOCK.PLANKS,count:8}],output:{type:'block',block:BLOCK.CHEST,count:1},name:'Chest'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'block',block:BLOCK.PLANKS,count:3}],output:{type:'item',item:ITEM.WOODEN_PICKAXE,count:1},name:'Wood Pickaxe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'block',block:BLOCK.COBBLESTONE,count:3}],output:{type:'item',item:ITEM.STONE_PICKAXE,count:1},name:'Stone Pickaxe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'item',item:ITEM.IRON_INGOT,count:3}],output:{type:'item',item:ITEM.IRON_PICKAXE,count:1},name:'Iron Pickaxe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'item',item:ITEM.DIAMOND,count:3}],output:{type:'item',item:ITEM.DIAMOND_PICKAXE,count:1},name:'Diamond Pickaxe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'block',block:BLOCK.PLANKS,count:3}],output:{type:'item',item:ITEM.WOODEN_AXE,count:1},name:'Wood Axe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'block',block:BLOCK.COBBLESTONE,count:3}],output:{type:'item',item:ITEM.STONE_AXE,count:1},name:'Stone Axe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'item',item:ITEM.IRON_INGOT,count:3}],output:{type:'item',item:ITEM.IRON_AXE,count:1},name:'Iron Axe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'item',item:ITEM.DIAMOND,count:3}],output:{type:'item',item:ITEM.DIAMOND_AXE,count:1},name:'Diamond Axe'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'block',block:BLOCK.PLANKS,count:1}],output:{type:'item',item:ITEM.WOODEN_SHOVEL,count:1},name:'Wood Shovel'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'block',block:BLOCK.COBBLESTONE,count:1}],output:{type:'item',item:ITEM.STONE_SHOVEL,count:1},name:'Stone Shovel'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'item',item:ITEM.IRON_INGOT,count:1}],output:{type:'item',item:ITEM.IRON_SHOVEL,count:1},name:'Iron Shovel'},
{inputs:[{type:'item',item:ITEM.STICK,count:2},{type:'item',item:ITEM.DIAMOND,count:1}],output:{type:'item',item:ITEM.DIAMOND_SHOVEL,count:1},name:'Diamond Shovel'}];

function hasIngredients(recipe){for(const inp of recipe.inputs){let need=inp.count,have=0;
for(const s of hotbarSlots){if(!s)continue;if(inp.type==='block'&&s.type==='block'&&s.block===inp.block)have+=s.count;
if(inp.type==='item'&&s.type==='item'&&s.item===inp.item)have+=s.count;}if(have<need)return false;}return true;}
function consumeIngredients(recipe){for(const inp of recipe.inputs){let need=inp.count;
for(let i=0;i<hotbarSlots.length&&need>0;i++){const s=hotbarSlots[i];if(!s)continue;let match=false;
if(inp.type==='block'&&s.type==='block'&&s.block===inp.block)match=true;
if(inp.type==='item'&&s.type==='item'&&s.item===inp.item)match=true;
if(match){const take=Math.min(need,s.count);s.count-=take;need-=take;if(s.count<=0)hotbarSlots[i]=null;}}}}
function craftRecipe(recipe){if(!hasIngredients(recipe))return;consumeIngredients(recipe);
const out=recipe.output;
if(out.type==='block'){for(let i=0;i<hotbarSlots.length;i++){const s=hotbarSlots[i];
if(s&&s.type==='block'&&s.block===out.block){s.count+=out.count;renderHotbar();openCrafting();return;}}
for(let i=0;i<hotbarSlots.length;i++){if(!hotbarSlots[i]){hotbarSlots[i]={type:'block',block:out.block,count:out.count};renderHotbar();openCrafting();return;}}}
else{addItemToInventory(out.item,out.count);}renderHotbar();openCrafting();}

function openCrafting(){craftingOpen=true;craftOverlay.style.display='flex';document.exitPointerLock();
recipeList.innerHTML='';
for(const recipe of RECIPES){const row=document.createElement('div');row.className='recipe-row';
const canCraft=hasIngredients(recipe);row.style.opacity=canCraft?'1':'0.5';row.style.cursor=canCraft?'pointer':'not-allowed';
for(let i=0;i<recipe.inputs.length;i++){if(i>0){const plus=document.createElement('span');plus.textContent=' + ';plus.style.color='#fff';row.appendChild(plus);}
const inp=recipe.inputs[i];const item=document.createElement('div');item.className='recipe-item';
const slot=inp.type==='block'?makeBlockSlot(inp.block):makeItemSlot(inp.item,inp.count);
const preview=drawSlotPreview(slot,28);item.appendChild(preview);
const lbl=document.createElement('span');lbl.textContent=`×${inp.count} ${getSlotName(slot)}`;item.appendChild(lbl);row.appendChild(item);}
const arrow=document.createElement('span');arrow.className='recipe-arrow';arrow.textContent='→';row.appendChild(arrow);
const result=document.createElement('div');result.className='recipe-result';
const outSlot=recipe.output.type==='block'?makeBlockSlot(recipe.output.block):makeItemSlot(recipe.output.item,recipe.output.count);
result.appendChild(drawSlotPreview(outSlot,28));
const outLbl=document.createElement('span');outLbl.textContent=`×${recipe.output.count} ${recipe.name}`;result.appendChild(outLbl);row.appendChild(result);
if(canCraft)row.onclick=()=>craftRecipe(recipe);recipeList.appendChild(row);}}
function closeCrafting(){craftingOpen=false;craftOverlay.style.display='none';renderer.domElement.requestPointerLock();}

function toggleDoor(x,y,z){let by=y;if(getBlock(x,y,z)===BLOCK.DOOR_TOP)by--;
const key=`${x},${by},${z}`;doorStates.set(key,!doorStates.get(key));playSound('door');}

// (first chest section removed - duplicated below)

function getForwardDir(){const dir=new THREE.Vector3();camera.getWorldDirection(dir);return dir;}
function raycast(origin,direction,maxDist){
const dx=direction.x,dy=direction.y,dz=direction.z;
let x=Math.floor(origin.x),y=Math.floor(origin.y),z=Math.floor(origin.z);
const stepX=dx>0?1:-1,stepY=dy>0?1:-1,stepZ=dz>0?1:-1;
let tMaxX=dx!==0?((dx>0?x+1:x)-origin.x)/dx:Infinity;
let tMaxY=dy!==0?((dy>0?y+1:y)-origin.y)/dy:Infinity;
let tMaxZ=dz!==0?((dz>0?z+1:z)-origin.z)/dz:Infinity;
const tDeltaX=dx!==0?stepX/dx:Infinity,tDeltaY=dy!==0?stepY/dy:Infinity,tDeltaZ=dz!==0?stepZ/dz:Infinity;
let dist=0,prevX=x,prevY=y,prevZ=z;
for(let i=0;i<maxDist*3;i++){if(dist>maxDist)break;
const b=getBlock(x,y,z);
if(b!==BLOCK.AIR&&b!==BLOCK.WATER&&b!==BLOCK.LAVA){return{x,y,z,block:b,prevX,prevY,prevZ};}
prevX=x;prevY=y;prevZ=z;
if(tMaxX<tMaxY){if(tMaxX<tMaxZ){dist=tMaxX;x+=stepX;tMaxX+=tDeltaX;}else{dist=tMaxZ;z+=stepZ;tMaxZ+=tDeltaZ;}}
else{if(tMaxY<tMaxZ){dist=tMaxY;y+=stepY;tMaxY+=tDeltaY;}else{dist=tMaxZ;z+=stepZ;tMaxZ+=tDeltaZ;}}}
return null;}

function collideAxis(pos,vel,axis){const pw=PLAYER_WIDTH,ph=PLAYER_HEIGHT;
const minX=pos.x-pw,maxX=pos.x+pw,minY=pos.y,maxY=pos.y+ph,minZ=pos.z-pw,maxZ=pos.z+pw;
for(let bx=Math.floor(minX);bx<=Math.floor(maxX);bx++)
for(let by=Math.floor(minY);by<=Math.floor(maxY);by++)
for(let bz=Math.floor(minZ);bz<=Math.floor(maxZ);bz++){
if(!isBlockSolid(bx,by,bz))continue;
if(axis==='x'){if(vel.x>0)pos.x=bx-pw-0.001;else pos.x=bx+1+pw+0.001;vel.x=0;}
if(axis==='y'){if(vel.y>0)pos.y=by-ph-0.001;else{pos.y=by+1+0.001;player.onGround=true;}vel.y=0;}
if(axis==='z'){if(vel.z>0)pos.z=bz-pw-0.001;else pos.z=bz+1+pw+0.001;vel.z=0;}
return;}}

const zombies=[];const MAX_ZOMBIES=8;const ZOMBIE_SPEED=3;
function checkCollision(x,y,z){const pw=PLAYER_WIDTH,ph=PLAYER_HEIGHT;
for(let bx=Math.floor(x-pw);bx<=Math.floor(x+pw);bx++)
for(let by=Math.floor(y);by<=Math.floor(y+ph);by++)
for(let bz=Math.floor(z-pw);bz<=Math.floor(z+pw);bz++){if(isBlockSolid(bx,by,bz))return true;}return false;}
function canPlaceBlock(x,y,z){const pp=player.position;
if(Math.floor(pp.x)===x&&(Math.floor(pp.y)===y||Math.floor(pp.y+PLAYER_HEIGHT)===y)&&Math.floor(pp.z)===z)return false;return true;}
function createZombieMesh(){const g=new THREE.Group();
const body=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.9,0.3),new THREE.MeshLambertMaterial({color:0x2d8c2d}));body.position.y=1.15;g.add(body);
const head=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5),new THREE.MeshLambertMaterial({color:0x2d8c2d}));head.position.y=1.85;g.add(head);
const lEye=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.05),new THREE.MeshBasicMaterial({color:0x111111}));lEye.position.set(-0.12,1.9,0.26);g.add(lEye);
const rEye=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.05),new THREE.MeshBasicMaterial({color:0x111111}));rEye.position.set(0.12,1.9,0.26);g.add(rEye);
const mouth=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.06,0.05),new THREE.MeshBasicMaterial({color:0x111111}));mouth.position.set(0,1.72,0.26);g.add(mouth);
const lArm=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.8,0.2),new THREE.MeshLambertMaterial({color:0x2d8c2d}));lArm.position.set(-0.45,1.15,0.2);g.add(lArm);
const rArm=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.8,0.2),new THREE.MeshLambertMaterial({color:0x2d8c2d}));rArm.position.set(0.45,1.15,0.2);g.add(rArm);
for(let i=0;i<2;i++){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.7,0.25),new THREE.MeshLambertMaterial({color:0x1a5c1a}));
leg.position.set(i===0?-0.15:0.15,0.35,0);g.add(leg);}return g;}
function spawnZombie(){if(zombies.length>=MAX_ZOMBIES)return;
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

const skeletons=[];const MAX_SKELETONS=4;const SKEL_SPEED=3.5;const arrows=[];
function createSkeletonMesh(){const g=new THREE.Group();
const body=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.8,0.25),new THREE.MeshLambertMaterial({color:0xd4d0c8}));body.position.y=1.1;g.add(body);
const head=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5),new THREE.MeshLambertMaterial({color:0xe8e4dc}));head.position.y=1.8;g.add(head);
const lEye=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.12,0.05),new THREE.MeshBasicMaterial({color:0x111111}));lEye.position.set(-0.12,1.82,0.26);g.add(lEye);
const rEye=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.12,0.05),new THREE.MeshBasicMaterial({color:0x111111}));rEye.position.set(0.12,1.82,0.26);g.add(rEye);
const nose=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.15,0.05),new THREE.MeshBasicMaterial({color:0x222222}));nose.position.set(0,1.72,0.26);g.add(nose);
const lArm=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.7,0.15),new THREE.MeshLambertMaterial({color:0xc8c4bc}));lArm.position.set(-0.38,1.1,0);g.add(lArm);
const rArm=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.7,0.15),new THREE.MeshLambertMaterial({color:0xc8c4bc}));rArm.position.set(0.38,1.1,0);g.add(rArm);
for(let i=0;i<2;i++){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.65,0.15),new THREE.MeshLambertMaterial({color:0xb0aca4}));
leg.position.set(i===0?-0.12:0.12,0.32,0);g.add(leg);}return g;}

function spawnSkeleton(){if(skeletons.length>=MAX_SKELETONS)return;
const angle=Math.random()*Math.PI*2;const dist=20+Math.random()*15;
const sx=Math.floor(player.position.x+Math.cos(angle)*dist);
const sz=Math.floor(player.position.z+Math.sin(angle)*dist);
if(sx<1||sx>=WORLD_SIZE-1||sz<1||sz>=WORLD_SIZE-1)return;
let sy=-1;for(let y=WORLD_HEIGHT-1;y>=0;y--){if(isBlockSolid(sx,y,sz)){sy=y+1;break;}}
if(sy<2||sy>=WORLD_HEIGHT-2)return;
const mesh=createSkeletonMesh();mesh.position.set(sx+0.5,sy,sz+0.5);scene.add(mesh);
skeletons.push({mesh,health:10,x:sx+0.5,y:sy,z:sz+0.5,vy:0,shootTimer:2+Math.random(),wanderAngle:Math.random()*Math.PI*2,wanderTimer:0});}

function damageSkeleton(s,dmg){s.health-=dmg;playSound('mobhurt');
spawnColorParticles(s.x,s.y+1,s.z,0xd4d0c8,5);
if(s.health<=0){playSound('mobdie');scene.remove(s.mesh);
const si=skeletons.indexOf(s);if(si>=0)skeletons.splice(si,1);
playerStats.mobskilled++;addItemToInventory(ITEM.BONE,1+Math.floor(Math.random()*2));}}

function shootArrow(sk){
const dx=player.position.x-sk.x,dy=(player.position.y+1)-sk.y-1.5,dz=player.position.z-sk.z;
const d=Math.sqrt(dx*dx+dy*dy+dz*dz);if(d<1)return;
const speed=18;const vx=dx/d*speed,vy=dy/d*speed+2,vz=dz/d*speed;
const geo=new THREE.BoxGeometry(0.06,0.06,0.5);
const mat=new THREE.MeshLambertMaterial({color:0x8b6914});
const mesh=new THREE.Mesh(geo,mat);mesh.position.set(sk.x,sk.y+1.5,sk.z);
mesh.lookAt(player.position.x,player.position.y+1,player.position.z);
scene.add(mesh);arrows.push({mesh,x:sk.x,y:sk.y+1.5,z:sk.z,vx,vy,vz,life:4});}

function updateArrows(dt){for(let i=arrows.length-1;i>=0;i--){const a=arrows[i];
a.vy-=10*dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.z+=a.vz*dt;a.life-=dt;
a.mesh.position.set(a.x,a.y,a.z);
const dir=new THREE.Vector3(a.vx,a.vy,a.vz);if(dir.length()>0){a.mesh.lookAt(a.x+a.vx,a.y+a.vy,a.z+a.vz);}
const dx=a.x-player.position.x,dy=a.y-(player.position.y+0.9),dz=a.z-player.position.z;
if(dx*dx+dy*dy+dz*dz<0.6&&!player.isDead){damagePlayer(1.5,'skeleton');
scene.remove(a.mesh);a.mesh.geometry.dispose();a.mesh.material.dispose();arrows.splice(i,1);continue;}
if(a.life<=0||a.y<0||isBlockSolid(Math.floor(a.x),Math.floor(a.y),Math.floor(a.z))){
scene.remove(a.mesh);a.mesh.geometry.dispose();a.mesh.material.dispose();arrows.splice(i,1);}}}

function updateSkeletons(dt){
if(!isDaytime()&&Math.random()<0.006*dt&&skeletons.length<MAX_SKELETONS)spawnSkeleton();
if(isDaytime()){for(let i=skeletons.length-1;i>=0;i--){if(Math.random()<0.2*dt){scene.remove(skeletons[i].mesh);skeletons.splice(i,1);}}}
for(const s of skeletons){
const dx=player.position.x-s.x,dz2=player.position.z-s.z;
const dist=Math.sqrt(dx*dx+dz2*dz2);
if(dist<25&&!isDaytime()){
const idealDist=10;const a=Math.atan2(dz2,dx);
if(dist<8){const flee=a+Math.PI;const spd=SKEL_SPEED*dt;
const nx=s.x+Math.cos(flee)*spd,nz=s.z+Math.sin(flee)*spd;
if(!isBlockSolid(Math.floor(nx),Math.floor(s.y),Math.floor(nz))){s.x=nx;s.z=nz;}
else if(!isBlockSolid(Math.floor(nx),Math.floor(s.y+1),Math.floor(nz))){s.vy=7;}}
else if(dist>12){const spd=SKEL_SPEED*0.5*dt;
const nx=s.x+Math.cos(a)*spd,nz=s.z+Math.sin(a)*spd;
if(!isBlockSolid(Math.floor(nx),Math.floor(s.y),Math.floor(nz))){s.x=nx;s.z=nz;}}
s.mesh.rotation.y=Math.atan2(-dx,-dz2);
s.shootTimer-=dt;if(s.shootTimer<=0&&dist<20){s.shootTimer=2+Math.random();shootArrow(s);playSound('hit');}
}else{
s.wanderTimer-=dt;if(s.wanderTimer<=0){s.wanderAngle=Math.random()*Math.PI*2;s.wanderTimer=2+Math.random()*3;}
const nx=s.x+Math.cos(s.wanderAngle)*1.5*dt,nz=s.z+Math.sin(s.wanderAngle)*1.5*dt;
if(!isBlockSolid(Math.floor(nx),Math.floor(s.y),Math.floor(nz))){s.x=nx;s.z=nz;}}
s.vy-=GRAVITY*dt;s.y+=s.vy*dt;
const by=Math.floor(s.y);if(by>=0&&isBlockSolid(Math.floor(s.x),by,Math.floor(s.z))){s.y=by+1;s.vy=0;}
if(s.y<0){s.y=WORLD_HEIGHT;s.vy=0;}
s.x=Math.max(1,Math.min(WORLD_SIZE-2,s.x));s.z=Math.max(1,Math.min(WORLD_SIZE-2,s.z));
s.mesh.position.set(s.x,s.y,s.z);
const ws=dist<25&&!isDaytime()?6:3;const t=performance.now()/1000;
if(s.mesh.children[7])s.mesh.children[7].rotation.x=Math.sin(t*ws)*0.4;
if(s.mesh.children[8])s.mesh.children[8].rotation.x=Math.sin(t*ws+Math.PI)*0.4;}
updateArrows(dt);}

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
// MOBILE TOUCH CONTROLS
// ═══════════════════════════════════════
const isMobile='ontouchstart'in window||navigator.maxTouchPoints>1;
if(isMobile){
try{screen.orientation.lock('landscape').catch(()=>{});}catch(e){}
document.getElementById('mobile-controls').style.display='block';
blocker.querySelector('p').textContent='Tap to play!';
const mobileHotbar=document.getElementById('mob-hotbar');
const mcLook=document.getElementById('mc-look-zone');
const mcJoyZone=document.getElementById('mc-joystick-zone');
const mcThumb=document.getElementById('mc-joystick-thumb');
const mcJump=document.getElementById('mc-jump');
const mcBreak=document.getElementById('mc-break');
const mcPlace=document.getElementById('mc-place');
const mcInv=document.getElementById('mc-inv');
let joyTouchId=null,lookTouchId=null,joyOrigin={x:0,y:0};
const LOOK_SENS=0.004,JOY_MAX=50;
function resetJoy(){mcThumb.style.left='40px';mcThumb.style.top='40px';keys['KeyW']=false;keys['KeyS']=false;keys['KeyA']=false;keys['KeyD']=false;}
mcJoyZone.addEventListener('touchstart',e=>{e.preventDefault();const t=e.changedTouches[0];joyTouchId=t.identifier;
const r=mcJoyZone.getBoundingClientRect();joyOrigin={x:r.left+65,y:r.top+65};},{passive:false});
mcJoyZone.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier!==joyTouchId)continue;
let dx=t.clientX-joyOrigin.x,dy=t.clientY-joyOrigin.y;
const d=Math.sqrt(dx*dx+dy*dy);if(d>JOY_MAX){dx=dx/d*JOY_MAX;dy=dy/d*JOY_MAX;}
mcThumb.style.left=(40+dx)+'px';mcThumb.style.top=(40+dy)+'px';
const deadzone=12;keys['KeyW']=dy<-deadzone;keys['KeyS']=dy>deadzone;keys['KeyA']=dx<-deadzone;keys['KeyD']=dx>deadzone;}},{passive:false});
mcJoyZone.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===joyTouchId){joyTouchId=null;resetJoy();}});
mcJoyZone.addEventListener('touchcancel',e=>{joyTouchId=null;resetJoy();});
mcLook.addEventListener('touchstart',e=>{e.preventDefault();const t=e.changedTouches[0];lookTouchId=t.identifier;
mcLook._lx=t.clientX;mcLook._ly=t.clientY;},{passive:false});
mcLook.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier!==lookTouchId)continue;
const dx=t.clientX-mcLook._lx,dy=t.clientY-mcLook._ly;
mcLook._lx=t.clientX;mcLook._ly=t.clientY;
if(isLocked||isMobile){player.yaw-=dx*LOOK_SENS;player.pitch-=dy*LOOK_SENS;
player.pitch=Math.max(-Math.PI/2+0.01,Math.min(Math.PI/2-0.01,player.pitch));}}},{passive:false});
mcLook.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===lookTouchId)lookTouchId=null;});
let breakInterval=null;
mcBreak.addEventListener('touchstart',e=>{e.preventDefault();breakingState.mouseDown=true;
const cs=hotbarSlots[player.selectedSlot];
if(isSlotSword(cs)&&player.attackCooldown<=0){player.attackCooldown=0.4;handSwing=1;playSound('hit');
const dir=getForwardDir();
for(const z of[...zombies]){const dx2=z.x-camera.position.x,dy2=z.y+0.8-camera.position.y,dz2=z.z-camera.position.z;
const dist=Math.sqrt(dx2*dx2+dy2*dy2+dz2*dz2);if(dist<ATTACK_REACH){const dot=dx2*dir.x+dy2*dir.y+dz2*dir.z;
if(dot>0&&dot/dist>0.6){damageZombie(z,getSwordDamage(cs));break;}}}
for(const m of[...passiveMobs]){const dx2=m.x-camera.position.x,dy2=m.y+0.5-camera.position.y,dz2=m.z-camera.position.z;
const dist=Math.sqrt(dx2*dx2+dy2*dy2+dz2*dz2);if(dist<ATTACK_REACH){const dot=dx2*dir.x+dy2*dir.y+dz2*dir.z;
if(dot>0&&dot/dist>0.5){damagePassiveMob(m,getSwordDamage(cs));m.fleeTimer=3;m.fleeAngle=Math.atan2(m.z-player.position.z,m.x-player.position.x);break;}}}}
},{passive:false});
mcBreak.addEventListener('touchend',e=>{breakingState.mouseDown=false;});
mcBreak.addEventListener('touchcancel',e=>{breakingState.mouseDown=false;});
mcPlace.addEventListener('touchstart',e=>{e.preventDefault();
const cs=hotbarSlots[player.selectedSlot];
if(isSlotFood(cs)&&player.hunger<10){player.isEating=true;return;}
const dir=getForwardDir();const hit=raycast(camera.position,dir,REACH);
if(hit){
if(hit.block===BLOCK.DOOR_BOTTOM||hit.block===BLOCK.DOOR_TOP){
let doorY=hit.y;if(hit.block===BLOCK.DOOR_TOP)doorY=hit.y-1;
const kk=`${hit.x},${doorY},${hit.z}`;doorStates.set(kk,!doorStates.get(kk));
rebuildChunkAt(hit.x,hit.z);playSound('place');return;}
if(hit.block===BLOCK.CHEST){openChestUI(hit.x,hit.y,hit.z);return;}
if(cs&&cs.type==='block'){const px2=hit.prevX,py=hit.prevY,pz=hit.prevZ;
if(py>=0&&py<WORLD_HEIGHT&&canPlaceBlock(px2,py,pz)&&getBlock(px2,py,pz)===BLOCK.AIR){
if(cs.block===BLOCK.DOOR_BOTTOM){if(py+1<WORLD_HEIGHT&&getBlock(px2,py+1,pz)===BLOCK.AIR&&canPlaceBlock(px2,py+1,pz)){
setBlock(px2,py,pz,BLOCK.DOOR_BOTTOM);setBlock(px2,py+1,pz,BLOCK.DOOR_TOP);}else return;
}else{setBlock(px2,py,pz,cs.block);}
if(cs.block===BLOCK.TORCH)addTorchLight(px2,py,pz);
playSound('place');handSwing=1;cs.count--;if(cs.count<=0)hotbarSlots[player.selectedSlot]=null;renderHotbar();}}}
},{passive:false});
mcPlace.addEventListener('touchend',e=>{player.isEating=false;player.eatTimer=0;});
mcJump.addEventListener('touchstart',e=>{e.preventDefault();keys['Space']=true;},{passive:false});
mcJump.addEventListener('touchend',e=>{keys['Space']=false;});
mcJump.addEventListener('touchcancel',e=>{keys['Space']=false;});
mcInv.addEventListener('touchstart',e=>{e.preventDefault();
if(inventoryOpen)closeInventory();else if(craftingOpen)closeCrafting();else if(chestOpen)closeChest();else openInventory();},{passive:false});
const origRenderHotbar=renderHotbar;
renderHotbar=function(){origRenderHotbar();
if(!isMobile)return;
mobileHotbar.innerHTML='';
for(let i=0;i<9;i++){const div=document.createElement('div');div.className='hotbar-slot'+(i===player.selectedSlot?' selected':'');
const slot=hotbarSlots[i];const preview=drawSlotPreview(slot,28);preview.className='block-preview';div.appendChild(preview);
const num=document.createElement('span');num.className='slot-num';num.textContent=i+1;div.appendChild(num);
if(slot&&slot.count>1){const cnt=document.createElement('span');cnt.className='stack-count';cnt.textContent=slot.count;div.appendChild(cnt);}
div.addEventListener('touchstart',((idx)=>e=>{e.preventDefault();e.stopPropagation();player.selectedSlot=idx;renderHotbar();})(i),{passive:false});
mobileHotbar.appendChild(div);}};
blocker.addEventListener('touchstart',e=>{if(e.target.id==='new-world-btn')return;e.preventDefault();
isLocked=true;blocker.style.display='none';initAudio();},{passive:false});
const origOpenInv=openInventory,origClosInv=closeInventory,origOpenCraft=openCrafting,origClosCraft=closeCrafting;
const origOpenChestUI=openChestUI,origCloseChest=closeChest;
openInventory=function(){inventoryOpen=true;invOverlay.style.display='flex';
invGrid.innerHTML='';
const allSlots=[...ALL_BLOCKS.map(b=>makeBlockSlot(b)),...ALL_ITEMS.map(i=>makeItemSlot(i,1))];
for(const slot of allSlots){const div=document.createElement('div');div.className='inv-slot';
const c=drawSlotPreview(slot,32);div.appendChild(c);
const nm=document.createElement('span');nm.className='inv-name';nm.textContent=getSlotName(slot);div.appendChild(nm);
div.onclick=()=>{hotbarSlots[player.selectedSlot]=slot.type==='block'?makeBlockSlot(slot.block):makeItemSlot(slot.item,1);renderHotbar();closeInventory();};
invGrid.appendChild(div);}};
closeInventory=function(){inventoryOpen=false;invOverlay.style.display='none';};
openCrafting=function(){craftingOpen=true;craftOverlay.style.display='flex';
recipeList.innerHTML='';
for(const recipe of RECIPES){const row=document.createElement('div');row.className='recipe-row';
const canCraft=hasIngredients(recipe);row.style.opacity=canCraft?'1':'0.5';row.style.cursor=canCraft?'pointer':'not-allowed';
for(let i=0;i<recipe.inputs.length;i++){if(i>0){const plus=document.createElement('span');plus.textContent=' + ';plus.style.color='#fff';row.appendChild(plus);}
const inp=recipe.inputs[i];const item=document.createElement('div');item.className='recipe-item';
const sl=inp.type==='block'?makeBlockSlot(inp.block):makeItemSlot(inp.item,inp.count);
const preview=drawSlotPreview(sl,28);item.appendChild(preview);
const lbl=document.createElement('span');lbl.textContent=`×${inp.count} ${getSlotName(sl)}`;item.appendChild(lbl);row.appendChild(item);}
const arrow=document.createElement('span');arrow.className='recipe-arrow';arrow.textContent='→';row.appendChild(arrow);
const result=document.createElement('div');result.className='recipe-result';
const outSlot=recipe.output.type==='block'?makeBlockSlot(recipe.output.block):makeItemSlot(recipe.output.item,recipe.output.count);
result.appendChild(drawSlotPreview(outSlot,28));
const outLbl=document.createElement('span');outLbl.textContent=`×${recipe.output.count} ${recipe.name}`;result.appendChild(outLbl);row.appendChild(result);
if(canCraft)row.onclick=()=>craftRecipe(recipe);recipeList.appendChild(row);}};
closeCrafting=function(){craftingOpen=false;craftOverlay.style.display='none';};
}
// ═══════════════════════════════════════
// START
// ═══════════════════════════════════════
init();

