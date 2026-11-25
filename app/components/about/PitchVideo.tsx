'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

// Shows the episode thumbnail and loads the YouTube player only when someone presses play.
export default function PitchVideo({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return <div className="about-video">
    {playing
      ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      : <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          <Image src="/media/about/indian-angels.webp" alt="" fill sizes="(max-width: 1000px) 100vw, 55vw" />
          <span className="about-video-play"><Play size={22} fill="currentColor" aria-hidden="true" /></span>
          <span className="about-video-meta">Watch the pitch · 1:45</span>
        </button>}
  </div>;
}
