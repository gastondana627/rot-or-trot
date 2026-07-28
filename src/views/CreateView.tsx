import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { Idea } from '../types';

interface CreateViewProps {
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'status'>) => void;
  onComplete: () => void;
}

export default function CreateView({ addIdea, onComplete }: CreateViewProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState<{ title: string, description: string } | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setGeneratedPitch(null);
    try {
      const res = await fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: input })
      });
      const data = await res.json();
      if (data.title && data.description) {
        setGeneratedPitch(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = () => {
    if (generatedPitch) {
      addIdea({
        title: generatedPitch.title,
        description: generatedPitch.description,
        tags: ['AI GENERATED', 'NEW'],
        decayTime: 60 // 60 seconds
      });
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col p-6 relative overflow-y-auto hide-scrollbar pb-20">
      <div className="flex justify-between items-start mb-8 md:max-w-2xl mx-auto w-full">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 border-2 border-border-light bg-bg-darker flex items-center justify-center shrink-0 shadow-[4px_4px_0_0_#3D246C]">
            <Sparkles className="w-6 h-6 text-toxic-purple" />
          </div>
          <div>
            <h2 className="font-black text-4xl tracking-tighter text-white mb-2 uppercase">Creator<br/>Studio</h2>
            <div className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase leading-relaxed flex flex-col gap-1">
              <span>PITCH GENERATOR</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 border-2 border-border-light bg-bg-darker text-zinc-400 text-[10px] font-mono tracking-[0.2em] uppercase shadow-[4px_4px_0_0_#3D246C]">
          STUDIO
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 md:max-w-2xl mx-auto w-full">
        <label className="text-sm text-zinc-400 font-mono">Drop your GitHub repo or raw idea here...</label>
        
        <div className="bg-bg-card border-2 border-border-light relative shadow-[8px_8px_0_0_#3D246C]">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Drop your GitHub repo or raw idea here..."
            className="w-full h-48 bg-transparent p-6 text-lg font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-toxic-purple transition-colors resize-none"
          />
          <div className="absolute bottom-2 right-2 opacity-50">
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L0 12H12V0Z" fill="currentColor"/>
             </svg>
          </div>
        </div>

        <div className="flex justify-between items-center mb-2 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border-2 border-border-light text-zinc-300 text-sm shadow-[4px_4px_0_0_#3D246C]">
            Cyberpunk <ChevronDown className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {!generatedPitch ? (
          <button 
            onClick={handleGenerate}
            disabled={!input.trim() || isLoading}
            className="w-full py-4 brutalist-button bg-toxic-purple text-bg-base text-sm flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
            {isLoading ? 'GENERATING...' : 'GENERATE PITCH'}
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-bg-card border-2 border-hyper-green p-6 shadow-[8px_8px_0_0_#22C55E]"
          >
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-hyper-green bg-hyper-green/10 text-hyper-green text-xs font-mono font-bold uppercase tracking-widest w-fit mb-6">
              <Sparkles className="w-3 h-3" /> Generated Pitch
            </div>
            <h3 className="font-black text-3xl mb-4 text-white leading-tight uppercase">{generatedPitch.title}</h3>
            <p className="text-zinc-300 text-base mb-8 leading-relaxed font-mono">{generatedPitch.description}</p>
            
            <button 
              onClick={handleDrop}
              className="w-full py-4 brutalist-button-green text-sm flex justify-center items-center"
            >
              DROP INTO FEED
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
