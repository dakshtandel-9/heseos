'use client';
import { useState } from 'react';
import { Clapperboard, House, Moon, Plane } from 'lucide-react';

const SCENES = [
 {name:'Home',icon:House,detail:'Welcome-home scene selected'},
 {name:'Movie',icon:Clapperboard,detail:'Movie scene selected'},
 {name:'Sleep',icon:Moon,detail:'Sleep scene selected'},
 {name:'Away',icon:Plane,detail:'Away scene selected'},
] as const;

export default function SceneExamples() {
 const [selected,setSelected]=useState<(typeof SCENES)[number]['name']>('Home');
 return <div className="app-scene-examples" aria-label="Illustrative smart scene examples">
  <div className="app-scene-list">{SCENES.map(scene=><button key={scene.name} type="button" className={selected===scene.name?'active':''} onClick={()=>setSelected(scene.name)} aria-pressed={selected===scene.name}><scene.icon size={16} aria-hidden="true"/><span>{scene.name}</span><span aria-hidden="true">›</span></button>)}</div>
  <p className="app-scene-feedback" role="status">{SCENES.find(scene=>scene.name===selected)?.detail} <span>· Illustration only</span></p>
 </div>;
}
