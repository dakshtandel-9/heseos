import { Clapperboard, House, Moon, Plane } from 'lucide-react';

const SCENES = [
 {name:'Home',icon:House,detail:'Welcome-home scene selected'},
 {name:'Movie',icon:Clapperboard,detail:'Movie scene selected'},
 {name:'Sleep',icon:Moon,detail:'Sleep scene selected'},
 {name:'Away',icon:Plane,detail:'Away scene selected'},
] as const;

export default function SceneExamples() {
 return <div className="app-scene-examples" aria-label="Illustrative smart scene examples">
  <div className="app-scene-list">{SCENES.map(scene=><div key={scene.name} className={scene.name==='Home'?'active':''}><scene.icon size={16} aria-hidden="true"/><span>{scene.name}</span><span aria-hidden="true">›</span></div>)}</div>
  <p className="app-scene-feedback">{SCENES[0].detail} <span>· Illustration only</span></p>
 </div>;
}
