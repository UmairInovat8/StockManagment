import axios from 'axios';
import * as fs from 'fs';
import FormData from 'form-data';
import * as XLSX from 'xlsx';

const API = 'http://localhost:3001/api';

async function test() {
    console.log('=== STEP 1: LOGIN ===');
    let token: string;
    try {
        const loginRes = await axios.post(`${API}/auth/login`, {
            email: 'manager@athgadlang.com',
            password: 'athgadlang123'
        });
        token = loginRes.data.access_token;
        console.log('Login OK. Token:', token?.substring(0, 20) + '...');
    } catch (err: any) {
        console.error('LOGIN FAILED:', err.response?.status, JSON.stringify(err.response?.data));
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n=== STEP 2: GET MASTERS ===');
    try {
        const mastersRes = await axios.get(`${API}/items/masters`, { headers });
        console.log('Masters:', JSON.stringify(mastersRes.data.map((m: any) => ({ id: m.id, name: m.name }))));
    } catch (err: any) {
        console.error('MASTERS FAILED:', err.response?.status, JSON.stringify(err.response?.data));
    }

    console.log('\n=== STEP 3: GET ITEMS ===');
    try {
        const itemsRes = await axios.get(`${API}/items`, { headers, params: { page: 1, limit: 5 } });
        console.log('Items response keys:', Object.keys(itemsRes.data));
        console.log('Total:', itemsRes.data.total, 'Page:', itemsRes.data.page, 'Pages:', itemsRes.data.pages);
    } catch (err: any) {
        console.error('ITEMS FAILED:', err.response?.status, JSON.stringify(err.response?.data));
    }

    console.log('\n=== STEP 4: DELETE ALL ===');
    try {
        const delRes = await axios.delete(`${API}/items/all`, { headers, params: { itemMasterId: '115e6470-91cf-49af-9e42-605b8b0f0cb3' } });
        console.log('Delete response:', JSON.stringify(delRes.data));
    } catch (err: any) {
        console.error('DELETE FAILED:', err.response?.status, JSON.stringify(err.response?.data));
    }

    console.log('\n=== STEP 5: UPLOAD CSV ===');
    try {
        // Create a simple test CSV
        const csvContent = 'SKU Code,Item Name,Unit Cost\nTEST-001,Test Item One,99.99\nTEST-002,Test Item Two,49.50';
        fs.writeFileSync('d:/React/Applications/StockCount/test-data/e2e_test.csv', csvContent);
        
        const form = new FormData();
        form.append('file', fs.createReadStream('d:/React/Applications/StockCount/test-data/e2e_test.csv'));
        form.append('itemMasterId', '115e6470-91cf-49af-9e42-605b8b0f0cb3');

        const uploadRes = await axios.post(`${API}/items/upload`, form, {
            headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` }
        });
        console.log('Upload response:', JSON.stringify(uploadRes.data));

        // Wait and check
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await axios.get(`${API}/items/import/status`, { headers });
        console.log('Import status:', JSON.stringify(statusRes.data));

        // Check items after upload
        await new Promise(r => setTimeout(r, 2000));
        const itemsAfter = await axios.get(`${API}/items`, { headers, params: { page: 1, limit: 5 } });
        console.log('Items after upload - Total:', itemsAfter.data.total);
        
    } catch (err: any) {
        console.error('UPLOAD FAILED:', err.response?.status, JSON.stringify(err.response?.data));
    }

    console.log('\n=== ALL TESTS DONE ===');
}

test().catch(e => console.error('CRITICAL:', e.message));
