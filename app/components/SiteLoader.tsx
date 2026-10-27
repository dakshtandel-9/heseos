type Props={percent:number;error:string};
export default function SiteLoader({percent,error}:Props){
 return <div className="site-loader" style={{position:'fixed',inset:0,zIndex:10000,background:'#000',color:'#fff'}} aria-label="Loading Heseos experience">
  <div className="site-loader-content">
   <span className="site-loader-brand">HESEOS<span>LIGHTING AHEAD</span></span>
   <div className="site-loader-orbit" aria-hidden="true"><i/><i/></div>
   <div className="site-loader-number" role="progressbar" aria-label="Website loading progress" aria-valuemin={1} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={error?'Loading interrupted':`${percent}% loaded`}><span>{String(percent).padStart(2,'0')}</span><small>%</small></div>
   <div className="site-loader-track" aria-hidden="true"><span style={{transform:`scaleX(${percent/100})`}}/></div>
   <p role="status">{error|| (percent===100?'Your home is ready.':'Preparing your connected home…')}</p>
   {error&&<button onClick={()=>window.location.reload()}>Try again</button>}
   <noscript><p>Please enable JavaScript to load the interactive home.</p></noscript>
  </div>
  <span className="site-loader-foot">SAVING POWER. ROOM BY ROOM.</span>
 </div>;
}
