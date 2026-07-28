import React from 'react';
import { Skull, Zap } from 'lucide-react';
import { Idea } from '../../types';
import FeedView from '../FeedView';

export default function ControlRoom({ ideas, updateIdeaStatus, addIdea }: { ideas: Idea[], updateIdeaStatus: (id: string, status: 'rotted' | 'trotted') => void, addIdea: (idea: any) => void }) {
  const rottedIdeas = ideas.filter(i => i.status === 'rotted').slice(0, 3);
  const trottedIdeas = ideas.filter(i => i.status === 'trotted').sort((a, b) => (b.trots || 0) - (a.trots || 0)).slice(0, 4);

  return (
    <div className="flex h-full w-full bg-bg-base text-zinc-100 overflow-hidden">
      {/* Left Column - Telemetry */}
      <div className="w-1/4 min-w-[300px] border-r border-border-light flex flex-col p-6 overflow-y-auto">
        <h2 className="font-mono text-sm tracking-widest text-zinc-400 mb-6 uppercase flex items-center gap-2">
          <span className="w-4 h-px bg-toxic-purple"></span>
          System Telemetry
        </h2>
        
        <div className="space-y-6">
          <div className="border border-border-light p-4 bg-bg-card">
            <h3 className="font-mono text-[10px] text-zinc-500 mb-4">LATENCY METRICS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border-light p-3">
                <div className="font-mono text-[10px] text-zinc-500">API RTT</div>
                <div className="font-mono text-xl text-hyper-green mt-1">24ms</div>
              </div>
              <div className="border border-border-light p-3">
                <div className="font-mono text-[10px] text-zinc-500">AI EXEC</div>
                <div className="font-mono text-xl text-hyper-green mt-1">138ms</div>
              </div>
              <div className="border border-border-light p-3">
                <div className="font-mono text-[10px] text-zinc-500">SHEETS</div>
                <div className="font-mono text-xl text-hyper-green mt-1">61ms</div>
              </div>
              <div className="border border-border-light p-3">
                <div className="font-mono text-[10px] text-zinc-500">RENDER</div>
                <div className="font-mono text-xl text-hyper-green mt-1">16ms</div>
              </div>
            </div>
          </div>

          <div className="border border-border-light p-4 bg-bg-card">
            <h3 className="font-mono text-[10px] text-zinc-500 mb-4">AI ENGINE STATUS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border border-border-light p-2">
                <span className="font-mono text-[10px] text-zinc-400">gpt-4o</span>
                <span className="font-mono text-[10px] text-hyper-green flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hyper-green"></div>READY</span>
              </div>
              <div className="flex justify-between items-center border border-border-light p-2">
                <span className="font-mono text-[10px] text-zinc-400">DECAY_ENGINE</span>
                <span className="font-mono text-[10px] text-hyper-green flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hyper-green"></div>RUNNING</span>
              </div>
              <div className="flex justify-between items-center border border-border-light p-2">
                <span className="font-mono text-[10px] text-zinc-400">VAULT_INDEXER</span>
                <span className="font-mono text-[10px] text-hyper-green flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hyper-green"></div>IDLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Column - Mobile Frame */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMHgtNDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0zOSAzOVYxaC0zOHYzOGgzOHoiIGZpbGw9IiMxMDBBMTciIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]">
        <div className="relative w-[375px] h-[812px] bg-bg-darker rounded-[40px] border-8 border-toxic-purple shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden shrink-0 flex flex-col">
          <div className="absolute top-0 inset-x-0 h-6 bg-toxic-purple rounded-b-xl w-32 mx-auto z-50"></div>
          <FeedView ideas={ideas} updateIdeaStatus={updateIdeaStatus} addIdea={addIdea} />
        </div>
        <div className="mt-8 flex gap-4">
          <button className="px-4 py-2 border border-toxic-purple font-mono text-sm text-toxic-purple hover:bg-toxic-purple hover:text-bg-base transition-colors">-5s</button>
          <div className="px-6 py-2 border border-border-light font-mono text-sm text-zinc-500">DECAY CONTROL</div>
          <button className="px-4 py-2 border border-hyper-green font-mono text-sm text-hyper-green hover:bg-hyper-green hover:text-bg-base transition-colors">+5s</button>
        </div>
      </div>

      {/* Right Column - Logs & Sync */}
      <div className="w-1/4 min-w-[300px] border-l border-border-light flex flex-col p-6 overflow-y-auto">
        <h2 className="font-mono text-sm tracking-widest text-zinc-400 mb-6 uppercase flex items-center gap-2">
          <Zap className="w-4 h-4 text-hyper-green" />
          Live Sync Stream
        </h2>

        <div className="space-y-6">
          <div className="border border-border-light bg-bg-card p-4">
             <h3 className="font-mono text-[10px] text-zinc-500 mb-4 flex justify-between">
                <span>RECENT ROTTED VAULT</span>
             </h3>
             <div className="space-y-3">
               {rottedIdeas.map(idea => (
                 <div key={idea.id} className="border border-border-light p-3 flex justify-between items-center">
                   <div>
                     <div className="font-mono font-bold text-xs">{idea.title}</div>
                     <div className="text-[10px] text-zinc-500 mt-1">Rotted just now</div>
                   </div>
                   <Skull className="w-4 h-4 text-zinc-500" />
                 </div>
               ))}
               {rottedIdeas.length === 0 && (
                 <div className="text-xs text-zinc-500 font-mono">Vault is empty...</div>
               )}
             </div>
          </div>

          <div className="border-2 border-hyper-green bg-bg-card p-4">
             <h3 className="font-mono text-[10px] text-hyper-green mb-4 flex justify-between">
                <span>TOP TROT HIGHLIGHTS</span>
             </h3>
             <div className="space-y-3">
               {trottedIdeas.map((idea, i) => (
                 <div key={idea.id} className="border border-border-light p-3 flex gap-3 items-center">
                   <div className="font-mono font-bold text-hyper-green border border-hyper-green px-2 py-1 text-xs">#{i + 1}</div>
                   <div>
                     <div className="font-mono font-bold text-xs">{idea.title}</div>
                     <div className="text-[10px] text-zinc-500 mt-1">{idea.trots || 0} TROTS</div>
                   </div>
                 </div>
               ))}
                {trottedIdeas.length === 0 && (
                 <div className="text-xs text-zinc-500 font-mono">No trending projects...</div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
