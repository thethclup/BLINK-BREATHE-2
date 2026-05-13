/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Shield, Zap, Activity, Info, Trophy, Ghost } from 'lucide-react';
import { config } from './lib/web3';
import { useBlink } from './hooks/useBlink';
import { HorrorCanvas } from './components/HorrorCanvas';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <GameContainer />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function GameContainer() {
  const [gameState, setGameState] = useState<'title' | 'playing' | 'gameover' | 'leaderboard' | 'archive' | 'safe'>('title');
  const { 
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
  } = useBlink();

  const handleStartGame = () => {
    setGameState('playing');
    setIsGameOver(false);
  };

  const handleSayGM = () => {
    alert("Initiating SIWE Signature & 'Say GM' Transaction on Base...");
  };

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') toggleBreath(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') toggleBreath(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, toggleBreath]);

  // Safe Room Logic
  useEffect(() => {
    if (gameState === 'playing' && fear > 85 && sanity > 30 && Math.random() < 0.001) {
       setGameState('safe');
    }
  }, [fear, sanity, gameState]);

  const [isRecording, setIsRecording] = useState(false);

  const handleRecordNightmare = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      alert("Nightmare Hash Recorded on Base Mainnet. Verification ID: BB2-" + Math.random().toString(36).substring(7).toUpperCase());
    }, 2000);
  };

  return (
    <main className="relative h-screen w-full bg-horror-bg text-gray-100 overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {gameState === 'safe' && (
          <motion.div
            key="safe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0f0f0f] z-[120] flex flex-col items-center justify-center p-8 text-center"
          >
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border border-white/5 rounded-full absolute pointer-events-none" 
             />
             <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center mb-8 relative">
                <Shield size={40} className="text-white opacity-80" />
                <motion.div 
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border border-white rounded-full"
                />
             </div>
             <h2 className="text-3xl font-serif italic mb-4">The Quiet Place</h2>
             <p className="text-xs font-mono opacity-60 mb-12 max-w-xs uppercase tracking-widest">A temporary fracture in the nightmare. Sanity recovering...</p>
             
             <button 
               onClick={() => setGameState('playing')}
               className="px-8 py-3 bg-white text-black text-xs font-mono uppercase tracking-[0.2em] hover:bg-horror-red hover:text-white transition-all"
             >
               Return to the Shifting Void
             </button>
          </motion.div>
        )}
        {gameState === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8"
          >
            <div className="relative group cursor-pointer" onClick={() => setGameState('archive')}>
               <motion.div 
                 animate={{ scale: [1, 1.05, 1], filter: ["grayscale(100%)", "grayscale(0%)", "grayscale(100%)"] }} 
                 transition={{ duration: 4, repeat: Infinity }}
                 className="w-48 h-48 border-2 border-horror-gray rounded-full flex items-center justify-center p-4 bg-horror-ink overflow-hidden"
               >
                 <Eye size={80} className="text-horror-red opacity-80" />
               </motion.div>
               <div className="absolute inset-0 bg-red-900/10 blur-xl rounded-full" />
               <p className="absolute -bottom-4 left-0 w-full text-[8px] font-mono uppercase tracking-[0.4em] opacity-30 text-white">Archives</p>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl font-serif italic tracking-tighter text-white">BLINK & BREATHE 2</h1>
              <p className="text-xs font-mono uppercase tracking-widest text-horror-red opacity-60">The Psychological Descent</p>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <button
                onClick={handleStartGame}
                className="w-full py-4 bg-white text-black font-semibold tracking-widest uppercase text-sm hover:bg-horror-red hover:text-white transition-all duration-500 rounded-none border border-transparent shadow-2xl"
              >
                Enter the Nightmare
              </button>
              
              <div className="flex justify-center">
                <ConnectButton label="Authenticate Soul" />
              </div>
            </div>

            <div className="absolute bottom-12 flex space-x-6 text-horror-gray">
              <Trophy size={20} className="cursor-pointer hover:text-white transition-colors" onClick={() => setGameState('leaderboard')} />
              <Ghost size={20} className="cursor-pointer hover:text-white transition-colors" onClick={() => setGameState('archive')} />
              <Info size={20} className="cursor-pointer hover:text-white transition-colors" />
            </div>
          </motion.div>
        )}

        {gameState === 'archive' && (
           <motion.div
            key="archive"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 bg-horror-bg/95 z-[110] p-8 overflow-y-auto"
          >
            <div className="max-w-md mx-auto space-y-12 py-12">
              <div className="flex justify-between items-end">
                <h2 className="text-4xl font-serif italic">Memory Archive</h2>
                <button 
                  onClick={() => setGameState('title')}
                  className="text-xs font-mono uppercase tracking-widest opacity-50 mb-2"
                >
                  [Exit]
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-horror-ink border border-horror-gray flex items-center justify-center relative group overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/horror${i}/400/400?grayscale`} 
                      className="w-full h-full object-cover opacity-20 filter sepia brightness-50 group-hover:opacity-60 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 text-[8px] font-mono uppercase opacity-40">FRAGMENT_00{i}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 border border-horror-gray bg-horror-ink/50 space-y-4">
                 <h3 className="text-xs font-mono uppercase tracking-widest text-horror-red">System Log</h3>
                 <p className="text-[10px] leading-relaxed opacity-60">
                   THE ENTITIES ARE LEARNING. EACH BLINK FEEDS THE ARCHIVE. YOUR MEMORIES ARE NO LONGER PRIVATE. THEY ARE ASSETS ON THE CHAIN.
                 </p>
                 <div className="text-[8px] font-mono opacity-20">BUILDER_ID: bc_8thf7f3m</div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full relative h-[100dvh]"
            onMouseDown={(e) => {
              if (e.button === 2) toggleBreath(true);
              else startStaring();
            }}
            onMouseUp={(e) => {
              if (e.button === 2) toggleBreath(false);
              else blink();
            }}
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={(e) => {
              // Simple touch partitioning: Left half for breath, Right half for eyes
              const x = e.touches[0].clientX;
              if (x < window.innerWidth / 2) toggleBreath(true);
              else startStaring();
            }}
            onTouchEnd={() => {
              toggleBreath(false);
              blink();
            }}
          >
            <HorrorCanvas 
              isEyesOpen={isEyesOpen} 
              sanity={sanity} 
              fear={fear} 
              isGameOver={isGameOver} 
              breathLevel={breathLevel}
            />

            {/* HUD */}
            <div className="absolute pt-safe-top top-8 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div className="space-y-4 w-32">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-tighter font-mono opacity-60">
                    <span>VISION</span>
                    <span>{Math.round(blinkTimer)}%</span>
                  </div>
                  <div className="h-0.5 bg-horror-gray w-full">
                    <motion.div 
                      className="h-full bg-white" 
                      animate={{ width: `${blinkTimer}%` }} 
                      style={{ backgroundColor: blinkTimer < 30 ? '#8B0000' : 'white' }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-tighter font-mono opacity-60">
                    <span>LUNGS</span>
                    <span>{Math.round(100 - breathLevel)}%</span>
                  </div>
                  <div className="h-0.5 bg-horror-gray w-full">
                    <motion.div 
                      className="h-full bg-blue-400" 
                      animate={{ width: `${100 - breathLevel}%` }} 
                      style={{ backgroundColor: breathLevel > 80 ? '#8B0000' : '#60a5fa' }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">Psych-Sync</div>
                <div className="flex items-center space-x-2 text-horror-red">
                  <Activity size={12} className="animate-pulse" />
                  <span className="text-sm font-mono tracking-tighter">BASE_MAIN_V2</span>
                </div>
              </div>
            </div>

            {/* Instruction Overlays */}
            <div className="absolute bottom-12 left-0 w-full flex justify-around px-8 pointer-events-none opacity-40">
              <div className="text-center">
                 <p className="text-[8px] font-mono uppercase tracking-widest">Hold Space/Left</p>
                 <p className="text-[10px] font-mono font-bold">BREATH CONTROL</p>
              </div>
              <div className="text-center">
                 <p className="text-[8px] font-mono uppercase tracking-widest">Hold Click/Right</p>
                 <p className="text-[10px] font-mono font-bold">EYE CONTROL</p>
              </div>
            </div>

            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-8 text-center"
              >
                 <h2 className="text-4xl font-serif text-white mb-2">YOU FINALLY BLINKED</h2>
                 <p className="text-horror-red font-mono text-xs uppercase mb-8 tracking-widest">Fractured Memory #342</p>
                 
                 <div className="space-y-4 w-full max-w-xs">
                   <button 
                     onClick={() => { setGameState('title'); setIsGameOver(false); }}
                     className="w-full py-4 border border-white text-white font-mono uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all"
                   >
                     Restart Cycle
                   </button>
                   <button 
                     onClick={handleRecordNightmare}
                     disabled={isRecording}
                     className="w-full py-4 bg-horror-red text-white font-mono uppercase text-xs tracking-widest hover:bg-horror-red/80 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                   >
                     <span>{isRecording ? "Transmitting to Base..." : "Record Nightmare On-Chain"}</span>
                     <Zap size={14} className={isRecording ? "animate-spin" : ""} />
                   </button>
                 </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-horror-bg z-[100] p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-serif italic">Bravest Survivors</h2>
              <button 
                onClick={() => setGameState('title')}
                className="text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100"
              >
                [Return]
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-horror-gray pb-4 group cursor-pointer hover:bg-horror-ink p-2 transition-colors">
                  <div className="flex items-center space-x-4">
                    <span className="text-horror-red font-mono text-xs">0{i}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold tracking-tight">0x72...{i}f4</span>
                      <span className="text-[10px] text-horror-gray font-mono uppercase">Deepest Psychological Descent</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-serif italic">12m 4s</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-horror-gray space-y-4">
              <button 
                onClick={handleSayGM}
                className="w-full py-3 bg-horror-red/20 border border-horror-red text-horror-red text-xs font-mono uppercase tracking-[0.2em] rounded-none hover:bg-horror-red hover:text-white transition-all"
              >
                Say GM to the Void
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
