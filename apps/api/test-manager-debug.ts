import { PrismaClient } from './src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync('test-manager-debug.log', msg + '\n');
    };

    fs.writeFileSync('test-manager-debug.log', '--- TEST MANAGER DEBUG ---\n');

    // 1. Reset test_manager password
    const password = await bcrypt.hash('athgadlang123', 10);
    await prisma.user.update({
        where: { email: 'test_manager@athgadlang.com' },
        data: { password },
    });
    log('Password reset for test_manager@athgadlang.com done.');

    // 2. Try to login
    try {
        const loginRes = await axios.post('http://localhost:3001/auth/login', {
            email: 'test_manager@athgadlang.com',
            password: 'athgadlang123',
        });
        const token = loginRes.data.access_token;
        log(`Login OK. tenantId in token: ${JSON.stringify(loginRes.data.user)}`);

        // 3. Fetch the specific audit
        const auditId = '835e08bc-e513-4db3-979b-0f10ceffc3c0';
        try {
            const detailRes = await axios.get(`http://localhost:3001/audits/${auditId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            log(`Audit detail response: ${detailRes.data ? 'FOUND - ' + detailRes.data.name : 'EMPTY'}`);
        } catch (e) {
            log(`Audit detail error: ${e.response?.status} - ${JSON.stringify(e.response?.data)}`);
        }
    } catch (e) {
        log(`Login error: ${JSON.stringify(e.response?.data || e.message)}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
