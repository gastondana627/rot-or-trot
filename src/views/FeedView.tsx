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

  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    updateIdeaStatus(id, direction === 'left' ? 'rotted' : 'trotted');
  };

  return (
    <div className="h-full relative flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full pb-24">
      {/* Decay Timer Header */}
      <div className="flex justify-between items-center mb-4 px-6 py-3 rounded-full bg-border-light/30 border border-border-light shrink-0 z-20">
        <span className="text-sm text-toxic-purple-light tracking-widest font-mono uppercase font-bold">Decay Timer</span>
        <DecayTimer initialSeconds={idea?.decayTime || 60} onExpire={() => idea && handleSwipe(idea.id, 'left')} />
      </div>

      {/* Card Stack */}
      <div className="flex-1 relative w-full h-full flex items-start justify-center perspective-[1000px] min-h-[400px]">
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
      <div className="mt-6 flex gap-4 shrink-0 z-20 h-[100px] mb-8">
        <button 
          onClick={() => idea && handleSwipe(idea.id, 'left')}
          className="flex-1 brutalist-button bg-toxic-purple text-white border-2 border-toxic-purple flex flex-col items-start justify-center p-4 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 text-2xl md:text-4xl font-black tracking-widest mb-1">
              ROT <Skull className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <span className="font-mono text-[10px] md:text-xs opacity-80 font-bold uppercase tracking-widest">Toxic Purple</span>
          </div>
          <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
        <button 
          onClick={() => idea && handleSwipe(idea.id, 'right')}
          className="flex-1 brutalist-button-green bg-bg-card text-border-light border-2 border-hyper-green shadow-[6px_6px_0px_0px_#22C55E] flex flex-col items-start justify-center p-4 relative overflow-hidden group hover:bg-hyper-green hover:text-bg-base transition-colors duration-300"
        >
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-2 text-2xl md:text-4xl font-black tracking-widest mb-1">
              TROT <span className="text-2xl md:text-3xl">🐎</span>
            </div>
            <span className="font-mono text-[10px] md:text-xs opacity-80 font-bold uppercase tracking-widest">Hyper Green</span>
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
      className="absolute w-full h-[calc(100%-20px)] overflow-hidden bg-gradient-to-b from-[#3D246C] to-[#2D1B4E] rounded-[32px] border-2 border-border-light flex flex-col"
    >
      <div className="relative flex-1 p-6 md:p-8 flex flex-col z-10 overflow-y-auto hide-scrollbar">
        {/* Mock GitHub Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs md:text-sm tracking-wide">
            <span className="w-2 h-2 rounded-full bg-hyper-green shadow-[0_0_8px_#22C55E]"></span>
            README.MD
          </div>
          <div className="bg-black/40 border border-white/10 text-zinc-300 px-3 py-1 rounded-full font-mono text-[10px] md:text-xs uppercase font-bold tracking-wider">
            NEW APP IDEA
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-white tracking-tight">{idea.title}</h2>
        <p className="text-base md:text-xl text-zinc-200 mb-8 leading-relaxed font-medium">{idea.description}</p>
        
        {/* Mock Checkboxes */}
        <div className="bg-black/20 rounded-2xl p-4 mb-4 border border-white/5 space-y-3">
          <div className="flex items-center gap-3 text-zinc-300 text-sm md:text-base font-medium">
            <CheckCircle className="w-5 h-5 text-zinc-500" />
            <span>GitHub-style README mock</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300 text-sm md:text-base font-medium">
            <CheckCircle className="w-5 h-5 text-zinc-500" />
            <span>Neon decision logic</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300 text-sm md:text-base font-medium">
            <CheckCircle className="w-5 h-5 text-zinc-500" />
            <span>Built for satisfying doomscrolling</span>
          </div>
        </div>

        {/* Mock Terminal */}
        <div className="bg-black/40 rounded-2xl p-4 border border-white/10 font-mono text-xs md:text-sm mb-8">
          <div className="text-toxic-purple-light font-bold mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> npm install rot-or-trot
          </div>
          <ul className="text-zinc-400 space-y-1 ml-6 list-disc">
            <li>swipe right to trot</li>
            <li>swipe left to rot</li>
            <li>watch the decay timer collapse</li>
          </ul>
        </div>
      </div>
      
      {/* Background Placeholder at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-zinc-900 z-0 border-t border-white/10 pointer-events-none opacity-40">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B4E] to-transparent"></div>
      </div>
    </motion.div>
  );
}
