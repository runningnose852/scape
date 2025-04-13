//Google spreadsheet
require('dotenv').config();  // Load .env values
const sheetId = process.env.SHEET_ID;
console.log('📄 Sheet ID:', sheetId); // Just to verify it works

const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function appendToSheet(product, price, link) {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  const spreadsheetId = 'SHEET_ID';
  const range = 'Sheet1!A:D';

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[product, price, link, new Date().toISOString()]],
    },
  });

  console.log('✅ Appended to Google Sheet');
}
appendToSheet('Awesome Beans', 3.65, 'https://example.com/product');
