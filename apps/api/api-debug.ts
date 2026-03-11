import axios from 'axios';
import fs from 'fs';

async function main() {
    const logFile = 'api-debug.log';
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync(logFile, msg + '\n');
    };

    fs.writeFileSync(logFile, '--- API DEBUG START ---\n');

    try {
        log('Attempting login...');
        const loginRes = await axios.post('http://localhost:3001/auth/login', {
            email: 'manager@athgadlang.com',
            password: 'athgadlang123'
        });
        const token = loginRes.data.access_token;
        log('Login successful. TenantId: ' + loginRes.data.user.tenantId);

        log('Fetching audits list...');
        const auditsRes = await axios.get('http://localhost:3001/audits', {
            headers: { Authorization: `Bearer ${token}` }
        });
        log(`Found ${auditsRes.data.length} audits.`);

        for (const audit of auditsRes.data) {
            log(`Testing findOne for: ${audit.name} (${audit.id})`);
            try {
                const detailRes = await axios.get(`http://localhost:3001/audits/${audit.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                log(`Result for ${audit.id}: ${detailRes.data ? 'SUCCESS' : 'EMPTY'}`);
            } catch (e) {
                log(`Error for ${audit.id}: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
            }
        }
    } catch (e) {
        log('FATAL ERROR: ' + (e.response?.data ? JSON.stringify(e.response.data) : e.message));
    }
}

main();
