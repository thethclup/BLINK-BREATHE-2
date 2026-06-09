import { useState, useEffect, useCallback, useRef } from 'react';

export function useBlink() {
  const [isEyesOpen, setIsEyesOpen] = useState(false);
  const [blinkTimer, setBlinkTimer] = useState(100); // 100 is fully rested
  const [innerCalm, setInnerCalm] = useState(0); 
  const [breathSync, setBreathSync] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [breathLevel, setBreathLevel] = useState(0); // 0 to 100 (100 = deep breath held)
  const [isHoldingBreath, setIsHoldingBreath] = useState(false);
  
  const startStaring = useCallback(() => {
    if (isSessionComplete) return;
    setIsEyesOpen(true);
  }, [isSessionComplete]);

  const blink = useCallback(() => {
    setIsEyesOpen(false);
    setBlinkTimer(prev => Math.min(prev + 20, 100));
  }, []);

  const toggleBreath = useCallback((holding: boolean) => {
    setIsHoldingBreath(holding);
  }, []);

  useEffect(() => {
    if (isSessionComplete) return;

    const interval = setInterval(() => {
      // Vision Logic
      if (isEyesOpen) {
        setBlinkTimer(prev => {
          const next = prev - 0.2;
          if (next <= 0) {
            blink(); 
            return 0;
          }
          return next;
        });
      } else {
        setBlinkTimer(prev => Math.min(prev + 1.5, 100));
      }

      // Breathing Logic
      if (isHoldingBreath) {
        setBreathLevel(prev => {
          const next = prev + 1.0; // Fill lungs
          if (next >= 100) return 100;
          return next;
        });
        
        // Increase calm if holding a good deep breath
        if (breathLevel > 50) {
          setInnerCalm(prev => Math.min(prev + 0.1, 100));
        }
      } else {
        setBreathLevel(prev => {
          const next = prev - 1.5; // Exhale
          if (next <= 0) return 0;
          return next;
        });
      }

      // Breath Sync mechanics (combining gentle blink + breath)
      if (innerCalm > 20 && breathLevel > 20 && !isEyesOpen) {
        setBreathSync(prev => Math.min(prev + 0.2, 100));
      } else if (isEyesOpen) {
        setBreathSync(prev => Math.max(prev - 0.1, 0));
      }

    }, 50);

    return () => clearInterval(interval);
  }, [isEyesOpen, isSessionComplete, blink, isHoldingBreath, breathLevel, innerCalm]);

  useEffect(() => {
    // If you achieve ultimate harmony
    if (innerCalm >= 100 && breathSync >= 100) {
      setIsSessionComplete(true);
    }
  }, [innerCalm, breathSync]);

  return {
    isEyesOpen,
    blinkTimer,
    innerCalm,
    breathSync,
    isSessionComplete,
    breathLevel,
    isHoldingBreath,
    startStaring,
    blink,
    toggleBreath,
    setIsSessionComplete
  };
}
