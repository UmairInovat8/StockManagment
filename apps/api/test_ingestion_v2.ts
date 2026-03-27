import axios from 'axios';
const FormData = require('form-data');

async function main() {
  const baseURL = 'http://127.0.0.1:3001';
  try {
    console.log('--- TEST: ABSOLUTE MULTIPART INGESTION ---');
    
    // 1. Login
    console.log('Step 1: Authenticating...');
    const loginRes = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'manager@athgadlang.com',
      password: 'athgadlang123'
    });
    const token = loginRes.data.access_token;
    console.log('Auth Success!');

    // 2. Fetch Masters
    console.log('\nStep 2: Fetching Masters...');
    const mastersRes = await axios.get(`${baseURL}/api/items/masters`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const masters = mastersRes.data;
    if (masters.length === 0) throw new Error('No Item Masters found for this tenant');
    const itemMasterId = masters[0].id;
    console.log(`Using Master: ${masters[0].name} (${itemMasterId})`);

    // 3. Create Dummy Buffer
    const dummyBuffer = Buffer.from('Article code,Article Description,Alternative\nSKU001,Test Item,2025-12-31');
    
    // 4. Upload with FormData
    console.log('\nStep 3: Attempting Multipart Upload...');
    const fd = new FormData();
    fd.append('file', dummyBuffer, { filename: 'test_catalog.csv' });
    fd.append('itemMasterId', itemMasterId);

    const uploadRes = await axios.post(`${baseURL}/api/items/upload`, fd, {
      headers: {
        ...fd.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Upload Request Sent! Status:', uploadRes.status);
    console.log('Job ID:', uploadRes.data.jobId);

    // 5. Poll
    console.log('\nStep 4: Polling Status...');
    const statusRes = await axios.get(`${baseURL}/api/items/import/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Current Status:', statusRes.data.status);

  } catch (e: any) {
    console.error('\nFAILED:');
    if (e.response) {
      console.error('Status:', e.response.status);
      console.error('Data:', JSON.stringify(e.response.data, null, 2));
    } else {
      console.error('Error:', e.message);
    }
  }
}

main();
