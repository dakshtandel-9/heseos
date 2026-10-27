import * as THREE from 'three';
export function faceGeometry(w: number, h: number, corners: number[][]) {
  const geometry = new THREE.PlaneGeometry(w, h, 32, 32);
  const uv = geometry.getAttribute('uv');
  // Projective map from a unit square to the photographed product face.
  const a = [[0,0],[1,0],[1,1],[0,1]].flatMap(([u,v],i)=>{
    const [x,y]=corners[i];return [[u,v,1,0,0,0,-u*x,-v*x,x],[0,0,0,u,v,1,-u*y,-v*y,y]];
  });
  for(let i=0;i<8;i++){let pivot=i;for(let j=i+1;j<8;j++)if(Math.abs(a[j][i])>Math.abs(a[pivot][i]))pivot=j;[a[i],a[pivot]]=[a[pivot],a[i]];const div=a[i][i];for(let k=i;k<9;k++)a[i][k]/=div;for(let j=0;j<8;j++)if(j!==i){const f=a[j][i];for(let k=i;k<9;k++)a[j][k]-=f*a[i][k];}}
  const t=a.map(row=>row[8]);
  for(let i=0;i<uv.count;i++){const u=uv.getX(i),v=1-uv.getY(i),d=t[6]*u+t[7]*v+1;uv.setXY(i,(t[0]*u+t[1]*v+t[2])/d/1672,1-(t[3]*u+t[4]*v+t[5])/d/941);}
  return geometry;
}
