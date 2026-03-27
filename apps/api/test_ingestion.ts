import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

async function main() {
  const baseURL = 'http://localhost:3001';
  try {
    console.log('--- TEST: ABSOLUTE MULTIPART INGESTION ---');
    
    // 1. Login
    console.log('Step 1: Authenticating...');
    const loginRes = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    const token = loginRes.data.access_token;
    console.log('Auth Success! Token: ' + token.substring(0, 15) + '...');

    // 2. Create Dummy Buffer (simulating XLSX)
    const dummyBuffer = Buffer.from('dummy xlsx content');
    
    // 3. Upload with FormData (No manual Content-Type)
    console.log('\nStep 2: Attempting Multipart Upload...');
    const fd = new FormData();
    fd.append('file', dummyBuffer, { filename: 'test_catalog.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const uploadRes = await axios.post(`${baseURL}/api/items/upload`, fd, {
      headers: {
        ...fd.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Upload Request Sent! Status:', uploadRes.status);
    console.log('Job ID:', uploadRes.data.jobId);

    // 4. Poll for Status
    console.log('\nStep 3: Polling for Import Status...');
    const statusRes = await axios.get(`${baseURL}/api/items/import/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Sync Logic Active! Status:', statusRes.data.status, 'Progress:', statusRes.data.processed);

  } catch (e: any) {
    console.error('\nFAILED during ingestion test:');
    if (e.response) {
      console.error('Status:', e.response.status);
      console.error('Data:', JSON.stringify(e.response.data, null, 2));
    } else {
      console.error('Error:', e.message);
    }
  }
}

main();
