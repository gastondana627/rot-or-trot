import React, { useState, useEffect } from 'react';
import { Home, Compass, Plus, User, Zap, Skull, TrendingUp, Bell } from 'lucide-react';
import { useIdeaStore } from './store';
import FeedView from './views/FeedView';
import ExploreView from './views/ExploreView';
import CreateView from './views/CreateView';
import ProfileView from './views/ProfileView';
import ControlRoom from './views/desktop/ControlRoom';
import DesktopTrotHub from './views/desktop/DesktopTrotHub';
import DesktopStudio from './views/desktop/DesktopStudio';
import { initAuth, googleSignIn } from './auth';
import { useMediaQuery } from './hooks/useMediaQuery';

type Tab = 'home' | 'explore' | 'create' | 'profile';
type DesktopTab = 'control' | 'leaderboard' | 'studio' | 'profile';

const HexBrandLogo = () => (
  <div className="w-10 h-10 shrink-0 relative flex items-center justify-center bg-[#120A22] border-2 border-[#A855F7] shadow-[2px_2px_0px_0px_#A855F7] overflow-hidden p-1">
    <img src="/logo.png" alt="Rot or Trot Logo" className="w-full h-full object-contain" />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeDesktopTab, setActiveDesktopTab] = useState<DesktopTab>('control');
  const { ideas, actionLog, addIdea, updateIdeaStatus } = useIdeaStore();
  
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [lastClearedAlertsAt, setLastClearedAlertsAt] = useState(0);

  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    initAuth(
      () => setNeedsAuth(false),
      () => setNeedsAuth(true)
    );
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (needsAuth) {
    return (
      <div className="flex flex-col h-screen w-full relative overflow-hidden bg-bg-base font-sans text-zinc-100 items-center justify-center p-8">
        <div className="max-w-md w-full bg-bg-darker border-4 border-border-light p-8 flex flex-col items-center text-center shadow-[12px_12px_0_0_#A855F7]">
          <div className="w-16 h-16 rounded-full bg-bg-darker border border-border-light flex items-center justify-center font-bold text-toxic-purple font-mono text-2xl mb-6">
            <Skull className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">Rot or Trot</h1>
          <p className="text-zinc-400 font-mono text-sm mb-8">Access restricted. Connect Uplink to proceed.</p>
          
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full bg-zinc-100 text-black font-bold tracking-widest text-sm py-4 rounded-xl border border-zinc-300 hover:bg-white flex justify-center items-center gap-3 transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? 'Connecting...' : (
              <>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (isDesktop) {
    return (
      <div className="flex flex-col h-screen w-full mx-auto relative overflow-hidden bg-bg-base font-sans text-zinc-100">
        {/* Desktop Header */}
        <header className="flex justify-between items-center px-8 py-4 bg-bg-base z-10 shrink-0 border-b border-border-light">
          <div className="flex items-center gap-3">
            <HexBrandLogo />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-none">ROT OR TROT</h1>
              <div className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase mt-1">v1.0 &middot; CONTROL ROOM</div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="flex items-center gap-8 font-mono text-sm uppercase tracking-widest">
             <button onClick={() => setActiveDesktopTab('control')} className={`transition-colors pb-1 ${activeDesktopTab === 'control' ? 'text-white border-b-2 border-toxic-purple' : 'text-zinc-500 hover:text-white'}`}>Feed</button>
             <button onClick={() => setActiveDesktopTab('leaderboard')} className={`transition-colors pb-1 ${activeDesktopTab === 'leaderboard' ? 'text-white border-b-2 border-hyper-green' : 'text-zinc-500 hover:text-white'}`}>Leaderboard</button>
             <button onClick={() => setActiveDesktopTab('studio')} className={`transition-colors pb-1 ${activeDesktopTab === 'studio' ? 'text-white border-b-2 border-toxic-purple' : 'text-zinc-500 hover:text-white'}`}>Studio</button>
          </nav>

          <div className="flex items-center gap-4 relative">
             <div className="border border-hyper-green px-4 py-2 text-xs font-mono text-hyper-green flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-hyper-green"></div> SYSTEM ONLINE // 24MS
             </div>
             
             <button 
               onClick={() => { setShowAlerts(!showAlerts); setShowProfileDrawer(false); }}
               className="border border-border-light px-4 py-2 text-xs font-mono text-zinc-400 flex items-center gap-2 hover:bg-bg-darker relative"
             >
                <Bell className="w-4 h-4" /> ALERTS
                {([
                  { timestamp: 1 }, // Static featured message
                  ...ideas.filter(i => i.status === 'pending' && i.decayTime > 0 && i.decayTime <= 10),
                  ...actionLog.slice(0, 3)
                ].filter(a => ((a as any).timestamp || Date.now()) > lastClearedAlertsAt).length > 0) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-toxic-purple shadow-[0_0_5px_#A855F7] border border-bg-base"></div>
                )}
             </button>

             <button 
               onClick={() => { setShowProfileDrawer(!showProfileDrawer); setShowAlerts(false); }}
               className="w-10 h-10 rounded-full bg-bg-darker border border-border-light flex items-center justify-center hover:border-toxic-purple transition-colors cursor-pointer"
             >
                <User className="w-4 h-4 text-zinc-400" />
             </button>
             
             {/* Alerts Dropdown */}
             {showAlerts && (
               <div className="absolute top-14 right-12 w-80 bg-[#120A22] border-2 border-toxic-purple shadow-[8px_8px_0px_0px_#A855F7] z-50 flex flex-col p-4">
                 <div className="flex justify-between items-center mb-4 border-b border-toxic-purple/30 pb-2">
                   <h3 className="font-bold text-white uppercase tracking-widest text-sm">System Alerts</h3>
                   <button 
                     onClick={() => setLastClearedAlertsAt(Date.now())}
                     className="text-[10px] text-zinc-400 font-mono hover:text-toxic-purple transition-colors"
                   >
                     CLEAR ALERTS
                   </button>
                 </div>
                 <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                   {/* Flowstep x Contra Static Alert */}
                   <div className="bg-bg-base border-2 border-hyper-green p-3 flex flex-col gap-1 shadow-[4px_4px_0_0_#22C55E] mb-2">
                     <div className="flex items-center gap-2 text-hyper-green text-[10px] font-bold font-mono uppercase">
                       📨 INCOMING DISPATCH // FLOWSTEP x CONTRA
                     </div>
                     <div className="text-xs text-white leading-relaxed">
                       The $10,000 pipeline intercepted your prototype. Flowstep AI & Contra judges are monitoring your decay timer. Is this masterpiece gonna TROT to production or ROT in the backlog? 🐎💀
                     </div>
                   </div>

                   {ideas.filter(i => i.status === 'pending' && i.decayTime > 0 && i.decayTime <= 10).map(warning => (
                     <div key={`warn-${warning.id}`} className="bg-bg-base border border-toxic-purple p-3 flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-toxic-purple text-xs font-bold font-mono uppercase">
                         ⚠️ Critical Decay Warning
                       </div>
                       <div className="text-sm text-zinc-300">{warning.title} is ticking under 10s!</div>
                     </div>
                   ))}
                   {actionLog.slice(0, 3).map(action => (
                     <div key={`act-${action.id}`} className="bg-bg-base border border-border-light p-3 flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold font-mono uppercase">
                         <Zap className={`w-3 h-3 ${action.action === 'TROTTED' ? 'text-hyper-green' : 'text-toxic-purple'}`} />
                         Vote Stream Activity
                       </div>
                       <div className="text-sm text-zinc-300">
                         You {action.action.toLowerCase()} <span className="font-bold text-white">{action.title}</span>
                       </div>
                     </div>
                   ))}
                   {ideas.filter(i => i.status === 'pending' && i.decayTime > 0 && i.decayTime <= 10).length === 0 && actionLog.length === 0 && (
                     <div className="text-center text-zinc-500 font-mono text-xs py-4">NO ALERTS IN QUEUE</div>
                   )}
                 </div>
               </div>
             )}

             {/* Profile Drawer */}
             {showProfileDrawer && (
               <div className="absolute top-14 right-0 w-96 bg-[#120A22] border-l-2 border-b-2 border-toxic-purple shadow-[-8px_8px_0px_0px_#A855F7] z-50 flex flex-col p-6 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
                 <h2 className="font-black text-2xl text-white mb-6 uppercase tracking-tight">User Highlights</h2>
                 
                 <div className="space-y-6 flex-1">
                   {/* Top Trot */}
                   <div className="flex flex-col gap-2">
                     <h3 className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 bg-hyper-green inline-block"></span> Your Top Trot
                     </h3>
                     {(() => {
                       const topTrot = [...ideas].filter(i => i.status === 'trotted').sort((a, b) => (b.trots || 0) - (a.trots || 0))[0];
                       if (!topTrot) return <div className="text-zinc-600 font-mono text-sm">No trots yet.</div>;
                       return (
                         <div className="bg-bg-base border-2 border-hyper-green p-4 flex justify-between items-center">
                           <div className="font-bold text-white">{topTrot.title}</div>
                           <div className="text-hyper-green font-mono font-bold">{topTrot.trots} 🐎</div>
                         </div>
                       );
                     })()}
                   </div>

                   {/* Worst Rot */}
                   <div className="flex flex-col gap-2">
                     <h3 className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2">
                       <span className="w-2 h-2 bg-toxic-purple inline-block"></span> Worst Rot
                     </h3>
                     {(() => {
                       const worstRot = [...ideas].filter(i => i.status === 'rotted').sort((a, b) => b.createdAt - a.createdAt)[0];
                       if (!worstRot) return <div className="text-zinc-600 font-mono text-sm">No rots yet.</div>;
                       return (
                         <div className="bg-bg-base border-2 border-toxic-purple p-4 flex flex-col gap-2">
                           <div className="font-bold text-white">{worstRot.title}</div>
                           <div className="text-xs text-zinc-400 line-clamp-2 italic">"{worstRot.roast}"</div>
                         </div>
                       );
                     })()}
                   </div>

                   {/* Live Metrics */}
                   <div className="flex flex-col gap-2">
                     <h3 className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-2 mb-2">
                       <TrendingUp className="w-3 h-3 text-white" /> Live Metrics
                     </h3>
                     <div className="grid grid-cols-2 gap-3">
                       <div className="bg-bg-base border border-border-light p-3 flex flex-col">
                         <span className="text-[10px] text-zinc-500 font-mono uppercase">Trots Cast</span>
                         <span className="text-xl font-bold text-white font-mono">{actionLog.filter(a => a.action === 'TROTTED').length}</span>
                       </div>
                       <div className="bg-bg-base border border-border-light p-3 flex flex-col">
                         <span className="text-[10px] text-zinc-500 font-mono uppercase">Rots Cast</span>
                         <span className="text-xl font-bold text-white font-mono">{actionLog.filter(a => a.action === 'ROTTED').length}</span>
                       </div>
                       <div className="bg-bg-base border border-border-light p-3 flex flex-col col-span-2 items-center text-center">
                         <span className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Earned Balance</span>
                         <span className="text-2xl font-bold text-hyper-green font-mono">
                           ${actionLog.filter(a => a.action === 'TROTTED').length * 10 + actionLog.filter(a => a.action === 'ROTTED').length * 5} <span className="text-sm">TROT</span>
                         </span>
                       </div>
                     </div>
                   </div>
                 </div>

                 <button 
                   onClick={() => { setActiveDesktopTab('profile'); setShowProfileDrawer(false); }}
                   className="mt-8 w-full brutalist-button bg-bg-darker text-white border-2 border-border-light text-xs py-4 hover:border-toxic-purple hover:text-toxic-purple transition-colors"
                 >
                   FULL ACCOUNT & API KEYS
                 </button>
               </div>
             )}
          </div>
        </header>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-hidden relative">
          {activeDesktopTab === 'control' && <ControlRoom ideas={ideas} updateIdeaStatus={updateIdeaStatus} addIdea={addIdea} />}
          {activeDesktopTab === 'leaderboard' && <DesktopTrotHub ideas={ideas} />}
          {activeDesktopTab === 'studio' && <DesktopStudio addIdea={addIdea} />}
          {activeDesktopTab === 'profile' && <ProfileView ideas={ideas} />}
        </main>
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="flex flex-col h-screen w-full mx-auto relative overflow-hidden bg-bg-base font-sans text-zinc-100 max-w-md shadow-2xl">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 py-4 bg-bg-base z-10 shrink-0">
        <div className="flex items-center gap-3">
          <HexBrandLogo />
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">ROT OR TROT</h1>
            <div className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase mt-1">F E E D v 1 . 0</div>
          </div>
        </div>
        <div className="flex bg-bg-darker border border-border-light p-2 gap-2 shadow-[2px_2px_0_0_#3D246C] relative">
          <button onClick={() => setShowAlerts(!showAlerts)} className="relative">
            <Bell className="w-4 h-4 text-zinc-400 hover:text-white" />
            {([
              { timestamp: 1 }, // Static featured message
              ...ideas.filter(i => i.status === 'pending' && i.decayTime > 0 && i.decayTime <= 10),
              ...actionLog.slice(0, 3)
            ].filter(a => ((a as any).timestamp || Date.now()) > lastClearedAlertsAt).length > 0) && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-toxic-purple shadow-[0_0_5px_#A855F7] rounded-full"></div>
            )}
          </button>
          
          <button onClick={() => { setActiveTab('profile'); setShowAlerts(false); }}>
            <User className="w-4 h-4 text-toxic-purple hover:text-white" />
          </button>

          {/* Alerts Dropdown Mobile */}
          {showAlerts && (
             <div className="absolute top-12 right-0 w-72 bg-[#120A22] border-2 border-toxic-purple shadow-[8px_8px_0px_0px_#A855F7] z-50 flex flex-col p-4">
               <div className="flex justify-between items-center mb-4 border-b border-toxic-purple/30 pb-2">
                 <h3 className="font-bold text-white uppercase tracking-widest text-sm">System Alerts</h3>
                 <button 
                   onClick={() => setLastClearedAlertsAt(Date.now())}
                   className="text-[10px] text-zinc-400 font-mono hover:text-toxic-purple transition-colors"
                 >
                   CLEAR
                 </button>
               </div>
               <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar text-left">
                 {/* Flowstep x Contra Static Alert */}
                 <div className="bg-bg-base border-2 border-hyper-green p-3 flex flex-col gap-1 shadow-[4px_4px_0_0_#22C55E] mb-2">
                   <div className="flex items-center gap-2 text-hyper-green text-[10px] font-bold font-mono uppercase">
                     📨 INCOMING DISPATCH // FLOWSTEP x CONTRA
                   </div>
                   <div className="text-xs text-white leading-relaxed">
                     The $10,000 pipeline intercepted your prototype. Flowstep AI & Contra judges are monitoring your decay timer. Is this masterpiece gonna TROT to production or ROT in the backlog? 🐎💀
                   </div>
                 </div>

                 {ideas.filter(i => i.status === 'pending' && i.decayTime > 0 && i.decayTime <= 10).map(warning => (
                   <div key={`warn-mob-${warning.id}`} className="bg-bg-base border border-toxic-purple p-3 flex flex-col gap-1">
                     <div className="flex items-center gap-2 text-toxic-purple text-[10px] font-bold font-mono uppercase">
                       ⚠️ Critical Decay
                     </div>
                     <div className="text-xs text-zinc-300">{warning.title} is ticking under 10s!</div>
                   </div>
                 ))}
                 {actionLog.slice(0, 3).map(action => (
                   <div key={`act-mob-${action.id}`} className="bg-bg-base border border-border-light p-3 flex flex-col gap-1">
                     <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold font-mono uppercase">
                       <Zap className={`w-3 h-3 ${action.action === 'TROTTED' ? 'text-hyper-green' : 'text-toxic-purple'}`} />
                       Vote Stream
                     </div>
                     <div className="text-xs text-zinc-300">
                       You {action.action.toLowerCase()} <span className="font-bold text-white">{action.title}</span>
                     </div>
                   </div>
                 ))}
                 {ideas.filter(i => i.status === 'pending' && i.decayTime > 0 && i.decayTime <= 10).length === 0 && actionLog.length === 0 && (
                   <div className="text-center text-zinc-500 font-mono text-xs py-4">NO ALERTS IN QUEUE</div>
                 )}
               </div>
             </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && <FeedView ideas={ideas} updateIdeaStatus={updateIdeaStatus} addIdea={addIdea} />}
        {activeTab === 'explore' && <ExploreView ideas={ideas} />}
        {activeTab === 'create' && <CreateView addIdea={addIdea} onComplete={() => setActiveTab('home')} />}
        {activeTab === 'profile' && <ProfileView ideas={ideas} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 flex justify-between items-center h-20 bg-bg-darker border-t border-border-light z-40 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <NavItem icon={<Home className="w-5 h-5" />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<Compass className="w-5 h-5" />} label="Explore" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
        <NavItem icon={<Plus className="w-5 h-5" />} label="Create" active={activeTab === 'create'} onClick={() => setActiveTab('create')} />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-16 py-2 rounded-[20px] transition-all duration-300 ${active ? 'bg-toxic-purple text-bg-base shadow-[4px_4px_0_0_#22C55E]' : 'text-zinc-500 border border-transparent hover:text-zinc-300'}`}
    >
      {icon}
      <span className="text-[10px] font-mono tracking-widest uppercase">{label}</span>
    </button>
  );
}
