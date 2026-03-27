import axios from 'axios';
const FormData = require('form-data');
import * as XLSX from 'xlsx';

async function main() {
  const baseURL = 'http://127.0.0.1:3001';
  try {
    console.log('--- TEST: PHARMA CATALOG INGESTION ---');
    
    // 1. Login
    console.log('Step 1: Authenticating...');
    const loginRes = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    const token = loginRes.data.access_token;

    // 2. Create Pharma XLSX with specific headers
    console.log('Step 2: Creating Pharma XLSX...');
    const data = [
      ["Article\ncode", "Alternative\nArticle\nCode 1", "Alternative\nArticle\nCode 2", "Alternative\nArticle\nCode 3", "Alternative", "Article Description"],
      ["MRMD-00865-5886642-09658", "MRMD-00865", "5886642", "09658", "February 28, 2028", "CETRALON 10MG TAB 10S"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // 3. Upload
    console.log('Step 3: Uploading...');
    const fd = new FormData();
    fd.append('file', buffer, { filename: 'pharma.xlsx' });

    const uploadRes = await axios.post(`${baseURL}/api/items/upload`, fd, {
      headers: {
        ...fd.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    const jobId = uploadRes.data.jobId;
    console.log('Upload Success! Job ID:', jobId);

    // 4. Wait for sync
    console.log('Step 4: Waiting for background sync...');
    await new Promise(r => setTimeout(r, 3000));

    // 5. Verify In DB
    const statusRes = await axios.get(`${baseURL}/api/items/import/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Sync Status:', statusRes.data.status, 'Processed:', statusRes.data.processed);

  } catch (e: any) {
    console.error('FAILED:', e.response?.data || e.message);
  }
}

main();
