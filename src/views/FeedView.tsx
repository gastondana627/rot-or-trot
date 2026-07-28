import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo, AnimatePresence } from 'motion/react';
import { Idea } from '../types';
import { Skull, Code, CheckCircle, Terminal } from 'lucide-react';

interface FeedViewProps {
  ideas: Idea[];
  updateIdeaStatus: (id: string, status: 'rotted' | 'trotted') => void;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'status'>, append?: boolean) => void;
}

export default function FeedView({ ideas, updateIdeaStatus, addIdea }: FeedViewProps) {
  const pendingIdeas = ideas.filter(i => i.status === 'pending');
  const [isGenerating, setIsGenerating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('right');

  // Continuous auto-generator
  useEffect(() => {
    let timeoutId: any;
    if (pendingIdeas.length < 2 && !isGenerating) {
      setIsGenerating(true);
      fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: "Generate a completely new, random, absurd cyberpunk hackathon startup idea. Make it dark, sarcastic, and tech-heavy." })
      }).then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      }).then(data => {
        if (data.title && data.description) {
          addIdea({
            title: data.title,
            description: data.description,
            tags: ['AI GENERATED', 'AUTO'],
            decayTime: 60
          }, true); // append to end
        }
        setIsGenerating(false);
      }).catch(err => {
        console.error("Generator failed, applying cooldown:", err);
        timeoutId = setTimeout(() => setIsGenerating(false), 20000); // 20s cooldown on error
      });
    }
    return () => clearTimeout(timeoutId);
  }, [pendingIdeas.length, isGenerating, addIdea]);

  if (pendingIdeas.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <Skull className={`w-16 h-16 mb-4 ${isGenerating ? 'text-toxic-purple animate-pulse' : 'text-border-light'}`} />
        <h2 className="text-xl font-bold text-gray-300">{isGenerating ? 'Synthesizing...' : 'Vault Empty'}</h2>
        <p className="text-sm text-gray-500 mt-2 font-mono">
          {isGenerating ? "Hacking the mainframe for more ideas..." : "No new ideas to rot or trot. Go build something."}
        </p>
      </div>
    );
  }

  const idea = pendingIdeas[0];

  const handleSwipe = async (id: string, direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    const action = direction === 'left' ? 'rotted' : 'trotted';
    
    // Update local state immediately for snappy UI
    updateIdeaStatus(id, action);

    // Send vote to Vercel serverless backend to log in Google Sheets
    if (idea) {
      try {
        await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action, 
            projectName: idea.title 
          })
        });
      } catch (err) {
        console.error("Failed to log vote to sheet:", err);
      }
    }
  };

  return (
    <div className="h-full relative flex flex-col p-3 sm:p-4 md:p-6 max-w-xl mx-auto w-full min-h-0 overflow-hidden pb-22 sm:pb-4">
      {/* Decay Timer Header adjusted up slightly */}
      <div className="mt-10 sm:mt-14 flex justify-between items-center mb-2.5 px-4 py-1.5 sm:py-2 rounded-full bg-border-light/30 border border-border-light shrink-0 flex-shrink-0 z-20 shadow-sm">
        <span className="text-xs md:text-sm text-toxic-purple-light tracking-widest font-mono uppercase font-bold">Decay Timer</span>
        <DecayTimer initialSeconds={idea?.decayTime || 60} onExpire={() => idea && handleSwipe(idea.id, 'left')} />
      </div>

      {/* Card Stack */}
      <div className="flex-1 min-h-0 relative w-full flex items-center justify-center perspective-[1000px] my-1">
        <AnimatePresence custom={swipeDirection}>
          {pendingIdeas.slice(0, 3).reverse().map((i, idx) => (
            <IdeaCard 
              key={i.id} 
              idea={i} 
              isTop={idx === pendingIdeas.slice(0, 3).length - 1} 
              onSwipe={(dir) => handleSwipe(i.id, dir)}
              index={pendingIdeas.slice(0, 3).length - 1 - idx}
              custom={swipeDirection}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="mt-2.5 sm:mt-3 flex gap-3 shrink-0 flex-shrink-0 z-20 h-14 sm:h-16 md:h-20 w-full">
        <button 
          onClick={() => idea && handleSwipe(idea.id, 'left')}
          className="flex-1 brutalist-button bg-toxic-purple text-white border-2 border-toxic-purple flex items-center justify-between px-3.5 sm:px-4 py-2 relative overflow-hidden group rounded-xl shadow-[4px_4px_0px_0px_#A855F7] active:translate-y-0.5 transition-all"
        >
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5 text-lg sm:text-xl md:text-2xl font-black tracking-wider">
              ROT <Skull className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-mono text-[9px] md:text-[10px] opacity-80 font-bold uppercase tracking-widest">Toxic Purple</span>
          </div>
          <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
        <button 
          onClick={() => idea && handleSwipe(idea.id, 'right')}
          className="flex-1 brutalist-button-green bg-bg-card text-hyper-green border-2 border-hyper-green shadow-[4px_4px_0px_0px_#22C55E] flex items-center justify-between px-3.5 sm:px-4 py-2 relative overflow-hidden group hover:bg-hyper-green hover:text-bg-base transition-colors duration-300 rounded-xl active:translate-y-0.5 transition-all"
        >
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5 text-lg sm:text-xl md:text-2xl font-black tracking-wider">
              TROT <span className="text-lg sm:text-xl md:text-2xl">🐎</span>
            </div>
            <span className="font-mono text-[9px] md:text-[10px] opacity-80 font-bold uppercase tracking-widest">Hyper Green</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function DecayTimer({ initialSeconds, onExpire }: { initialSeconds: number, onExpire: () => void }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => {
      setSeconds(s => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onExpire]);

  return (
    <div className="font-mono text-zinc-100 bg-black/50 px-3 py-1 rounded-md border border-zinc-800 text-sm md:text-base font-bold">
      {seconds}s
    </div>
  );
}

interface IdeaCardProps {
  key?: React.Key;
  idea: Idea;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  index: number;
  custom: 'left' | 'right';
}

function IdeaCard({ idea, isTop, onSwipe, index, custom }: IdeaCardProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ scale: 1 - index * 0.05, y: index * -15, opacity: 1, zIndex: 10 - index, x: 0 });
  }, [index, controls]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe('left');
    } else {
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      exit={(customDirection) => ({ x: customDirection === 'left' ? -500 : 500, opacity: 0, transition: { duration: 0.2 } })}
      custom={custom}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-[#3D246C] to-[#2D1B4E] rounded-3xl border-2 border-border-light flex flex-col shadow-2xl"
    >
      <div className="relative flex-1 p-3.5 sm:p-5 md:p-6 flex flex-col z-10 overflow-y-auto hide-scrollbar min-h-0">
        {/* Mock GitHub Header */}
        <div className="flex justify-between items-center mb-2 sm:mb-3 shrink-0 flex-shrink-0">
          <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs tracking-wide">
            <span className="w-2 h-2 rounded-full bg-hyper-green shadow-[0_0_8px_#22C55E]"></span>
            README.MD
          </div>
          <div className="bg-black/40 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-full font-mono text-[10px] md:text-xs uppercase font-bold tracking-wider">
            NEW APP IDEA
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight mb-2 text-white tracking-tight shrink-0">{idea.title}</h2>
        <p className="text-xs sm:text-sm text-zinc-200 mb-3 leading-relaxed font-normal shrink-0">{idea.description}</p>
        
        {/* Mock Checkboxes */}
        <div className="bg-black/20 rounded-xl p-3 mb-2.5 border border-white/5 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-medium">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-hyper-green shrink-0" />
            <span>GitHub-style README mock</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-medium">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-hyper-green shrink-0" />
            <span>Neon decision logic</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-medium">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-hyper-green shrink-0" />
            <span>Built for satisfying doomscrolling</span>
          </div>
        </div>

        {/* Mock Terminal */}
        <div className="bg-black/40 rounded-xl p-3 border border-white/10 font-mono text-xs shrink-0 mb-2">
          <div className="text-toxic-purple-light font-bold mb-1 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" /> npm install rot-or-trot
          </div>
          <ul className="text-zinc-400 space-y-1 ml-5 list-disc text-[10px] sm:text-xs">
            <li>swipe right to trot</li>
            <li>swipe left to rot</li>
            <li>watch the decay timer collapse</li>
          </ul>
        </div>
      </div>
      
      {/* Background Placeholder at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-zinc-900 z-0 border-t border-white/10 pointer-events-none opacity-20">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B4E] to-transparent"></div>
      </div>
    </motion.div>
  );
}