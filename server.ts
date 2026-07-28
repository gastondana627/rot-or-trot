import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/roast', async (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  try {
    const prompt = `You are a brutal, cyberpunk hacker AI evaluator for a hackathon. 
A user has submitted an app idea that just "rotted" (failed to get enough interest before the timer ran out).
Give a short, punchy, cynical, and highly sarcastic roast of this idea.
Use brutalist cyberpunk language. Do not exceed 2-3 sentences.
App Title: ${title}
App Description: ${description}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ roast: response.text });
  } catch (error: any) {
    if (error?.status !== 429 && !error?.message?.includes('429')) {
      console.error('Error generating roast:', error);
    }
    res.json({ roast: "SYSTEM OFFLINE. Core logic overloaded. Your idea remains terrible, confirmed by analog fallback circuits." });
  }
});

app.post('/api/pitch', async (req, res) => {
  const { idea } = req.body;
  if (!idea) return res.status(400).json({ error: 'Idea required' });

  try {
    const prompt = `You are an AI assistant in a cyberpunk builder platform.
A user has dropped a raw idea or github repo.
Generate a punchy title and a short 2-sentence description for a hackathon app pitch based on this.
Output as JSON: { "title": "...", "description": "..." }
Input: ${idea}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    try {
      const text = response.text || '';
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      res.json(parsed);
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse AI response' });
    }
  } catch (error: any) {
    if (error?.status !== 429 && !error?.message?.includes('429')) {
      console.error('Error generating pitch:', error);
    }
    // Fallback data when quota is exceeded
    const fallbacks = [
      { title: "NeuroSnack", description: "Direct-to-brain dopamine delivery as a service. Bypasses the need for actual food." },
      { title: "ChromeVain", description: "Smart mirrors that use AI to make you look like a 90s cyberpunk protagonist. Subscription required for sunglasses." },
      { title: "VoidCache", description: "Cloud storage that explicitly deletes your data after 24 hours to 'preserve your digital purity'." },
      { title: "GitGuilt", description: "An IDE plugin that publicly shames you on Twitter every time you copy-paste from StackOverflow." },
      { title: "SynthMatch", description: "Dating app where your AI agent dates other AI agents. You just get a push notification if they get married." }
    ];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    res.json(randomFallback);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
