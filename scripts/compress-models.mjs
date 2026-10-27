// Rebuilds the web models in public/media/models from the original apartment GLBs kept at the repo root.
// Step 1 caps very dense meshes (one interior door alone had 1.1M triangles); step 2 is gltf-transform's
// optimize pipeline without palette merging, so the "Light" emissive material stays separate for the simulation.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, draco, flatten, instance, join, prune, resample, simplify, simplifyPrimitive, sparse, textureCompress, weld } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import fs from 'node:fs';

const MODELS=[
 {source:'../modern_apartment.glb',target:'public/media/models/apartment-1.glb',triangleBudget:12000},
 {source:'../appartement.glb',target:'public/media/models/apartment-2.glb'},
];
const root=new URL('..',import.meta.url);
await MeshoptSimplifier.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.encoder':await draco3d.createEncoderModule(),'draco3d.decoder':await draco3d.createDecoderModule()});
for(const model of MODELS){
 const source=new URL(model.source,root),target=new URL(model.target,root);
 if(!fs.existsSync(source)){console.error(`Missing ${model.source}; skipped.`);continue;}
 const doc=await io.read(source.pathname);
 await doc.transform(weld());
 if(model.triangleBudget)for(const mesh of doc.getRoot().listMeshes())for(const prim of mesh.listPrimitives()){
  const triangles=(prim.getIndices()?.getCount()??0)/3;
  if(prim.getMode()===4&&triangles>model.triangleBudget)simplifyPrimitive(prim,{simplifier:MeshoptSimplifier,ratio:Math.max(.03,model.triangleBudget/triangles),error:.02,lockBorder:false});
 }
 await doc.transform(
  dedup(),instance({min:5}),flatten(),join(),weld(),
  simplify({simplifier:MeshoptSimplifier,error:.0001}),resample(),prune({keepAttributes:false,keepIndices:false,keepLeaves:false}),sparse(),
  textureCompress({encoder:sharp,targetFormat:'webp',resize:[2048,2048]}),draco(),
 );
 await io.write(target.pathname,doc);
 console.log(`${model.target}: ${(fs.statSync(source).size/1e6).toFixed(1)} MB -> ${(fs.statSync(target).size/1e6).toFixed(2)} MB`);
}
