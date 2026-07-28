import React, { useState } from 'react';
import { Idea } from '../types';

interface ProfileViewProps {
  ideas: Idea[];
}

export default function ProfileView({ ideas }: ProfileViewProps) {
  const rottedCount = ideas.filter(i => i.status === 'rotted').length;
  const trottedCount = ideas.filter(i => i.status === 'trotted').length;
  const activeCount = ideas.filter(i => i.status === 'pending').length;

  return (
    <div className="h-full overflow-y-auto hide-scrollbar p-6 space-y-8 pb-20 bg-bg-base">
      {/* Header */}
      <div className="flex justify-between items-start md:max-w-2xl mx-auto w-full">
        <div>
          <h2 className="font-black text-4xl tracking-tighter text-white mb-2 uppercase">User Profile</h2>
          <div className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase leading-relaxed flex flex-col gap-1">
            <span>SUBMISSIONS &</span>
            <span>SETTINGS</span>
          </div>
        </div>
        <div className="px-4 py-2 border-2 border-toxic-purple bg-bg-darker text-toxic-purple text-[10px] font-mono tracking-[0.2em] uppercase shadow-[4px_4px_0_0_#A855F7]">
          ACTIVE
        </div>
      </div>

      <div className="md:max-w-2xl mx-auto w-full space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <StatBox label="ROTTED" value={rottedCount.toString() || "14"} />
          <StatBox label="PROJECTS TROTTED" value={trottedCount.toString() || "6"} highlight />
          <StatBox label="EARNED CREDITS" value="420" />
        </div>

        {/* Active Submissions */}
        <div className="bg-bg-card border-2 border-border-light p-6 space-y-6 shadow-[8px_8px_0_0_#3D246C]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-3xl text-white leading-none tracking-tight mb-2 uppercase">Active<br/>Submissions</h3>
              <div className="text-sm text-zinc-400 font-mono">Personal projects in the pipeline</div>
            </div>
            <div className="w-16 h-16 border-2 border-border-light bg-bg-darker flex flex-col items-center justify-center gap-1 shrink-0 shadow-[4px_4px_0_0_#3D246C]">
              <span className="text-xl text-white font-mono font-bold leading-none">{activeCount}</span>
              <span className="text-[8px] text-zinc-500 font-mono tracking-[0.2em] uppercase leading-none">LIVE</span>
            </div>
          </div>

          <div className="space-y-4">
            <SubmissionItem 
              title="Neon Forge" 
              subtitle="Pitch draft · awaiting review" 
              status="DRAFT" 
              statusColor="text-toxic-purple border-toxic-purple bg-toxic-purple/10 shadow-[2px_2px_0_0_#A855F7]" 
            />
            <SubmissionItem 
              title="Vault Sprint" 
              subtitle="Submitted to leaderboard" 
              status="LIVE" 
              statusColor="text-hyper-green border-hyper-green bg-hyper-green/10 shadow-[2px_2px_0_0_#22C55E]" 
            />
            <SubmissionItem 
              title="Pulse Relay" 
              subtitle="Queued for generation" 
              status="QUEUED" 
              statusColor="text-zinc-400 border-border-light bg-bg-darker shadow-[2px_2px_0_0_#3D246C]" 
            />
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-bg-card border-2 border-border-light p-6 space-y-6 shadow-[8px_8px_0_0_#3D246C]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-3xl text-white leading-none tracking-tight mb-2 uppercase">System<br/>Settings</h3>
              <div className="text-sm text-zinc-400 font-mono">Safety and content controls</div>
            </div>
            <div className="px-4 py-2 border-2 border-border-light bg-bg-darker text-zinc-400 text-[10px] font-mono tracking-[0.2em] uppercase shrink-0 shadow-[4px_4px_0_0_#3D246C]">
              CONTROLS
            </div>
          </div>

          <div className="bg-bg-darker border-2 border-border-light p-6 flex justify-between items-center gap-4 shadow-[4px_4px_0_0_#3D246C]">
            <div>
              <h4 className="font-bold text-lg text-white mb-1 uppercase tracking-wider">Safe Mode</h4>
              <div className="text-xs text-zinc-500 font-mono">Filter aggressive outputs and risky prompts</div>
            </div>
            <Toggle initial={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`bg-bg-darker border-2 p-4 flex flex-col justify-between h-32 transition-all ${highlight ? 'border-toxic-purple shadow-[4px_4px_0_0_#A855F7]' : 'border-hyper-green shadow-[4px_4px_0_0_#22C55E]'}`}>
      <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">{label}</div>
      <div className={`text-4xl font-mono mt-auto font-black ${highlight ? 'text-toxic-purple' : 'text-hyper-green'}`}>{value}</div>
    </div>
  );
}

function SubmissionItem({ title, subtitle, status, statusColor }: { title: string, subtitle: string, status: string, statusColor: string }) {
  return (
    <div className="bg-bg-darker border-2 border-border-light p-5 flex justify-between items-center gap-4 hover:border-toxic-purple/50 transition-colors">
      <div>
        <h4 className="font-bold text-lg text-white mb-1 uppercase">{title}</h4>
        <div className="text-xs text-zinc-500 font-mono">{subtitle}</div>
      </div>
      <div className={`text-[10px] font-mono tracking-[0.2em] border-2 px-4 py-2 shrink-0 ${statusColor}`}>
        {status}
      </div>
    </div>
  );
}

function Toggle({ initial }: { initial: boolean }) {
  const [active, setActive] = useState(initial);
  return (
    <button 
      onClick={() => setActive(!active)}
      className={`w-14 h-8 p-1 transition-all flex items-center shrink-0 border-2 ${active ? 'border-toxic-purple bg-toxic-purple shadow-[2px_2px_0_0_#A855F7]' : 'border-border-light bg-bg-base shadow-[2px_2px_0_0_#3D246C]'}`}
    >
      <div className={`w-5 h-5 bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}
