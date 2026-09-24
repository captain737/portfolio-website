import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  type: 'pixel-star' | 'pixel-square' | 'pixel-cross';
  color: string;
  vx: number;
  vy: number;
  size: number;
}

export function ClickSparkle() {
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    // Check if user prefers reduced motion
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const colors = ['#ea7684', '#fde047', '#38bdf8', '#2c2a26', '#fdfaf6'];
    const types: ('pixel-star' | 'pixel-square' | 'pixel-cross')[] = ['pixel-star', 'pixel-square', 'pixel-cross'];

    const handleClick = (e: MouseEvent) => {
      // Spawn 8-bit chunky pixel particles around the click position
      const count = 4;
      const newParticles: SparkleParticle[] = [];
      const now = Date.now();

      // Snap coordinates to 2px pixel grid
      const snapX = Math.round(e.clientX / 2) * 2;
      const snapY = Math.round(e.clientY / 2) * 2;

      for (let i = 0; i < count; i++) {
        const angle = (i * (360 / count) + 45) * (Math.PI / 180);
        const speed = 18 + Math.random() * 16;
        newParticles.push({
          id: now + i + Math.random(),
          x: snapX,
          y: snapY,
          type: types[i % types.length],
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.round(Math.cos(angle) * speed / 2) * 2,
          vy: Math.round((Math.sin(angle) * speed - 6) / 2) * 2,
          size: 8 + Math.floor(Math.random() * 4) * 2,
        });
      }

      setSparkles(prev => [...prev.slice(-15), ...newParticles]);

      // Auto clear after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(p => now - p.id > 400));
      }, 420);
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  if (sparkles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {sparkles.map(sparkle => (
        <span
          key={sparkle.id}
          className="click-particle absolute inline-block origin-center"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            '--vx': `${sparkle.vx}px`,
            '--vy': `${sparkle.vy}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            color: sparkle.color,
            imageRendering: 'pixelated',
          } as CSSProperties}
        >
          {sparkle.type === 'pixel-star' ? (
            <svg viewBox="0 0 8 8" shapeRendering="crispEdges" className="w-full h-full fill-current">
              <rect x="3" y="0" width="2" height="8" fill={sparkle.color} />
              <rect x="0" y="3" width="8" height="2" fill={sparkle.color} />
              <rect x="2" y="2" width="4" height="4" fill="#2c2a26" />
              <rect x="3" y="3" width="2" height="2" fill="#ffffff" />
            </svg>
          ) : sparkle.type === 'pixel-square' ? (
            <span 
              className="block w-full h-full border-2 border-ink" 
              style={{ backgroundColor: sparkle.color }} 
            />
          ) : (
            <svg viewBox="0 0 6 6" shapeRendering="crispEdges" className="w-full h-full">
              <rect x="2" y="0" width="2" height="6" fill="#2c2a26" />
              <rect x="0" y="2" width="6" height="2" fill="#2c2a26" />
              <rect x="2" y="2" width="2" height="2" fill={sparkle.color} />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
