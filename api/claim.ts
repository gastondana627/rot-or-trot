import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, devHandle } = req.body;
    
    // TODO: Add your Google Sheets integration logic here to find the 
    // project row by ID, increment the builder count, and log the devHandle.

    return res.status(200).json({ 
      success: true, 
      message: `Successfully claimed project ${projectId} by ${devHandle}` 
    });
  } catch (error: any) {
    console.error('Claim build error:', error);
    return res.status(500).json({ error: 'Failed to claim build' });
  }
}