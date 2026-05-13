import React, { useRef, useEffect, useState } from 'react';

interface Entity {
  x: number;
  y: number;
  speed: number;
  id: string;
}

interface HorrorCanvasProps {
  isEyesOpen: boolean;
  sanity: number;
  fear: number;
  isGameOver: boolean;
  breathLevel: number;
}

export const HorrorCanvas: React.FC<HorrorCanvasProps> = ({ isEyesOpen, sanity, fear, isGameOver, breathLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [entities, setEntities] = useState<Entity[]>([
    { x: 400, y: 100, speed: 2, id: '1' },
  ]);
  const [memoryFragment, setMemoryFragment] = useState<string | null>(null);

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.01 && sanity < 70) {
        setMemoryFragment(`MEMORY_${Math.floor(Math.random() * 9999)}`);
        setTimeout(() => setMemoryFragment(null), 500);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sanity, isGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear
      ctx.fillStyle = breathLevel > 90 ? '#110000' : '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isEyesOpen) {
        // Draw Liminal Corridors
        ctx.strokeStyle = `rgba(45, 45, 45, ${sanity / 100})`;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 12; i++) {
          const s = (sanity / 100);
          const offset = i * (40 * s) + (Math.sin(Date.now() / 1000) * 5);
          ctx.strokeRect(offset, offset, canvas.width - offset * 2, canvas.height - offset * 2);
        }

        // Entities
        entities.forEach(entity => {
          ctx.fillStyle = `rgba(139, 0, 0, ${(100 - sanity) / 100})`;
          ctx.beginPath();
          ctx.arc(entity.x, entity.y, 25 + (100 - sanity) / 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Memory Horror Text
      if (memoryFragment) {
        ctx.fillStyle = 'white';
        ctx.font = 'italic 10px Playfair Display';
        ctx.globalAlpha = 0.5;
        ctx.fillText(memoryFragment, Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.globalAlpha = 1;
      }

      // Sanity Distortions
      if (sanity < 40) {
        const d = (40 - sanity);
        ctx.fillStyle = `rgba(255, 0, 0, ${d / 200})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Movement logic
      if (!isEyesOpen && !isGameOver) {
        setEntities(prev => prev.map(e => ({
          ...e,
          // Moves faster if fear is high or sanity is low
          y: e.y + e.speed + (fear / 15) + (breathLevel / 20), 
          x: e.x + (Math.random() - 0.5) * 10
        })));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isEyesOpen, sanity, fear, isGameOver, entities, breathLevel, memoryFragment]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-auto max-h-screen object-contain grayscale brightness-90 contrast-125"
      />
      {/* Visual Overlays */}
      {!isEyesOpen && (
        <div className="absolute inset-0 bg-black z-10 transition-opacity duration-300" style={{ opacity: 0.95 }} />
      )}
      {isEyesOpen && (
        <div className="absolute inset-0 pointer-events-none eye-strain z-20" />
      )}
      <div className="absolute inset-0 pointer-events-none liminal-noise z-30" />
    </div>
  );
};
