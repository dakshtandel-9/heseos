export type VoiceState='loading'|'ready'|'starting'|'listening'|'processing'|'speaking'|'paused'|'error';
type RecognitionResult=ArrayLike<{transcript:string}> & {isFinal:boolean};
export type RecognitionEvent={resultIndex:number;results:ArrayLike<RecognitionResult>};
export type Recognition={
 lang:string;continuous:boolean;interimResults:boolean;
 onstart:(()=>void)|null;onspeechend:(()=>void)|null;onaudioend:(()=>void)|null;
 onresult:((event:RecognitionEvent)=>void)|null;onerror:((event:{error:string})=>void)|null;onend:(()=>void)|null;
 start:()=>void;stop:()=>void;abort:()=>void;
};
export type SpeechWindow=Window & {SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};
export type VoiceSession={start:()=>void;stop:()=>void;dispose:()=>void;pause:(reason:'speech'|'hidden')=>void;resume:(reason:'speech'|'hidden')=>void;isEnabled:()=>boolean};
type Callbacks={onState:(state:VoiceState,message?:string)=>void;onEnabled:(enabled:boolean)=>void;onTranscript:(text:string)=>void};
type Timer={set:(callback:()=>void,delay:number)=>unknown;clear:(id:unknown)=>void};
const defaultTimer:Timer={set:(callback,delay)=>setTimeout(callback,delay),clear:id=>clearTimeout(id as ReturnType<typeof setTimeout>)};
const FATAL_ERRORS:Record<string,string>={
 'not-allowed':'Allow microphone access, then tap the mic to enable it.',
 'service-not-allowed':'Voice service unavailable. You can type a command instead.',
 'audio-capture':'No microphone found. Connect one, then tap the mic.',
 'language-not-supported':'Voice is unavailable in this language. Use typed commands.',
};

// Enabled intent survives normal disconnects and spoken replies. Manual off always wins.
export function createVoiceSession(createRecognition:()=>Recognition,callbacks:Callbacks,timer:Timer=defaultTimer):VoiceSession{
 let enabled=false,disposed=false,current:Recognition|null=null,restart:unknown,watchdog:unknown,failures=0;
 const pauses=new Set<'speech'|'hidden'>();
 const clearTimers=()=>{if(restart!==undefined)timer.clear(restart);if(watchdog!==undefined)timer.clear(watchdog);restart=watchdog=undefined;};
 const detach=()=>{const r=current;current=null;if(r){r.onstart=null;r.onspeechend=null;r.onaudioend=null;r.onresult=null;r.onerror=null;r.onend=null;try{r.abort();}catch{/* Already disconnected. */}}};
 const canListen=()=>enabled&&!disposed&&pauses.size===0;
 const fatal=(message:string)=>{clearTimers();detach();enabled=false;callbacks.onEnabled(false);callbacks.onState('error',message);};
 const schedule=(delay=350)=>{clearTimers();detach();if(!canListen())return;callbacks.onState('starting');restart=timer.set(()=>{restart=undefined;connect();},delay);};
 const recover=()=>{if(++failures>3){fatal('Voice connection interrupted. Tap the mic to reconnect.');return;}schedule(500*2**(failures-1));};
 const deadline=(delay:number,callback:()=>void)=>{if(watchdog!==undefined)timer.clear(watchdog);watchdog=timer.set(()=>{watchdog=undefined;callback();},delay);};
 function connect(){
  if(!canListen()||current)return;callbacks.onState('starting');
  let r:Recognition;try{r=createRecognition();}catch{fatal('Voice is unavailable here. Use typed commands instead.');return;}
  current=r;let started=false;const delivered=new Set<number>();
  const active=()=>current===r&&canListen();
  r.lang='en-IN';r.continuous=true;r.interimResults=false;
  r.onstart=()=>{if(!active())return;started=true;clearTimers();callbacks.onState('listening');};
  const processing=()=>{if(!active())return;callbacks.onState('processing');deadline(10000,()=>{if(active())recover();});};
  r.onspeechend=processing;r.onaudioend=processing;
  r.onresult=event=>{
   if(!active())return;const commands:string[]=[];
   for(let i=event.resultIndex;i<event.results.length;i++){const result=event.results[i];if(result.isFinal&&!delivered.has(i)){delivered.add(i);const text=result[0]?.transcript.trim();if(text)commands.push(text);}}
   if(!commands.length)return;failures=0;clearTimers();callbacks.onState('listening');
   // Snapshot this event before a spoken response pauses recognition.
   for(const text of commands){if(!enabled||disposed)break;callbacks.onTranscript(text);}
  };
  r.onerror=event=>{if(!active())return;if(FATAL_ERRORS[event.error]){fatal(FATAL_ERRORS[event.error]);return;}if(event.error==='no-speech'){schedule();return;}recover();};
  r.onend=()=>{if(!active())return;if(started)schedule();else recover();};
  deadline(20000,()=>{if(active())fatal('Microphone did not connect. Tap the mic to try again.');});
  try{r.start();}catch{if(active())fatal('Your browser needs a click to start the microphone. Tap the mic.');}
 }
 return {
  start(){if(disposed||enabled)return;enabled=true;failures=0;callbacks.onEnabled(true);if(pauses.size){callbacks.onState(pauses.has('hidden')?'paused':'speaking');}else connect();},
  stop(){if(disposed)return;enabled=false;clearTimers();detach();callbacks.onEnabled(false);callbacks.onState('ready');},
  pause(reason){if(disposed)return;pauses.add(reason);clearTimers();detach();if(enabled)callbacks.onState(reason==='hidden'?'paused':'speaking');},
  resume(reason){if(disposed||!pauses.delete(reason))return;if(canListen())schedule(reason==='speech'?300:100);else if(enabled)callbacks.onState(pauses.has('hidden')?'paused':'speaking');else callbacks.onState('ready');},
  isEnabled:()=>enabled&&!disposed,
  dispose(){disposed=true;enabled=false;clearTimers();detach();pauses.clear();},
 };
}
