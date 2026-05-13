import { useState, useEffect, useCallback, useRef } from 'react';

export function useBlink() {
  const [isEyesOpen, setIsEyesOpen] = useState(false);
  const [blinkTimer, setBlinkTimer] = useState(100); // Percentage
  const [sanity, setSanity] = useState(100);
  const [fear, setFear] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [breathLevel, setBreathLevel] = useState(0); // 0 to 100, 100 is "out of breath"
  const [isHoldingBreath, setIsHoldingBreath] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  const startStaring = useCallback(() => {
    if (isGameOver) return;
    setIsEyesOpen(true);
  }, [isGameOver]);

  const blink = useCallback(() => {
    setIsEyesOpen(false);
    // Recharge blink timer slightly on blink
    setBlinkTimer(prev => Math.min(prev + 15, 100));
  }, []);

  const toggleBreath = useCallback((holding: boolean) => {
    setIsHoldingBreath(holding);
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      // Blink and Sanity logic
      if (isEyesOpen) {
        setBlinkTimer(prev => {
          const next = prev - 0.5;
          if (next <= 0) {
            blink(); 
            return 0;
          }
          return next;
        });
        setSanity(prev => Math.max(prev - 0.1, 0));
      } else {
        setBlinkTimer(prev => Math.min(prev + 1, 100));
      }

      // Breathing logic
      if (isHoldingBreath) {
        setBreathLevel(prev => {
          const next = prev + 1.2;
          if (next >= 100) {
            setIsHoldingBreath(false); // Forced gasp
            setFear(f => Math.min(f + 10, 100)); // Gasping increases fear
            return 100;
          }
          return next;
        });
      } else {
        setBreathLevel(prev => Math.max(prev - 0.8, 0));
      }

      // Fear increases over time, and spikes based on visual horror
      setFear(prev => Math.min(prev + 0.05, 100));
    }, 50);

    return () => clearInterval(interval);
  }, [isEyesOpen, isGameOver, blink, isHoldingBreath]);

  useEffect(() => {
    if (sanity <= 0) {
      setIsGameOver(true);
    }
  }, [sanity]);

  return {
    isEyesOpen,
    blinkTimer,
    sanity,
    fear,
    isGameOver,
    breathLevel,
    isHoldingBreath,
    startStaring,
    blink,
    toggleBreath,
    setIsGameOver
  };
}
