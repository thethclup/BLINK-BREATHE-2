/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { WagmiProvider, useAccount, useWriteContract } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Shield, Zap, Activity, Info, Trophy, Ghost, Sun, Heart, Leaf } from 'lucide-react';
import { config } from './lib/web3';
import { useBlink } from './hooks/useBlink';
import { DreamCanvas } from './components/DreamCanvas'; // Refactored file

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
  const [gameState, setGameState] = useState<'title' | 'playing' | 'sessionComplete' | 'leaderboard' | 'journal' | 'sanctuary'>('title');
  const { 
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
  } = useBlink();

  const handleStartGame = () => {
    setGameState('playing');
    setIsSessionComplete(false);
  };

  const { writeContract, isPending, isSuccess } = useWriteContract();
  const { isConnected } = useAccount();

  const sendGMTransaction = () => {
    writeContract({
      address: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      abi: [{ "type": "function", "name": "sayGM", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }],
      functionName: 'sayGM',
    });
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

  // Handle session complete trigger
  useEffect(() => {
    if (isSessionComplete && gameState === 'playing') {
       setTimeout(() => setGameState('sessionComplete'), 1000);
    }
  }, [isSessionComplete, gameState]);

  return (
    <main className="relative h-screen w-full bg-peace-bg text-peace-dark overflow-hidden select-none touch-none font-sans">
      {/* Header for GM Button */}
      {isConnected && (
         <div className="absolute top-4 right-4 z-50">
            <button
               onClick={sendGMTransaction}
               disabled={isPending}
               className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-serif text-xs font-bold"
            >
               <Sun size={14} className={isPending ? 'animate-spin' : ''} />
               {isPending ? 'Sending...' : isSuccess ? 'GM Sent!' : 'Say GM'}
            </button>
         </div>
      )}

      <AnimatePresence mode="wait">
        {gameState === 'sanctuary' && (
          <motion.div
            key="sanctuary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-peace-light z-[120] flex flex-col items-center justify-center p-8 text-center"
          >
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border border-peace-gold/30 rounded-full absolute pointer-events-none" 
             />
             <div className="w-24 h-24 border border-peace-gold/40 rounded-full flex items-center justify-center mb-8 relative">
                <Leaf size={40} className="text-peace-gold opacity-80" />
                <motion.div 
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 border border-peace-gold rounded-full"
                />
             </div>
             <h2 className="text-3xl font-serif mb-4 text-peace-gold">The Sanctuary</h2>
             <p className="text-xs font-mono opacity-60 mb-12 max-w-xs uppercase tracking-widest text-peace-sage">A place of pure calm. Breathe in. Let go.</p>
             
             <button 
               onClick={() => setGameState('playing')}
               className="px-8 py-3 bg-peace-sage text-white text-xs font-mono uppercase tracking-[0.2em] shadow-lg rounded-full hover:bg-opacity-90 transition-all"
             >
               Return to the Journey
             </button>
          </motion.div>
        )}
        {gameState === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 relative z-10"
          >
            <div className="relative group cursor-pointer" onClick={() => setGameState('sanctuary')}>
               <motion.div 
                 animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} 
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="w-48 h-48 border-2 border-peace-gold/20 rounded-full flex items-center justify-center p-4 bg-peace-highlight shadow-2xl overflow-hidden"
               >
                 <Heart size={80} className="text-peace-gold opacity-80" />
               </motion.div>
               <div className="absolute inset-0 bg-peace-gold/10 blur-xl rounded-full" />
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl font-serif tracking-tighter text-peace-dark drop-shadow-sm">BLINK & BREATHE 2</h1>
              <p className="text-xs font-mono uppercase tracking-widest text-peace-sage">A mindful relaxation journey</p>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <button
                onClick={handleStartGame}
                className="w-full py-4 bg-peace-gold text-white font-semibold tracking-widest uppercase text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-500"
              >
                Begin Journey
              </button>
              
              <div className="flex justify-center mt-2">
                <ConnectButton label="Connect to Save Progress" showBalance={false} />
              </div>
            </div>

            <div className="absolute bottom-12 flex space-x-6 text-peace-sage">
              <Trophy size={20} className="cursor-pointer hover:text-peace-gold transition-colors" onClick={() => setGameState('leaderboard')} />
              <Info size={20} className="cursor-pointer hover:text-peace-gold transition-colors" />
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
              const x = e.touches[0].clientX;
              if (x < window.innerWidth / 2) toggleBreath(true);
              else startStaring();
            }}
            onTouchEnd={() => {
              toggleBreath(false);
              blink();
            }}
          >
            <DreamCanvas 
              isEyesOpen={isEyesOpen} 
              innerCalm={innerCalm} 
              breathSync={breathSync} 
              isSessionComplete={isSessionComplete} 
              breathLevel={breathLevel}
            />

            {/* HUD */}
            <div className="absolute pt-safe-top top-8 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div className="space-y-4 w-32">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-tighter font-mono opacity-60 text-peace-dark">
                    <span>GENTLE FOCUS</span>
                    <span>{Math.round(blinkTimer)}%</span>
                  </div>
                  <div className="h-1 bg-peace-dark/10 w-full rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-peace-gold" 
                      animate={{ width: `${blinkTimer}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase tracking-tighter font-mono opacity-60 text-peace-dark">
                    <span>BREATH DEPTH</span>
                    <span>{Math.round(breathLevel)}%</span>
                  </div>
                  <div className="h-1 bg-peace-dark/10 w-full rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-peace-sage" 
                      animate={{ width: `${breathLevel}%` }} 
                    />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-peace-dark">Harmony Sync</div>
                <div className="flex items-center space-x-2 text-peace-sage justify-end mt-1">
                  <Activity size={12} className="animate-pulse" />
                  <span className="text-sm font-mono tracking-tighter">{Math.round(breathSync)}%</span>
                </div>
              </div>
            </div>

            {/* Instruction Overlays */}
            <div className="absolute bottom-12 left-0 w-full flex justify-around px-8 pointer-events-none opacity-40 text-peace-dark">
              <div className="text-center">
                 <p className="text-[8px] font-mono uppercase tracking-widest">Hold Space/Left Click</p>
                 <p className="text-[10px] font-mono font-bold">BREATHE IN</p>
              </div>
              <div className="text-center">
                 <p className="text-[8px] font-mono uppercase tracking-widest">Hold right click</p>
                 <p className="text-[10px] font-mono font-bold">OPEN EYES</p>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'sessionComplete' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-peace-highlight/95 z-50 flex flex-col items-center justify-center p-8 text-center"
          >
             <h2 className="text-4xl font-serif text-peace-dark mb-4">Harmony Achieved</h2>
             <p className="text-peace-sage font-mono text-xs uppercase mb-12 tracking-widest">You have found your center.</p>
             
             <div className="space-y-4 w-full max-w-xs">
               <button 
                 onClick={() => { setGameState('title'); setIsSessionComplete(false); }}
                 className="w-full py-4 border border-peace-sage text-peace-sage font-mono uppercase text-xs tracking-widest hover:bg-peace-sage hover:text-white transition-all rounded-full"
               >
                 Return to Dreamtide
               </button>
               {isConnected && (
                 <button 
                   onClick={() => alert("Recorded breath signature to Base.")}
                   className="w-full py-4 bg-peace-gold text-white font-mono uppercase text-xs tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 rounded-full"
                 >
                   <span>Record Breath On-Chain</span>
                   <Sun size={14} />
                 </button>
               )}
             </div>
          </motion.div>
        )}

        {gameState === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-peace-bg z-[100] p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-serif text-peace-dark">Serene Navigators</h2>
              <button 
                onClick={() => setGameState('title')}
                className="text-xs font-mono uppercase tracking-widest text-peace-sage hover:text-peace-dark transition-colors"
              >
                [Return]
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-peace-dark/10 pb-4 group cursor-pointer hover:bg-white/40 p-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <span className="text-peace-gold font-mono text-xs">0{i}</span>
                    <div className="flex flex-col text-peace-dark">
                      <span className="text-sm font-semibold tracking-tight">0x72...{i}f4</span>
                      <span className="text-[10px] text-peace-sage font-mono uppercase">Highest Inner Peace Score</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-serif text-peace-dark">100%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
