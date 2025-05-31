const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());

// Path to your service account key file
const KEYFILEPATH = path.join(__dirname, 'complianceheatmap-lucas-a64f3ed8182a.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Your spreadsheet ID and range
const SPREADSHEET_ID = '1N-10Z6jSI9Dwf0fUuY8uRSuHYiuZFMi1y4HPDaeVrn0';
const RANGE = "'Risk Analysis'!A1:U8";

app.get('/api/sheet-data', async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching sheet data:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
