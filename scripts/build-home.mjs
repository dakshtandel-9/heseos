import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import fs from 'node:fs/promises';
class FileReaderPolyfill {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result=result; this.onload?.({target:this}); this.onloadend?.({target:this}); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(result => { this.result=`data:${blob.type};base64,${Buffer.from(result).toString('base64')}`; this.onload?.({target:this}); this.onloadend?.({target:this}); }); }
}
globalThis.FileReader = FileReaderPolyfill;
const mats = {};
function mat(name,color,roughness=.65,metalness=0, extra={}) { mats[name] = new THREE.MeshStandardMaterial({name,color,roughness,metalness,...extra}); return mats[name]; }
mat('charcoal-architecture','#242a2b',.68,.16);
mat('graphite-metal','#151d20',.38,.7);
mat('warm-stone','#918777',.87);
mat('light-limestone','#b7ac97',.8);
mat('dark-travertine','#544e43',.85);
mat('walnut','#5d3d28',.6);
mat('walnut-light','#7f5a39',.65);
mat('walnut-dark','#3c2b21',.65);
mat('oak-floor','#98714d',.75);
mat('oak-alternate','#a37c55',.7);
mat('black-marble','#232c2c',.28,.1);
mat('brass','#b18b4c',.32,.75);
mat('linen','#c8bdaa',.94);
mat('cream-upholstery','#b8ac98',.95);
mat('taupe-upholstery','#84796a',.94);
mat('dark-upholstery','#333c3e',.94);
mat('cushion-terracotta','#9c6b4c',.95);
mat('bed-linen','#d7d1c7',.96);
mat('rug','#85765f',1);
mat('curtain','#a1947e',1);
mat('ceramic','#c9c2b1',.4);
mat('leaf-dark','#223e2e',.85);
mat('leaf-light','#4c6240',.95);
mat('soil','#292d21',1);
mat('grass','#354636',1);
mat('art-sand','#c6b59b',.9);
mat('art-ink','#45443b',.9);
mat('house-warm-light','#ffdf9e',.4,0,{emissive:'#ffb74e',emissiveIntensity:3});
mat('tv-screen','#0c1821',.22,.25,{emissive:'#426075',emissiveIntensity:.45});
mat('tv-image','#547074',.4,0,{emissive:'#688689',emissiveIntensity:.28});
mat('climate-led','#65d7ff',.25,0,{emissive:'#7dd9ff',emissiveIntensity:2});
mat('climate-white','#dadbd5',.28,.18);
mat('glass','#bdd1cc',.08,.05,{transparent:true,opacity:.12,depthWrite:false});
mat('car-paint','#1c2426',.2,.78);
mat('rubber','#111718',.9);
mat('smoked-glass','#253437',.1,.55);
const scene = new THREE.Scene(); scene.name='Saving Power — architectural smart home';
const root = new THREE.Group(); root.name='saving-power-home'; scene.add(root);
root.userData = { description:'Procedurally modeled architectural home based on the source proposal image. Three floors, open glass facade, nine furnished spaces and rooftop pavilion.', facadeDirection:'+Z', units:'metres' };
const buckets = new Map(); let section='architecture'; let matrix = new THREE.Matrix4(); let primitiveCount=0;
function add(g,m,x=0,y=0,z=0,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1) {
  let meshMatrix=new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)),new THREE.Vector3(sx,sy,sz));
  g=g.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(matrix,meshMatrix));
  if(g.index) g=g.toNonIndexed(); for(const attr of Object.keys(g.attributes)) if(!['position','normal'].includes(attr)) g.deleteAttribute(attr);
  const key=section+'::'+m; if(!buckets.has(key)) buckets.set(key,[]); buckets.get(key).push(g); primitiveCount++;
}
function box(w,h,d,x,y,z,m,ry=0,r=.0) { add(r ? new RoundedBoxGeometry(w,h,d,1,Math.min(r,w/2,h/2,d/2)) : new THREE.BoxGeometry(w,h,d),m,x,y,z,0,ry); }
function cyl(rt,rb,h,x,y,z,m,ry=0,rz=0) { add(new THREE.CylinderGeometry(rt,rb,h,16),m,x,y,z,0,ry,rz); }
function ball(rx,ry,rz,x,y,z,m,rot=0) { add(new THREE.SphereGeometry(1,12,8),m,x,y,z,0,0,rot,rx,ry,rz); }
function ring(r,t,x,y,z,m,rx=Math.PI/2) { add(new THREE.TorusGeometry(r,t,7,32),m,x,y,z,rx); }
function at(x,y,z,ry,fn) { const old=matrix.clone(); matrix.multiply(new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,ry,0)),new THREE.Vector3(1,1,1))); fn(); matrix=old; }
function named(name,fn) { let old=section; section=name; fn(); section=old; }
function plant(x,y,z,s=1) {
  at(x,y,z,0,()=>{ cyl(.24*s,.19*s,.47*s,0,.235*s,0,'dark-travertine'); cyl(.21*s,.21*s,.025*s,0,.48*s,0,'soil');
    for(let i=0;i<5;i++){const a=i*2.399; const h=(.9+(i%3)*.18)*s; cyl(.018*s,.025*s,h,Math.sin(a)*.09*s,.5*s+h/2,Math.cos(a)*.09*s,'walnut-dark');
      ball(.18*s,.39*s,.1*s,Math.sin(a)*.28*s,.65*s+h,Math.cos(a)*.28*s,i%2?'leaf-dark':'leaf-light',Math.sin(a)*.6);
      ball(.14*s,.32*s,.08*s,Math.sin(a)*.34*s,.45*s+h,Math.cos(a)*.34*s,'leaf-dark',-.6*Math.sin(a));
    }
  });
}
function vase(x,y,z,s=.3,m='ceramic') { cyl(.12*s,.19*s,.6*s,x,y+.3*s,z,m); ball(.2*s,.23*s,.2*s,x,y+.22*s,z,m); }
function book(x,y,z,w=.24,h=.4,m='walnut-light') { box(w,h,.25,x,y+h/2,z,m); box(w*.65,.013,.252,x,y+h*.83,z,'brass'); }
function art(x,y,z,w=1.4,h=1.8) { box(w+.10,h+.10,.06,x,y,z,'graphite-metal');box(w,h,.065,x,y,z+.035,'art-sand');
  ball(w*.25,h*.32,.016,x-w*.1,y+h*.01,z+.075,'art-ink',.3); ball(w*.21,h*.20,.014,x+w*.19,y-h*.22,z+.085,'taupe-upholstery',-.35);
}
function floorLamp(x,y,z){cyl(.24,.25,.07,x,y+.035,z,'graphite-metal');cyl(.024,.024,1.6,x,y+.85,z,'brass');cyl(.22,.30,.40,x,y+1.65,z,'linen');cyl(.21,.27,.02,x,y+1.445,z,'house-warm-light');}
function tableLamp(x,y,z) { cyl(.12,.17,.05,x,y+.025,z,'brass'); cyl(.024,.025,.30,x,y+.2,z,'brass');cyl(.15,.20,.30,x,y+.49,z,'linen');cyl(.15,.2,.015,x,y+.34,z,'house-warm-light'); }
function pendant(x,y,z,r=.55){cyl(.015,.015,.6,x,y+.32,z,'brass');ring(r,.035,x,y,z,'brass');ring(r-.025,.018,x,y-.025,z,'house-warm-light');}
function sofa(x,y,z,w=2.8,ry=0,m='cream-upholstery') { at(x,y,z,ry,()=>{
  box(w,.28,1.1,0,.26,0,m,0,.1); box(w-.3,.57,.25,0,.65,.43,m,0,.09);
  for(let i of [-1,1]) {box(.20,.45,1.0,i*(w/2-.12),.54,0,m,0,.085);cyl(.026,.026,.18,i*(w/2-.22),.09,-.37,'brass');cyl(.026,.026,.18,i*(w/2-.22),.09,.37,'brass');}
  const n=w>2?3:1; for(let i=0;i<n;i++){box((w-.48)/n-.025,.17,.75,(i-(n-1)/2)*(w-.48)/n,.48,-.10,m,0,.07);box((w-.58)/n-.03,.4,.15,(i-(n-1)/2)*(w-.48)/n,.76,.30,m,0,.07);}
  box(.37,.35,.16,-w*.28,.68,.15,'cushion-terracotta',.1,.06);box(.34,.32,.15,w*.28,.67,.12,'linen',-.1,.06);
}); }
function coffeeTable(x,y,z,w=1.45,d=.85) {box(w,.11,d,x,y+.40,z,'black-marble',0,.035);box(w*.78,.30,d*.72,x,y+.20,z,'walnut-dark',0,.02);box(.31,.045,.23,x-.27,y+.48,z,'linen',.16);vase(x+.26,y+.47,z,.34);}
function rug(x,y,z,w,d) {box(w,.025,d,x,y+.022,z,'rug',0,.02);box(w-.12,.01,.018,x,y+.04,z+d/2-.065,'linen');box(w-.12,.01,.018,x,y+.04,z-d/2+.065,'linen');}
function shelves(x,y,z,w=1) {box(w,2.7,.4,x,y+1.35,z,'walnut-dark'); for(let j=0;j<4;j++){const sy=y+.2+j*.67;box(w+.02,.055,.5,x,sy,z+.03,'walnut');box(w-.1,.016,.028,x,sy+.045,z+.28,'house-warm-light');
  if(j%2===0){vase(x-.2,sy+.028,z+.14,.68);book(x+.19,sy+.028,z+.12,.16,.36,'walnut-light');book(x+.37,sy+.028,z+.12,.12,.43,'linen');}else{ball(.13,.15,.12,x+.2,sy+.19,z+.14,'ceramic');book(x-.25,sy+.028,z+.15,.18,.31,'taupe-upholstery');}}
}
function tv(x,y,z,w=2.65,h=1.43){box(w+.065,h+.065,.1,x,y,z,'graphite-metal',0,.025);box(w,h,.018,x,y,z+.062,'tv-screen',0,.012);box(w*.70,.09,.022,x,y-h*.19,z+.077,'tv-image');box(w*.40,.025,.023,x-w*.15,y-h*.08,z+.078,'tv-image');cyl(.015,.015,.02,x+w/2-.08,y-h/2+.045,z+.072,'house-warm-light',0,Math.PI/2);}
function cove(x,y,w=6.35,d=6.35) {box(w,.035,.035,x,y,-2.95,'house-warm-light');box(.035,.035,d,x-w/2,y,.20,'house-warm-light');}
function curtain(x,y,z){for(let i=0;i<7;i++) cyl(.055,.055,2.74,x+(i-3)*.09,y+1.48,z,'curtain');box(.72,.06,.16,x,y+2.87,z,'walnut-dark');}
function wallPanels(cx,y,m='walnut'){for(let i=0;i<8;i++) box(.802,2.98,.10,cx+(i-3.5)*.82,y+1.61,-3.42,i%4===1?'walnut-light':m);}
// Architectural shell. Each complete storey is 3.3 m; three interior bays of 7 m.
named('01-architectural-shell',()=>{
  box(22.4,.32,8.0,0,-.23,.12,'light-limestone');
  for(let level=0;level<4;level++){const y=level*3.3;box(21.6,.27,7.9,0,y-.04,0,'charcoal-architecture');box(21.35,.085,7.6,0,y-.21,0,'graphite-metal'); if(level<3)box(20.6,.10,7.0,0,y+.10,0,'oak-floor');}
  box(20.85,9.66,.23,0,4.88,-3.67,'dark-travertine');
  for(let x of [-10.48,-3.52,3.52,10.48]) {box(.20,9.8,.30,x,4.88,3.50,'graphite-metal');box(.19,9.8,.26,x,4.88,-3.42,'charcoal-architecture');}
  for(let x of [-10.55,10.55])box(.17,9.6,6.85,x,4.85,-.1,'charcoal-architecture');
  for(let y of [3.3,6.6]){box(21.62,.23,.18,0,y+.02,3.92,'charcoal-architecture');box(21.3,.045,.10,0,y-.22,3.91,'brass');}
  // Thin side glazing panels and front mullions retain a visibly open facade.
  for(let level=0;level<3;level++){let y=level*3.3; for(let x of [-10.38,10.38]){box(.023,2.95,6.6,x,y+1.65,.05,'glass');for(let z of [-2.8,.2,3.25])box(.055,2.99,.07,x,y+1.62,z,'graphite-metal');}
    for(let x of [-7,0,7]){box(6.47,.03,.055,x,y+3.07,3.52,'graphite-metal');box(.045,2.98,.08,x+2.82,y+1.63,3.52,'graphite-metal');}
  }
  // Central rooftop pavilion, broad floating overhang, setback side terraces.
  box(10.55,.20,4.5,0,11.45,-.42,'charcoal-architecture');box(10.15,.055,4.05,0,11.32,-.48,'walnut-dark');
  box(9.3,1.31,.15,0,10.57,-2.43,'walnut');for(let x of [-4.67,4.67]) box(.18,1.4,3.5,x,10.6,-.68,'charcoal-architecture');
  for(let x of [-4.52,-1.5,1.5,4.52])box(.07,1.35,.085,x,10.65,1.38,'graphite-metal');box(9.03,1.23,.02,0,10.62,1.4,'glass');box(8.8,.025,.045,0,11.2,-2.30,'house-warm-light');
  for(let x of [-8,8]){box(4.5,.11,3.2,x,10.08,-1.05,'charcoal-architecture');box(4.4,.35,.11,x,10.20,-2.7,'graphite-metal');}
  // Thin glass terrace railings near the front edges.
  for(let level of [1,2])for(let x of [-7,7]){box(6.4,.75,.025,x,level*3.3+.55,3.68,'glass');box(6.48,.03,.045,x,level*3.3+.93,3.68,'graphite-metal');}
});
// Furnished bays have contrasting wall finishes, articulated flooring, and cove light.
for(let level=0;level<3;level++)for(let bay=0;bay<3;bay++){const cx=(bay-1)*7;const fy=level*3.3+.15; named(`room-${level}-${bay}`,()=>{
  if(!(level===0&&bay===0)){wallPanels(cx,level*3.3,bay===1?'walnut-dark':'walnut');
    for(let i=0;i<13;i++)box(.475,.02,6.65,cx+(i-6)*.485,fy+.02,-.05,i%3===0?'oak-alternate':'oak-floor');
    box(6.55,.08,6.7,cx,level*3.3+3.08,-.05,'walnut-light');cove(cx,level*3.3+2.99);
    for(let dx of [-2.4,2.4])for(let z of [-1.4,1.65])cyl(.05,.05,.018,cx+dx,level*3.3+3.024,z,'house-warm-light');
  }
  if(level>0)for(let side of [-1,1])curtain(cx+side*3.01,fy,3.22);
});}
// Middle-centre living room: the first scroll destination.
named('living-room',()=>{const y=3.48;
  box(4.85,2.7,.12,0,y+1.44,-3.17,'dark-travertine');tv(0,y+1.62,-3.03,2.7,1.47);
  box(4.9,.27,.60,0,y+.40,-2.77,'walnut-dark',0,.025);box(4.7,.025,.04,0,y+.22,-2.47,'house-warm-light');
  shelves(-2.89,y,-3.12,.66);shelves(2.89,y,-3.12,.66);
  rug(0,y,.9,4.8,3.25);sofa(-.75,y,1.8,3.2,0);sofa(2.05,y,.25,1.27,-Math.PI/2,'taupe-upholstery');coffeeTable(0,y,.34,1.85,1.0);
  floorLamp(-2.72,y,-.5);plant(2.6,y,2.55,.68);vase(-2,y+.545,-2.77,.82);vase(1.99,y+.545,-2.77,.65);pendant(-1.8,y+2.20,.45,.45);
});
// Upper-centre main bedroom and real, wall-mounted climate unit.
named('bedroom',()=>{const y=6.78;
  box(3.75,2.56,.16,0,y+1.45,-3.12,'dark-travertine');for(let i=0;i<13;i++)box(.035,2.48,.025,-1.78+i*.298,y+1.45,-3.02,'walnut-dark');
  rug(0,y,-.25,4.9,4.6);box(3.18,.37,3.68,0,y+.22,-.42,'walnut-dark',0,.07);box(3.07,.29,3.57,0,y+.53,-.43,'bed-linen',0,.13);
  box(3.26,1.19,.21,0,y+.68,-2.22,'taupe-upholstery',0,.08);box(3.06,.13,2.25,0,y+.71,.13,'linen',0,.065);
  box(3.08,.10,.75,0,y+.81,.8,'taupe-upholstery',0,.05);for(let x of [-.82,.82]){box(1.07,.23,.67,x,y+.77,-1.42,'bed-linen',-.03*x,.11);box(.69,.24,.38,x,y+.85,-.93,'dark-upholstery',.05*x,.10);}
  for(let x of [-2.11,2.11]){box(.72,.44,.76,x,y+.26,-1.80,'walnut',0,.025);box(.74,.07,.78,x,y+.52,-1.80,'black-marble');tableLamp(x,y+.56,-1.8);}
  box(1.86,.47,.23,0,y+2.48,-2.995,'climate-white',0,.08);box(1.51,.06,.031,0,y+2.34,-2.866,'graphite-metal');
  for(let i=0;i<5;i++)box(1.45,.008,.012,0,y+2.32+i*.013,-2.847,'climate-white');box(.12,.028,.018,.63,y+2.46,-2.867,'climate-led');
  box(2.0,.44,.53,0,y+.25,1.82,'taupe-upholstery',0,.065);plant(2.75,y,.55,.72);art(-2.77,y+1.91,-3.23,.6,1.18);
});
// Ground-right home cinema.
named('theatre',()=>{const y=.18;
  box(4.55,2.65,.14,7,y+1.50,-3.15,'dark-travertine');tv(7,y+1.72,-3.03,3.4,1.75);
  box(5.75,.23,.6,7,y+.40,-2.78,'walnut',0,.018);box(5.65,.027,.035,7,y+.24,-2.45,'house-warm-light');
  box(1.0,.07,.17,7,y+.56,-2.52,'graphite-metal',0,.025);shelves(9.82,y,-3.05,.9);art(4.14,y+1.64,-3.21,.64,1.46);
  rug(7,y,.7,5.4,4.5);sofa(6.2,y,1.65,3.0,0,'dark-upholstery');sofa(9.0,y,.4,1.23,-Math.PI/2,'dark-upholstery');coffeeTable(7,y,.2,1.7,1.1);
  box(.85,.31,.70,5.0,y+.23,.25,'taupe-upholstery',0,.12);plant(9.9,y,1.92,.9);floorLamp(4.32,y,-1.74);
});
// Middle-left dining room with an island kitchen, stools, cabinetry and pendant.
named('kitchen-dining',()=>{const y=3.48;
  box(5.5,.77,.81,-7,y+.40,-2.63,'walnut-dark');box(5.56,.10,.89,-7,y+.83,-2.61,'black-marble');
  for(let i=0;i<7;i++)box(.019,.66,.02,-9.34+i*.78,y+.43,-2.213,'brass');box(4.94,.79,.38,-7,y+2.32,-3.0,'walnut');box(4.8,.022,.035,-7,y+1.91,-2.8,'house-warm-light');
  box(2.36,1.0,.09,-7,y+1.39,-3.15,'black-marble');box(.96,.025,.45,-7,y+.90,-2.58,'graphite-metal');for(let dx of [-.26,.26])for(let dz of [-.12,.12])ring(.115,.007,-7+dx,y+.922,-2.58+dz,'brass');
  box(2.25,.76,.76,-8.58,y+.41,-.90,'walnut');box(2.4,.105,.88,-8.58,y+.84,-.9,'light-limestone');
  box(3.10,.115,1.22,-6.53,y+.81,1.1,'walnut-light',0,.035);for(let x of [-7.5,-5.56])for(let z of [.77,1.43])box(.085,.75,.085,x,y+.4,z,'graphite-metal');
  for(let x of [-7.56,-6.52,-5.48])for(let z of [.11,2.08])at(x,y,z,z>1?0:Math.PI,()=>{box(.49,.095,.50,0,.49,0,'taupe-upholstery',0,.055);box(.50,.48,.09,0,.72,.21,'taupe-upholstery',0,.045);for(let dx of [-.18,.18])for(let dz of [-.18,.18])box(.036,.45,.036,dx,.225,dz,'graphite-metal');});
  pendant(-6.5,y+2.18,1.1,.70);plant(-9.87,y,2.51,.85);vase(-6.5,y+.88,1.1,.83);vase(-9.07,y+.90,-.9,.4);
});
// Middle-right reading lounge with library.
named('reading-lounge',()=>{const y=3.48;art(7,y+1.79,-3.20,2.30,1.87);shelves(9.84,y,-3.08,.84);
 rug(7,y,.65,5.1,4.5);sofa(7.3,y,-1.70,2.65,Math.PI,'taupe-upholstery');sofa(5.15,y,1.0,1.18,Math.PI/2);sofa(9.15,y,.93,1.18,-Math.PI/2);coffeeTable(7.05,y,.62,1.65,.96);
 for(let x of [5.42,8.66]){box(.57,.59,.57,x,y+.34,-1.85,'walnut-dark');tableLamp(x,y+.66,-1.85);}plant(9.73,y,2.65,.73);plant(4.28,y,-1.4,.9);
});
// Upper-left quiet lounge.
named('upper-lounge',()=>{const y=6.78;art(-7,y+1.89,-3.21,1.56,1.8);shelves(-9.70,y,-3.11,.91);rug(-7,y,.2,5.1,4.25);sofa(-7.0,y,-1.75,2.48,Math.PI);sofa(-5.1,y,.8,1.30,-Math.PI/2,'taupe-upholstery');coffeeTable(-7.2,y,.28,1.55,.95);floorLamp(-9.38,y,-1.55);plant(-9.6,y,2.62,.85);pendant(-7.25,y+2.13,.65,.56);});
// Upper-right study / guest lounge.
named('upper-study',()=>{const y=6.78;art(7,y+1.78,-3.20,1.65,1.8);shelves(9.71,y,-3.1,1.0);rug(7,y,.15,5.2,4.75);sofa(7,y,-1.68,2.68,Math.PI);sofa(9.18,y,1.17,1.25,-Math.PI/2);coffeeTable(7.15,y,.74,1.65,1.0);floorLamp(5.16,y,-1.80);plant(4.37,y,2.66,.82);box(1.45,.09,.75,5.04,y+.81,.27,'walnut');for(let x of [4.48,5.58])box(.055,.77,.58,x,y+.39,.27,'graphite-metal');book(5.12,y+.86,.16,.2,.34,'ceramic');});
// Entrance, stone staircase, door and landing on ground-centre.
named('entrance-staircase',()=>{const y=.18;
  box(2.15,2.68,.17,.50,y+1.34,-2.85,'light-limestone');box(1.71,2.39,.20,.50,y+1.2,-2.72,'walnut-dark');
  for(let i=0;i<9;i++)box(1.60,.014,.024,.5,y+.20+i*.245,-2.609,'walnut-light');box(.036,.60,.047,1.14,y+1.11,-2.57,'brass');
  art(2.25,y+1.65,-3.18,.71,1.48);plant(2.37,y,-1.68,.77);plant(-2.60,y,2.47,.65);
  for(let i=0;i<12;i++){let sy=y+.13+i*.251;let sz=2.32-i*.435;box(1.52,.11,.53,-1.91,sy,sz,'dark-travertine');box(1.41,.026,.032,-1.91,sy+.058,sz+.255,'house-warm-light');}
  // Slim stringers and a glass staircase balustrade track the rise.
  box(.12,3.15,.15,-2.65,y+1.63,-.1,'graphite-metal');box(.024,2.55,5.25,-1.1,y+1.47,-.18,'glass');
  for(let i=0;i<6;i++){box(.022,.89,.022,-1.075,y+.6+i*.5,2.30-i*.87,'graphite-metal');}
  box(2.05,.12,1.45,.65,y-.02,2.0,'light-limestone');box(2.08,.025,.025,.65,y+.052,2.73,'house-warm-light');
});
// Ground-left garage and geometric premium saloon.
named('garage',()=>{const y=.18;box(6.66,.09,6.7,-7,y,-.1,'dark-travertine');wallPanels(-7,0,'walnut-dark');box(6.43,.05,6.5,-7,3.07,-.05,'walnut-dark');box(.04,.035,5.4,-9.99,2.97,-.15,'house-warm-light');box(.04,.035,5.4,-4.05,2.97,-.15,'house-warm-light');
 at(-7,y+.17,.16,-.12,()=>{box(2.05,.40,4.37,0,.54,0,'car-paint',0,.22);box(1.96,.32,3.66,0,.79,-.24,'car-paint',0,.15);box(1.69,.57,2.12,0,1.02,-.38,'smoked-glass',0,.22);box(1.75,.09,1.75,0,1.32,-.5,'car-paint',0,.055);
 for(let x of [-1.0,1.0])for(let z of [-1.34,1.38]){cyl(.39,.39,.22,x,.35,z,'rubber',0,Math.PI/2);cyl(.265,.265,.228,x,.35,z,'graphite-metal',0,Math.PI/2);cyl(.205,.205,.235,x,.35,z,'brass',0,Math.PI/2);cyl(.11,.11,.24,x,.35,z,'graphite-metal',0,Math.PI/2);}
 box(1.18,.25,.045,0,.55,2.19,'graphite-metal',0,.06);for(let x of [-.70,.70])box(.43,.07,.052,x,.78,2.09,'house-warm-light',0,.025);box(1.71,.035,.05,0,.80,-2.12,'brass');for(let x of [-1.02,1.02])box(.20,.11,.27,x,1.0,.25,'car-paint',0,.04);
 });
});
// Rooftop furniture visible through the pavilion glass.
named('roof-pavilion',()=>{box(8.8,.05,3.3,0,10.03,-.4,'oak-floor');sofa(-1.7,10.08,-1.15,2.65,Math.PI);coffeeTable(.3,10.08,-.38,1.3,.8);plant(3.9,10.05,-1.15,.68);});
// Front approach, broad lit stairs and landscaped edges.
named('landscape',()=>{
 box(25.5,.30,13.8,0,-.73,1.2,'dark-travertine',0,.12);box(22.5,.09,3.3,0,-.43,5.15,'light-limestone');
 for(let row=0;row<3;row++)for(let col=0;col<15;col++)box(1.43,.027,.94,(col-7)*1.47,-.372,4.11+row*1.0,(row+col)%4===0?'warm-stone':'light-limestone');
 for(let i=0;i<5;i++){box(5.1,.11,.40,2,-.40-i*.11,6.9+i*.39,'warm-stone');box(4.98,.018,.020,2,-.343-i*.11,7.088+i*.39,'house-warm-light');}
 for(let x of [-9,8.55]){box(5.05,.16,2.35,x,-.45,6.95,'grass',0,.04);box(5.15,.16,.12,x,-.44,5.70,'light-limestone');}
 for(let side of [-1,1]){let x=side*11.55;box(1.2,.38,8.0,x,-.22,1.15,'light-limestone');box(1.05,.04,7.8,x,-.008,1.15,'soil');
  for(let j=0;j<8;j++){ball(.58,.44,.62,x,.26,-2.17+j*.94,j%2?'leaf-dark':'leaf-light');}
  for(let j=0;j<3;j++){let z=-1.7+j*2.4;cyl(.07,.13,3.1,x,.90,z,'walnut-dark');ball(.88,1.45,.8,x,2.9,z,'leaf-dark');ball(.62,1.0,.65,x+.28,3.55,z,'leaf-light');}
 }
 for(let x of [-11.1,-6.5,-.9,4.9,10.8]){box(.13,.47,.13,x,-.15,7.5,'graphite-metal');box(.145,.065,.145,x,.10,7.5,'house-warm-light');}
 for(let x of [-3.85,3.8]){box(1.05,.37,1.05,x,-.18,5.15,'light-limestone');for(let i=0;i<4;i++)ball(.4,.4,.4,x+Math.sin(i*2.4)*.22,.16,5.15+Math.cos(i*2.4)*.22,'leaf-dark');}
});
// Merge static pieces into one geometry for each room and material. No textures or image planes.
const sections = new Map();let triangles=0;
for(const [key,geometries] of buckets){ const [name,matName]=key.split('::');if(!sections.has(name)){const group=new THREE.Group();group.name=name;root.add(group);sections.set(name,group);}
 let merged=mergeVertices(mergeGeometries(geometries,false)); merged.computeBoundingBox();merged.computeBoundingSphere();triangles+=(merged.index ? merged.index.count : merged.attributes.position.count)/3;
 const mesh=new THREE.Mesh(merged,mats[matName]);mesh.name=`${name}-${matName}`;mesh.castShadow=!['glass','house-warm-light'].includes(matName);mesh.receiveShadow=matName!=='glass';sections.get(name).add(mesh);for(const geo of geometries)geo.dispose();
}
// Empty named nodes are stable interaction / camera anchor points.
const anchors={
 'anchor-home':[0,4.7,.0],
 'anchor-living-room':[0,4.75,-.15],
 'anchor-living-product':[2.10,4.9,-3.02],
 'anchor-climate':[0,9.20,-2.78],
 'anchor-bedroom':[0,8.15,-.50],
 'anchor-theatre':[7,1.9,-2.67],
 'anchor-theatre-product':[9.05,1.55,-3.02],
};
for(const [name,position] of Object.entries(anchors)){const anchor=new THREE.Object3D();anchor.name=name;anchor.position.fromArray(position);root.add(anchor);}
scene.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(root);
const output=await new GLTFExporter().parseAsync(scene,{binary:true,onlyVisible:true,maxTextureSize:1024});
const path=new URL('../public/assets/heseos-home.glb',import.meta.url);await fs.writeFile(path,Buffer.from(output));
const metadata={path,bytes:output.byteLength,primitiveCount,meshCount:buckets.size,triangles,materialNames:Object.keys(mats),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray(),size:bounds.getSize(new THREE.Vector3()).toArray()},anchors};
await fs.writeFile(new URL('../public/assets/home-metadata.json',import.meta.url),JSON.stringify(metadata,null,2));console.log(JSON.stringify(metadata,null,2));
