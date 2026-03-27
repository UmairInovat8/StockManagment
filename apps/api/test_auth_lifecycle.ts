import axios from 'axios';

async function main() {
  const baseURL = 'http://localhost:3001';
  try {
    console.log('--- TEST: AUTHENTICATION LIFECYCLE ---');
    
    // 1. Login
    console.log('Step 1: Attempting Login...');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginRes.data.access_token;
    console.log('Login Success! Token received:', token.substring(0, 20) + '...');
    
    // 2. Fetch Items (Protected)
    console.log('\nStep 2: Accessing Protected Route (/items)...');
    const itemsRes = await axios.get(`${baseURL}/items`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Access Success! Items fetched:', itemsRes.data.items?.length || 0);
    
    // 3. Fetch Import Status (Protected)
    console.log('\nStep 3: Accessing Protected Route (/items/import/status)...');
    const statusRes = await axios.get(`${baseURL}/items/import/status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Access Success! Status:', statusRes.data.status || 'No job');

  } catch (e: any) {
    console.error('\nFAILED during lifecycle test:');
    if (e.response) {
      console.error('Status:', e.response.status);
      console.error('Data:', JSON.stringify(e.response.data, null, 2));
    } else {
      console.error('Error:', e.message);
    }
  }
}

main();
