'use client';

import { useEffect, useRef, useState } from 'react';
import './product-slice-animation.css';

interface SlicePart {
  id: string;
  label: string;
  color: string;
  offset: number; // Distance to move out from center during explode
  delay: number;
}

const SLICE_PARTS: SlicePart[] = [
  { id: 'pcb', label: 'Circuit Board', color: '#1a7c3a', offset: 120, delay: 0 },
  { id: 'transformer', label: 'Transformer', color: '#d4a574', offset: 140, delay: 0.1 },
  { id: 'contacts', label: 'Relay Contacts', color: '#2c3e50', offset: 160, delay: 0.2 },
  { id: 'housing', label: 'Housing', color: '#f5f5f5', offset: 100, delay: 0.3 },
];

export default function ProductSliceAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const sequence = setInterval(() => {
      setIsExploded(prev => !prev);
    }, 4000);

    return () => clearInterval(sequence);
  }, [autoPlay]);

  const handleInteraction = () => {
    setAutoPlay(false);
    setIsExploded(prev => !prev);
  };

  return (
    <div
      className="psa-container"
      ref={containerRef}
      onClick={handleInteraction}
      role="presentation"
      aria-label="Interactive 3D energy meter component visualization with explode animation"
    >
      {/* Main stage */}
      <div className="psa-stage">
        {/* Back housing - white exterior */}
        <div
          className={`psa-part psa-housing ${isExploded ? 'psa-exploded' : ''}`}
          style={{
            '--part-delay': `${SLICE_PARTS[3].delay}s`,
            '--part-offset': `${SLICE_PARTS[3].offset}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="psa-label">Housing</div>
        </div>

        {/* Circuit board - green PCB */}
        <div
          className={`psa-part psa-pcb ${isExploded ? 'psa-exploded' : ''}`}
          style={{
            '--part-delay': `${SLICE_PARTS[0].delay}s`,
            '--part-offset': `${SLICE_PARTS[0].offset}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="psa-pcb-inner">
            <div className="psa-chip"></div>
            <div className="psa-chip" style={{ top: '30%', left: '70%' }}></div>
            <div className="psa-chip" style={{ top: '70%', left: '20%' }}></div>
            <div className="psa-trace"></div>
          </div>
          <div className="psa-label">PCB</div>
        </div>

        {/* Transformer - golden transformer */}
        <div
          className={`psa-part psa-transformer ${isExploded ? 'psa-exploded' : ''}`}
          style={{
            '--part-delay': `${SLICE_PARTS[1].delay}s`,
            '--part-offset': `${SLICE_PARTS[1].offset}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="psa-transformer-inner">
            <div className="psa-coil"></div>
            <div className="psa-coil" style={{ top: '50%' }}></div>
          </div>
          <div className="psa-label">Transformer</div>
        </div>

        {/* Relay contacts - dark metal contacts */}
        <div
          className={`psa-part psa-contacts ${isExploded ? 'psa-exploded' : ''}`}
          style={{
            '--part-delay': `${SLICE_PARTS[2].delay}s`,
            '--part-offset': `${SLICE_PARTS[2].offset}px`,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="psa-contact"></div>
          <div className="psa-contact" style={{ transform: 'rotateY(180deg)' }}></div>
          <div className="psa-contact" style={{ transform: 'rotateX(45deg)' }}></div>
          <div className="psa-label">Relay Control</div>
        </div>

        {/* Center label */}
        <div className="psa-center-label">
          <div className="psa-logo">HESEOS™</div>
          <div className="psa-title">3 Phase Energy Meter</div>
          <div className="psa-subtitle">Relay Control</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="psa-instructions">
        <span className="psa-hint">Click to explore</span>
        {autoPlay && <span className="psa-auto-hint">Auto-playing...</span>}
      </div>

      {/* Background gradient */}
      <div className="psa-gradient"></div>
    </div>
  );
}
