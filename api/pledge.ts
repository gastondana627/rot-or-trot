import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, amount } = req.body;
    
    // TODO: Google Sheet row update logic here:
    // 1. Locate project by ID and increment pledge pool.
    // 2. Append row to ActivityLog tab.

    const timestamp = new Date().toTimeString().split(' ')[0] + '.0';
    const activityItem = {
      time: timestamp,
      type: 'TROT',
      name: `$TROT ${amount} Pledged`
    };

    return res.status(200).json({ 
      success: true, 
      newTotalPool: 42190 + Number(amount),
      newActivityItem: activityItem 
    });
  } catch (error: any) {
    console.error('Pledge error:', error);
    return res.status(500).json({ error: 'Failed to process pledge' });
  }
}