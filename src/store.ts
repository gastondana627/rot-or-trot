import { useState, useEffect } from 'react';
import { Idea } from './types';
import { appendToSheet } from './sheets';

const INITIAL_IDEAS: Idea[] = [
  {
    id: '1',
    title: 'Tind(R)oll',
    description: 'A co-founder matching app that exclusively pairs 10x rockstar developers with "idea guys". Match rating drops 5% for every buzzword used in bio.',
    tags: ['MATCHMAKING', 'WEB3'],
    createdAt: Date.now(),
    decayTime: 120,
    status: 'pending'
  },
  {
    id: '4',
    title: 'PromptOverflow',
    description: 'StackOverflow, but you can only ask questions in hyper-optimized system prompts. Answers are just binary strings that compile into passive-aggressive responses.',
    tags: ['AI', 'COMMUNITY'],
    createdAt: Date.now() - 7200000,
    decayTime: 60,
    status: 'pending'
  },
  {
    id: '6',
    title: 'Neural Net-flix',
    description: 'A streaming service for AI models to watch human behavior and learn how to simulate us. We are the content. They are the audience.',
    tags: ['AI', 'STREAMING'],
    createdAt: Date.now() - 100000,
    decayTime: 300,
    status: 'pending'
  },
  {
    id: '2',
    title: 'GhostCommit',
    description: 'Automated script that pushes random obfuscated code at 3 AM to make your GitHub contribution graph look like an active warzone.',
    tags: ['DEVTOOLS', 'PRODUCTIVITY'],
    createdAt: Date.now() - 3600000,
    decayTime: 0,
    status: 'trotted',
    trots: 31337,
    devsPledged: 99
  },
  {
    id: '5',
    title: 'Neon Stable',
    description: 'Stable diffusion interface with neon brutalist aesthetics. Because everything is better with chromatic aberration.',
    tags: ['AI', 'DESIGN'],
    createdAt: Date.now() - 172800000,
    decayTime: 0,
    status: 'trotted',
    trots: 8848,
    devsPledged: 42
  },
  {
    id: '3',
    title: 'SaaS-ify My Pet',
    description: 'Micro-transactions for pets. Basic tier: food and water. Pro tier: belly rubs. Enterprise: access to the nice couch. Monetize your best friend.',
    tags: ['PETTECH', 'FINTECH'],
    createdAt: Date.now() - 86400000,
    decayTime: 0,
    status: 'rotted',
    roast: "SaaS-ify My Pet? The only thing you're disrupting is your dog's trust. Prepare for a class-action lawsuit filed by golden retrievers."
  },
  {
    id: '7',
    title: 'Uber for Pet Rocks',
    description: 'AI-powered limestone delivery for people who want the responsibility of a companion without the biological mess.',
    tags: ['WEB3', 'PETTECH'],
    createdAt: Date.now() - 186400000,
    decayTime: 0,
    status: 'rotted',
    roast: "This idea is so stale it's technically fossil fuel. You've managed to combine the worst parts of logistics with the lowest utility value possible. Even the rocks are embarrassed by this pitch."
  }
];

export type ActionLog = { id: string; title: string; action: 'ROTTED' | 'TROTTED'; timestamp: number; };

export function useIdeaStore() {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    try {
      const saved = localStorage.getItem('rot-or-trot-ideas');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_IDEAS;
  });
  
  const [actionLog, setActionLog] = useState<ActionLog[]>(() => {
    try {
      const saved = localStorage.getItem('rot-or-trot-action-log');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('rot-or-trot-ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('rot-or-trot-action-log', JSON.stringify(actionLog));
  }, [actionLog]);

  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt' | 'status'>, append = false) => {
    const newIdea: Idea = {
      ...idea,
      id: Math.random().toString(36).substring(7),
      createdAt: Date.now(),
      status: 'pending'
    };
    if (append) {
      setIdeas(prev => [...prev, newIdea]);
    } else {
      setIdeas(prev => [newIdea, ...prev]);
    }
    
    // Log to Google Sheets
    appendToSheet(append ? 'AUTO-GENERATED' : 'NEW IDEA', idea.title, `Tags: ${idea.tags.join(', ')} | Decay: ${idea.decayTime}h`);
  };

  const updateIdeaStatus = async (id: string, status: 'rotted' | 'trotted') => {
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;
    
    // Update immediately so it leaves the pending queue
    setIdeas(prev => prev.map(i => 
      i.id === id ? { ...i, status } : i
    ));

    setActionLog(prev => [{ id: Math.random().toString(), title: idea.title, action: status.toUpperCase() as 'ROTTED' | 'TROTTED', timestamp: Date.now() }, ...prev].slice(0, 50));

    // Log to Google Sheets
    appendToSheet('VOTE', idea.title, status.toUpperCase());

    if (status === 'rotted') {
      try {
        const res = await fetch('/api/roast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: idea.title, description: idea.description })
        });
        const data = await res.json();
        if (data.roast) {
          setIdeas(prev => prev.map(i => 
            i.id === id ? { ...i, roast: data.roast } : i
          ));
        }
      } catch (e) {
        console.error("Failed to roast:", e);
        setIdeas(prev => prev.map(i => 
          i.id === id ? { ...i, roast: "Error 404: Roast not found. Even my insult engine is bored by this." } : i
        ));
      }
    } else if (status === 'trotted') {
      setIdeas(prev => prev.map(i => 
        i.id === id ? { ...i, trots: (i.trots || 0) + 1, devsPledged: (i.devsPledged || 0) + 1 } : i
      ));
    }
  };

  const autoGenerateIdea = async () => {
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generate: true })
      });
      const data = await res.json();
      if (data.title && data.description) {
        addIdea({
          title: data.title,
          description: data.description,
          tags: ['AI', 'GENERATED'],
          decayTime: 60
        }, true);
      }
    } catch (e) {
      // Fallback generator
      const fallbackThemes = ['AI Blockchain', 'VR Pet', 'Web3 Toaster', 'Dating for Devs', 'SaaS for Plants'];
      const title = fallbackThemes[Math.floor(Math.random() * fallbackThemes.length)];
      addIdea({
        title,
        description: `An innovative ${title} platform designed to disrupt the industry. It's totally not vaporware.`,
        tags: ['AUTO', 'TECH'],
        decayTime: Math.floor(Math.random() * 60) + 30
      }, true);
    }
  };

  return { ideas, actionLog, addIdea, updateIdeaStatus, autoGenerateIdea };
}
