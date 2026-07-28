import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a completely new, random, absurd cyberpunk hackathon startup idea. Return strictly valid JSON with "title" and "description" keys. Make it dark, sarcastic, and tech-heavy.',
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      }
    }

    // Fallback cyberpunk ideas if API key is missing or fails
    const fallbacks = [
      {
        title: "Neural Net-flix",
        description: "AI generates personalized 80s dystopian cyberpunk movies in real-time based on your doomscrolling habits."
      },
      {
        title: "Ghost in the Shell-script",
        description: "Automated legacy codebase exorcism tool that traps disgruntled developer consciousnesses inside infinite loop functions."
      },
      {
        title: "Cyber-Gourd 3000",
        description: "Smart hydroponic pumpkin patch managed by a sentient corporate AI that taxes your local Wi-Fi bandwidth for fertilizer."
      },
      {
        title: "Deadlock Diner",
        description: "A decentralized food delivery network where drone swarms race against rival gangs for the last lukewarm synth-burger."
      }
    ];

    const randomIdea = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.status(200).json(randomIdea);

  } catch (error: any) {
    console.error('Pitch generation error:', error);
    return res.status(500).json({ 
      title: "Glitch in the Matrix", 
      description: "The AI core experienced a severe temporal paradox while trying to synthesize a new pitch." 
    });
  }
}