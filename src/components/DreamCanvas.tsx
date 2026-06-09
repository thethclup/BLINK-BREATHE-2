import React, { useRef, useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  size: number;
  alpha: number;
}

interface PeaceCanvasProps {
  isEyesOpen: boolean;
  innerCalm: number;
  breathSync: number;
  isSessionComplete: boolean;
  breathLevel: number;
}

export const DreamCanvas: React.FC<PeaceCanvasProps> = ({ isEyesOpen, innerCalm, breathSync, isSessionComplete, breathLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Initialize Particles
    const initialParticles: Particle[] = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedY: Math.random() * 0.5 + 0.1,
      speedX: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.2
    }));
    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Dynamic sky background color
      const breathingPhase = breathLevel / 100; // 0 to 1
      
      const r = Math.floor(234 - breathingPhase * 20);
      const g = Math.floor(227 - breathingPhase * 15);
      const b = Math.floor(217 - breathingPhase * 10);
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isEyesOpen && !isSessionComplete) {
        // Draw ripples based on innerCalm
        ctx.strokeStyle = `rgba(232, 160, 32, ${(innerCalm / 200)})`; // peace-gold
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 4; i++) {
          const s = (innerCalm / 100);
          const offset = i * (60 * s) + (Math.sin(Date.now() / 2000) * 15);
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, offset + 50, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw soft glowing orb
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, 150 + breathingPhase * 50
        );
        gradient.addColorStop(0, `rgba(255, 253, 249, 0.8)`);
        gradient.addColorStop(1, `rgba(255, 253, 249, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 200, 0, Math.PI * 2);
        ctx.fill();

        // Particles floating upwards
        particles.forEach(p => {
          ctx.fillStyle = `rgba(154, 178, 159, ${p.alpha * (innerCalm / 100)})`; // peace-sage
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      
      if (!isSessionComplete && (breathLevel > 0 || innerCalm > 0)) {
         setParticles(prev => prev.map(p => {
           let newY = p.y - p.speedY - (breathLevel / 50);
           if (newY < -10) newY = canvas.height + 10;
           return {
             ...p,
             y: newY,
             x: p.x + p.speedX + Math.sin(Date.now() / 1000 + p.y) * 0.5
           };
         }));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isEyesOpen, innerCalm, breathSync, isSessionComplete, particles, breathLevel]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
      />
      {/* Visual Overlays */}
      {!isEyesOpen && (
        <div className="absolute inset-0 bg-peace-light z-10 transition-opacity duration-700" style={{ opacity: 0.85 }} />
      )}
      {isEyesOpen && (
        <div className="absolute inset-0 pointer-events-none glow-effect z-20" />
      )}
      <div className="absolute inset-0 pointer-events-none liminal-noise z-30" />
    </div>
  );
};
