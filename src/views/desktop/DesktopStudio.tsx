import React, { useState } from 'react';
import { Eye, Skull, Zap, Rocket } from 'lucide-react';

export default function DesktopStudio({ addIdea }: { addIdea: (idea: any) => void }) {
  const [pitch, setPitch] = useState('');
  const [tag, setTag] = useState('Cyberpunk Brutalist AI-Chaos Vaporware Web3');

  const handleGenerate = () => {
    if (!pitch.trim()) return;
    
    // We pass the raw pitch as the title so the App.tsx interceptor can grab the URL, 
    // while ensuring we don't lose our specific Studio tags!
    addIdea({
      title: pitch, 
      tags: [tag.split(' ')[0], 'WEB3'],
      decayTime: 42
    });
    setPitch('');
  };

  // --- LIVE PREVIEW PARSER (Real-time formatting) ---
  let previewTitle = pitch ? "GENERATED PREVIEW" : "DARK CYBERPUNK X SHADCN";
  let previewDesc = pitch || "A chaotic swipe engine for deciding whether an idea should rot in the backlog or trot into production.";
  let previewFooter = pitch ? "Preview generated..." : "Awaiting repo input...";

  // Instantly format if it detects a GitHub URL while typing
  const githubRegex = /github\.com\/([^/]+)\/([^/\s]+)/i;
  const match = pitch.match(githubRegex);

  if (match) {
    const username = match[1];
    const repo = match[2].replace('.git', '');
    previewTitle = repo.toUpperCase();
    previewDesc = `Built by @${username}. ${pitch}`;
    previewFooter = "GitHub Repo Detected ⚡";
  }
  // --------------------------------------------------

  return (
    <div className="flex flex-col h-full w-full bg-bg-base text-zinc-100 p-8 overflow-y-auto">
      <div className="max-w-7xl w-full mx-auto">
        <header className="flex justify-between items-end mb-8 border-b border-border-light pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">Desktop Creator Studio IDE</h1>
            <div className="text-[10px] text-zinc-500 font-mono tracking-widest mt-2 uppercase">Rot or Trot // Creator Studio</div>
          </div>
          <div className="flex gap-4">
             <div className="border border-border-light px-4 py-2 text-xs font-mono text-zinc-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-500"></div> ENGINE READY
             </div>
             <button className="border border-toxic-purple text-toxic-purple px-6 py-2 text-xs font-mono uppercase tracking-widest hover:bg-toxic-purple hover:text-bg-base transition-colors">Studio</button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="border-2 border-toxic-purple bg-bg-card p-6 shadow-[8px_8px_0_0_#A855F7]">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-xl tracking-tight">IDEA INPUT EDITOR</h2>
                 <span className="border border-border-light px-3 py-1 text-[10px] font-mono text-zinc-500">GITHUB READY</span>
              </div>
              <p className="text-zinc-400 font-mono text-sm mb-4">Drop a repo URL or raw idea. The engine will roast it accordingly.</p>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="https://github.com/user/repo or drop your raw idea here..."
                className="w-full h-48 bg-bg-base border border-border-light p-4 text-sm font-mono focus:outline-none focus:border-toxic-purple text-white resize-none"
              ></textarea>
              <div className="mt-4">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Tag Selector</div>
                <div className="text-lg font-mono mb-4">{tag}</div>
                <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs mb-6 cursor-pointer hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  Pin this idea to favorites
                </div>
                <button onClick={handleGenerate} className="w-full brutalist-button py-4 text-sm flex items-center justify-center gap-2">
                   <Rocket className="w-4 h-4" /> GENERATE PITCH
                </button>
              </div>
            </div>

            <div className="border-2 border-hyper-green bg-bg-card p-6 shadow-[8px_8px_0_0_#22C55E]">
               <h2 className="font-bold text-xl tracking-tight mb-6">GENERATOR CONFIG</h2>
               <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-border-light pb-6">
                   <div>
                     <div className="font-bold">Safe Mode</div>
                     <div className="text-xs text-zinc-500 font-mono mt-1">Filter aggressive AI roasts</div>
                   </div>
                   <div className="w-12 h-6 bg-toxic-purple rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </div>
                 <div className="flex justify-between items-center border-b border-border-light pb-6">
                   <div>
                     <div className="font-bold">Auto-Generate on Paste</div>
                     <div className="text-xs text-zinc-500 font-mono mt-1">Trigger pitch instantly on repo drop</div>
                   </div>
                   <div className="w-12 h-6 bg-bg-darker border border-border-light rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-500 rounded-full"></div>
                   </div>
                 </div>
                 <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-toxic-purple"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                      sk-gm-••••••••••••7f3a
                    </div>
                    <button className="border border-toxic-purple p-2 text-toxic-purple hover:bg-toxic-purple hover:text-bg-base transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="border-2 border-border-light bg-bg-card p-6 shadow-[8px_8px_0_0_#3D246C]">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="font-bold text-xl tracking-tight">LIVE FEED PREVIEW</h2>
                 <span className="border border-border-light px-3 py-1 text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                   <Eye className="w-3 h-3" /> SWIPE FEED SIM
                 </span>
              </div>
              <p className="text-zinc-400 font-mono text-sm mb-6">This is how your pitch appears in the main swipe feed.</p>
              
              {/* Preview Card */}
              <div className="border-2 border-toxic-purple p-6 bg-bg-darker shadow-[8px_8px_0_0_#A855F7] mb-6 relative">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex gap-3 items-center">
                     <div className="w-10 h-10 bg-bg-card border border-border-light flex items-center justify-center">
                       <Skull className="w-5 h-5 text-toxic-purple" />
                     </div>
                     <div>
                       <div className="font-mono text-xs uppercase tracking-widest font-bold">Rot or Trot</div>
                       <div className="font-mono text-[10px] text-zinc-500 uppercase">Feed Preview</div>
                     </div>
                   </div>
                   <div className="font-mono text-xl font-bold">42s</div>
                 </div>

                 <div className="border border-border-light bg-bg-card p-4 mb-4">
                    <div className="flex justify-end mb-4">
                      <span className="border border-toxic-purple text-toxic-purple text-[10px] px-2 py-1 font-mono">NEW APP IDEA</span>
                    </div>
                    {/* Live formatting applied here */}
                    <h3 className="font-bold text-xl tracking-tight mb-2 uppercase">{previewTitle}</h3>
                    <p className="text-zinc-400 text-sm font-mono mb-4">{previewDesc}</p>
                    <div className="text-[10px] text-zinc-500 font-mono italic">
                      {previewFooter}
                    </div>
                 </div>

                 <div className="h-32 border border-border-light bg-bg-card flex flex-col items-center justify-center gap-2 text-zinc-500 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    <span className="font-mono text-[10px] tracking-widest uppercase">Placeholder Video Loop</span>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <button className="bg-toxic-purple text-bg-base py-4 font-black tracking-widest text-xl flex flex-col items-center justify-center gap-2">
                     <Skull className="w-6 h-6" /> ROT
                   </button>
                   <button className="border-2 border-border-light text-zinc-500 py-4 font-black tracking-widest text-xl flex flex-col items-center justify-center gap-2">
                     <Zap className="w-6 h-6" /> TROT
                   </button>
                 </div>
              </div>
            </div>

            <div className="border-2 border-toxic-purple bg-bg-card p-6 shadow-[8px_8px_0_0_#A855F7]">
               <h2 className="font-bold text-xl tracking-tight mb-6 uppercase">Decay Timer Simulation</h2>
               <div className="flex justify-between items-end mb-2">
                 <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Countdown</span>
                 <span className="font-mono text-3xl font-bold">42s</span>
               </div>
               <div className="h-2 w-full bg-bg-darker border border-border-light mb-6">
                 <div className="h-full bg-toxic-purple w-[75%]"></div>
               </div>
               <div className="flex gap-4">
                 <button className="flex-1 border border-toxic-purple text-toxic-purple py-2 font-mono text-sm hover:bg-toxic-purple hover:text-bg-base transition-colors">-5s</button>
                 <button className="flex-1 border border-toxic-purple text-toxic-purple py-2 font-mono text-sm hover:bg-toxic-purple hover:text-bg-base transition-colors">RESET</button>
                 <button className="flex-1 bg-bg-darker border border-border-light text-zinc-600 py-2 font-mono text-sm cursor-not-allowed">+5s</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}