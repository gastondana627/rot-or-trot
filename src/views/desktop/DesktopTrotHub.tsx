import React, { useState } from 'react';
import { Idea } from '../../types';

export default function DesktopTrotHub({ ideas }: { ideas: Idea[] }) {
  const [trottedIdeas, setTrottedIdeas] = useState(
    ideas.filter(i => i.status === 'trotted').sort((a, b) => (b.trots || 0) - (a.trots || 0))
  );

  // --- PLEDGE & ACTIVITY STATE ---
  const [pledgeAmount, setPledgeAmount] = useState<number>(25);
  const [totalPool, setTotalPool] = useState<number>(42190);
  const [activityFeed, setActivityFeed] = useState<any[]>([
    { time: '00:00:01.5', type: 'TROT', name: 'Phantom Forge' },
    { time: '00:00:02.9', type: 'ROT', name: 'Mood Forge' },
    { time: '00:00:04.1', type: 'TROT', name: 'Decay Relay' }
  ]);

  // --- CLAIM TO BUILD API HANDLER ---
  const handleClaimBuild = async (projectId: string, devHandle: string = '@gasman93') => {
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, devHandle })
      });
      
      if (res.ok) {
        setTrottedIdeas(prev => prev.map(p => 
          p.id === projectId ? { ...p, claimed: true, devsPledged: (p.devsPledged || 0) + 1 } : p
        ));
      } else {
        setTrottedIdeas(prev => prev.map(p => 
          p.id === projectId ? { ...p, claimed: true, devsPledged: (p.devsPledged || 0) + 1 } : p
        ));
      }
    } catch (error) {
      console.error('Network error claiming build:', error);
      setTrottedIdeas(prev => prev.map(p => 
        p.id === projectId ? { ...p, claimed: true, devsPledged: (p.devsPledged || 0) + 1 } : p
      ));
    }
  };

  // --- PLEDGE TOKENS API HANDLER ---
  const handlePledgeTokens = async (targetProjectId: string = 'top-project') => {
    try {
      const res = await fetch('/api/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: targetProjectId, amount: pledgeAmount })
      });

      if (res.ok) {
        const data = await res.json();
        setTotalPool(data.newTotalPool);
        setActivityFeed(prev => [data.newActivityItem, ...prev.slice(0, 4)]);
      } else {
        setTotalPool(prev => prev + pledgeAmount);
        const now = new Date().toTimeString().split(' ')[0] + '.0';
        setActivityFeed(prev => [{ time: now, type: 'TROT', name: `$TROT ${pledgeAmount} Pledged` }, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Failed to process pledge:', error);
      setTotalPool(prev => prev + pledgeAmount);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-base text-zinc-100 p-8 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="border border-hyper-green px-3 py-1 text-[10px] font-mono text-hyper-green">
                LIVE // 24 TRENDING
              </span>
              <span className="font-mono text-xs text-zinc-400">
                TOTAL POOL: <strong className="text-hyper-green">${totalPool.toLocaleString()} TROT</strong>
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">The Trot Hub</h1>
            <div className="flex gap-2 mt-4">
              <button className="border border-border-light bg-bg-card px-4 py-1 text-xs font-mono text-white">TRENDING</button>
              <button className="border border-border-light px-4 py-1 text-xs font-mono text-zinc-500 hover:text-white">NEW</button>
              <button className="border border-border-light px-4 py-1 text-xs font-mono text-zinc-500 hover:text-white">DECAY SURVIVORS</button>
            </div>
          </div>
          <div className="w-64">
             <input type="text" placeholder="Search projects..." className="w-full bg-bg-darker border border-border-light p-3 text-sm font-mono focus:outline-none focus:border-toxic-purple" />
          </div>
        </header>

        <div className="flex gap-8">
          {/* Main Table */}
          <div className="flex-1 border-2 border-hyper-green p-1 bg-bg-card shadow-[12px_12px_0_0_#22C55E]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-light font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  <th className="py-4 px-4 font-normal">Rank</th>
                  <th className="py-4 px-4 font-normal">Project</th>
                  <th className="py-4 px-4 font-normal">Pledges</th>
                  <th className="py-4 px-4 font-normal">Decay Survival</th>
                  <th className="py-4 px-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {trottedIdeas.map((idea, i) => {
                  const isClaimed = (idea as any).claimed;
                  return (
                    <tr key={idea.id} className="border-b border-border-light/50 hover:bg-bg-darker transition-colors">
                      <td className="py-4 px-4">
                        <div className="bg-hyper-green text-bg-base font-bold font-mono text-xs inline-block px-2 py-1">#{i + 1}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold uppercase tracking-wide">{idea.title}</div>
                        <div className="text-[10px] text-zinc-500 font-mono mt-1">{idea.trots || 0} TROTS &middot; {idea.devsPledged || 0} devs building</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-sm">{idea.devsPledged || 0} devs</td>
                      <td className="py-4 px-4 font-mono text-sm text-hyper-green">
                        {Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}m
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => handleClaimBuild(idea.id)}
                          className={`px-4 py-2 text-xs font-mono font-bold transition-all ${
                            isClaimed 
                              ? 'bg-bg-darker text-hyper-green border border-hyper-green' 
                              : 'brutalist-button-green'
                          }`}
                        >
                          {isClaimed ? 'CLAIMED 🐎' : 'Claim to Build 🐎'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {trottedIdeas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 font-mono text-sm">No trending projects yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-8">
            <div className="border border-toxic-purple p-6 bg-bg-card shadow-[8px_8px_0_0_#A855F7]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-mono text-xs text-white uppercase tracking-widest">Top Dev Pledges</h3>
                 <span className="border border-toxic-purple px-2 py-1 text-[10px] font-mono text-toxic-purple">42 devs</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border border-border-light p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-darker border border-toxic-purple flex items-center justify-center text-xs font-mono text-toxic-purple">JD</div>
                    <span className="font-mono text-sm">@jd_builds</span>
                  </div>
                  <span className="font-mono text-hyper-green text-sm">$TROT 2,400</span>
                </div>
                <div className="flex justify-between items-center border border-border-light p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-darker border border-toxic-purple flex items-center justify-center text-xs font-mono text-toxic-purple">MK</div>
                    <span className="font-mono text-sm">@mkode</span>
                  </div>
                  <span className="font-mono text-hyper-green text-sm">$TROT 1,980</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border-light">
                 <div className="text-[10px] font-mono text-zinc-500 mb-2 uppercase">Pledge to top project</div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => setPledgeAmount(prev => Math.max(5, prev - 5))}
                     className="border border-border-light px-3 hover:bg-bg-darker text-white font-mono"
                   >-</button>
                   <input 
                     type="text" 
                     value={`$TROT ${pledgeAmount}`} 
                     readOnly 
                     className="w-full bg-bg-darker border border-border-light text-center font-mono text-sm text-white" 
                   />
                   <button 
                     onClick={() => setPledgeAmount(prev => prev + 5)}
                     className="border border-border-light px-3 hover:bg-bg-darker text-white font-mono"
                   >+</button>
                 </div>
                 <button 
                   onClick={() => handlePledgeTokens()}
                   className="w-full brutalist-button-green py-3 text-xs mt-4"
                 >
                   PLEDGE NOW ⚡
                 </button>
              </div>
            </div>

            <div className="border border-hyper-green p-6 bg-bg-card">
              <h3 className="font-mono text-xs text-white uppercase tracking-widest flex justify-between items-center mb-6">
                Live Activity Feed
                <span className="text-hyper-green flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-hyper-green"></div>LIVE</span>
              </h3>
              <div className="space-y-4 text-[10px] font-mono">
                 {activityFeed.map((item, idx) => (
                   <div key={idx} className="flex justify-between text-zinc-400">
                     <span>{item.time}</span>
                     <span className={item.type === 'TROT' ? 'text-hyper-green' : 'text-toxic-purple'}>{item.type}</span>
                     <span className="text-white">{item.name}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}