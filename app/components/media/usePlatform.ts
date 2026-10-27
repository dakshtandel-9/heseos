'use client';
import { useSyncExternalStore } from 'react';
// Browser capabilities as external stores: the server renders the motion-on, WebGL-on version.
const REDUCED='(prefers-reduced-motion: reduce)';
const subscribeMotion=(onChange:()=>void)=>{const media=matchMedia(REDUCED);media.addEventListener('change',onChange);return()=>media.removeEventListener('change',onChange);};
export const useReducedMotion=()=>useSyncExternalStore(subscribeMotion,()=>matchMedia(REDUCED).matches,()=>false);
let webgl:boolean|undefined;
function supportsWebGL(){
 if(webgl===undefined){try{const gl=document.createElement('canvas').getContext('webgl2');webgl=!!gl;gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{webgl=false;}}
 return webgl;
}
const never=()=>()=>{};
export const useWebGLSupport=()=>useSyncExternalStore(never,supportsWebGL,()=>true);
