import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo, AnimatePresence } from 'motion/react';
import { Idea } from '../types';
import { Skull, CheckCircle, Terminal } from 'lucide-react';

interface FeedViewProps {
  ideas: Idea[];
  updateIdeaStatus: (id: string, status: 'rotted' | 'trotted') => void;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'status'>, append?: boolean) => void;
}

const FALLBACK_IDEAS: Omit<Idea, 'id' | 'createdAt' | 'status'>[] = [
  {
    title: "PromptOverflow",
    description: "A StackOverflow clone where AI developers yell at each other's system prompts until the context window explodes.",
    tags: ['CYBERPUNK', 'AI'],
    decayTime: 42
  },
  {
    title: "Tind(R)oll",
    description: "Swipe right on risky smart contracts. If it rugs you, the app auto-posts a salty meme to your X feed.",
    tags: ['WEB3', 'MEME'],
    decayTime: 42
  },
  {
    title: "Neural Net-flix",
    description: "AI generates personalized 80s dystopian cyberpunk movies in real-time based on your doomscrolling habits.",
    tags: ['SYNTHETIC MEDIA'],
    decayTime: 42
  }
];

export default function FeedView({ ideas, updateIdeaStatus, addIdea }: FeedViewProps) {
  const pendingIdeas = ideas.filter(i => i.status === 'pending');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('right');

  const activeIdeas: Idea[] = pendingIdeas.length > 0 
    ? pendingIdeas 
    : FALLBACK_IDEAS.map((mock, idx) => ({
        ...mock,
        id: `default-${idx}`,
        createdAt: Date.now(),
        status: 'pending' as const
      }));

  const currentIdea = activeIdeas[0];

  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    updateIdeaStatus(id, direction === 'left' ? 'rotted' : 'trotted');
  };

  return (
    <div className="h-full w-full flex flex-col justify-between p-3 max-w-xl mx-auto overflow-hidden">
      
      {/* Decay Timer Bar */}
      <div className="flex justify-between items-center px-4 py-2 rounded-full bg-border-light/30 border border-border-light shrink-0 z-20 mb-2 shadow-lg">
        <span className="text-xs text-toxic-purple-light tracking-widest font-mono uppercase font-bold">Decay Timer</span>
        <DecayTimer initialSeconds={currentIdea?.decayTime || 42} onExpire={() => currentIdea && handleSwipe(currentIdea.id, 'left')} />
      </div>

      {/* Main Card Stack Container */}
      <div className="relative w-full flex-1 min-h-0 my-1 flex items-center justify-center perspective-[1000px] z-10">
        <AnimatePresence custom={swipeDirection}>
          {activeIdeas.slice(0, 3).reverse().map((i, idx) => (
            <IdeaCard 
              key={i.id} 
              idea={i} 
              isTop={idx === activeIdeas.slice(0, 3).length - 1} 
              onSwipe={(dir) => handleSwipe(i.id, dir)}
              index={activeIdeas.slice(0, 3).length - 1 - idx}
              custom={swipeDirection}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 shrink-0 z-20 h-14 mt-2">
        <button 
          onClick={() => currentIdea && handleSwipe(currentIdea.id, 'left')}
          className="flex-1 brutalist-button bg-toxic-purple text-white border-2 border-toxic-purple flex flex-col items-start justify-center px-3 py-1.5 relative overflow-hidden group shadow-[4px_4px_0px_0px_#A855F7] active:translate-y-0.5 transition-all"
        >
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5 text-base font-black tracking-widest leading-none mb-0.5">
              ROT <Skull className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-[9px] opacity-80 font-bold uppercase tracking-widest leading-none">Toxic Purple</span>
          </div>
        </button>
        <button 
          onClick={() => currentIdea && handleSwipe(currentIdea.id, 'right')}
          className="flex-1 brutalist-button-green bg-bg-card text-border-light border-2 border-hyper-green shadow-[4px_4px_0px_0px_#22C55E] flex flex-col items-start justify-center px-3 py-1.5 relative overflow-hidden group hover:bg-hyper-green hover:text-bg-base transition-colors duration-300 active:translate-y-0.5"
        >
          <div className="relative z-10 flex flex-col items-start text-left">
            <div className="flex items-center gap-1.5 text-base font-black tracking-widest leading-none mb-0.5">
              TROT <span className="text-sm">🐎</span>
            </div>
            <span className="font-mono text-[9px] opacity-80 font-bold uppercase tracking-widest leading-none">Hyper Green</span>
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
    <div className="font-mono text-zinc-100 bg-black/50 px-2.5 py-0.5 rounded-md border border-zinc-800 text-xs font-bold">
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
    controls.start({ scale: 1 - index * 0.04, y: index * -8, opacity: 1, zIndex: 10 - index, x: 0 });
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
      style={{ touchAction: 'pan-y' }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute w-full h-full bg-gradient-to-b from-[#3D246C] to-[#2D1B4E] rounded-[20px] border-2 border-border-light flex flex-col shadow-2xl overflow-hidden"
    >
      {/* Scrollable Body Wrapper */}
      <div 
        className="w-full h-full overflow-y-auto p-4 sm:p-5 custom-scrollbar flex flex-col"
        style={{ touchAction: 'pan-y' }}
      >
        {/* GitHub Header Badge */}
        <div className="flex justify-between items-center mb-3 shrink-0">
          <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-hyper-green shadow-[0_0_8px_#22C55E]"></span>
            README.MD
          </div>
          <div className="bg-black/40 border border-white/10 text-zinc-300 px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider">
            NEW APP IDEA
          </div>
        </div>

        {/* Startup Title */}
        <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2 text-white tracking-tight break-words shrink-0">
          {idea.title}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-200 mb-3 leading-relaxed font-medium shrink-0">
          {idea.description}
        </p>
        
        {/* Feature Checkboxes */}
        <div className="bg-black/20 rounded-xl p-2.5 mb-3 border border-white/5 space-y-1.5 shrink-0">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>GitHub-style README mock</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>Neon decision logic</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>Built for satisfying doomscrolling</span>
          </div>
        </div>

        {/* Terminal Box */}
        <div className="bg-black/40 rounded-xl p-2.5 border border-white/10 font-mono text-xs shrink-0 mb-2">
          <div className="text-toxic-purple-light font-bold mb-1 flex items-center gap-1.5 text-[11px]">
            <Terminal className="w-3.5 h-3.5" /> npm install rot-or-trot
          </div>
          <ul className="text-zinc-400 space-y-0.5 ml-4 list-disc text-[10px]">
            <li>swipe right to trot</li>
            <li>swipe left to rot</li>
            <li>watch the decay timer collapse</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}