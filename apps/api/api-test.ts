import axios from 'axios';

async function main() {
    try {
        const res = await axios.post('http://localhost:3001/auth/login', {
            email: 'manager@athgadlang.com',
            password: 'athgadlang123'
        });
        console.log('TOKEN:', res.data.access_token);
        console.log('USER:', JSON.stringify(res.data.user, null, 2));

        const token = res.data.access_token;
        const auditsRes = await axios.get('http://localhost:3001/audits', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('AUDITS COUNT:', auditsRes.data.length);
        if (auditsRes.data.length > 0) {
            const firstId = auditsRes.data[0].id;
            console.log('Fetching detail for ID:', firstId);
            try {
                const detailRes = await axios.get(`http://localhost:3001/audits/${firstId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('DETAIL FOUND:', !!detailRes.data);
                console.log('DETAIL:', JSON.stringify(detailRes.data, null, 2).slice(0, 500));
            } catch (e) {
                console.log('DETAIL ERROR:', e.response?.status, e.response?.data);
            }
        }
    } catch (e) {
        console.error('LOGIN ERROR:', e.response?.data || e.message);
    }
}

main();
