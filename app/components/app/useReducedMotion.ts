'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => { const m = matchMedia(QUERY); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); };

// True when the visitor asks for reduced motion. The server renders as if motion is allowed.
export default function useReducedMotion() {
 return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
}
