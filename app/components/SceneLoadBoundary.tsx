'use client';
import {Component,type ReactNode} from 'react';
export default class SceneLoadBoundary extends Component<{onError:()=>void;children:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onError();}
 render(){return this.state.failed?<div className="home-loading">The 3D home could not load. Please reload to try again.</div>:this.props.children;}
}
