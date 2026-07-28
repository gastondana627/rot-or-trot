import React, { useState } from 'react';
import { Idea } from '../types';
import { Skull, Search, Filter, Zap, Activity, Sparkles, BarChart2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ExploreViewProps {
  ideas: Idea[];
}

export default function ExploreView({ ideas }: ExploreViewProps) {
  const [tab, setTab] = useState<'graveyard' | 'hub'>('graveyard');
  
  const rotted = ideas.filter(i => i.status === 'rotted');
  const trotted = ideas.filter(i => i.status === 'trotted').sort((a, b) => (b.trots || 0) - (a.trots || 0));

  return (
    <div className="h-full flex flex-col md:max-w-4xl mx-auto w-full pb-20">
      <div className="p-4 md:p-6 border-b border-border-light flex gap-4 shrink-0 bg-bg-base/80 backdrop-blur-md sticky top-0 z-30">
        <button 
          onClick={() => setTab('graveyard')}
          className={`flex-1 py-3 rounded-full font-mono text-xs md:text-sm uppercase font-bold tracking-widest transition-all ${tab === 'graveyard' ? 'bg-bg-darker text-toxic-purple border border-toxic-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border border-border-light bg-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Graveyard
        </button>
        <button 
          onClick={() => setTab('hub')}
          className={`flex-1 py-3 rounded-full font-mono text-xs md:text-sm uppercase font-bold tracking-widest transition-all ${tab === 'hub' ? 'bg-bg-darker text-hyper-green border border-hyper-green shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border border-border-light bg-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Trot Hub
        </button>
      </div>

      <div className="p-4 md:p-6 flex-1 overflow-y-auto hide-scrollbar">
        {tab === 'graveyard' ? (
          <Graveyard ideas={rotted} />
        ) : (
          <TrotHub ideas={trotted} />
        )}
      </div>
    </div>
  );
}

function Graveyard({ ideas }: { ideas: Idea[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-darker border border-border-light flex items-center justify-center">
            <Skull className="w-5 h-5 text-toxic-purple" />
          </div>
          <div>
            <h2 className="font-black text-2xl tracking-tight text-white">The Graveyard</h2>
            <div className="text-xs text-toxic-purple-light font-mono tracking-widest uppercase">Rot Vault</div>
          </div>
        </div>
        <div className="flex gap-2 text-zinc-400 bg-bg-darker border border-border-light rounded-full px-4 py-2">
          <Search className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <Filter className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
      
      <div className="bg-bg-card border border-border-light rounded-[24px] p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-toxic-purple bg-toxic-purple/10 text-toxic-purple text-xs font-mono font-bold uppercase tracking-widest">
            <Skull className="w-3 h-3" /> Rotted Ideas
          </div>
          <div className="px-4 py-2 rounded-full border border-border-light bg-bg-darker text-zinc-400 text-xs font-mono">
            {ideas.length} archived
          </div>
        </div>
        <p className="text-zinc-300 text-base leading-relaxed">A vault of ideas that missed the decay timer and got buried with full creative honors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idea.id} 
            className="bg-bg-card border-2 border-border-light p-6 flex flex-col transition-colors shadow-[8px_8px_0_0_#3D246C]"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-2xl leading-tight text-white pr-2">{idea.title}</h3>
              <span className="bg-toxic-purple/20 border border-toxic-purple text-toxic-purple px-2 py-1 font-mono text-[10px] font-bold uppercase whitespace-nowrap">Decayed</span>
            </div>
            
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 shrink-0 bg-bg-darker border border-toxic-purple flex items-center justify-center mt-1 shadow-[2px_2px_0_0_#A855F7]">
                <Skull className="w-4 h-4 text-toxic-purple" />
              </div>
              <div>
                <div className="text-xs text-zinc-400 font-mono">Rotted</div>
                <div className="text-sm text-zinc-500 font-mono">{Math.floor((Date.now() - idea.createdAt) / 3600000)}h ago</div>
              </div>
            </div>
            
            <p className="text-zinc-300 text-sm mb-6 flex-1 line-clamp-3">
              {idea.roast || idea.description}
            </p>
            
            <button className="brutalist-button bg-toxic-purple text-bg-base py-3 text-sm flex items-center justify-center gap-2">
              Revive <Zap className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrotHub({ ideas }: { ideas: Idea[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-darker border border-border-light flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-hyper-green" />
          </div>
          <div>
            <h2 className="font-black text-2xl tracking-tight text-white">The Trot Hub</h2>
            <div className="text-xs text-zinc-500 font-mono tracking-widest uppercase">The Rise Leaderboard</div>
          </div>
        </div>
        <div className="px-4 py-2 rounded-full border border-hyper-green bg-hyper-green/10 text-hyper-green flex items-center gap-2 text-xs font-mono font-bold tracking-widest">
          <Activity className="w-4 h-4" /> LIVE
        </div>
      </div>

      <div className="bg-bg-card border border-border-light rounded-[24px] p-6 mb-8">
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-2">
          <div className="shrink-0 px-6 py-2 rounded-full border border-toxic-purple bg-toxic-purple/10 text-toxic-purple text-xs font-mono font-bold uppercase tracking-widest">
            Top Trots
          </div>
          <div className="shrink-0 px-6 py-2 rounded-full border border-border-light bg-bg-darker text-zinc-400 text-xs font-mono font-bold uppercase tracking-widest">
            24h Trending
          </div>
        </div>
        <p className="text-zinc-300 text-base leading-relaxed">Projects that survived the decay timer and are now racing up the leaderboard with real traction.</p>
      </div>

      <div className="space-y-6">
        {ideas.map((idea, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={idea.id} 
            className="bg-bg-card border-2 border-hyper-green p-6 flex flex-col md:flex-row gap-6 relative shadow-[8px_8px_0_0_#22C55E]"
          >
            <div className="font-black text-5xl md:text-7xl text-white tracking-tighter w-16 md:w-24 mt-2">#{index + 1}</div>
            
            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-2xl md:text-3xl text-white max-w-[80%]">{idea.title}</h3>
                <div className="flex gap-1 items-end h-10"> 
                   {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-2 md:w-3 ${i < 3 ? 'bg-hyper-green' : 'bg-toxic-purple'}`} style={{ height: `${Math.random() * 60 + 40}%` }}></div>
                   ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-hyper-green font-mono text-sm tracking-widest font-bold">{idea.trots} TROTS</span>
                <span className="text-zinc-400 font-mono text-sm tracking-widest">{idea.devsPledged || Math.floor(Math.random() * 50)} DEVS PLEDGED</span>
              </div>
              
              <button className="brutalist-button-green w-full md:w-auto px-8 py-3 text-sm flex items-center justify-center gap-2">
                CLAIM TO BUILD 🐎
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
