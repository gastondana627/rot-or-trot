import { getAccessToken } from './auth';

let spreadsheetId: string | null = '1PEPaDAQ5t-py52aouLNNa8wYOslOCLE4ssUKvsv3EYo';

export const initOrGetSpreadsheet = async () => {
  return spreadsheetId;
};

export const appendToSheet = async (actionType: string, projectName: string, metrics: string) => {
  const token = await getAccessToken();
  if (!token) return;

  const sid = await initOrGetSpreadsheet();
  if (!sid) return;

  try {
    const timestamp = new Date().toISOString();
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/A1:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [
          [timestamp, actionType, projectName, metrics]
        ]
      })
    });
  } catch (e) {
    console.error('Failed to append to sheet', e);
  }
};
