// Simple marks for the social networks Heseos is on; the icon set has no brand logos.
export default function SocialIcon({id}:{id:'linkedin'|'instagram'|'youtube'|'facebook'}){
 return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  {id==='linkedin'&&<><rect x="3" y="9" width="4" height="12" rx=".5"/><circle cx="5" cy="5" r="2.2"/><path d="M10 9h3.8v1.8c.6-1.1 2-2.1 4-2.1 3.3 0 4.2 2 4.2 5V21h-4v-6.4c0-1.6-.4-2.7-1.9-2.7-1.6 0-2.1 1.2-2.1 2.8V21h-4z"/></>}
  {id==='instagram'&&<><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4z"/><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><circle cx="17.5" cy="6.5" r="1.2"/></>}
  {id==='youtube'&&<path d="M21.6 7.2c-.2-1-1-1.8-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.6.4c-1 .2-1.8 1-2 2C2 9 2 12 2 12s0 3 .4 4.8c.2 1 1 1.8 2 2 1.8.4 7.6.4 7.6.4s5.8 0 7.6-.4c1-.2 1.8-1 2-2 .4-1.8.4-4.8.4-4.8s0-3-.4-4.8zM10 15.2V8.8l5.2 3.2z"/>}
  {id==='facebook'&&<path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.7v8z"/>}
 </svg>;
}
