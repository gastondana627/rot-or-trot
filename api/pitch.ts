import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Try Primary: Gemini
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
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanText);
        return res.status(200).json(data);
      }
    }
  } catch (geminiError) {
    console.warn('Gemini quota/error hit, cascading to Groq fallback...', geminiError);
  }

  // 2. Try Secondary Fallback: Groq
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are a cyberpunk startup generator. Return strictly valid JSON with "title" and "description" keys. No markdown code blocks, just raw JSON.'
            },
            {
              role: 'user',
              content: 'Generate a completely new, random, absurd cyberpunk hackathon startup idea. Make it dark, sarcastic, and tech-heavy.'
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const content = groqData.choices?.[0]?.message?.content;
        if (content) {
          const data = JSON.parse(content);
          return res.status(200).json(data);
        }
      }
    }
  } catch (groqError) {
    console.warn('Groq failed, cascading to OpenRouter fallback...', groqError);
  }

  // 3. Try Tertiary Fallback: OpenRouter
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (openRouterKey) {
      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://rot-or-trot.vercel.app',
          'X-Title': 'Rot or Trot'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            {
              role: 'system',
              content: 'Return strictly valid JSON with "title" and "description" keys. No markdown.'
            },
            {
              role: 'user',
              content: 'Generate a random absurd cyberpunk hackathon startup idea. Dark and sarcastic.'
            }
          ]
        })
      });

      if (orRes.ok) {
        const orData = await orRes.json();
        const content = orData.choices?.[0]?.message?.content;
        if (content) {
          const cleanText = content.replace(/```json/g, '').replace(/```/g, '').trim();
          const data = JSON.parse(cleanText);
          return res.status(200).json(data);
        }
      }
    }
  } catch (orError) {
    console.warn('OpenRouter failed, using static mock fallbacks...', orError);
  }

  // 4. Final Safety Net: Static Mock Cyberpunk Ideas
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
}